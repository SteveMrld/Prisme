// @ts-nocheck
'use client'
import { useMemo } from 'react'
import { C } from '../data'

/* ════════════════════════════════════════════════════════════════
   DOT GRID : 1000 points, 7 en accent qui pulsent
   ════════════════════════════════════════════════════════════════ */
export default function DotGrid({ total = 1000, revealed }) {
  const accentIdx = useMemo(() => new Set([97, 203, 341, 518, 662, 789, 901]), [])
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(50, 1fr)',
      gap: 3,
      maxWidth: 760,
    }}>
      {Array.from({ length: total }).map((_, i) => {
        const isAccent = accentIdx.has(i)
        return (
          <div
            key={i}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              background: isAccent ? C.accent : C.muted,
              opacity: revealed ? (isAccent ? 1 : 0.3) : 0,
              borderRadius: '50%',
              transition: `opacity 500ms ease ${Math.min(i * 0.3, 300)}ms`,
              animation: isAccent && revealed
                ? `dotPulse 2.4s ease-in-out ${(i % 7) * 0.3}s infinite`
                : 'none',
              boxShadow: isAccent && revealed ? `0 0 8px ${C.accent}` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}
