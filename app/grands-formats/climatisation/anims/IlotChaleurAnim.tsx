// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'

// Animation canvas : bande intérieur frais / extérieur qui chauffe +
// boucle de rétroaction.
// Haut (coupe urbaine) : INTERIEUR a gauche stable a 23 C, cloison
// avec climatiseur, EXTERIEUR a droite qui chauffe, panache de chaleur
// rejete par la clim. Compteur de temperature exterieure nocturne :
// +2,4 C (nuit normale) puis +3,6 C (canicule extreme). Source :
// simulation Meteo-France & CNRS, type canicule 2003 a Paris.
// Bas : la boucle de retroaction en trois etapes connectees par
// fleches courbes : "DEHORS TROP CHAUD" -> "ON CLIMATISE" -> "REJET
// DEHORS" -> retour.
export default function IlotChaleurAnim() {
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
    const WARM = '#e09454'
    const HOT = '#c0402c'

    function mono(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Mono", ui-monospace, monospace' }
    function sans(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Sans", system-ui, sans-serif' }
    function serif(s: number, wt?: string) { ctx.font = (wt || '700') + ' ' + s + 'px "Playfair Display", Georgia, serif' }

    type Particle = { x: number, y: number, vy: number, vx: number, life: number, max: number, size: number, heat: number }
    let particles: Particle[] = []
    let lastSpawn = 0

    function rgba(rh: number, g: number, b: number, a: number) { return 'rgba(' + rh + ',' + g + ',' + b + ',' + a + ')' }

    function resize() {
      const b = cv.getBoundingClientRect()
      W = b.width; H = b.height
      cv.width = W * DPR; cv.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      particles = []
    }

    function lerpColor(c1: number[], c2: number[], k: number) {
      return [
        Math.round(c1[0] + (c2[0] - c1[0]) * k),
        Math.round(c1[1] + (c2[1] - c1[1]) * k),
        Math.round(c1[2] + (c2[2] - c1[2]) * k),
      ]
    }

    function drawScene(t: number, deltaC: number, heatLevel: number, sceneTop: number, sceneH: number) {
      // Background scene : ciel a gauche frais, ciel droite qui chauffe.
      const midX = W * 0.50
      // Interieur (gauche)
      ctx.fillStyle = BLUE_PALE
      ctx.fillRect(0, sceneTop, midX, sceneH)
      // Exterieur (droite) : couleur qui passe du beige au rouge selon heatLevel
      const exC = lerpColor([231, 227, 218], [200, 90, 64], heatLevel)
      ctx.fillStyle = rgba(exC[0], exC[1], exC[2], 1)
      ctx.fillRect(midX, sceneTop, W - midX, sceneH)

      // Cloison verticale fine au milieu
      ctx.fillStyle = '#1a1714'
      ctx.fillRect(midX - 2, sceneTop, 4, sceneH)

      // Sol
      ctx.fillStyle = '#3a322a'
      ctx.fillRect(0, sceneTop + sceneH - 8, W, 8)

      // Interieur : silhouette d'une fenetre et d'un climatiseur intérieur (split)
      // Climatiseur intérieur (split) accroche en haut a gauche de la cloison
      const acIw = Math.min(120, W * 0.13)
      const acIh = Math.min(34, sceneH * 0.10)
      const acIx = midX - acIw - 14
      const acIy = sceneTop + sceneH * 0.20
      ctx.fillStyle = '#fafafa'
      ctx.fillRect(acIx, acIy, acIw, acIh)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(acIx, acIy, acIw, acIh)
      // grille
      ctx.strokeStyle = 'rgba(26,23,20,0.35)'
      ctx.lineWidth = 1
      for (let i = 1; i < 4; i++) {
        const yy = acIy + (acIh * i / 4)
        ctx.beginPath(); ctx.moveTo(acIx + 6, yy); ctx.lineTo(acIx + acIw - 6, yy); ctx.stroke()
      }
      // souffle bleu intérieur
      ctx.fillStyle = rgba(53, 106, 155, 0.18)
      for (let i = 0; i < 5; i++) {
        const ox = acIx - 12 - i * 14
        const oy = acIy + acIh / 2
        ctx.beginPath()
        ctx.arc(ox, oy + Math.sin(t * 2 + i) * 4, 6 - i * 0.7, 0, 6.2832)
        ctx.fill()
      }

      // Climatiseur extérieur (unité) accroché en haut a droite de la cloison
      const acEw = Math.min(120, W * 0.13)
      const acEh = Math.min(50, sceneH * 0.15)
      const acEx = midX + 14
      const acEy = sceneTop + sceneH * 0.30
      ctx.fillStyle = '#fafafa'
      ctx.fillRect(acEx, acEy, acEw, acEh)
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.5
      ctx.strokeRect(acEx, acEy, acEw, acEh)
      // ventilateur
      const fcx = acEx + acEw - acEh * 0.45
      const fcy = acEy + acEh * 0.5
      const fr = acEh * 0.32
      ctx.strokeStyle = INK
      ctx.lineWidth = 1.2
      ctx.beginPath(); ctx.arc(fcx, fcy, fr, 0, 6.2832); ctx.stroke()
      ctx.save()
      ctx.translate(fcx, fcy)
      ctx.rotate(t * 6 * (0.4 + heatLevel))
      for (let bl = 0; bl < 3; bl++) {
        ctx.rotate(6.2832 / 3)
        ctx.fillStyle = heatLevel > 0.3 ? HOT : GRAY
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fr * 0.85, -fr * 0.16); ctx.lineTo(fr * 0.85, fr * 0.16); ctx.closePath(); ctx.fill()
      }
      ctx.restore()
      // grille gauche (compresseur)
      ctx.strokeStyle = 'rgba(26,23,20,0.4)'
      ctx.lineWidth = 1
      const gx = acEx + 8
      const gy = acEy + 8
      const gw = acEh * 0.7
      const gh = acEh - 16
      ctx.strokeRect(gx, gy, gw, gh)
      for (let i = 1; i < 5; i++) {
        const yy = gy + (gh * i / 5)
        ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke()
      }

      // Particules de chaleur qui montent (cote exterieur), au-dessus du clim
      const now = performance.now()
      if (now - lastSpawn > 14) {
        lastSpawn = now
        const spawnRate = 0.4 + heatLevel * 0.8
        if (Math.random() < spawnRate) {
          particles.push({
            x: acEx + acEw * 0.35 + (Math.random() - 0.5) * acEw * 0.6,
            y: acEy - 2,
            vy: -(0.4 + Math.random() * 0.7),
            vx: (Math.random() - 0.5) * 0.3,
            life: 0,
            max: 110 + Math.random() * 40,
            size: 2 + Math.random() * 3,
            heat: 0.6 + Math.random() * 0.4,
          })
        }
      }

      const alive: Particle[] = []
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life += 1
        p.y += p.vy
        p.x += p.vx + Math.sin(p.life * 0.1) * 0.2
        if (p.y < sceneTop + 8 || p.life > p.max) continue
        const fade = Math.min(1, p.life / 6) * Math.max(0, 1 - (p.life - p.max + 30) / 30)
        const col = lerpColor([231, 147, 76], [192, 64, 44], heatLevel * p.heat)
        ctx.fillStyle = rgba(col[0], col[1], col[2], 0.18 * fade)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.4, 0, 6.2832); ctx.fill()
        ctx.fillStyle = rgba(col[0], col[1], col[2], 0.6 * fade)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.2832); ctx.fill()
        alive.push(p)
      }
      particles = alive

      // Labels INTERIEUR / EXTERIEUR
      mono(11, '500')
      ctx.fillStyle = BLUE
      ctx.textAlign = 'left'
      ctx.fillText('INTERIEUR', 24, sceneTop + 22)
      ctx.fillStyle = heatLevel > 0.3 ? HOT : GRAY
      ctx.textAlign = 'right'
      ctx.fillText('EXTERIEUR  ·  LA RUE LA NUIT', W - 24, sceneTop + 22)
      ctx.textAlign = 'left'

      // Compteur INTERIEUR : 23 C stable
      sans(14, '600')
      ctx.fillStyle = BLUE
      ctx.textAlign = 'left'
      ctx.fillText('Salon climatise', 24, sceneTop + 42)
      serif(34, '700')
      ctx.fillStyle = INK
      ctx.fillText('23 °C', 24, sceneTop + 82)

      // Compteur EXTERIEUR : delta qui evolue, scenario
      const scenarioLabel = heatLevel < 0.55
        ? 'Nuit de canicule type 2003'
        : 'Pic de canicule extreme'
      const exTempBase = 27
      const exTempActual = exTempBase + deltaC
      sans(14, '600')
      ctx.fillStyle = heatLevel > 0.3 ? HOT : GRAY
      ctx.textAlign = 'right'
      ctx.fillText(scenarioLabel, W - 24, sceneTop + 42)
      serif(34, '700')
      ctx.fillStyle = heatLevel > 0.3 ? HOT : INK
      ctx.fillText(exTempActual.toFixed(1).replace('.', ',') + ' °C', W - 24, sceneTop + 82)
      // delta sous-label
      mono(11, '500')
      ctx.fillStyle = heatLevel > 0.3 ? HOT : GRAY
      ctx.fillText('+ ' + deltaC.toFixed(1).replace('.', ',') + ' °C  ·  EFFET CLIMATISATION', W - 24, sceneTop + 102)
      ctx.textAlign = 'left'
    }

    function drawLoop(t: number, loopHL: number, top: number, h: number) {
      // Boucle de retroaction : 3 noeuds avec fleches courbes
      const cx = W * 0.50
      const cy = top + h * 0.55
      const radius = Math.min(W * 0.18, h * 0.45)

      // 3 noeuds disposes en triangle (haut, bas-gauche, bas-droite)
      const nodes = [
        { x: cx, y: cy - radius, label: 'DEHORS TROP CHAUD' },
        { x: cx - radius * 0.92, y: cy + radius * 0.55, label: 'ON CLIMATISE DEDANS' },
        { x: cx + radius * 0.92, y: cy + radius * 0.55, label: 'REJET DEHORS' },
      ]

      // Label de boucle
      mono(10, '500')
      ctx.fillStyle = OR
      ctx.textAlign = 'center'
      ctx.fillText('LA BOUCLE DE RETROACTION', cx, top + 22)
      sans(13, '400')
      ctx.fillStyle = GRAY
      ctx.fillText('plus il fait chaud dehors, plus on climatise, donc plus de chaleur rejetee', cx, top + 42)

      // Animation : un "pulse" qui circule de noeud en noeud (3s par tour)
      const cycle = (t * 0.33) % 1 // 0..1 sur 3s
      // identifier l'arc actif (0,1,2)
      const activeArc = Math.floor(cycle * 3) // 0, 1, 2
      const arcProgress = (cycle * 3) % 1     // 0..1 dans l'arc actif

      // Dessiner les 3 fleches courbes entre noeuds (sens horaire)
      for (let i = 0; i < 3; i++) {
        const a = nodes[i]
        const b = nodes[(i + 1) % 3]
        // controle pour courbe : decalage vers exterieur du triangle
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        const dx = b.x - a.x, dy = b.y - a.y
        const len = Math.sqrt(dx * dx + dy * dy)
        const nx = -dy / len, ny = dx / len
        const offset = 28
        const c1x = mx + nx * offset
        const c1y = my + ny * offset

        const isActive = i === activeArc
        ctx.strokeStyle = isActive ? OR : '#c9c3b6'
        ctx.lineWidth = isActive ? 2.2 : 1.2
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.quadraticCurveTo(c1x, c1y, b.x, b.y)
        ctx.stroke()

        // Pointe de fleche en bout de courbe : tangente a l'arrivee
        // approx : direction (b - c1)
        const adx = b.x - c1x, ady = b.y - c1y
        const al = Math.sqrt(adx * adx + ady * ady)
        const ux = adx / al, uy = ady / al
        const ar = 9
        ctx.fillStyle = isActive ? OR : '#9a9590'
        ctx.beginPath()
        ctx.moveTo(b.x, b.y)
        ctx.lineTo(b.x - ux * ar - uy * ar * 0.55, b.y - uy * ar + ux * ar * 0.55)
        ctx.lineTo(b.x - ux * ar + uy * ar * 0.55, b.y - uy * ar - ux * ar * 0.55)
        ctx.closePath()
        ctx.fill()

        // Petit "pulse" qui se deplace le long de la courbe active
        if (isActive) {
          const px = (1 - arcProgress) * (1 - arcProgress) * a.x + 2 * (1 - arcProgress) * arcProgress * c1x + arcProgress * arcProgress * b.x
          const py = (1 - arcProgress) * (1 - arcProgress) * a.y + 2 * (1 - arcProgress) * arcProgress * c1y + arcProgress * arcProgress * b.y
          ctx.fillStyle = rgba(192, 64, 44, 0.85)
          ctx.beginPath(); ctx.arc(px, py, 6, 0, 6.2832); ctx.fill()
          ctx.fillStyle = rgba(192, 64, 44, 0.20)
          ctx.beginPath(); ctx.arc(px, py, 14, 0, 6.2832); ctx.fill()
        }
      }

      // Dessiner les 3 noeuds (cercles + label)
      for (let i = 0; i < 3; i++) {
        const n = nodes[i]
        const isHere = i === activeArc
        ctx.fillStyle = isHere ? HOT : '#fafafa'
        ctx.strokeStyle = INK
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(n.x, n.y, 22, 0, 6.2832); ctx.fill(); ctx.stroke()
        // Numero
        mono(11, '500')
        ctx.fillStyle = isHere ? '#fff' : INK
        ctx.textAlign = 'center'
        ctx.fillText((i + 1).toString(), n.x, n.y + 4)
        // Label en dessous ou cote
        sans(11, '600')
        ctx.fillStyle = INK
        const off = 38
        if (i === 0) {
          ctx.fillText(n.label, n.x, n.y - 30)
        } else {
          ctx.fillText(n.label, n.x, n.y + off + 4)
        }
      }
      ctx.textAlign = 'left'
    }

    function frame(now: number) {
      const t = (now - t0) / 1000
      // Cycle global 12s : scenario nuit normale (0-6s) puis pic canicule (6-12s)
      const cycle = t % 12
      let deltaC = 0
      let heatLevel = 0
      if (cycle < 4) {
        const k = cycle / 4
        deltaC = k * 2.4
        heatLevel = k * 0.55
      } else if (cycle < 6) {
        deltaC = 2.4
        heatLevel = 0.55
      } else if (cycle < 9) {
        const k = (cycle - 6) / 3
        deltaC = 2.4 + k * 1.2
        heatLevel = 0.55 + k * 0.45
      } else if (cycle < 11) {
        deltaC = 3.6
        heatLevel = 1.0
      } else {
        // pas de fade out, transition rapide vers le restart
        const k = 1 - (cycle - 11)
        deltaC = 3.6 * k
        heatLevel = 1.0 * k
      }

      // Clear
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, W, H)

      // Split vertical : scene en haut (62%), boucle en bas (38%)
      const sceneTop = 0
      const sceneH = H * 0.62
      const loopTop = sceneH + 12
      const loopH = H - sceneH - 12

      drawScene(t, deltaC, heatLevel, sceneTop, sceneH)

      // Separateur horizontal
      ctx.strokeStyle = LIGHT
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, sceneH + 6); ctx.lineTo(W, sceneH + 6); ctx.stroke()

      drawLoop(t, heatLevel, loopTop, loopH)

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
        (document as any).fonts.load('600 14px "DM Sans"'),
        (document as any).fonts.load('700 34px "Playfair Display"'),
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
          height: 'clamp(560px, 70vw, 720px)',
          display: 'block',
          background: '#ffffff',
          border: '1px solid #DDD9D2',
        }}
        aria-label="Bande interieur frais (23 C) / exterieur qui chauffe (+ 2,4 C, jusqu'a + 3,6 C) plus boucle de retroaction"
      />
      <figcaption style={{
        padding: '14px 4px 0',
        fontFamily: "'DM Mono', ui-monospace, monospace",
        fontSize: '10.5px',
        letterSpacing: '0.08em',
        color: '#8a7f72',
      }}>
        Salon a 23 C, rue qui chauffe : la chaleur rejetee par les blocs exterieurs s'ajoute a l'ilot urbain et alimente la boucle. Source : simulation Meteo-France et CNRS pour une canicule de type 2003 a Paris. Animation Soara.
      </figcaption>
    </figure>
  )
}
