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

/* Carto Voyager raster, libre, attribution OSM + Carto.
   Labels en anglais standard, plus lisibles pour un lectorat francophone
   que les labels natifs OSM (chinois, arabe, cyrillique selon la zone).
   Sera remplacé par MapTiler avec labels français dès que la clé
   NEXT_PUBLIC_MAPTILER_KEY est en place. */
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

function getChapterView(chapter: any, isMobile: boolean): { center: [number, number]; zoom: number; duration: number } {
  const c = chapter.carte
  const center = (isMobile && c.centre_mobile) ? c.centre_mobile : (c.centre_desktop ?? c.centre)
  const zoom = isMobile ? (c.zoom_mobile ?? c.zoom_desktop) : c.zoom_desktop
  const duration = c.duree_fly_ms ?? 1400
  return { center: [center[0], center[1]], zoom, duration }
}

export default function EauVizClient({ activeChapter }: { activeChapter: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    loadMaplibre()
      .then(maplibregl => {
        if (cancelled || !containerRef.current || mapRef.current) return
        const isMobile = window.innerWidth < 768
        const firstView = getChapterView(eauData.chapitres[0], isMobile)
        const map = new maplibregl.Map({
          container: containerRef.current,
          style: FALLBACK_STYLE,
          center: firstView.center,
          zoom: firstView.zoom,
          interactive: false,
          attributionControl: true,
        })
        mapRef.current = map
        map.on('load', () => { if (!cancelled) setReady(true) })
      })
      .catch(err => { if (!cancelled) setError(err.message) })

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current) return
    const ch = eauData.chapitres[activeChapter]
    if (!ch) return
    const isMobile = window.innerWidth < 768
    const view = getChapterView(ch, isMobile)
    mapRef.current.flyTo({
      center: view.center,
      zoom: view.zoom,
      duration: view.duration,
      essential: true,
    })
  }, [ready, activeChapter])

  return (
    <div className={styles.wrap}>
      <div ref={containerRef} className={styles.map} aria-label="Carte interactive, eau et géopolitique" />
      {error && <div className={styles.error}>Carte indisponible, {error}</div>}
    </div>
  )
}
