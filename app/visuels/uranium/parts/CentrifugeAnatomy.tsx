// @ts-nocheck
import { C, hex } from '../data'

/* ════════════════════════════════════════════════════════════════
   CENTRIFUGE ANATOMY
   Grande centrifugeuse en coupe avec flux de particules animés.
   U-235 (ocre) remonte au centre. U-238 (muet) descend sur les parois.
   ════════════════════════════════════════════════════════════════ */
export default function CentrifugeAnatomy({ revealed }) {
  const cfH = 440  // hauteur de la centrifugeuse
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center',
    }} className="uranium-grid-2">

      {/* SCHÉMA */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 360,
        height: cfH + 60,
        margin: '0 auto',
      }}>
        {/* Indicateur rotation */}
        <div style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: C.accent,
          whiteSpace: 'nowrap',
          animation: 'breathe 2.5s ease-in-out infinite',
        }}>
          ↻ 70 000 tours / minute
        </div>

        {/* Moteur */}
        <div style={{
          position: 'absolute',
          top: 28,
          left: '32%',
          right: '32%',
          height: 14,
          background: C.dim,
        }} />
        <div style={{
          position: 'absolute',
          top: 38,
          left: '28%',
          right: '28%',
          height: 8,
          background: C.muted,
        }} />

        {/* Tube extérieur (casing) */}
        <div style={{
          position: 'absolute',
          top: 46,
          left: '15%',
          right: '15%',
          height: cfH - 60,
          border: `2px solid ${C.dim}`,
          borderRadius: 4,
          background: `linear-gradient(to right,
            ${hex(C.surface, 0.8)} 0%,
            ${hex(C.bg, 0.5)} 50%,
            ${hex(C.surface, 0.8)} 100%)`,
          overflow: 'hidden',
        }}>

          {/* Rotor intérieur (qui "tourne" via stripes défilantes) */}
          <div style={{
            position: 'absolute',
            top: 8,
            left: '12%',
            right: '12%',
            bottom: 8,
            background: `linear-gradient(to right,
              ${hex(C.text, 0.08)} 0%,
              ${hex(C.text, 0.18)} 30%,
              ${hex(C.text, 0.12)} 50%,
              ${hex(C.text, 0.18)} 70%,
              ${hex(C.text, 0.08)} 100%)`,
            overflow: 'hidden',
            borderLeft: `1px solid ${hex(C.text, 0.2)}`,
            borderRight: `1px solid ${hex(C.text, 0.2)}`,
          }}>
            {/* stripes de rotation rapide */}
            <div style={{
              position: 'absolute',
              inset: '-30% -30%',
              background: `repeating-linear-gradient(
                60deg,
                transparent 0,
                transparent 5px,
                rgba(255,255,255,0.08) 5px,
                rgba(255,255,255,0.08) 7px
              )`,
              animation: 'cfStripes 0.5s linear infinite',
            }} />

            {/* Particules U-235 qui montent au centre */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`u235-${i}`} style={{
                position: 'absolute',
                left: `${40 + (i % 3) * 8}%`,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: C.accentBright,
                boxShadow: `0 0 10px ${C.accent}, 0 0 4px ${C.accentBright}`,
                animation: revealed
                  ? `u235Rise ${3 + (i % 3) * 0.4}s linear ${i * 0.35}s infinite`
                  : 'none',
              }} />
            ))}

            {/* Particules U-238 qui descendent sur les parois */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`u238-left-${i}`} style={{
                position: 'absolute',
                left: '5%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: C.dim,
                opacity: 0.8,
                animation: revealed
                  ? `u238Fall ${2.8 + (i % 3) * 0.3}s linear ${i * 0.4 + 0.2}s infinite`
                  : 'none',
              }} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`u238-right-${i}`} style={{
                position: 'absolute',
                right: '5%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: C.dim,
                opacity: 0.8,
                animation: revealed
                  ? `u238Fall ${2.8 + (i % 3) * 0.3}s linear ${i * 0.4 + 0.6}s infinite`
                  : 'none',
              }} />
            ))}
          </div>
        </div>

        {/* Base */}
        <div style={{
          position: 'absolute',
          top: cfH - 14 + 46,
          left: '10%',
          right: '10%',
          height: 6,
          background: C.dim,
        }} />
        <div style={{
          position: 'absolute',
          top: cfH - 8 + 46,
          left: '5%',
          right: '5%',
          height: 3,
          background: C.muted,
        }} />

        {/* Flèche d'entrée (feed) à droite, milieu */}
        <div style={{
          position: 'absolute',
          top: `${46 + (cfH - 60) * 0.5 - 8}px`,
          right: -6,
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: C.text,
          whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 30,
            height: 2,
            background: C.text,
            position: 'relative',
            animation: revealed ? 'feedPulse 2s ease-in-out infinite' : 'none',
          }}>
            <div style={{
              position: 'absolute',
              right: 0,
              top: -4,
              width: 0,
              height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: `6px solid ${C.text}`,
            }} />
          </div>
        </div>

        {/* Sortie haute : enrichie */}
        <div style={{
          position: 'absolute',
          top: 60,
          left: -6,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: `6px solid ${C.accent}`,
            animation: revealed ? 'arrowPulse 2s ease-in-out infinite' : 'none',
          }} />
          <div style={{
            width: 30,
            height: 2,
            background: C.accent,
            marginLeft: -6,
          }} />
        </div>

        {/* Sortie basse : appauvrie */}
        <div style={{
          position: 'absolute',
          bottom: 56,
          left: -6,
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: `6px solid ${C.muted}`,
          }} />
          <div style={{
            width: 30,
            height: 2,
            background: C.muted,
            marginLeft: -6,
          }} />
        </div>
      </div>

      {/* LÉGENDE ANNOTÉE */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}>
        <AnnotationRow
          num="1"
          title="Entrée · UF₆ à 0,7 %"
          desc="Le gaz d'hexafluorure d'uranium, légèrement enrichi en U-235, est injecté au milieu du rotor."
          color={C.text}
        />
        <AnnotationRow
          num="2"
          title="Rotor · 70 000 tours/min"
          desc="Tournant à des vitesses proches du mur sonique, le rotor génère une force centrifuge d'environ un million de fois la gravité terrestre."
          color={C.text}
        />
        <AnnotationRow
          num="3"
          title="Paroi · U-238 appauvri"
          desc="Plus lourdes, les molécules contenant de l'uranium 238 sont plaquées contre la paroi extérieure et descendent vers la sortie basse."
          color={C.muted}
          dim
        />
        <AnnotationRow
          num="4"
          title="Centre · U-235 enrichi"
          desc="Plus légères, les molécules d'U-235 restent au centre du rotor et remontent vers la sortie haute, où le gaz collecté est légèrement plus riche."
          color={C.accent}
        />
        <AnnotationRow
          num="5"
          title="Répéter des milliers de fois"
          desc="Une seule centrifugeuse n'enrichit que de 0,1 à 0,2 point. Il en faut des dizaines de milliers en série, raccordées en cascades, pour atteindre les 5 % du combustible civil."
          color={C.accent}
          emphasis
        />
      </div>
    </div>
  )
}

function AnnotationRow({ num, title, desc, color, dim = false, emphasis = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr',
      gap: 16,
      alignItems: 'start',
      opacity: dim ? 0.85 : 1,
      paddingBottom: emphasis ? 0 : 16,
      borderBottom: emphasis ? 'none' : `1px solid ${C.lineSoft}`,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 28,
        fontWeight: 400,
        color: color,
        lineHeight: 1,
        fontStyle: 'italic',
      }}>
        {num}
      </div>
      <div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: color,
          marginBottom: 8,
        }}>
          {title}
        </div>
        <div style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: C.dim,
          fontWeight: 300,
        }}>
          {desc}
        </div>
      </div>
    </div>
  )
}
