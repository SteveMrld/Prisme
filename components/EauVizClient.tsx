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

        /* MapTiler streets-v2 expose les noms multilingues via name:fr et
           name:latin. Le paramètre &language=fr de l'URL ne couvre pas
           tous les layers, on force chaque layer symbol à utiliser le
           français avec fallback latin puis nom natif. */
        if (MAPTILER_STYLE_URL) {
          map.on('load', () => {
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
          })
        }
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
