// @ts-nocheck
import { C, hex } from '../data'

/* ════════════════════════════════════════════════════════════════
   CENTRIFUGEUSE EN CSS PUR
   Un cylindre avec stripes diagonales qui défilent.
   Fonctionne partout, animation toujours visible.
   ════════════════════════════════════════════════════════════════ */
export default function Centrifuge({ w = 14, h = 60, color = C.text, speed = 1, className = '' }) {
  const stripeDur = `${(0.9 / speed).toFixed(2)}s`
  const particleDur = `${(2.4 / speed).toFixed(2)}s`
  return (
    <div className={`cf-wrap ${className}`} style={{
      width: w,
      height: h,
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Tête (moteur) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: Math.max(2, h * 0.03),
        background: color,
        opacity: 0.9,
      }} />
      <div style={{
        position: 'absolute',
        top: Math.max(2, h * 0.03),
        left: '10%',
        right: '10%',
        height: Math.max(2, h * 0.03),
        background: color,
        opacity: 0.9,
      }} />

      {/* Corps principal avec stripes animées */}
      <div style={{
        position: 'absolute',
        top: Math.max(3, h * 0.05),
        bottom: Math.max(3, h * 0.05),
        left: 0,
        right: 0,
        overflow: 'hidden',
        background: `linear-gradient(to right,
          ${hex(color, 0.35)} 0%,
          ${color} 20%,
          ${hex(color, 0.82)} 50%,
          ${color} 80%,
          ${hex(color, 0.35)} 100%)`,
      }}>
        {/* stripes qui défilent vers le haut (rotation visible) */}
        <div style={{
          position: 'absolute',
          inset: '-20% -20%',
          background: `repeating-linear-gradient(
            55deg,
            transparent 0,
            transparent 3px,
            rgba(0,0,0,0.3) 3px,
            rgba(0,0,0,0.3) 5px
          )`,
          animation: `cfStripes ${stripeDur} linear infinite`,
        }} />
        {/* particule d'enrichissement */}
        <div style={{
          position: 'absolute',
          left: '50%',
          width: Math.max(2, w * 0.15),
          height: Math.max(2, w * 0.15),
          borderRadius: '50%',
          background: C.accentBright,
          boxShadow: `0 0 ${Math.max(3, w * 0.4)}px ${C.accent}`,
          transform: 'translateX(-50%)',
          animation: `cfParticle ${particleDur} linear infinite`,
        }} />
      </div>

      {/* Base */}
      <div style={{
        position: 'absolute',
        bottom: Math.max(2, h * 0.02),
        left: 0,
        right: 0,
        height: Math.max(2, h * 0.04),
        background: color,
        opacity: 0.95,
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '-10%',
        right: '-10%',
        height: Math.max(1, h * 0.02),
        background: color,
        opacity: 0.6,
      }} />
    </div>
  )
}
