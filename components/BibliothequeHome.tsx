import Link from 'next/link'
import type { CSSProperties } from 'react'
import livres from '../lib/bibliotheque.json'
import { toneFor } from '../lib/bibliotheque-palette'
import styles from './BibliothequeHome.module.css'

type Livre = {
  titre: string
  auteur: string
  auteurCourt?: string
  hauteur?: number
  largeur?: number
}

export default function BibliothequeHome() {
  const items = livres as Livre[]
  const total = items.length

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <div className={styles.eyebrow}>Soara · Bibliothèque</div>
          <h2>
            La <em>Bibliothèque</em>
          </h2>
          <p className={styles.intro}>
            Une page de Jade Desroses. À chaque coup de cœur, un livre qui mérite
            d&apos;être lu, et la raison pour laquelle il compte.
          </p>
          <Link href="/bibliotheque" className={styles.cta}>
            Parcourir l&apos;étagère →
          </Link>
        </div>

        <Link
          href="/bibliotheque"
          className={styles.shelfLink}
          aria-label="Découvrir la Bibliothèque"
        >
          <div className={styles.shelf}>
            {items.map((l, i) => {
              const tone = toneFor(i, total)
              const h = Math.round((l.hauteur ?? 270) * 0.72)
              const spineStyle: CSSProperties = {
                height: h + 'px',
                width: (l.largeur ?? 32) + 'px',
                background: tone[0],
                color: tone[1],
                ['--ac' as any]: tone[2],
              }
              return (
                <span
                  key={l.titre + i}
                  className={styles.spine}
                  style={spineStyle}
                >
                  <span className={styles.band}>
                    <i /><i />
                  </span>
                  <span className={styles.sTitle}>{l.titre}</span>
                  <span className={styles.sAuthor}>{l.auteurCourt || l.auteur}</span>
                  <span className={styles.band}>
                    <i />
                  </span>
                </span>
              )
            })}
          </div>
          <div className={styles.board} />
        </Link>
      </div>
    </section>
  )
}
