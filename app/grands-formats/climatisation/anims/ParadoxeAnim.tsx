// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'

// Animation canvas : bilan energetique du climatiseur sur fond sombre.
// Trois flux convergent ou divergent autour d'une boite "CLIMATISEUR" :
//  - Gauche : particules bleues = 100 unites de chaleur extraites du salon.
//  - Bas    : eclair jaune     = 30 unites d'electricite consommees.
//  - Droite : particules rouges = 130 unites rejetees dehors (plus dense).
// Trois compteurs cycliques (4s) montent en cascade : 100 -> +30 -> = 130.
export default function ParadoxeAnim() {
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

    const BG = '#0d0c0b'
    const BLUE = [127, 179, 224]
    const YELLOW = [246, 201, 122]
    const RED = [232, 128, 96]
    const TXT = '#e9e3d6'
    const DIM = '#7d7872'

    type P = { x: number, y: number, vx: number, vy: number, life: number, max: number, kind: number, size: number, jitter: number }
    let particles: P[] = []
    let lastSpawn = 0

    function rgba(c: number[], a: number) {
      return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'
    }
    function mono(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Mono", ui-monospace, monospace' }
    function sans(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Sans", system-ui, sans-serif' }

    function resize() {
      const b = cv.getBoundingClientRect()
      W = b.width; H = b.height
      cv.width = W * DPR; cv.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      particles = []
    }

    // 0 = blue (in), 1 = yellow (elec), 2 = red (out)
    function spawn(kind: number) {
      const mx = W * 0.5, my = H * 0.52
      const mw = Math.min(W * 0.20, 200)
      let x = 0, y = 0, vx = 0, vy = 0, jitter = 0
      if (kind === 0) {
        x = W * 0.05 + Math.random() * W * 0.04
        y = my + (Math.random() - 0.5) * H * 0.22
        vx = 0.7 + Math.random() * 0.5
        vy = (my - y) * 0.004
        jitter = 0.4
      } else if (kind === 1) {
        x = mx + (Math.random() - 0.5) * mw * 0.6
        y = H * 0.95
        vx = (mx - x) * 0.008
        vy = -(0.6 + Math.random() * 0.4)
        jitter = 0.2
      } else {
        x = mx + mw / 2 + Math.random() * 4
        y = my + (Math.random() - 0.5) * H * 0.22
        vx = 0.7 + Math.random() * 0.6
        vy = (my - y) * 0.004 + (Math.random() - 0.5) * 0.2
        jitter = 0.5
      }
      particles.push({
        x, y, vx, vy,
        life: 0,
        max: 90 + Math.random() * 30,
        kind,
        size: 1.6 + Math.random() * 2.2,
        jitter,
      })
    }

    function drawMachine(mx: number, my: number, mw: number, mh: number, pulse: number) {
      ctx.save()
      ctx.strokeStyle = '#fafafa'
      ctx.lineWidth = 1.5
      ctx.fillStyle = '#161412'
      const r = 6
      ctx.beginPath()
      ctx.moveTo(mx - mw / 2 + r, my - mh / 2)
      ctx.arcTo(mx + mw / 2, my - mh / 2, mx + mw / 2, my + mh / 2, r)
      ctx.arcTo(mx + mw / 2, my + mh / 2, mx - mw / 2, my + mh / 2, r)
      ctx.arcTo(mx - mw / 2, my + mh / 2, mx - mw / 2, my - mh / 2, r)
      ctx.arcTo(mx - mw / 2, my - mh / 2, mx + mw / 2, my - mh / 2, r)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
      // Halo electrique sur les bords pendant le pulse
      if (pulse > 0) {
        ctx.strokeStyle = rgba(YELLOW, 0.35 * pulse)
        ctx.lineWidth = 3 + 2 * pulse
        ctx.stroke()
      }
      mono(11, '500')
      ctx.fillStyle = '#fafafa'
      ctx.textAlign = 'center'
      ctx.fillText('CLIMATISEUR', mx, my - 4)
      mono(9, '400')
      ctx.fillStyle = DIM
      ctx.fillText('LE PARADOXE', mx, my + 14)
      ctx.restore()
    }

    function drawCounter(label: string, value: string, x: number, y: number, color: number[], align: 'left' | 'right' | 'center') {
      ctx.textAlign = align
      mono(11, '500')
      ctx.fillStyle = DIM
      ctx.fillText(label, x, y - 38)
      // gros chiffre en DM Sans pour la lisibilite
      sans(Math.min(58, W * 0.07), '700')
      ctx.fillStyle = rgba(color, 1)
      ctx.fillText(value, x, y)
    }

    function frame(now: number) {
      const t = (now - t0) / 1000
      // trainee fade
      ctx.fillStyle = 'rgba(13,12,11,0.22)'
      ctx.fillRect(0, 0, W, H)

      const mx = W * 0.5, my = H * 0.52
      const mw = Math.min(W * 0.20, 200)
      const mh = Math.min(H * 0.30, 200)

      // Spawn cadences differents pour rendre le flux de droite plus dense
      // que celui de gauche (100 vs 130 = +30%)
      if (now - lastSpawn > 18) {
        lastSpawn = now
        // intérieur : 2 par tick
        if (Math.random() < 0.85) spawn(0)
        if (Math.random() < 0.5) spawn(0)
        // electricité : pulse périodique pendant la phase 1 du cycle
        const cyc = (t % 4)
        if (cyc > 1.2 && cyc < 2.0 && Math.random() < 0.6) spawn(1)
        // rejet : 3 par tick (plus dense)
        if (Math.random() < 0.95) spawn(2)
        if (Math.random() < 0.8) spawn(2)
        if (Math.random() < 0.55) spawn(2)
      }

      // Update + draw particules
      const alive: P[] = []
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life += 1
        // jitter perpendiculaire
        if (p.kind === 1) p.x += (Math.random() - 0.5) * p.jitter
        else p.y += (Math.random() - 0.5) * p.jitter
        p.x += p.vx
        p.y += p.vy

        // Mort si arrivee dans la machine (pour kinds 0 et 1) ou hors ecran (pour kind 2)
        if (p.kind === 0 && p.x > mx - mw / 2 - 4) continue
        if (p.kind === 1 && p.y < my + mh / 2 + 4) continue
        if (p.kind === 2 && (p.x > W + 10 || p.life > p.max + 30)) continue

        const fade = Math.min(1, p.life / 8) * Math.max(0, 1 - (p.life - p.max) / 30)
        const col = p.kind === 0 ? BLUE : p.kind === 1 ? YELLOW : RED
        ctx.fillStyle = rgba(col, 0.18 * fade)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2.6, 0, 6.2832)
        ctx.fill()
        ctx.fillStyle = rgba(col, 0.85 * fade)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, 6.2832)
        ctx.fill()
        alive.push(p)
      }
      particles = alive

      // Pulse de la boite quand l'electricite arrive
      const cyc = (t % 4)
      const pulse = (cyc > 1.2 && cyc < 2.0) ? Math.sin((cyc - 1.2) / 0.8 * Math.PI) : 0

      drawMachine(mx, my, mw, mh, pulse)

      // Compteurs cycliques sur 4 secondes
      // phase 0..1 : "100" passe de 0 a 100 (chaleur extraite)
      // phase 1..2 : "+30" passe de 0 a 30 (electricite)
      // phase 2..3 : "=130" passe de 0 a 130 (rejet)
      // phase 3..4 : palier
      const p100 = Math.min(1, Math.max(0, cyc / 1))
      const p30 = Math.min(1, Math.max(0, (cyc - 1) / 1))
      const p130 = Math.min(1, Math.max(0, (cyc - 2) / 1))
      const v100 = Math.round(p100 * 100)
      const v30 = Math.round(p30 * 30)
      const v130 = Math.round(p130 * 130)

      drawCounter('CHALEUR EXTRAITE DU SALON', v100.toString(), W * 0.10, my + mh / 2 + 70, BLUE, 'left')
      drawCounter('ELECTRICITE CONSOMMEE', '+ ' + v30, mx, H - 30, YELLOW, 'center')
      drawCounter('CHALEUR REJETEE DEHORS', '= ' + v130, W * 0.90, my + mh / 2 + 70, RED, 'right')

      // Petits triangles de fleche aux extremites
      // Fleche entrante a gauche
      ctx.fillStyle = rgba(BLUE, 0.6)
      ctx.beginPath()
      ctx.moveTo(mx - mw / 2 - 14, my); ctx.lineTo(mx - mw / 2 - 22, my - 6); ctx.lineTo(mx - mw / 2 - 22, my + 6); ctx.closePath(); ctx.fill()
      // Fleche electricite montante en bas
      ctx.fillStyle = rgba(YELLOW, 0.6)
      ctx.beginPath()
      ctx.moveTo(mx, my + mh / 2 + 14); ctx.lineTo(mx - 6, my + mh / 2 + 22); ctx.lineTo(mx + 6, my + mh / 2 + 22); ctx.closePath(); ctx.fill()
      // Fleche sortante a droite
      ctx.fillStyle = rgba(RED, 0.85)
      ctx.beginPath()
      ctx.moveTo(mx + mw / 2 + 22, my); ctx.lineTo(mx + mw / 2 + 14, my - 8); ctx.lineTo(mx + mw / 2 + 14, my + 8); ctx.closePath(); ctx.fill()

      rafId = requestAnimationFrame(frame)
    }

    function startNow() {
      resize()
      rafId = requestAnimationFrame(frame)
    }
    window.addEventListener('resize', resize)
    if ((document as any).fonts && (document as any).fonts.load) {
      Promise.all([
        (document as any).fonts.load('500 16px "DM Mono"'),
        (document as any).fonts.load('700 32px "DM Sans"'),
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
          height: 'clamp(360px, 50vw, 460px)',
          display: 'block',
          background: '#0d0c0b',
          border: '1px solid #1f1c18',
        }}
        aria-label="Bilan energetique : 100 unites de chaleur extraites + 30 d'electricite = 130 rejetees dehors"
      />
      <figcaption style={{
        padding: '14px 4px 0',
        fontFamily: "'DM Mono', ui-monospace, monospace",
        fontSize: '10.5px',
        letterSpacing: '0.08em',
        color: '#7d7872',
      }}>
        Bilan : pour chaque 100 unites de chaleur retirees du salon, le bloc exterieur en rejette environ 130, parce que l'electricite consommee par le compresseur finit elle aussi en chaleur. Animation Soara.
      </figcaption>
    </figure>
  )
}
