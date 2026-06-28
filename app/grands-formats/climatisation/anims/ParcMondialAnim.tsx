// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'

// Animation canvas : la proliferation du parc mondial de climatiseurs.
// Grille de 560 dots representant 5,6 Md d'appareils (1 dot = 10 millions).
// Cycle de 14 secondes :
//  - 0-3s  : remplissage 0 -> 1,6 Md (160 dots encre)  -> "2025"
//  - 3-5s  : palier 1,6 Md
//  - 5-10s : remplissage 1,6 -> 5,6 Md (400 dots or)   -> "2050"
//  - 10-13s : palier 5,6 Md
//  - 13-14s : fade out
export default function ParcMondialAnim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    let rafId = 0
    const t0 = performance.now()

    const INK = '#1a1714'
    const OR = '#C8A96E'
    const GRAY = '#6f6a61'
    const LIGHT = '#e7e3da'

    const COLS = 28
    const ROWS = 20
    const TOTAL = COLS * ROWS // 560 dots = 5,6 Md (1 dot = 10 millions)
    const BASELINE = 160      // 1,6 Md
    const DOTS_PER_BILLION = 100

    // Pre-shuffle l'ordre d'apparition pour eviter un remplissage ligne par ligne
    const order = Array.from({ length: TOTAL }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = order[i]; order[i] = order[j]; order[j] = tmp
    }
    // Quand chaque dot a "atteint" son etat plein (en secondes depuis t0)
    // pour pouvoir faire un pulse a la naissance.
    const bornAt = new Float32Array(TOTAL)
    for (let i = 0; i < TOTAL; i++) bornAt[i] = -1

    function mono(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Mono", ui-monospace, monospace' }
    function sans(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Sans", system-ui, sans-serif' }

    function resize() {
      const b = cv.getBoundingClientRect()
      W = b.width; H = b.height
      cv.width = W * DPR; cv.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    function frame(now: number) {
      const t = (now - t0) / 1000
      const cycle = t % 14

      // Determine combien de dots doivent etre allumes a ce frame
      let filled = 0
      let fadeAlpha = 1
      if (cycle < 3) {
        filled = Math.floor((cycle / 3) * BASELINE)
      } else if (cycle < 5) {
        filled = BASELINE
      } else if (cycle < 10) {
        const k = (cycle - 5) / 5
        filled = Math.floor(BASELINE + k * (TOTAL - BASELINE))
      } else if (cycle < 13) {
        filled = TOTAL
      } else {
        filled = TOTAL
        fadeAlpha = Math.max(0, 1 - (cycle - 13))
      }
      // Si on a depasse l'effacement (fadeAlpha=0), reset des dates de naissance
      if (cycle < 0.1) {
        for (let i = 0; i < TOTAL; i++) bornAt[i] = -1
      }

      // Layout : sur mobile (W<640), grille en haut, panel en bas. Sur desktop, cote a cote.
      const isMobile = W < 720
      let gridLeft = 0, gridRight = 0, gridTop = 0, gridBottom = 0
      let panelX = 0, panelTop = 0, panelTextAlign: 'left' | 'center' = 'left'
      if (isMobile) {
        gridLeft = W * 0.04
        gridRight = W * 0.96
        gridTop = H * 0.06
        gridBottom = H * 0.62
        panelX = W * 0.5
        panelTop = H * 0.70
        panelTextAlign = 'center'
      } else {
        gridLeft = W * 0.04
        gridRight = W * 0.62
        gridTop = H * 0.08
        gridBottom = H * 0.92
        panelX = W * 0.66
        panelTop = H * 0.30
        panelTextAlign = 'left'
      }

      const cellW = (gridRight - gridLeft) / COLS
      const cellH = (gridBottom - gridTop) / ROWS
      const baseDot = Math.min(cellW, cellH) * 0.32

      // Clear
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)

      // Draw dots
      for (let rank = 0; rank < TOTAL; rank++) {
        const idx = order[rank]
        const col = idx % COLS
        const row = Math.floor(idx / COLS)
        const x = gridLeft + (col + 0.5) * cellW
        const y = gridTop + (row + 0.5) * cellH

        const isFilled = rank < filled
        if (isFilled) {
          if (bornAt[rank] < 0) bornAt[rank] = t
          const isOr = rank >= BASELINE
          const age = Math.max(0, t - bornAt[rank])
          const pulse = age < 0.5 ? (1 - age / 0.5) : 0
          const radius = baseDot * (1 + pulse * 0.6)
          ctx.globalAlpha = fadeAlpha
          ctx.fillStyle = isOr ? OR : INK
          ctx.beginPath(); ctx.arc(x, y, radius, 0, 6.2832); ctx.fill()
          ctx.globalAlpha = 1
        } else {
          ctx.fillStyle = 'rgba(26,23,20,0.06)'
          ctx.beginPath(); ctx.arc(x, y, baseDot * 0.5, 0, 6.2832); ctx.fill()
        }
      }

      // Cadre fin autour de la grille
      ctx.strokeStyle = LIGHT
      ctx.lineWidth = 1
      ctx.strokeRect(gridLeft - 6, gridTop - 6, gridRight - gridLeft + 12, gridBottom - gridTop + 12)

      // Panel : annee + compteur + sous-titre
      const showAnnee = cycle < 5 ? '2025' : '2050'
      const annDelta = cycle < 5 ? 'AUJOURD’HUI' : 'EN 2050'

      // Valeur en Md, suit "filled"
      const vMd = (filled / DOTS_PER_BILLION).toFixed(1).replace('.', ',')

      // Eyebrow annee
      ctx.textAlign = panelTextAlign
      mono(11, '500')
      ctx.fillStyle = OR
      ctx.fillText(annDelta + '   ·   ' + showAnnee, panelX, panelTop)

      // Label PARC MONDIAL
      mono(10, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('PARC MONDIAL DE CLIMATISEURS', panelX, panelTop + 22)

      // Gros chiffre
      const figSize = Math.min(W * 0.072, isMobile ? 56 : 78)
      sans(figSize, '700')
      ctx.fillStyle = cycle < 5 ? INK : OR
      ctx.fillText(vMd + ' Md', panelX, panelTop + 22 + figSize * 0.95)

      // Sous-titre
      sans(14, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('appareils en service dans le monde', panelX, panelTop + 22 + figSize * 0.95 + 26)

      // Petit comparatif quand on est sur 5,6 Md : delta
      if (cycle > 10 && cycle < 13) {
        sans(12, '500')
        ctx.fillStyle = OR
        const deltaAlpha = Math.min(1, (cycle - 10) / 0.6)
        ctx.globalAlpha = deltaAlpha
        ctx.fillText('+ 4 milliards en 25 ans', panelX, panelTop + 22 + figSize * 0.95 + 50)
        ctx.globalAlpha = 1
      }

      // Legende sous la grille : "Chaque point = 10 M d'appareils"
      const legY = isMobile ? gridBottom + 16 : gridBottom + 18
      mono(9, '400')
      ctx.fillStyle = GRAY
      ctx.textAlign = 'left'
      ctx.fillText('1 POINT  ·  10 MILLIONS D’APPAREILS', gridLeft, legY)
      ctx.textAlign = 'right'
      // Annonce a droite : 1,6 ou 5,6 selon phase
      const legR = cycle < 5
        ? '160 POINTS REMPLIS  ·  1,6 MD'
        : (cycle < 13 ? Math.min(filled, TOTAL) + ' POINTS REMPLIS  ·  ' + vMd + ' MD' : '560 POINTS  ·  5,6 MD')
      ctx.fillText(legR, gridRight, legY)

      rafId = requestAnimationFrame(frame)
    }

    function startNow() {
      resize()
      rafId = requestAnimationFrame(frame)
    }
    window.addEventListener('resize', resize)
    if ((document as any).fonts && (document as any).fonts.load) {
      Promise.all([
        (document as any).fonts.load('500 11px "DM Mono"'),
        (document as any).fonts.load('700 56px "DM Sans"'),
      ]).then(startNow, startNow)
    } else {
      startNow()
    }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <figure style={{ margin: '40px 0 8px' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'clamp(420px, 56vw, 540px)',
          display: 'block',
          background: '#ffffff',
          border: '1px solid #DDD9D2',
        }}
        aria-label="Le parc mondial de climatiseurs passe de 1,6 milliard d'unites en 2025 a 5,6 milliards en 2050"
      />
      <figcaption style={{
        padding: '14px 4px 0',
        fontFamily: "'DM Mono', ui-monospace, monospace",
        fontSize: '10.5px',
        letterSpacing: '0.08em',
        color: '#8a7f72',
      }}>
        Du parc actuel a la projection 2050. Plus de 80% de la croissance prevue viendra des pays emergents. Sources : Agence internationale de l'energie, The Future of Cooling. Animation Soara.
      </figcaption>
    </figure>
  )
}
