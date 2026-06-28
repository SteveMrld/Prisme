import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '../../../components/Header'
import { Reveal } from '../Reveal'
import styles from '../visuels.module.css'

export const metadata: Metadata = {
  title: "La chaleur deplacee, animation pour les reseaux",
  description: "L'animation du cycle de la climatisation et de son paradoxe energetique, deux formats prets pour les reseaux : carre 1:1 et vertical 9:16.",
  alternates: { canonical: 'https://soara.fr/visuels/climatisation' },
  openGraph: {
    type: 'video.other',
    url: 'https://soara.fr/visuels/climatisation',
    title: 'La chaleur deplacee, Atlas Soara',
    description: "Le cycle du climatiseur et le paradoxe energetique en animation, deux formats pour TikTok, LinkedIn, Instagram.",
    siteName: 'Soara',
    locale: 'fr_FR',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'La chaleur deplacee, animation Soara' }],
  },
}

export default function ClimatisationAtlasPage() {
  return (
    <>
      <Header activeNav="concept" />

      <div className={styles.atlasIntro}>
        <div className={styles.atlasIntroEyebrow}>Atlas Soara · Animation immersive</div>
        <h1 className={styles.atlasIntroTitle}>La chaleur déplacée</h1>
        <p className={styles.atlasIntroChapeau}>
          Le cycle du climatiseur et le paradoxe énergétique en animation, deux formats prêts à partager : carré 1:1 et vertical 9:16. Pour comprendre, en une minute, ce qu'un climatiseur fait vraiment.
        </p>
        <div className={styles.atlasIntroStats}>Environnement · 2 formats vidéo · Animation Soara</div>
      </div>

      <div className={styles.page}>

        {/* ═══ INTRO ═══ */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '8px 24px 12px' }}>
          <Reveal>
            <p style={{
              fontFamily: "var(--font-serif-text, 'Cormorant Garamond'), Georgia, serif",
              fontSize: 'clamp(17px, 1.4vw, 19px)',
              fontStyle: 'italic',
              color: '#3D3D3D',
              lineHeight: 1.55,
              margin: 0,
            }}>
              La climatisation ne fabrique pas de froid : elle déplace de la chaleur, d'une pièce vers la rue, en consommant de l'électricité pour le faire. Pour chaque 100 unités retirées du salon, le bloc extérieur en rejette 130. Le grand format est en accès libre,{' '}
              <Link href="/grands-formats/climatisation" style={{ borderBottom: '1px solid #C8A96E', color: '#C8A96E' }}>
                à lire ici
              </Link>.
            </p>
          </Reveal>
        </section>

        {/* ═══ VIDEOS COTE A COTE ═══ */}
        <section style={{
          maxWidth: 1200,
          margin: '40px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}>

          {/* CARRE 1:1 */}
          <Reveal>
            <figure style={{ margin: 0 }}>
              <div style={{
                background: '#0d0c0b',
                borderRadius: '4px',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                position: 'relative',
              }}>
                <video
                  src="/soara_clim_nyt_s.mp4"
                  controls
                  preload="metadata"
                  playsInline
                  poster="/articles/atlas/16_climatisation-chaleur-deplacee.jpg"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <figcaption style={{
                marginTop: '14px',
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: '#8a7f72',
              }}>
                <strong style={{ color: '#0A0A0A', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Format carré · 1:1</strong>
                <br />Pour Instagram, LinkedIn, X. Téléchargement direct :{' '}
                <a
                  href="/soara_clim_nyt_s.mp4"
                  download
                  style={{ color: '#C8A96E', borderBottom: '1px solid #C8A96E' }}
                >
                  soara_clim_nyt_s.mp4
                </a>.
              </figcaption>
            </figure>
          </Reveal>

          {/* VERTICAL 9:16 */}
          <Reveal delay={120}>
            <figure style={{ margin: 0 }}>
              <div style={{
                background: '#0d0c0b',
                borderRadius: '4px',
                overflow: 'hidden',
                aspectRatio: '9 / 16',
                position: 'relative',
                maxWidth: 'min(100%, 380px)',
                marginInline: 'auto',
              }}>
                <video
                  src="/soara_clim_nyt_v.mp4"
                  controls
                  preload="metadata"
                  playsInline
                  poster="/articles/atlas/16_climatisation-chaleur-deplacee.jpg"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <figcaption style={{
                marginTop: '14px',
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: '#8a7f72',
              }}>
                <strong style={{ color: '#0A0A0A', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Format vertical · 9:16</strong>
                <br />Pour TikTok, Instagram Reels, YouTube Shorts. Filigrane anti-recadrage. Téléchargement :{' '}
                <a
                  href="/soara_clim_nyt_v.mp4"
                  download
                  style={{ color: '#C8A96E', borderBottom: '1px solid #C8A96E' }}
                >
                  soara_clim_nyt_v.mp4
                </a>.
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* ═══ CTA RETOUR GRAND FORMAT ═══ */}
        <section style={{ maxWidth: 760, margin: '64px auto 24px', padding: '0 24px', textAlign: 'center' }}>
          <Reveal>
            <Link
              href="/grands-formats/climatisation"
              style={{
                display: 'inline-block',
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#0A0A0A',
                border: '1px solid #DDD9D2',
                padding: '14px 24px',
                textDecoration: 'none',
              }}
            >
              Lire le grand format, accès libre →
            </Link>
          </Reveal>
        </section>

      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>So<em>ara</em></div>
        <div className={styles.footerLinks}>
          <Link href="/apropos">À propos</Link>
          <Link href="/contributeurs">Contributeurs</Link>
          <Link href="/mentions">Mentions légales</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 Soara · Média d'analyse indépendant</div>
      </footer>
    </>
  )
}
