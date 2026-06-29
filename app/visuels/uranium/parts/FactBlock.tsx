// @ts-nocheck
import { C } from '../data'
import CountUp from './CountUp'

/* ════════════════════════════════════════════════════════════════
   FACT BLOCK ANIMÉ
   ════════════════════════════════════════════════════════════════ */
export default function FactBlock({ target, suffix = '', label, source, accent = false, trigger }) {
  return (
    <div style={{
      borderTop: `2px solid ${accent ? C.accent : C.line}`,
      paddingTop: 18,
      animation: trigger ? 'fadeUp 700ms ease both' : 'none',
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(34px, 4vw, 52px)',
        fontWeight: 400,
        color: accent ? C.accent : C.text,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        marginBottom: 16,
      }}>
        <CountUp target={target} duration={1800} trigger={trigger} suffix={suffix} />
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 15,
        lineHeight: 1.5,
        color: C.text,
        fontWeight: 300,
        marginBottom: 12,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: C.muted,
      }}>
        {source}
      </div>
    </div>
  )
}
