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
        <div className={styles.eyebrow}>Soara · Une page de Jade Desroses</div>
        <h1>
          La <em>Bibliothèque</em>
        </h1>
        <p className={styles.lede}>
          Touchez un livre sur l&apos;étagère. Une lecture, un parti pris, la raison pour
          laquelle il compte.
        </p>
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
