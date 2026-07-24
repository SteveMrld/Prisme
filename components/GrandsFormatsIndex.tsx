'use client'
import Link from 'next/link'
import Header from './Header'
import BottomNav from './BottomNav'
import styles from './GrandsFormatsIndex.module.css'
import { getAllGrandFormats } from '../lib/grands-formats'

/* La grille lit désormais le registre lib/grands-formats.ts, qui est la
   source de vérité unique. Il n'y a plus de liste recopiée ici : ajouter
   un grand format au registre suffit à le faire apparaître. */
const FORMATS = getAllGrandFormats()

// Aligné avec la home : GF_LEAD_SLUG de app/page.tsx
const LEAD_SLUG = 'chambre-ratification'

export default function GrandsFormatsIndex() {
  const lead = FORMATS.find(f => f.slug === LEAD_SLUG)
  const rest = FORMATS.filter(f => f.slug !== LEAD_SLUG)

  return (
    <>
      <Header activeNav="concept" />
      <main className={styles.main}>
        <div className={styles.headerWrap}>
          <div className={styles.eyebrow}>Soara · Grands formats</div>
          <h1 className={styles.title}>
            Les enquêtes qui<br /><em>prennent le temps.</em>
          </h1>
          <p className={styles.lede}>
            Analyses de fond, visualisations interactives, décryptages en profondeur.
          </p>
        </div>

        {lead && (
          <Link href={lead.href} className={styles.openLink} data-cat={lead.cat}>
            <article className={styles.open}>
              <div className={styles.openImg}>
                {lead.image && <img src={lead.image} alt={lead.displayTitle} />}
              </div>
              <div className={styles.openBody}>
                <div className={styles.category}>{lead.eyebrow}</div>
                <h2 className={styles.openTitle} dangerouslySetInnerHTML={{ __html: lead.displayTitle }} />
                <p className={styles.openDesc}>{lead.desc}</p>
                <span className={styles.openCta}>Lire l'enquête →</span>
              </div>
            </article>
          </Link>
        )}

        <div className={styles.list}>
          {rest.map((f, i) => (
            <Link key={f.slug} href={f.href} className={styles.link} data-cat={f.cat}>
              <div className={styles.row}>
                <div className={styles.num}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.body}>
                  <div className={styles.category}>{f.eyebrow}</div>
                  <h2 className={styles.itemTitle} dangerouslySetInnerHTML={{ __html: f.displayTitle }} />
                  <p className={styles.desc}>{f.desc}</p>
                </div>
                <div className={styles.thumb}>
                  {f.image && <img src={f.image} alt={f.displayTitle} />}
                </div>
                <div className={styles.arrow}>→</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
