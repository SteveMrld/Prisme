import Header from '../../components/Header'
import Link from 'next/link'
import revues from '../../lib/revues.json'
import styles from './revue.module.css'

export const metadata = {
  title: 'Revue quotidienne · Soara',
  description: 'La revue de presse géopolitique quotidienne de Soara : les faits qui comptent, les sources qui les rapportent.',
}

const SOURCE_ABBR: Record<string, string> = {
  ajenews: 'AJ', haaretzcom: 'Ha', ft: 'FT', dropsitenews: 'DS',
  theintercept: 'TI', washingtonpost: 'WP', nytimes: 'NY', reuters: 'RE',
  marionawfal: 'MA', rnaudbertrand: 'AB', karimbitar: 'KB', sentdefender: 'SD',
  clashreport: 'CR', kobeissiletter: 'KL', iaeaorg: 'IA', tparsi: 'TP',
  shanaka86: 'Sh', hamidrezaaz: 'HR', furkangozukara: 'FG', allenanalysis: 'AA',
  ramabdu: 'RA', markseddon1962: 'MS', jamesmartinsj: 'JM', spectateursfr: 'SF',
  kuwaittimesnews: 'KT', ryangrim: 'RG', viviannereim: 'VN', globeeyenews: 'GE',
  osint613: 'OS', nowthis_x_media: 'NT',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

export default function RevuePage() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>Soara · Revue quotidienne</div>
          <h1 className={styles.title}>Revue <em>géopolitique</em></h1>
          <p className={styles.subtitle}>
            Les faits qui comptent. Les sources qui les rapportent. Sans filtre éditorial mainstream.
          </p>
        </div>

        <div className={styles.feed}>
          {(revues as any[]).map((revue, i) => (
            <div key={i} className={styles.revue}>
              <div className={styles.revueHeader}>
                <div className={styles.revueDate}>{formatDate(revue.date)}</div>
                <div className={styles.revueRegion}>{revue.region}</div>
              </div>
              <div className={styles.items}>
                {revue.items.map((item: any, j: number) => (
                  <div key={j} className={styles.item}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.itemLink}
                    >
                      <span className={styles.itemText}>{item.text}</span>
                      <span className={styles.itemSource}>
                        {SOURCE_ABBR[item.source] || item.source.slice(0,2).toUpperCase()}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <Link href="/recoupement" className={styles.ctaBtn}>
            Recouper une information →
          </Link>
        </div>
      </div>
    </>
  )
}
