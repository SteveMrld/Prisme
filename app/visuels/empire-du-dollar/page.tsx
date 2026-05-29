import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../../components/Header'
import { Reveal } from '../Reveal'
import styles from '../visuels.module.css'

export const metadata: Metadata = {
  title: "L'Empire du dollar, Trilogie animée",
  description: "Bretton Woods, pétrodollar, sanctions, BRICS. La trilogie animée Soara en trois actes.",
  alternates: { canonical: 'https://soara.fr/visuels/empire-du-dollar' },
  openGraph: {
    type: 'website',
    url: 'https://soara.fr/visuels/empire-du-dollar',
    title: "L'Empire du dollar, Trilogie Soara",
    description: "Comment une monnaie nationale est devenue l'étalon de l'économie mondiale. Une trilogie animée en trois actes.",
    siteName: 'Soara',
    locale: 'fr_FR',
    images: [{ url: '/articles/atlas/15_empire-du-dollar.jpg', width: 1200, height: 630, alt: "L'Empire du dollar" }],
  },
}

const ACTES = [
  { slug: 'dollar1', n: 'I', title: "La naissance d'un empire", desc: 'De Bretton Woods au pétrodollar, comment le dollar a pris le trône de la livre sterling.', slides: 8 },
  { slug: 'dollar2', n: 'II', title: "L'arme financière", desc: "SWIFT, sanctions, gel d'avoirs : le dollar comme instrument de puissance géopolitique.", slides: 7 },
  { slug: 'dollar3', n: 'III', title: 'Le crépuscule ?', desc: 'Dédollarisation, BRICS, yuan : la fin du monopole absolu est-elle en marche ?', slides: 7 },
]

export default function EmpireDuDollarPage() {
  return (
    <>
      <Header activeNav="concept" />

      <div className={styles.atlasIntro}>
        <div className={styles.atlasIntroEyebrow}>Atlas Soara · Trilogie</div>
        <h1 className={styles.atlasIntroTitle}>L&apos;Empire du dollar</h1>
        <p className={styles.atlasIntroChapeau}>
          Bretton Woods, pétrodollar, sanctions, BRICS. Comment une monnaie nationale est devenue l&apos;étalon de l&apos;économie mondiale, et pourquoi son règne pourrait finir. Trois actes animés, lus comme un livre éditorial sérialisé.
        </p>
        <div className={styles.atlasIntroStats}>3 actes · 22 slides · Économie</div>
      </div>

      <div className={styles.page}>
        <section className={styles.trilogie}>
          <Reveal>
            <div className={styles.trilogiePreamble}>
              <svg className={styles.sectionPicto} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <p>Une histoire en trois actes. Lue chapitre par chapitre, comme un livre éditorial sérialisé.</p>
            </div>
          </Reveal>

          <Reveal>
            <Link href="/visuels/dollar1" className={styles.trilogieBanner} aria-label="Lancer l'animation de l'Acte I, La naissance d'un empire">
              <img
                src="/articles/atlas/15_empire-du-dollar.jpg"
                alt="Billet de dollar et graphiques financiers"
                className={styles.trilogieBannerImg}
                loading="eager"
              />
              <div className={styles.trilogieBannerInner}>
                <div className={styles.trilogieEyebrow}>Trilogie · Économie</div>
                <h2 className={styles.trilogieTitle}>L&apos;Empire du dollar</h2>
                <p className={styles.trilogieSub}>Bretton Woods · Pétrodollar · Sanctions · BRICS</p>
                <p className={styles.trilogieDesc}>
                  Comment une monnaie nationale est devenue l&apos;étalon de l&apos;économie mondiale.
                  Et pourquoi son règne pourrait finir.
                </p>
                <span className={styles.trilogieBannerCta}>Lancer l&apos;animation →</span>
              </div>
            </Link>
          </Reveal>

          <div className={styles.trilogieGrid}>
            {ACTES.map((item, i) => (
              <Reveal key={item.slug} delay={i * 120} className={styles.acteRevealWrap}>
                <Link href={`/visuels/${item.slug}`} className={styles.acteCard}>
                  <span className={`${styles.formatChip} ${styles.formatChipTrilogie} ${styles.acteChip}`}>Trilogie {item.n}</span>
                  <div className={styles.acteN}>{item.n}</div>
                  <h3 className={styles.acteTitle}>{item.title}</h3>
                  <p className={styles.acteDesc}>{item.desc}</p>
                  <div className={styles.acteMeta}>
                    <span className={styles.acteSlides}>{item.slides} slides</span>
                    <span className={styles.acteCta}>Lancer l&apos;animation →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 8px' }}>
          <Link href="/visuels" style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gris-m)', textDecoration: 'none', borderBottom: '1px solid var(--gris-l)', paddingBottom: '3px' }}>
            ← Retour à l&apos;Atlas
          </Link>
        </div>
      </div>
    </>
  )
}
