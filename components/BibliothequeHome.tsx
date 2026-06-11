import Link from 'next/link'
import type { CSSProperties } from 'react'
import livres from '../lib/bibliotheque.json'
import { toneFor } from '../lib/bibliotheque-palette'
import { randomShuffle } from '../lib/rotation'
import styles from './BibliothequeHome.module.css'

type Livre = {
  titre: string
  auteur: string
  auteurCourt?: string
  editeur?: string
  pays?: string
  couverture?: string | null
  accroche?: string
  spine?: string[]
  hauteur?: number
  largeur?: number
}

/* Première phrase de l'accroche, pour le teaser sous chaque carte.
   Coupe sur ". " pour préserver les abréviations (M., Mme…) qui sont
   rares dans les chroniques mais possibles. */
function firstSentence(text?: string): string {
  if (!text) return ''
  const idx = text.indexOf('. ')
  return idx > 0 ? text.slice(0, idx + 1) : text
}

export default function BibliothequeHome() {
  const items = livres as Livre[]
  // 3 livres vedettes tirés au sort à chaque requête, le reste passe
  // en étagère discrète. La home étant force-dynamic, la sélection
  // change à chaque chargement comme le reste des blocs.
  const shuffled = randomShuffle(items)
  const featured = shuffled.slice(0, 3)
  const shelf = shuffled.slice(3)

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <span className={styles.eyebrow}>Bibliothèque · Une page de Jade Desroses</span>
          <h2 className={styles.title}>
            La <em>Bibliothèque</em>
          </h2>
          <p className={styles.intro}>
            Des livres qui méritent d&apos;être lus, et la raison pour laquelle ils comptent.
          </p>
        </div>
        <Link href="/bibliotheque" className={styles.seeAll}>
          Toutes les lectures →
        </Link>
      </div>

      <div className={styles.vitrine}>
        {featured.map((l, i) => (
          <Link
            href="/bibliotheque"
            key={l.titre + i}
            className={styles.card}
            aria-label={`${l.titre} de ${l.auteur}`}
          >
            <div className={styles.cover}>
              {l.couverture && (
                <img src={l.couverture} alt="" loading="lazy" />
              )}
            </div>
            <h3 className={styles.bookTitle}>{l.titre}</h3>
            <div className={styles.bookAuthor}>{l.auteur}</div>
            {l.accroche && (
              <p className={styles.teaser}>{firstSentence(l.accroche)}</p>
            )}
            <span className={styles.cta}>Lire la chronique →</span>
          </Link>
        ))}
      </div>

      <Link
        href="/bibliotheque"
        className={styles.shelfLink}
        aria-label="Voir tous les livres"
      >
        <div className={styles.shelf}>
          {shelf.map((l, i) => {
            const tone = l.spine ?? toneFor(i, shelf.length)
            const h = Math.round((l.hauteur ?? 270) * 0.46)
            const spineStyle: CSSProperties = {
              height: h + 'px',
              width: Math.round((l.largeur ?? 32) * 0.85) + 'px',
              background: tone[0],
              color: tone[1],
              ['--ac' as any]: tone[2],
            }
            return (
              <span key={l.titre + i} className={styles.spine} style={spineStyle}>
                <span className={styles.sTitle}>{l.titre}</span>
              </span>
            )
          })}
        </div>
        <div className={styles.board} />
      </Link>
    </section>
  )
}
