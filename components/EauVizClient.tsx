'use client'

import { useEffect, useRef, useState } from 'react'
import eauData from '../lib/eau-data.json'
import styles from './EauVizClient.module.css'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { maplibregl?: any }
}

const MAPLIBRE_JS = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js'
const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css'

/* MapTiler Streets v2 avec labels français. Inliné au build via
   NEXT_PUBLIC_MAPTILER_KEY. Le plan gratuit couvre 100k chargements
   de tuiles par mois, largement au-dessus du trafic Soara actuel. */
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY
const MAPTILER_STYLE_URL = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}&language=fr`
  : null

/* Fallback Carto Voyager raster si la clé MapTiler n'est pas définie
   (dev local sans .env, fork). Labels en anglais. */
const FALLBACK_STYLE = {
  version: 8 as const,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    base: {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap, © CARTO',
      maxzoom: 19,
    },
  },
  layers: [{ id: 'base-layer', type: 'raster' as const, source: 'base' }],
}

function loadMaplibre(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'))
  if (window.maplibregl) return Promise.resolve(window.maplibregl)
  return new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${MAPLIBRE_CSS}"]`)) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = MAPLIBRE_CSS
      document.head.appendChild(link)
    }
    let script = document.querySelector(`script[src="${MAPLIBRE_JS}"]`) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.src = MAPLIBRE_JS
      document.head.appendChild(script)
    }
    script.addEventListener('load', () => {
      if (window.maplibregl) resolve(window.maplibregl)
      else reject(new Error('maplibregl manquant après chargement'))
    })
    script.addEventListener('error', () => reject(new Error('Échec chargement maplibre-gl')))
  })
}

function getChapterView(chapter: any, isMobile: boolean): { center: [number, number]; zoom: number } {
  const c = chapter.carte
  const center = (isMobile && c.centre_mobile) ? c.centre_mobile : (c.centre_desktop ?? c.centre)
  const zoom = isMobile ? (c.zoom_mobile ?? c.zoom_desktop) : c.zoom_desktop
  return { center: [center[0], center[1]], zoom }
}

/* Remplace name par name:fr avec fallback name:latin puis name natif.
   Appelé uniquement quand MapTiler est actif (le fallback Carto raster
   n'a pas de layers symbol). */
function applyFrenchLabels(map: any) {
  const layers = map.getStyle().layers ?? []
  for (const layer of layers) {
    if (layer.type !== 'symbol') continue
    if (!layer.layout || !layer.layout['text-field']) continue
    map.setLayoutProperty(
      layer.id,
      'text-field',
      ['coalesce', ['get', 'name:fr'], ['get', 'name:latin'], ['get', 'name']],
    )
  }
}

/* Premier layer symbol du style. Sert de beforeId pour insérer nos
   overlays sous les labels MapTiler (les noms de pays restent lisibles
   par-dessus les tracés de fleuves). undefined en mode fallback raster. */
function getFirstSymbolLayerId(map: any): string | undefined {
  const layers = map.getStyle().layers ?? []
  for (const layer of layers) {
    if (layer.type === 'symbol') return layer.id
  }
  return undefined
}

/* Ajoute les overlays narratifs propres au chapitre, par-dessus la
   carte de base, sous les labels MapTiler quand possible. */
function addChapterOverlays(map: any, chapter: any) {
  const beforeId = getFirstSymbolLayerId(map)
  if (chapter.fleuves?.length) addFleuvesLayer(map, chapter, beforeId)
  if (chapter.frontiere_disputee?.length) addFrontiereLayer(map, chapter, beforeId)
  if (chapter.barrages?.length) addBarragesLayer(map, chapter, beforeId)
  if (chapter.tensions?.length) addTensionsLayer(map, chapter, beforeId)
  if (chapter.fleuves?.length) addFleuveLabelsLayer(map, chapter, beforeId)
  if (chapter.labels_pays?.length) addLabelsPaysLayer(map, chapter)
}

/* Mapping id court → nom français pour les labels sur fleuves. Centralisé
   ici plutôt que dans eau-data.json pour garder le JSON purement
   géométrique. Ajouter une entrée si un nouvel id de fleuve apparaît. */
const FLEUVE_NOMS: Record<string, string> = {
  amazon: 'Amazone',
  amur: 'Amour',
  brahma: 'Brahmapoutre',
  congo: 'Congo',
  danube: 'Danube',
  euphrate: 'Euphrate',
  gange: 'Gange',
  indus: 'Indus',
  irraw: 'Irrawaddy',
  jordan: 'Jourdain',
  lena: 'Léna',
  mekong: 'Mékong',
  miss: 'Mississippi',
  murray: 'Murray',
  niger: 'Niger',
  nil: 'Nil',
  nilb: 'Nil Bleu',
  nile: 'Nil',
  ob: 'Ob',
  orinoco: 'Orénoque',
  parana: 'Paraná',
  rhine: 'Rhin',
  salween: 'Salouen',
  tigre: 'Tigre',
  volga: 'Volga',
  yangtze: 'Yangzi Jiang',
  yellow: 'Fleuve Jaune',
  zambezi: 'Zambèze',
}

/* Les arrays barrages, tensions, frontiere_disputee et labels_pays du
   JSON sont stockés en [lat, lon] (plus naturel à l'écriture humaine).
   Les fleuves[].coords sont en [lon, lat] standard GeoJSON. On swap ici
   pour normaliser au format MapLibre. */
function toLonLat(point: number[]): [number, number] {
  return [point[1], point[0]]
}

/* chapter.fleuves[].coords est en [lon, lat] (standard GeoJSON).
   couleur_fleuve_rgba est un template avec OPACITY remplacé par
   l'opacite de chaque fleuve, ce qui donne une hiérarchie visuelle
   sans empiler line-color et line-opacity. */
function addFleuvesLayer(map: any, chapter: any, beforeId: string | undefined) {
  const colorTemplate: string = chapter.couleur_fleuve_rgba
  const features = chapter.fleuves.map((f: any) => ({
    type: 'Feature',
    properties: {
      id: f.id,
      couleur: colorTemplate.replace('OPACITY', String(f.opacite ?? 0.5)),
      epaisseur: f.epaisseur ?? 1,
    },
    geometry: { type: 'LineString', coordinates: f.coords },
  }))
  map.addSource('chap-fleuves', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })
  map.addLayer(
    {
      id: 'chap-fleuves-line',
      type: 'line',
      source: 'chap-fleuves',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': ['get', 'couleur'],
        'line-width': ['get', 'epaisseur'],
      },
    },
    beforeId,
  )
}

/* Cercle rouge sobre avec contour clair, suffisamment lisible aux zooms
   éditoriaux (5 à 6) sans surcharger la carte. Pas de label texte ici,
   le contexte du chapitre suffit à identifier (GERD pour le Nil,
   barrages chinois pour le Mékong). */
function addBarragesLayer(map: any, chapter: any, beforeId: string | undefined) {
  const features = chapter.barrages.map((p: number[], i: number) => ({
    type: 'Feature',
    properties: { idx: i },
    geometry: { type: 'Point', coordinates: toLonLat(p) },
  }))
  map.addSource('chap-barrages', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })
  map.addLayer(
    {
      id: 'chap-barrages-circle',
      type: 'circle',
      source: 'chap-barrages',
      paint: {
        'circle-radius': 6,
        'circle-color': '#8B1A1A',
        'circle-stroke-color': '#F8F4EE',
        'circle-stroke-width': 1.5,
        'circle-opacity': 0.92,
      },
    },
    beforeId,
  )
}

/* Cercle rouge plus appuyé pour les zones de tension. Légèrement plus
   gros que les barrages, et avec un anneau plus marqué pour signifier
   l'alerte sans recourir à une animation pulse. */
function addTensionsLayer(map: any, chapter: any, beforeId: string | undefined) {
  const features = chapter.tensions.map((p: number[], i: number) => ({
    type: 'Feature',
    properties: { idx: i },
    geometry: { type: 'Point', coordinates: toLonLat(p) },
  }))
  map.addSource('chap-tensions', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })
  map.addLayer(
    {
      id: 'chap-tensions-circle',
      type: 'circle',
      source: 'chap-tensions',
      paint: {
        'circle-radius': 8,
        'circle-color': '#8B1A1A',
        'circle-stroke-color': '#F8F4EE',
        'circle-stroke-width': 2,
        'circle-opacity': 0.82,
      },
    },
    beforeId,
  )
}

/* Ligne pointillée gris foncé pour signaler une frontière contestée
   sans dramatiser. Sert au chapitre III sur la ligne Cachemire. */
function addFrontiereLayer(map: any, chapter: any, beforeId: string | undefined) {
  const coords = chapter.frontiere_disputee.map(toLonLat)
  map.addSource('chap-frontiere', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords },
    },
  })
  map.addLayer(
    {
      id: 'chap-frontiere-line',
      type: 'line',
      source: 'chap-frontiere',
      layout: { 'line-cap': 'butt', 'line-join': 'round' },
      paint: {
        'line-color': 'rgba(28, 24, 20, 0.6)',
        'line-width': 1.4,
        'line-dasharray': [2, 2],
      },
    },
    beforeId,
  )
}

/* Label texte placé le long de la ligne du fleuve. Filtre les fleuves
   sans entrée dans FLEUVE_NOMS, ce qui permet d'ignorer un id sans
   nom officiel sans casser le rendu. Anti-overlap activé : sur la carte
   monde (21 fleuves), MapLibre masque automatiquement les labels qui
   se chevauchent, ce qui produit une densité d'étiquettes lisible
   sans curation manuelle. */
function addFleuveLabelsLayer(map: any, chapter: any, beforeId: string | undefined) {
  const features = chapter.fleuves
    .filter((f: any) => FLEUVE_NOMS[f.id])
    .map((f: any) => ({
      type: 'Feature',
      properties: { nom: FLEUVE_NOMS[f.id] },
      geometry: { type: 'LineString', coordinates: f.coords },
    }))
  if (!features.length) return
  map.addSource('chap-fleuves-labels', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })
  map.addLayer(
    {
      id: 'chap-fleuves-labels',
      type: 'symbol',
      source: 'chap-fleuves-labels',
      layout: {
        'symbol-placement': 'line',
        'text-field': ['get', 'nom'],
        'text-font': ['Open Sans Regular'],
        'text-size': 10,
        'text-letter-spacing': 0.06,
        'symbol-spacing': 240,
        'text-allow-overlap': false,
        'text-ignore-placement': false,
      },
      paint: {
        'text-color': 'rgba(28, 24, 20, 0.78)',
        'text-halo-color': 'rgba(248, 244, 238, 0.95)',
        'text-halo-width': 1.4,
        'text-halo-blur': 0.2,
      },
    },
    beforeId,
  )
}

/* Labels pays curés dans chapter.labels_pays au format [lat, lon, texte].
   Rendus par-dessus la carte (pas de beforeId) pour signifier qu'ils
   relèvent de la narration éditoriale, pas du fond cartographique.
   Texte gris encre, halo crème pour rester lisibles sur toute zone. */
function addLabelsPaysLayer(map: any, chapter: any) {
  const features = chapter.labels_pays.map((entry: any[], i: number) => ({
    type: 'Feature',
    properties: { texte: entry[2], idx: i },
    geometry: { type: 'Point', coordinates: [entry[1], entry[0]] },
  }))
  map.addSource('chap-labels-pays', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })
  map.addLayer({
    id: 'chap-labels-pays-text',
    type: 'symbol',
    source: 'chap-labels-pays',
    layout: {
      'text-field': ['get', 'texte'],
      'text-font': ['Open Sans Regular'],
      'text-size': 12,
      'text-letter-spacing': 0.12,
      'text-allow-overlap': false,
      'text-anchor': 'center',
    },
    paint: {
      'text-color': 'rgba(28, 24, 20, 0.85)',
      'text-halo-color': 'rgba(248, 244, 238, 0.95)',
      'text-halo-width': 1.6,
      'text-halo-blur': 0.3,
    },
  })
}

/* Une carte par chapitre, centrée sur sa zone, sans flyTo.
   Interactivité légère : dragPan et touchZoom, pas de scrollZoom
   (évite le hijack du scroll page quand le curseur passe sur la carte). */
export default function EauVizClient({ chapterIdx }: { chapterIdx: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const chapter = eauData.chapitres[chapterIdx]
    if (!chapter) return

    loadMaplibre()
      .then(maplibregl => {
        if (cancelled || !containerRef.current || mapRef.current) return
        const isMobile = window.innerWidth < 768
        const view = getChapterView(chapter, isMobile)
        const map = new maplibregl.Map({
          container: containerRef.current,
          style: MAPTILER_STYLE_URL ?? FALLBACK_STYLE,
          center: view.center,
          zoom: view.zoom,
          attributionControl: true,
          dragRotate: false,
          pitchWithRotate: false,
          scrollZoom: false,
        })
        mapRef.current = map

        map.on('load', () => {
          if (MAPTILER_STYLE_URL) applyFrenchLabels(map)
          addChapterOverlays(map, chapter)
        })
      })
      .catch(err => { if (!cancelled) setError(err.message) })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [chapterIdx])

  const chapter = eauData.chapitres[chapterIdx]
  const ariaLabel = chapter ? `Carte, ${chapter.titre_court}` : 'Carte'

  return (
    <div className={styles.wrap}>
      <div ref={containerRef} className={styles.map} aria-label={ariaLabel} />
      {error && <div className={styles.error}>Carte indisponible, {error}</div>}
    </div>
  )
}
