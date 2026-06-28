// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'

// Illustration canvas : le badgir (tour a vent) iranien, dans le meme
// trait que l'animation du climatiseur (chap. I). Fond clair, traits
// nets, fluide qui circule, organes etiquetes en DM Mono.
//
// Coupe simplifiee : tour a vent au centre, ouvertures en haut qui
// captent le vent exterieur. L'air descend dans la tour, passe au-dessus
// du bassin (qanat / citerne) ou il se rafraichit par evaporation, puis
// sort lateralement dans le salon comme air frais. Effet thermosiphon :
// l'air chaud du salon remonte et ressort par le sommet de la tour.
export default function BadgirAnim() {
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
    const GRAY = '#6f6a61'
    const LIGHT = '#e7e3da'
    const BLUE = '#356a9b'
    const BLUE_PALE = '#dde9f3'
    const OR = '#C8A96E'
    const SAND = '#e8d9b9'
    const ADOBE = '#c9a877'
    const HOT = '#c0402c'
    const YELLOW = '#e8b653'

    // Geometric layout
    let towerL = 0, towerR = 0, towerTop = 0, towerBottom = 0
    let houseLeft = 0, houseRight = 0, houseTop = 0, groundY = 0
    let basinL = 0, basinR = 0, basinY = 0, basinH = 0
    let exitX = 0

    type P = { x: number, y: number, vx: number, vy: number, life: number, max: number, size: number, kind: number, cool: number }
    // kind : 0 = descend dans la tour, 1 = passage au-dessus du bassin, 2 = salon (sortie), 3 = remonte chaude
    let particles: P[] = []
    let lastSpawn = 0

    function rgba(r: number, g: number, b: number, a: number) { return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')' }
    function mono(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Mono", ui-monospace, monospace' }
    function sans(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Sans", system-ui, sans-serif' }

    function build() {
      const towerW = Math.min(W * 0.11, 110)
      const centerX = W * 0.36
      towerL = centerX - towerW / 2
      towerR = centerX + towerW / 2
      towerTop = H * 0.14
      towerBottom = H * 0.84

      houseLeft = towerR
      houseRight = W * 0.92
      houseTop = H * 0.56
      groundY = H * 0.84

      basinL = towerL + 6
      basinR = towerR + Math.min(W * 0.10, 110)
      basinY = groundY - 10
      basinH = 16

      exitX = houseRight - 12
    }

    function resize() {
      const b = cv.getBoundingClientRect()
      W = b.width; H = b.height
      cv.width = W * DPR; cv.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      particles = []
      build()
    }

    function spawnInflow() {
      // Entre par le sommet (un seul cote pour clarte), descend
      const x = towerL + 6 + Math.random() * ((towerR - towerL) - 12)
      const y = towerTop - 4
      particles.push({
        x, y,
        vx: 0,
        vy: 0.7 + Math.random() * 0.4,
        life: 0,
        max: 240,
        size: 2.2 + Math.random() * 1.6,
        kind: 0,
        cool: 0,
      })
    }
    function spawnExhaust() {
      // Air chaud du salon qui remonte par le 2e conduit de la tour
      const x = towerR - 6 - Math.random() * 18
      const y = groundY - 30
      particles.push({
        x, y,
        vx: 0,
        vy: -0.4 - Math.random() * 0.3,
        life: 0,
        max: 200,
        size: 1.8 + Math.random() * 1.4,
        kind: 3,
        cool: 0,
      })
    }

    function drawSun(t: number) {
      const sunX = W * 0.90
      const sunY = H * 0.14
      ctx.fillStyle = YELLOW
      ctx.globalAlpha = 0.32
      ctx.beginPath(); ctx.arc(sunX, sunY, 36, 0, 6.2832); ctx.fill()
      ctx.globalAlpha = 0.85
      ctx.beginPath(); ctx.arc(sunX, sunY, 18, 0, 6.2832); ctx.fill()
      ctx.globalAlpha = 1
      ctx.strokeStyle = rgba(232, 182, 83, 0.55)
      ctx.lineWidth = 1.5
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4 + t * 0.05
        const x1 = sunX + Math.cos(a) * 26
        const y1 = sunY + Math.sin(a) * 26
        const x2 = sunX + Math.cos(a) * 42
        const y2 = sunY + Math.sin(a) * 42
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
      }
    }

    function drawWind(t: number) {
      // 4 lignes de vent ondulees venant de l'extreme gauche vers la tour
      ctx.strokeStyle = rgba(111, 106, 97, 0.45)
      ctx.lineWidth = 1.2
      for (let i = 0; i < 4; i++) {
        const baseY = H * (0.20 + i * 0.04) + Math.sin(t + i) * 3
        ctx.beginPath()
        ctx.moveTo(W * 0.02, baseY)
        for (let xx = W * 0.02; xx < towerL - 6; xx += 5) {
          const phase = (xx - W * 0.02) / 24 - t * 1.6 + i
          const yy = baseY + Math.sin(phase) * 3.5
          if (xx === W * 0.02) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy)
        }
        ctx.stroke()
        const arrX = towerL - 6
        const arrY = baseY + Math.sin((arrX - W * 0.02) / 24 - t * 1.6 + i) * 3.5
        ctx.fillStyle = rgba(111, 106, 97, 0.55)
        ctx.beginPath()
        ctx.moveTo(arrX, arrY); ctx.lineTo(arrX - 7, arrY - 4); ctx.lineTo(arrX - 7, arrY + 4); ctx.closePath(); ctx.fill()
      }
    }

    function drawTowerAndHouse() {
      // Maison : sol et mur droit
      ctx.fillStyle = '#2e2820'
      ctx.fillRect(0, groundY, W, H - groundY)

      // Plafond de la maison (de la tour au mur droit)
      ctx.fillStyle = ADOBE
      ctx.fillRect(towerR, houseTop - 8, houseRight - towerR + 4, 8)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(towerR, houseTop - 8, houseRight - towerR + 4, 8)

      // Mur droit
      ctx.fillStyle = ADOBE
      ctx.fillRect(houseRight, houseTop, 14, groundY - houseTop)
      ctx.strokeStyle = INK
      ctx.lineWidth = 2
      ctx.strokeRect(houseRight, houseTop, 14, groundY - houseTop)
      // Fenetre dans le mur droit
      ctx.fillStyle = '#1a1714'
      ctx.fillRect(houseRight + 3, houseTop + 30, 8, 60)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1
      ctx.strokeRect(houseRight + 3, houseTop + 30, 8, 60)

      // Tour : silhouette pleine adobe avec ouverture interieure
      // Mur exterieur gauche
      ctx.fillStyle = ADOBE
      ctx.fillRect(towerL - 10, towerTop, 10, towerBottom - towerTop)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(towerL - 10, towerTop, 10, towerBottom - towerTop)
      // Mur exterieur droit (au-dessus du plafond uniquement, car la tour traverse la maison)
      ctx.fillStyle = ADOBE
      ctx.fillRect(towerR, towerTop, 10, houseTop - towerTop)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(towerR, towerTop, 10, houseTop - towerTop)
      // Interieur de la tour : creme clair
      ctx.fillStyle = '#fafafa'
      ctx.fillRect(towerL, towerTop, towerR - towerL, towerBottom - towerTop)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(towerL, towerTop, towerR - towerL, towerBottom - towerTop)

      // Cloison verticale interieure dans la tour (separe le conduit d'entree
      // gauche du conduit d'evacuation droite)
      const cloisonX = (towerL + towerR) / 2
      ctx.strokeStyle = LIGHT
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(cloisonX, towerTop + 8)
      ctx.lineTo(cloisonX, groundY - 60)
      ctx.stroke()

      // Sommet de la tour : 2 ouvertures (l'une qui capte le vent, l'autre qui evacue)
      // Casquette
      ctx.fillStyle = ADOBE
      ctx.fillRect(towerL - 14, towerTop - 10, towerR - towerL + 28, 10)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(towerL - 14, towerTop - 10, towerR - towerL + 28, 10)

      // Cheminees (2)
      const chimW = (towerR - towerL) / 3.2
      const chimH = 22
      const c1x = towerL + 4
      const c2x = cloisonX + 4
      // Cheminee d'entree (gauche)
      ctx.fillStyle = '#fafafa'
      ctx.fillRect(c1x, towerTop - 10 - chimH, chimW, chimH)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(c1x, towerTop - 10 - chimH, chimW, chimH)
      // Cheminee de sortie (droite)
      ctx.fillStyle = '#fafafa'
      ctx.fillRect(c2x, towerTop - 10 - chimH, chimW, chimH)
      ctx.strokeRect(c2x, towerTop - 10 - chimH, chimW, chimH)

      // Bassin d'eau (qanat / citerne) au pied
      ctx.fillStyle = BLUE_PALE
      ctx.beginPath()
      ctx.ellipse((basinL + basinR) / 2, basinY, (basinR - basinL) / 2, basinH / 2, 0, 0, 6.2832)
      ctx.fill()
      ctx.strokeStyle = BLUE
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    function drawWaterRipples(t: number) {
      const cxB = (basinL + basinR) / 2
      ctx.strokeStyle = rgba(53, 106, 155, 0.35)
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i++) {
        const off = i * 3 + Math.sin(t * 2 + i) * 1.5
        ctx.beginPath()
        ctx.ellipse(cxB, basinY, (basinR - basinL) / 2 - off, basinH / 2 - off * 0.4, 0, 0, 6.2832)
        ctx.stroke()
      }
    }

    function drawLabels() {
      ctx.textAlign = 'center'
      // Vent
      mono(11, '500')
      ctx.fillStyle = GRAY
      ctx.fillText('VENT EXTERIEUR', (W * 0.02 + towerL) / 2, H * 0.13)
      mono(9, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('air chaud et sec', (W * 0.02 + towerL) / 2, H * 0.16)

      // Tour
      mono(11, '600')
      ctx.fillStyle = INK
      ctx.fillText('BADGIR', (towerL + towerR) / 2, towerTop - 38)
      mono(9, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('tour a vent', (towerL + towerR) / 2, towerTop - 25)

      // Bassin
      mono(11, '500')
      ctx.fillStyle = BLUE
      ctx.fillText('BASSIN', (basinL + basinR) / 2, basinY + 28)
      mono(9, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('refroidissement evaporatif', (basinL + basinR) / 2, basinY + 41)

      // Salon
      ctx.textAlign = 'left'
      mono(11, '500')
      ctx.fillStyle = BLUE
      ctx.fillText('SALON', basinR + 30, houseTop + 28)
      mono(9, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('air rafraichi, jusqu\'a 10 C en moins', basinR + 30, houseTop + 41)

      // Petites fleches d'orientation dans le bassin (sens du flux)
      ctx.strokeStyle = rgba(53, 106, 155, 0.6)
      ctx.lineWidth = 1.5
      for (let i = 0; i < 2; i++) {
        const xa = basinL + 20 + i * 38
        ctx.beginPath()
        ctx.moveTo(xa, basinY); ctx.lineTo(xa + 14, basinY); ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(xa + 14, basinY); ctx.lineTo(xa + 10, basinY - 3)
        ctx.lineTo(xa + 14, basinY); ctx.lineTo(xa + 10, basinY + 3)
        ctx.stroke()
      }

      // Legende globale en bas
      mono(10, '500')
      ctx.fillStyle = OR
      ctx.textAlign = 'center'
      ctx.fillText('YAZD, IRAN  ·  RAFRAICHISSEMENT PASSIF SANS ELECTRICITE', W / 2, H - 14)
    }

    function frame(now: number) {
      const t = (now - t0) / 1000

      // Clear with cream background
      ctx.fillStyle = '#fdfbf7'
      ctx.fillRect(0, 0, W, H)

      // Ciel degrade
      const grad = ctx.createLinearGradient(0, 0, 0, towerTop)
      grad.addColorStop(0, '#f4e5cc')
      grad.addColorStop(1, '#faf5e8')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, towerTop)

      drawSun(t)
      drawWind(t)
      drawTowerAndHouse()

      // Spawn nouvelles particules d'entree (descente) et d'echappement (montee)
      if (now - lastSpawn > 18) {
        lastSpawn = now
        if (Math.random() < 0.85) spawnInflow()
        if (Math.random() < 0.35) spawnExhaust()
      }

      // Update + draw particles
      const cloisonX = (towerL + towerR) / 2
      const alive: P[] = []
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life += 1

        if (p.kind === 0) {
          // Descend dans le conduit gauche : reste a gauche de la cloison
          p.x += (Math.random() - 0.5) * 0.25
          if (p.x > cloisonX - 4) p.x = cloisonX - 4
          if (p.x < towerL + 4) p.x = towerL + 4
          p.y += p.vy
          // Arrivee au niveau du bassin : changer en kind=1 (passage horizontal)
          if (p.y >= basinY - basinH / 2 - 6) {
            p.kind = 1
            p.vx = 0.5 + Math.random() * 0.4
            p.vy = -0.04
          }
        } else if (p.kind === 1) {
          p.x += p.vx
          p.y += p.vy + (Math.random() - 0.5) * 0.2
          if (p.x > basinL && p.x < basinR) p.cool = Math.min(1, p.cool + 0.025)
          if (p.x > basinR - 4) {
            p.kind = 2
            p.vy = -0.18 - Math.random() * 0.12
            p.vx = 0.4 + Math.random() * 0.4
          }
        } else if (p.kind === 2) {
          // Dans le salon, glisse vers la droite et legerement vers le haut
          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.99
          // Une fraction des particules monte pour repartir en thermosiphon
          if (p.life > 110 && Math.random() < 0.005) {
            p.kind = 3
            p.vx = -0.2
            p.vy = -0.4
            p.cool *= 0.5 // se rechauffe en remontant
          }
        } else {
          // Air chaud d'echappement qui remonte par le conduit droit
          p.x += (Math.random() - 0.5) * 0.25
          if (p.x < cloisonX + 4) p.x = cloisonX + 4
          if (p.x > towerR - 4) p.x = towerR - 4
          p.y += p.vy
          p.cool = Math.max(0, p.cool - 0.01)
          if (p.y < towerTop - 14) continue
        }

        if (p.x > houseRight - 8 && p.kind === 2) continue
        if (p.life > p.max) continue
        if (p.y > groundY - 4 && p.kind !== 1) continue

        const fade = Math.min(1, p.life / 8) * Math.max(0, 1 - (p.life - p.max + 30) / 30)
        const colWarm = [180, 140, 110]
        const colCool = [127, 179, 224]
        const r = Math.round(colWarm[0] + (colCool[0] - colWarm[0]) * p.cool)
        const g = Math.round(colWarm[1] + (colCool[1] - colWarm[1]) * p.cool)
        const b = Math.round(colWarm[2] + (colCool[2] - colWarm[2]) * p.cool)
        ctx.fillStyle = rgba(r, g, b, 0.18 * fade)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.4, 0, 6.2832); ctx.fill()
        ctx.fillStyle = rgba(r, g, b, 0.75 * fade)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.2832); ctx.fill()
        alive.push(p)
      }
      particles = alive

      drawWaterRipples(t)
      drawLabels()

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
          height: 'clamp(460px, 60vw, 580px)',
          display: 'block',
          background: '#fdfbf7',
          border: '1px solid #DDD9D2',
        }}
        aria-label="Coupe d'une tour a vent (badgir) : le vent descend dans la tour, se rafraichit au-dessus du bassin et entre dans le salon, l'air chaud ressort par le sommet"
      />
      <figcaption style={{
        padding: '14px 4px 0',
        fontFamily: "'DM Mono', ui-monospace, monospace",
        fontSize: '10.5px',
        letterSpacing: '0.08em',
        color: '#8a7f72',
      }}>
        Coupe d'un badgir traditionnel. Le vent capte en hauteur descend dans le conduit, traverse le bassin qui le rafraichit par evaporation, et entre dans le salon. L'air chaud ressort par le second conduit, effet thermosiphon. Pas un watt d'electricite. Animation Soara.
      </figcaption>
    </figure>
  )
}
