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

        {/* ═══ VIDEO PRINCIPALE, carre 1:1 pleine largeur du conteneur Atlas ═══ */}
        <section>
          <Reveal>
            <figure style={{ margin: 0 }}>
              <div style={{
                background: '#07080B',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                borderRadius: 4,
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
            </figure>
          </Reveal>
        </section>

        {/* ═══ TEXTE EXPLICATIF, style sectionDesc des autres pages Atlas ═══ */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <Reveal>
            <p style={{
              fontFamily: "var(--font-serif-text), 'Cormorant Garamond', Georgia, serif",
              fontSize: 17,
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--gris-m)',
              margin: 0,
            }}>
              L'animation reprend le cycle frigorifique en quatre étapes : évaporation, compression, condensation, détente. Un climatiseur ne fabrique pas de froid, il déplace de la chaleur, d'une pièce vers la rue. Pour chaque 100 unités retirées du salon, le bloc extérieur en rejette environ 130, parce que l'électricité consommée par le compresseur finit elle aussi en chaleur.{' '}
              <Link href="/grands-formats/climatisation" style={{ color: '#C8A96E', borderBottom: '1px solid #C8A96E' }}>
                Lire le grand format →
              </Link>
            </p>
          </Reveal>

          {/* Lien de telechargement discret, version verticale 9:16 */}
          <Reveal delay={120}>
            <div style={{
              marginTop: 28,
              fontFamily: "'DM Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: '0.12em',
              color: '#8a7f72',
            }}>
              Télécharger la version verticale 9:16 :{' '}
              <a href="/soara_clim_nyt_v.mp4" download style={{ color: '#8a7f72', borderBottom: '1px solid #DDD9D2' }}>
                soara_clim_nyt_v.mp4 ↓
              </a>
            </div>
          </Reveal>
        </section>

        {/* ═══ CTA RETOUR GRAND FORMAT, double affordance ═══ */}
        <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <Reveal>
            <Link
              href="/grands-formats/climatisation"
              style={{
                display: 'inline-block',
                fontFamily: "'DM Mono', ui-monospace, monospace",
                fontSize: 12,
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
