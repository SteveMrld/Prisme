// @ts-nocheck
import { C, hex } from '../data'
import Centrifuge from './Centrifuge'

/* ════════════════════════════════════════════════════════════════
   PROVIDER BAR
   Barre horizontale proportionnelle + cluster de centrifugeuses
   ════════════════════════════════════════════════════════════════ */
export default function ProviderBar({ provider, index, maxSwu, revealed }) {
  const widthPct = (provider.swu / maxSwu) * 100
  const isRosatom = provider.name === 'Rosatom'
  const isNegligible = provider.swu < 0.5
  const cfCount = isNegligible ? 1 : Math.max(3, Math.round((provider.swu / maxSwu) * 24))
  const color = isRosatom ? C.accent : C.text

  return (
    <div style={{
      animation: revealed ? `fadeUp 600ms ease ${index * 120}ms both` : 'none',
    }}>
      {/* ligne du haut : nom + métriques */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 14,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: isRosatom ? 'clamp(24px, 3.5vw, 34px)' : 'clamp(20px, 2.8vw, 28px)',
            fontWeight: 500,
            color: color,
            letterSpacing: '-0.01em',
          }}>
            {provider.name}
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: C.dim,
          }}>
            {provider.country}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(18px, 2.2vw, 24px)',
            color: color,
            fontWeight: 400,
          }}>
            {isNegligible ? '< 1' : provider.swu}
            <span style={{ fontSize: 10, marginLeft: 4, color: C.dim, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.08em' }}>
              M UTS
            </span>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            color: isRosatom ? C.accent : C.dim,
            minWidth: 44,
            textAlign: 'right',
          }}>
            {isNegligible ? '< 1' : provider.share} %
          </div>
        </div>
      </div>

      {/* rangée de centrifugeuses au-dessus de la barre */}
      <div style={{
        display: 'flex',
        gap: 3,
        marginBottom: 8,
        alignItems: 'flex-end',
        minHeight: 44,
      }}>
        {Array.from({ length: cfCount }).map((_, i) => (
          <div
            key={i}
            style={{
              animation: revealed
                ? `fadeUp 400ms ease ${index * 120 + i * 20}ms both`
                : 'none',
            }}
          >
            <Centrifuge
              w={10}
              h={40}
              color={color}
              speed={0.7 + (i % 4) * 0.2}
            />
          </div>
        ))}
      </div>

      {/* barre de progression */}
      <div style={{
        position: 'relative',
        height: 6,
        background: C.lineSoft,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 8,
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${widthPct}%`,
          background: `linear-gradient(90deg, ${color}, ${isRosatom ? C.accentBright : hex(C.text, 0.85)})`,
          transformOrigin: 'left',
          animation: revealed
            ? `barGrow 1200ms cubic-bezier(.3,.1,.2,1) ${index * 120}ms both`
            : 'none',
          boxShadow: isRosatom ? `0 0 12px ${hex(C.accent, 0.6)}` : 'none',
        }} />
        {/* sweep lumineux */}
        {isRosatom && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${hex(C.accentBright, 0.5)}, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'sweep 3.5s linear infinite',
          }} />
        )}
      </div>

      {/* plants */}
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 13,
        fontStyle: 'italic',
        color: C.muted,
      }}>
        {provider.plants}
      </div>
    </div>
  )
}
