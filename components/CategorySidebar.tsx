// Modules de la colonne droite des pages catégorie.
// Chaque module rend un petit bloc autonome avec un intitulé sobre,
// un filet fin en couleur de rubrique (via var(--catColor) hérité),
// et un contenu réel tiré des sources d'écriture du site.

import Link from 'next/link'
import articlesData from '../lib/articles.json'
import lettres from '../lib/lettres.json'
import indicateursData from '../lib/indicateurs.json'
import { TV_EPISODES, getLatestTVEpisode } from '../lib/tv-episodes'
import { MOIS, getLatestMonth } from '../lib/retrospective-mois'
import { POPULAR_POOL } from '../lib/home-pools'
import { FleuronIcon } from './LettresIcons'
import { CATEGORY_MODULES, type SidebarModuleKey, type CategoryKey } from '../lib/category-modules'
import styles from './CategorySidebar.module.css'

const ALL = articlesData as any[]

// ── Helpers ──────────────────────────────────────────────────
function stripHtml(s: string) { return (s || '').replace(/<[^>]+>/g, '').replace(/\n/g, ' ').trim() }
function hrefForArticle(a: any): string {
  return a.grandFormatUrl || `/articles/${a.slug}`
}

function ModuleLabel({ children }: { children: React.ReactNode }) {
  return <h3 className={styles.label}>{children}</h3>
}

// ── 1. Lettre du mardi ───────────────────────────────────────
function ModuleLettre() {
  const sorted = (lettres as any[]).slice().sort((a, b) =>
    new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  )
  const last = sorted[0]
  if (!last) return null
  return (
    <section className={styles.module}>
      <ModuleLabel>La lettre du mardi</ModuleLabel>
      <Link href={`/lettres/${last.slug}`} className={styles.lettreLink}>
        <span className={styles.lettrePicto} aria-hidden="true">
          <FleuronIcon width={18} height={18} />
        </span>
        <div className={styles.lettreBody}>
          <span className={styles.lettreNum}>N° {String(last.numero).padStart(2, '0')} · {last.date}</span>
          <span className={styles.lettreTitle}>{last.title}</span>
          {last.teaser && <span className={styles.lettreTeaser}>{last.teaser}</span>}
        </div>
      </Link>
      <Link href="/lettres" className={styles.moreLink}>Toutes les lettres →</Link>
    </section>
  )
}

// ── 2. Ailleurs sur Soara (POPULAR_POOL filtré) ──────────────
function ModuleAilleurs({ category }: { category: CategoryKey }) {
  const items = POPULAR_POOL
    .filter((a: any) => a.category !== category)
    .slice(0, 4)
  if (items.length === 0) return null
  return (
    <section className={styles.module}>
      <ModuleLabel>Ailleurs sur Soara</ModuleLabel>
      <ul className={styles.linkList}>
        {items.map((a: any) => (
          <li key={a.slug} className={styles.linkItem}>
            <Link href={hrefForArticle(a)} className={styles.linkRow}>
              <span className={styles.linkCat}>{categoryLabel(a.category)}</span>
              <span className={styles.linkTitle} dangerouslySetInnerHTML={{ __html: a.title }} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ── 3. Portraits ─────────────────────────────────────────────
function ModulePortraits({ excludeSlug }: { excludeSlug?: string }) {
  const portraits = ALL
    .filter(a => a.category === 'portrait' && !a.excludeFromCategoryList && a.slug !== excludeSlug)
    .slice(0, 3)
  if (portraits.length === 0) return null
  return (
    <section className={styles.module}>
      <ModuleLabel>Portraits</ModuleLabel>
      <ul className={styles.thumbList}>
        {portraits.map(p => (
          <li key={p.slug} className={styles.thumbItem}>
            <Link href={`/articles/${p.slug}`} className={styles.thumbRow}>
              {p.image && (
                <div className={styles.thumbImg}>
                  <img src={p.image} alt={stripHtml(p.title)} />
                </div>
              )}
              <span className={styles.thumbTitle} dangerouslySetInnerHTML={{ __html: p.title }} />
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/portraits" className={styles.moreLink}>Tous les portraits →</Link>
    </section>
  )
}

// ── 4. Soara TV ──────────────────────────────────────────────
function ModuleTV() {
  const ep = getLatestTVEpisode()
  return (
    <section className={styles.module}>
      <ModuleLabel>Soara TV</ModuleLabel>
      <Link href={ep.href} className={styles.tvLink}>
        <div className={styles.tvImg}>
          <img src={ep.thumb} alt={ep.title} />
          <span className={styles.tvPlay} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15.5" stroke="rgba(255,255,255,.7)" />
              <path d="M13 11 L22 16 L13 21 Z" fill="#fff" />
            </svg>
          </span>
        </div>
        <span className={styles.tvNum}>Ép. {ep.id} · {ep.duration}</span>
        <span className={styles.tvTitle}>{ep.title}</span>
      </Link>
      <Link href="/tv" className={styles.moreLink}>Tous les épisodes →</Link>
    </section>
  )
}

// ── 5. Rétrospective ─────────────────────────────────────────
function ModuleRetrospective() {
  const m = getLatestMonth()
  return (
    <section className={styles.module}>
      <ModuleLabel>Rétrospective 2025</ModuleLabel>
      <Link href="/retrospective" className={styles.retroLink}>
        <span className={styles.retroMonth}>{m.m} 2025</span>
        <span className={styles.retroTitle}>{m.titre}</span>
        <span className={styles.retroStat}>
          <span className={styles.retroStatNum}>{m.stat.num}</span>
          {m.stat.unit && <span className={styles.retroStatUnit}>{m.stat.unit}</span>}
          <span className={styles.retroStatLabel}>{m.stat.label}</span>
        </span>
      </Link>
      <Link href="/retrospective" className={styles.moreLink}>Toute la rétrospective →</Link>
    </section>
  )
}

// ── 6. Grands formats ────────────────────────────────────────
function ModuleGrandsFormats({ category }: { category: CategoryKey }) {
  // Préfère les GF de la catégorie courante, sinon tous les GF.
  const all = ALL.filter(a => a.grandFormat === true || a.grandFormatUrl)
  const inCat = all.filter(a => a.category === category)
  const pool = inCat.length >= 2 ? inCat : all
  const items = pool.slice(0, 2)
  if (items.length === 0) return null
  return (
    <section className={styles.module}>
      <ModuleLabel>Grands formats</ModuleLabel>
      <ul className={styles.thumbList}>
        {items.map(a => (
          <li key={a.slug} className={styles.thumbItem}>
            <Link href={hrefForArticle(a)} className={styles.thumbRow}>
              {a.image && (
                <div className={styles.thumbImg}>
                  <img src={a.image} alt={stripHtml(a.title)} />
                </div>
              )}
              <span className={styles.thumbTitle} dangerouslySetInnerHTML={{ __html: a.title }} />
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/formats" className={styles.moreLink}>Tous les grands formats →</Link>
    </section>
  )
}

// ── 7. Indicateurs ───────────────────────────────────────────
function ModuleIndicateurs() {
  const data = indicateursData as any
  const list = (data.indicateurs as any[]).slice(0, 4)
  if (list.length === 0) return null
  return (
    <section className={styles.module}>
      <ModuleLabel>Indicateurs</ModuleLabel>
      <ul className={styles.indicList}>
        {list.map((it, i) => (
          <li key={i} className={styles.indicItem}>
            <span className={styles.indicLabel}>{it.label || it.nom}</span>
            <span className={styles.indicValue}>{it.valeur ?? it.value ?? '—'}{it.unite ? ` ${it.unite}` : ''}</span>
            {(it.variation || it.delta) && (
              <span className={styles.indicDelta} data-trend={it.tendance || (parseFloat(it.variation || it.delta) >= 0 ? 'up' : 'down')}>
                {it.variation || it.delta}
              </span>
            )}
          </li>
        ))}
      </ul>
      <Link href="/indicateurs" className={styles.moreLink}>Tous les indicateurs →</Link>
    </section>
  )
}

// ── 8. Newsletter compact ────────────────────────────────────
function ModuleNewsletter() {
  return (
    <section className={styles.module}>
      <ModuleLabel>La lettre du mardi</ModuleLabel>
      <p className={styles.newsletterCopy}>
        Chaque mardi, une analyse signée Steve Moradel pour penser la semaine plutôt que la subir.
      </p>
      <Link href="/abonnement" className={styles.newsletterCta}>
        S'abonner gratuitement →
      </Link>
      <Link href="/lettres" className={styles.moreLink}>
        <FleuronIcon width={14} height={14} />
        <span>Lire les lettres</span>
      </Link>
    </section>
  )
}

// ── Dispatcher ───────────────────────────────────────────────
const CAT_LABEL: Record<string, string> = {
  geo: 'Géopolitique', eco: 'Économie', tech: 'Technologie',
  env: 'Environnement', soc: 'Société', culture: 'Culture',
  portrait: 'Portrait',
}
function categoryLabel(cat: string): string { return CAT_LABEL[cat] || cat }

function RenderModule({ k, category, currentSlug }: { k: SidebarModuleKey; category: CategoryKey; currentSlug?: string }) {
  switch (k) {
    case 'lettre':         return <ModuleLettre />
    case 'ailleurs':       return <ModuleAilleurs category={category} />
    case 'portraits':      return <ModulePortraits excludeSlug={currentSlug} />
    case 'tv':             return <ModuleTV />
    case 'retrospective':  return <ModuleRetrospective />
    case 'grands-formats': return <ModuleGrandsFormats category={category} />
    case 'indicateurs':    return <ModuleIndicateurs />
    case 'newsletter':     return <ModuleNewsletter />
    default:               return null
  }
}

export default function CategorySidebar({ category }: { category: CategoryKey }) {
  const modules = CATEGORY_MODULES[category] || []
  return (
    <aside className={styles.sidebar}>
      {/* Slot publicitaire réservé en tête de colonne. Volontairement
          neutre tant qu'aucun AdSlot n'est branché : aucune hauteur fixée,
          pas de placeholder visible. Quand on activera la pub, il suffira
          de poser un <AdSlot slotId="category-sidebar" .../> à cet endroit. */}
      <div className={styles.adSlotReserved} aria-hidden="true" />

      {modules.map((k, i) => (
        <RenderModule key={`${k}-${i}`} k={k} category={category} />
      ))}
    </aside>
  )
}
