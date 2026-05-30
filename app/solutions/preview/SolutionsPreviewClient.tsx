'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './solutions-preview.module.css'
import { solutions, COUNTRY_INFO, CATEGORIES, type Solution, type Category } from '../data'
import { FEATURED_PICKS } from './featured'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window { maplibregl?: any }
}

const MAPLIBRE_JS = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js'
const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css'
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY
const MAPTILER_STYLE = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/dataviz-light/style.json?key=${MAPTILER_KEY}&language=fr`
  : null

const FALLBACK_STYLE = {
  version: 8 as const,
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
  sources: {
    base: {
      type: 'raster' as const,
      tiles: ['https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap, © CARTO',
    },
  },
  layers: [{ id: 'base', type: 'raster' as const, source: 'base' }],
}

const CAT_BY_KEY = Object.fromEntries(
  CATEGORIES.map(c => [c.key, c])
) as Record<Category, typeof CATEGORIES[number]>

type CountryAgg = {
  country: string
  fr: string
  iso: string
  lng: number
  lat: number
  total: number
  byCat: Record<Category, number>
  topCat: Category
  topColor: string
}

function aggregate(): CountryAgg[] {
  const map = new Map<string, CountryAgg>()
  for (const s of solutions) {
    const info = COUNTRY_INFO[s.country]
    if (!info) continue
    let agg = map.get(s.country)
    if (!agg) {
      agg = {
        country: s.country, fr: info.fr, iso: info.iso, lng: info.lng, lat: info.lat,
        total: 0, byCat: {} as Record<Category, number>,
        topCat: 'Climat' as Category, topColor: '#0A0A0A',
      }
      map.set(s.country, agg)
    }
    agg.total++
    agg.byCat[s.cat] = (agg.byCat[s.cat] ?? 0) + 1
  }
  for (const agg of map.values()) {
    let topCat: Category = 'Climat'
    let topN = 0
    for (const [c, n] of Object.entries(agg.byCat)) {
      if (n > topN) { topN = n; topCat = c as Category }
    }
    agg.topCat = topCat
    agg.topColor = CAT_BY_KEY[topCat]?.color ?? '#0A0A0A'
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
}

function bubbleRadius(n: number): number {
  return Math.max(6, Math.min(36, 6 + Math.sqrt(n) * 4.5))
}

export default function SolutionsPreviewClient() {
  const aggs = useMemo(aggregate, [])
  const totalSolutions = solutions.length
  const totalCountries = aggs.length
  const totalCats = new Set(solutions.map(s => s.cat)).size

  /* ── MAP ──────────────────────────────────────────── */
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInst = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [hoverAgg, setHoverAgg] = useState<CountryAgg | null>(null)
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    let cancelled = false

    function ensureScripts(): Promise<void> {
      if (window.maplibregl) return Promise.resolve()
      return new Promise(resolve => {
        if (!document.querySelector(`link[href="${MAPLIBRE_CSS}"]`)) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'; link.href = MAPLIBRE_CSS
          document.head.appendChild(link)
        }
        if (document.querySelector(`script[src="${MAPLIBRE_JS}"]`)) {
          const wait = () => window.maplibregl ? resolve() : setTimeout(wait, 50)
          wait(); return
        }
        const s = document.createElement('script')
        s.src = MAPLIBRE_JS
        s.onload = () => resolve()
        document.head.appendChild(s)
      })
    }

    ensureScripts().then(() => {
      if (cancelled || !mapRef.current || !window.maplibregl) return
      const map = new window.maplibregl.Map({
        container: mapRef.current,
        style: MAPTILER_STYLE ?? FALLBACK_STYLE,
        center: [12, 30],
        zoom: 1.4,
        minZoom: 1.2,
        maxZoom: 5,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        renderWorldCopies: false,
      })
      mapInst.current = map
      map.scrollZoom.disable()
      map.addControl(
        new window.maplibregl.NavigationControl({ showCompass: false }),
        'bottom-right'
      )

      map.on('load', () => {
        if (cancelled) return
        for (const agg of aggs) {
          const el = document.createElement('button')
          el.type = 'button'
          el.setAttribute('aria-label', `${agg.fr}, ${agg.total} solutions`)
          const r = bubbleRadius(agg.total)
          el.style.cssText = `
            width:${r * 2}px;height:${r * 2}px;border-radius:50%;
            background:${agg.topColor};opacity:.78;
            border:1.5px solid #FAF9F6;
            cursor:pointer;padding:0;
            transition:transform .2s, opacity .2s;
            box-shadow:0 2px 8px rgba(0,0,0,.18);
          `
          el.onmouseenter = (e) => {
            el.style.opacity = '1'
            el.style.transform = 'scale(1.15)'
            const rect = mapRef.current!.getBoundingClientRect()
            const evt = e as MouseEvent
            setHoverAgg(agg)
            setHoverPos({ x: evt.clientX - rect.left, y: evt.clientY - rect.top })
          }
          el.onmouseleave = () => {
            el.style.opacity = '.78'
            el.style.transform = 'scale(1)'
            setHoverAgg(null); setHoverPos(null)
          }
          el.onclick = () => {
            document.getElementById('annuaire')?.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => {
              const sel = document.getElementById('country-select') as HTMLSelectElement | null
              if (sel) {
                sel.value = agg.country
                sel.dispatchEvent(new Event('change', { bubbles: true }))
              }
            }, 700)
          }
          const marker = new window.maplibregl.Marker({ element: el })
            .setLngLat([agg.lng, agg.lat])
            .addTo(map)
          markersRef.current.push(marker)
        }
      })
    })

    return () => {
      cancelled = true
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      mapInst.current?.remove()
      mapInst.current = null
    }
  }, [aggs])

  /* ── DIRECTORY FILTERS ────────────────────────────── */
  const [activeCat, setActiveCat] = useState<Category | null>(null)
  const [activeCountry, setActiveCountry] = useState<string>('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return solutions.filter(s => {
      if (activeCat && s.cat !== activeCat) return false
      if (activeCountry && s.country !== activeCountry) return false
      if (q) {
        const hay = (s.name + ' ' + s.country + ' ' + s.rawCat).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [activeCat, activeCountry, search])

  const countries = useMemo(
    () => Object.entries(COUNTRY_INFO)
      .map(([eng, info]) => ({ eng, fr: info.fr }))
      .sort((a, b) => a.fr.localeCompare(b.fr, 'fr')),
    []
  )

  /* ── PICKS RESOLVED ───────────────────────────────── */
  const picks = useMemo(() => {
    return FEATURED_PICKS.map(p => {
      const sol = solutions.find(s => s.name === p.name)
      return sol ? { ...sol, hook: p.hook } : null
    }).filter(Boolean) as (Solution & { hook: string })[]
  }, [])

  function pickSpan(i: number): string {
    /* Asymétrie éditoriale Atlantic / Bloomberg. */
    const pattern = [
      styles.pickWide, styles.pickHalf,   /* 8/4 */
      styles.pickHalf, styles.pickWide,   /* 4/8 */
      styles.pickFull,                     /* 12  */
      styles.pickHalf, styles.pickHalf, styles.pickHalf, /* 4/4/4 mais sur 12, soit 12 */
      styles.pickWide, styles.pickHalf,   /* 8/4 */
    ]
    return pattern[i] ?? styles.pickHalf
  }

  return (
    <main className={styles.page}>

      {/* ── HERO ──────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            Sélection ChangeNow 2026 <span>·</span> Grand Palais, Paris
          </div>
          <h1 className={styles.heroTitle}>
            Le monde qui <em>avance</em>,<br />
            face au monde qui s&apos;effondre.
          </h1>
          <p className={styles.heroBody}>
            Les crises dominent les unes. Mais partout sur la planète, des entrepreneurs,
            des scientifiques et des collectifs construisent en silence les solutions d&apos;après.
            Soara les recense, les cartographie, les met en regard.
          </p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatN}>{totalSolutions}</span>
              <span className={styles.heroStatL}>solutions référencées</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatN}>{totalCountries}</span>
              <span className={styles.heroStatL}>pays représentés</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatN}>{totalCats}</span>
              <span className={styles.heroStatL}>domaines couverts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOUVEMENT 1, CARTE ───────────────────────── */}
      <section className={styles.map}>
        <div className={styles.mapInner}>
          <div className={styles.mapTextCol}>
            <div className={styles.mapEyebrow}>La carte</div>
            <h2 className={styles.mapTitle}>
              Où le <em>monde d&apos;après</em><br />se construit
            </h2>
            <p className={styles.mapBody}>
              Chaque cercle est un pays. Sa taille traduit la densité de solutions qui
              y émergent. Sa couleur, le <em>domaine majoritaire</em> du territoire.
              Cliquez pour explorer l&apos;annuaire filtré sur ce pays.
            </p>
            <div className={styles.mapLegend}>
              {CATEGORIES.slice(0, 6).map(c => (
                <div key={c.key} className={styles.mapLegendRow}>
                  <span className={styles.mapLegendDot} style={{ background: c.color }} />
                  <span>{c.key}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.mapCanvasWrap}>
            <div ref={mapRef} className={styles.mapCanvas} />
            {hoverAgg && hoverPos && (
              <div
                className={`${styles.mapTooltip} ${styles.visible}`}
                style={{ left: hoverPos.x, top: hoverPos.y }}
              >
                <div className={styles.mapTooltipCountry}>{hoverAgg.iso} · {hoverAgg.fr}</div>
                <div className={styles.mapTooltipN}>{hoverAgg.total}</div>
                <div className={styles.mapTooltipL}>
                  solution{hoverAgg.total > 1 ? 's' : ''} référencée{hoverAgg.total > 1 ? 's' : ''}
                </div>
                <div className={styles.mapTooltipCats}>
                  {Object.entries(hoverAgg.byCat)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([cat, n]) => (
                      <span key={cat}>{cat} · {n}</span>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MOUVEMENT 2, SÉLECTION ──────────────────── */}
      <section className={styles.picks}>
        <div className={styles.picksInner}>
          <div className={styles.picksHead}>
            <div className={styles.picksEyebrow}>La sélection éditoriale</div>
            <h2 className={styles.picksTitle}>
              Dix initiatives <em>retenues</em>
            </h2>
            <p className={styles.picksLead}>
              Parmi les {totalSolutions} solutions référencées, dix nous ont semblé incarner
              ce que peut être une réponse concrète, ambitieuse et réplicable aux défis du siècle.
            </p>
          </div>

          <div className={styles.picksGrid}>
            {picks.map((p, i) => {
              const conf = CAT_BY_KEY[p.cat]
              const info = COUNTRY_INFO[p.country]
              return (
                <a
                  key={p.name}
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.pick} ${pickSpan(i)}`}
                  style={{ ['--pick-color' as any]: conf.color }}
                >
                  <div className={styles.pickHead}>
                    <span className={styles.pickNum}>{String(i + 1).padStart(2, '0')} / 10</span>
                    <span className={styles.pickCountry}>
                      <span className={styles.pickCountryIso}>{info?.iso}</span>
                      {info?.fr}
                    </span>
                  </div>
                  <h3 className={styles.pickName}>{p.name}</h3>
                  <p className={styles.pickHook}>{p.hook}</p>
                  <div className={styles.pickFoot}>
                    <span className={styles.pickCat}>{p.cat}</span>
                    <span className={styles.pickLink}>Voir le projet →</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── MOUVEMENT 3, ANNUAIRE ───────────────────── */}
      <section className={styles.dir} id="annuaire">
        <div className={styles.dirInner}>
          <div className={styles.dirHead}>
            <div className={styles.dirEyebrow}>L&apos;annuaire</div>
            <h2 className={styles.dirTitle}>
              Les {totalSolutions} solutions, <em>indexées</em>
            </h2>
            <p className={styles.dirLead}>
              Filtrez par domaine, par pays, ou cherchez par mot-clé.
              Chaque ligne ouvre le site de l&apos;organisation.
            </p>
          </div>

          <div className={styles.dirFilters}>
            <div className={styles.dirSearchRow}>
              <div className={styles.dirSearch}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Rechercher une organisation, un pays, un mot-clé"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                id="country-select"
                className={styles.dirCountrySel}
                value={activeCountry}
                onChange={e => setActiveCountry(e.target.value)}
                aria-label="Filtrer par pays"
              >
                <option value="">Tous les pays</option>
                {countries.map(c => (
                  <option key={c.eng} value={c.eng}>{c.fr}</option>
                ))}
              </select>
              <div className={styles.dirCountTotal}>
                <strong>{filtered.length}</strong> résultat{filtered.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className={styles.dirCats}>
              <button
                type="button"
                className={`${styles.dirCatBtn} ${!activeCat ? styles.dirCatBtnActive : ''}`}
                onClick={() => setActiveCat(null)}
              >
                Tous les domaines
              </button>
              {CATEGORIES.map(c => {
                const n = solutions.filter(s => s.cat === c.key).length
                if (n === 0) return null
                const active = activeCat === c.key
                return (
                  <button
                    key={c.key}
                    type="button"
                    className={`${styles.dirCatBtn} ${active ? styles.dirCatBtnActive : ''}`}
                    style={active ? { background: c.color, borderColor: c.color, color: '#FFF' } : { color: c.color }}
                    onClick={() => setActiveCat(active ? null : c.key)}
                  >
                    <span className={styles.dirCatBtnDot} />
                    {c.key} · {n}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.dirTable}>
            {filtered.length === 0 && (
              <div className={styles.dirEmpty}>Aucune solution ne correspond à ces filtres.</div>
            )}
            {filtered.map(s => {
              const conf = CAT_BY_KEY[s.cat]
              const info = COUNTRY_INFO[s.country]
              return (
                <a
                  key={s.name + s.website}
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dirRow}
                  style={{ ['--row-color' as any]: conf.color }}
                >
                  <span className={styles.dirRowIso}>{info?.iso ?? '???'}</span>
                  <span className={styles.dirRowName}>{s.name}</span>
                  <span className={styles.dirRowCountry}>{info?.fr ?? s.country}</span>
                  <span className={styles.dirRowCat}>{s.cat}</span>
                  <span className={styles.dirRowArrow}>→</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── PIED ───────────────────────────────────── */}
      <section className={styles.outro}>
        <div className={styles.outroInner}>
          <div className={styles.outroEyebrow}>Sélection Soara · ChangeNow 2026</div>
          <p className={styles.outroBody}>
            <strong>Cette page est vivante.</strong><br />
            Les organisations changent, les portefeuilles évoluent, des solutions disparaissent.
            Si vous repérez une donnée caduque, écrivez-nous.
          </p>
        </div>
      </section>
    </main>
  )
}
