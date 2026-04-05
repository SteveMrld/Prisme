import Header from '../../components/Header'
import SolutionsClient from './SolutionsClient'
import Link from 'next/link'
import styles from './solutions.module.css'

export const metadata = {
  title: 'Changer le monde — Confins',
  description: '157 solutions concrètes pour la planète. Économie circulaire, eau, énergie, biodiversité, agriculture. Sélection ChangeNow 2026.',
}

export default function SolutionsPage() {
  return (
    <>
      <Header />

      {/* HERO */}
      <div style={{
        background: '#0A0A0A',
        padding: '56px 48px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decoration */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,122,79,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 640, position: 'relative', zIndex: 1 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', color: '#C4A265', display: 'block', marginBottom: 16,
          }}>
            Changer le monde
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 400, lineHeight: 1.1, letterSpacing: '-1.5px',
            color: '#FAF9F7', marginBottom: 16,
          }}>
            157 solutions pour <em style={{ color: '#C4A265', fontStyle: 'italic' }}>réparer la planète</em>
          </h1>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 18, fontStyle: 'italic',
            color: 'rgba(250,249,247,0.65)', lineHeight: 1.6, marginBottom: 28,
          }}>
            Des entreprises, startups et ONG qui prouvent que le monde peut aller mieux.
            Sélection <a href="https://www.changenow.world" target="_blank" rel="noopener noreferrer"
              style={{ color: '#C4A265', textDecoration: 'none' }}>ChangeNow 2026</a> — Grand Palais, Paris.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[
              { n: '157', l: 'solutions' },
              { n: '31', l: 'pays' },
              { n: '14', l: 'catégories' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#FAF9F7', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(250,249,247,0.4)', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SolutionsClient />

      <footer style={{ borderTop: '2px solid var(--encre)', padding: '32px 48px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20 }}>Con<em>fins</em></div>
        <div style={{ display: 'flex', gap: 24, fontSize: 11 }}>
          <Link href="/apropos" style={{ color: 'var(--gris)', textDecoration: 'none' }}>À propos</Link>
          <Link href="/mentions" style={{ color: 'var(--gris)', textDecoration: 'none' }}>Mentions légales</Link>
        </div>
        <div style={{ fontSize: 10, color: 'var(--gris-l)', marginLeft: 'auto' }}>
          Source : ChangeNow 2026 · Grand Palais, Paris
        </div>
      </footer>
    </>
  )
}
