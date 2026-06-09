'use client'

import { useState, type CSSProperties } from 'react'
import Link from 'next/link'
import styles from './bibliotheque.module.css'
import { toneFor } from '../../lib/bibliotheque-palette'

type Livre = {
  titre: string
  auteur: string
  auteurCourt?: string
  editeur: string
  pays: string
  couverture?: string | null
  coupDeCoeur?: boolean
  lien?: string | null
  hauteur?: number
  largeur?: number
  accroche: string
}

const INTRO = `Il y a des livres que l'on referme et que l'on garde près de soi, parce qu'ils ont déplacé quelque chose en nous. Cette page leur est réservée. J'y choisis, au gré de mes lectures, un ouvrage dont j'ai envie de parler, et je prends le temps de dire pourquoi il compte. Des coups de cœur assumés, qui éclairent une part du monde que l'on regarde trop rarement. On y croisera des voix venues du Sud que l'on traduit trop tard, des romans, des essais, des textes anciens, à la seule condition qu'ils tiennent encore debout longtemps après qu'on les a quittés. Je vous les confie comme on glisse un livre dans la main de quelqu'un dont on espère qu'il l'aimera autant.`

export default function BibliothequeClient({ livres }: { livres: Livre[] }) {
  const startIndex = Math.max(0, livres.findIndex((l) => l.coupDeCoeur))
  const [active, setActive] = useState(startIndex)
  const total = livres.length
  const current = livres[active]
  const curTone = toneFor(active, total)

  const coverStyle: CSSProperties = {
    background: curTone[0],
    color: curTone[1],
    ['--ac' as any]: curTone[2],
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.eyebrow}>Soara · Bibliothèque</div>
        <h1>
          La <em>Bibliothèque</em>
        </h1>
        <div className={styles.introText}>
          <p>{INTRO}</p>
          <p className={styles.signature}>Jade Desroses</p>
        </div>
      </header>

      <div className={styles.shelfWrap}>
        <div className={styles.shelf}>
          {livres.map((l, i) => {
            const tone = toneFor(i, total)
            const spineStyle: CSSProperties = {
              height: (l.hauteur ?? 270) + 'px',
              width: (l.largeur ?? 32) + 'px',
              background: tone[0],
              color: tone[1],
              ['--ac' as any]: tone[2],
            }
            return (
              <button
                key={l.titre + i}
                type="button"
                className={`${styles.spine} ${i === active ? styles.spineActive : ''}`}
                style={spineStyle}
                aria-label={`${l.titre}, ${l.auteur}`}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
              >
                <span className={styles.band}>
                  <i /><i />
                </span>
                <span className={styles.sTitle}>{l.titre}</span>
                <span className={styles.sAuthor}>{l.auteurCourt || l.auteur}</span>
                <span className={styles.band}>
                  <i />
                </span>
              </button>
            )
          })}
        </div>
        <div className={styles.board} />
        <div className={styles.swipehint}>← faites glisser le long de l&apos;étagère →</div>
      </div>

      <section className={styles.detail} key={active}>
        <div className={styles.dCover} style={coverStyle}>
          {current.couverture ? (
            <img
              src={current.couverture}
              alt={`Couverture de ${current.titre}, ${current.auteur}`}
              className={styles.dCoverImg}
            />
          ) : (
            <>
              <span className={styles.dcPub}>{current.editeur}</span>
              <span className={styles.dcBands}>
                <i /><i />
              </span>
              <span className={styles.dcTitle}>{current.titre}</span>
              <span className={styles.dcAuthor}>{current.auteur}</span>
            </>
          )}
        </div>
        <div className={styles.dBody}>
          {current.coupDeCoeur && <span className={styles.kicker}>Coup de cœur</span>}
          <h2>{current.titre}</h2>
          <div className={styles.dMeta}>
            <b>{current.auteur}</b> · {current.editeur} · {current.pays}
          </div>
          <p className={styles.dHook}>{current.accroche}</p>
          {current.lien ? (
            <Link href={current.lien} className={styles.dRead}>
              Lire la recension de Jade →
            </Link>
          ) : (
            <span className={styles.dSoon}>Recension à paraître</span>
          )}
          <div className={styles.dBy}>par Jade Desroses</div>
        </div>
      </section>
    </div>
  )
}
