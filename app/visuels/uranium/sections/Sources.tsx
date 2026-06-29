// @ts-nocheck
import { C } from '../data'

/* ═══════════════════════════════════════════════════
    SOURCES
    ═══════════════════════════════════════════════════ */
export default function Sources() {
  return (
    <section style={{
      padding: '60px 24px 100px',
      maxWidth: 1200,
      margin: '0 auto',
      borderTop: `1px solid ${C.line}`,
    }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: C.dim,
        marginBottom: 24,
      }}>
        Sources
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 14,
        lineHeight: 1.55,
        color: C.dim,
        fontStyle: 'italic',
      }}>
        <div>World Nuclear Association, <span style={{ fontStyle: 'normal' }}>World Nuclear Fuel Report</span>, sept. 2025.</div>
        <div>Centrus Energy, <span style={{ fontStyle: 'normal' }}>10-K 2025</span>, fév. 2026.</div>
        <div>Bruegel, <span style={{ fontStyle: 'normal' }}>EU Reliance on Russian Nuclear Fuel</span>, 2025.</div>
        <div>AIEA, <span style={{ fontStyle: 'normal' }}>Safeguards Reports</span>, 2024–2025.</div>
        <div>CEA, <span style={{ fontStyle: 'normal' }}>L'enrichissement de l'uranium</span>.</div>
        <div>Thunder Said Energy, <span style={{ fontStyle: 'normal' }}>Uranium enrichment by country</span>, 2024.</div>
      </div>

      <div style={{
        marginTop: 48,
        paddingTop: 20,
        borderTop: `1px solid ${C.line}`,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 10,
        letterSpacing: '0.08em',
        color: C.muted,
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <span>Atlas Soara · Cartographie éditoriale</span>
        <a href="/visuels" style={{ color: C.accent, textDecoration: 'none' }}>
          Retour à l'Atlas ↗
        </a>
      </div>
    </section>
  )
}
