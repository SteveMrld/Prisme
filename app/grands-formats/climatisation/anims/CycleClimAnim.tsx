// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'

// Animation canvas SOARA : cycle du climatiseur (style NYT, fond blanc).
// Reprise telle quelle du brief : organes qui s'allument, fluide bleu rouge,
// vapeur/liquide, nuage de vapeur a la sortie de l'evaporateur, panache bleu
// ciel sur le condenseur, libelle d'etape. Police adaptee a DM Sans / DM Mono.
export default function CycleClimAnim() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    const INK = '#1a1714', GRAY = '#6f6a61', LIGHT = '#e7e3da'
    const RED = '#a6291c', BLUE = '#356a9b', HOT = '#c0402c'
    let LOOP: number[][] = [], CUM: number[] = [], PER = 0
    let TY = 0, BY = 0, LX = 0, RX = 0, r = 0, midY = 0, cx = 0
    const CONDP = 0.5

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k
    const smooth = (t: number) => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t) }
    const rgba = (c: number[], a: number) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'
    const ycol = (y: number) => {
      const k = smooth((y - TY) / (BY - TY))
      const c1 = [53, 106, 155], c2 = [192, 64, 44]
      return 'rgb(' + Math.round(lerp(c1[0], c2[0], k)) + ',' + Math.round(lerp(c1[1], c2[1], k)) + ',' + Math.round(lerp(c1[2], c2[2], k)) + ')'
    }

    function build() {
      cx = W / 2; TY = H * 0.22; BY = H * 0.64; LX = W * 0.16; RX = W * 0.84; r = W * 0.06; midY = (TY + BY) / 2
      LOOP = []
      const line = (x0: number, y0: number, x1: number, y1: number, n: number) => {
        for (let i = 0; i < n; i++) LOOP.push([lerp(x0, x1, i / n), lerp(y0, y1, i / n)])
      }
      const arc = (ccx: number, ccy: number, a0: number, a1: number, n: number) => {
        for (let i = 0; i < n; i++) { const a = lerp(a0, a1, i / n) * Math.PI / 180; LOOP.push([ccx + r * Math.cos(a), ccy + r * Math.sin(a)]) }
      }
      line(cx, TY, LX + r, TY, 18); arc(LX + r, TY + r, -90, -180, 12); line(LX, TY + r, LX, BY - r, 18); arc(LX + r, BY - r, 180, 90, 12)
      line(LX + r, BY, RX - r, BY, 18); arc(RX - r, BY - r, 90, 0, 12); line(RX, BY - r, RX, TY + r, 18); arc(RX - r, TY + r, 0, -90, 12); line(RX - r, TY, cx, TY, 18)
      CUM = [0]; PER = 0
      for (let i = 1; i < LOOP.length; i++) {
        const dx = LOOP[i][0] - LOOP[i - 1][0], dy = LOOP[i][1] - LOOP[i - 1][1]
        PER += Math.sqrt(dx * dx + dy * dy); CUM.push(PER)
      }
      const dx0 = LOOP[0][0] - LOOP[LOOP.length - 1][0], dy0 = LOOP[0][1] - LOOP[LOOP.length - 1][1]
      PER += Math.sqrt(dx0 * dx0 + dy0 * dy0)
    }
    function loopPt(p: number) {
      p = ((p % 1) + 1) % 1; const d = p * PER; let lo = 0, hi = CUM.length - 1
      while (lo < hi) { const m = (lo + hi) >> 1; if (CUM[m] < d) lo = m + 1; else hi = m }
      const i = Math.max(1, lo), a = LOOP[i - 1], b = LOOP[i % LOOP.length]
      const span = (CUM[i] || PER) - CUM[i - 1], f = span > 0 ? (d - CUM[i - 1]) / span : 0
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
    }
    function rr(x: number, y: number, w: number, h: number, rad: number) {
      ctx.beginPath(); ctx.moveTo(x + rad, y); ctx.arcTo(x + w, y, x + w, y + h, rad); ctx.arcTo(x + w, y + h, x, y + h, rad); ctx.arcTo(x, y + h, x, y, rad); ctx.arcTo(x, y, x + w, y, rad); ctx.closePath()
    }
    // sans = DM Sans (UI / nom d'organes), mono = DM Mono (libelles techniques)
    function sans(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Sans", system-ui, sans-serif' }
    function mono(s: number, wt?: string) { ctx.font = (wt || '500') + ' ' + s + 'px "DM Mono", ui-monospace, monospace' }
    function trkw(txt: string, sp: number) { let w = 0; for (let i = 0; i < txt.length; i++) w += ctx.measureText(txt[i]).width + sp; return w - sp }
    function trk(txt: string, x: number, y: number, sp: number) { let xp = x; for (let i = 0; i < txt.length; i++) { ctx.fillText(txt[i], xp, y); xp += ctx.measureText(txt[i]).width + sp } }

    function resize() {
      const b = cv.getBoundingClientRect(); W = b.width; H = b.height
      cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); build()
    }

    const t0 = performance.now()
    const STEPS = [
      ['ÉTAPE 01', 'ÉVAPORATEUR', 'INTÉRIEUR'],
      ['ÉTAPE 02', 'COMPRESSEUR', 'EXTÉRIEUR'],
      ['ÉTAPE 03', 'CONDENSEUR', 'EXTÉRIEUR'],
      ['ÉTAPE 04', 'DÉTENDEUR', 'DÉTENTE'],
    ]
    let rafId = 0

    function frame(now: number) {
      const t = (now - t0) / 1000
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H)
      const phase = (t / 3) % 4
      const foc = (idx: number) => { let d = Math.abs((phase - idx + 4) % 4); d = Math.min(d, 4 - d); return Math.max(0, 1 - d * 1.4) }
      const fe = foc(0), fcm = foc(1), fco = foc(2), fd = foc(3)
      ctx.strokeStyle = LIGHT; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(W * 0.05, midY); ctx.lineTo(W * 0.95, midY); ctx.stroke()
      mono(W * 0.020, '500'); ctx.fillStyle = GRAY; ctx.textAlign = 'left'; ctx.fillText('INTÉRIEUR', W * 0.05, midY - W * 0.014)
      ctx.textAlign = 'right'; ctx.fillText('EXTÉRIEUR', W * 0.95, midY + W * 0.032); ctx.textAlign = 'left'
      ctx.lineWidth = Math.max(3, W * 0.010); ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (let i = 1; i < LOOP.length; i++) {
        ctx.strokeStyle = ycol((LOOP[i - 1][1] + LOOP[i][1]) / 2); ctx.beginPath()
        ctx.moveTo(LOOP[i - 1][0], LOOP[i - 1][1]); ctx.lineTo(LOOP[i][0], LOOP[i][1]); ctx.stroke()
      }
      for (let k = 0; k < 16; k++) {
        const p = ((t * 0.05) + (k / 16)) % 1, pt = loopPt(p), col = ycol(pt[1])
        if (p < CONDP) {
          ctx.fillStyle = col; ctx.globalAlpha = 0.20; ctx.beginPath(); ctx.arc(pt[0], pt[1], W * 0.016, 0, 6.2832); ctx.fill()
          ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(pt[0], pt[1], W * 0.005, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1
        } else {
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(pt[0], pt[1], W * 0.008, 0, 6.2832); ctx.fill()
        }
      }
      const ev = loopPt(0.04)
      for (let c0 = 0; c0 < 7; c0++) {
        const phc = ((t * 0.5) + (c0 * 0.143)) % 1
        const pxc = ev[0] - W * 0.02 - phc * W * 0.05
        const pyc = ev[1] - W * 0.01 - phc * W * 0.045 + Math.sin(phc * 6.28 + c0) * W * 0.008
        const alc = 0.22 * Math.sin(phc * 3.1416)
        if (alc > 0) { ctx.fillStyle = rgba([90, 150, 205], alc); ctx.beginPath(); ctx.arc(pxc, pyc, W * 0.01 * (0.5 + phc), 0, 6.2832); ctx.fill() }
      }
      const iw = W * 0.26, ih = W * 0.075, ix = cx - iw / 2, iy = TY - ih / 2
      ctx.fillStyle = '#fff'; rr(ix, iy, iw, ih, 8); ctx.fill()
      ctx.strokeStyle = fe > 0.3 ? BLUE : INK; ctx.lineWidth = 2; rr(ix, iy, iw, ih, 8); ctx.stroke()
      ctx.strokeStyle = BLUE; ctx.globalAlpha = 0.5 + 0.4 * fe; ctx.lineWidth = 2; ctx.beginPath()
      for (let c1 = 0; c1 <= 30; c1++) {
        const xx = ix + iw * 0.1 + (iw * 0.8) * c1 / 30
        const yy = iy + ih * 0.45 + Math.sin(c1 / 30 * 6.28 * 3) * ih * 0.16
        if (c1 === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy)
      }
      ctx.stroke(); ctx.globalAlpha = 1
      ctx.strokeStyle = 'rgba(26,23,20,0.4)'; ctx.lineWidth = 3; ctx.beginPath()
      ctx.moveTo(ix + iw * 0.12, iy + ih * 0.84); ctx.lineTo(ix + iw * 0.88, iy + ih * 0.84); ctx.stroke()
      for (let a1 = 0; a1 < 3; a1++) {
        const ax = cx + (a1 - 1) * iw * 0.26
        ctx.strokeStyle = rgba([53, 106, 155], 0.25 + 0.7 * fe); ctx.lineWidth = 2.5; ctx.beginPath()
        ctx.moveTo(ax, iy - W * 0.008); ctx.lineTo(ax, iy - W * 0.05)
        ctx.moveTo(ax - W * 0.007, iy - W * 0.038); ctx.lineTo(ax, iy - W * 0.05); ctx.lineTo(ax + W * 0.007, iy - W * 0.038)
        ctx.stroke()
      }
      sans(W * 0.026, '600'); ctx.fillStyle = fe > 0.3 ? BLUE : INK; ctx.textAlign = 'center'
      ctx.fillText('ÉVAPORATEUR', cx, iy - W * 0.07)
      sans(W * 0.016, '400'); ctx.fillStyle = GRAY; ctx.fillText('unité intérieure', cx, iy - W * 0.048)
      const ow = W * 0.42, oh = W * 0.15, ox = cx - ow / 2, oy = BY - oh / 2
      ctx.fillStyle = '#fff'; rr(ox, oy, ow, oh, 8); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2; rr(ox, oy, ow, oh, 8); ctx.stroke()
      const mcx = ox + ow * 0.2, mcy = oy + oh * 0.5, mr = oh * 0.26
      ctx.strokeStyle = fcm > 0.3 ? HOT : INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(mcx, mcy, mr, 0, 6.2832); ctx.stroke()
      ctx.fillStyle = fcm > 0.3 ? HOT : GRAY; ctx.beginPath(); ctx.arc(mcx, mcy, mr * 0.4, 0, 6.2832); ctx.fill()
      for (let k3 = 0; k3 < 7; k3++) {
        const fx = ox + ow * 0.4 + k3 * ow * 0.05
        ctx.strokeStyle = fco > 0.3 ? HOT : GRAY; ctx.globalAlpha = 0.5 + 0.4 * fco; ctx.lineWidth = 2; ctx.beginPath()
        ctx.moveTo(fx, oy + oh * 0.22); ctx.lineTo(fx, oy + oh * 0.78); ctx.stroke()
      }
      ctx.globalAlpha = 1
      const fcx = ox + ow * 0.84, fcy = oy + oh * 0.5, fr = oh * 0.3
      ctx.strokeStyle = fco > 0.3 ? HOT : INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fcx, fcy, fr, 0, 6.2832); ctx.stroke()
      ctx.save(); ctx.translate(fcx, fcy); ctx.rotate(t * 2 * (0.4 + fco))
      for (let bl = 0; bl < 3; bl++) {
        ctx.rotate(6.2832 / 3); ctx.fillStyle = fco > 0.3 ? HOT : GRAY
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(fr * 0.85, -fr * 0.16); ctx.lineTo(fr * 0.85, fr * 0.16); ctx.closePath(); ctx.fill()
      }
      ctx.restore()
      for (let k4 = 0; k4 < 3; k4++) {
        const hx = fcx + (k4 - 1) * ow * 0.07
        ctx.strokeStyle = rgba([192, 64, 44], 0.25 + 0.7 * fco); ctx.lineWidth = 2.5; ctx.beginPath()
        ctx.moveTo(hx, oy + oh + W * 0.008); ctx.lineTo(hx, oy + oh + W * 0.05)
        ctx.moveTo(hx - W * 0.007, oy + oh + W * 0.038); ctx.lineTo(hx, oy + oh + W * 0.05); ctx.lineTo(hx + W * 0.007, oy + oh + W * 0.038)
        ctx.stroke()
      }
      const vcol = [148, 189, 224], px0 = fcx + fr * 0.4, py0 = oy
      for (let b1 = 0; b1 < 12; b1++) {
        const phb = ((t * 0.11) + (b1 / 12)) % 1
        const bx = px0 - W * 0.004 + W * 0.055 * phb + W * 0.02 * Math.sin(phb * 3.4 + b1)
        const by1 = py0 + W * 0.008 - W * 0.135 * phb
        const alb = 0.07 * (0.4 + 0.6 * fco) * Math.sin(phb * 3.1416)
        if (alb > 0) { ctx.fillStyle = rgba(vcol, alb); ctx.beginPath(); ctx.arc(bx, by1, W * 0.017 * (0.6 + 2.2 * phb), 0, 6.2832); ctx.fill() }
      }
      for (let b2 = 0; b2 < 26; b2++) {
        const ph2 = ((t * 0.16) + (b2 / 26)) % 1
        const bx2 = px0 + W * 0.05 * ph2 + W * 0.018 * Math.sin(ph2 * 4.5 + b2 * 0.6)
        const by2 = py0 - W * 0.12 * ph2 + W * 0.01 * Math.cos(ph2 * 3.2 + b2 * 0.5)
        const basef = 0.17 * (0.4 + 0.6 * fco) * Math.sin(ph2 * 3.1416)
        if (basef <= 0) continue
        const radf = W * 0.01 * (0.5 + 2 * ph2)
        const layers = [[1, 0.4], [0.62, 0.75], [0.32, 1]]
        for (let li = 0; li < 3; li++) {
          ctx.fillStyle = rgba(vcol, basef * layers[li][1])
          ctx.beginPath(); ctx.arc(bx2, by2, radf * layers[li][0], 0, 6.2832); ctx.fill()
        }
      }
      sans(W * 0.026, '600'); ctx.fillStyle = INK; ctx.textAlign = 'center'
      ctx.fillText('UNITÉ EXTÉRIEURE', cx, oy + oh + W * 0.07)
      sans(W * 0.016, '400'); ctx.fillStyle = fcm > 0.3 ? HOT : GRAY
      ctx.fillText('compresseur', mcx, mcy + mr + W * 0.026)
      ctx.fillStyle = fco > 0.3 ? HOT : GRAY
      ctx.fillText('condenseur', fcx - ow * 0.1, oy - W * 0.012)
      const vxx = RX, vyy = midY, vs = W * 0.016
      ctx.fillStyle = fd > 0.3 ? BLUE : INK
      ctx.beginPath()
      ctx.moveTo(vxx - vs, vyy - vs); ctx.lineTo(vxx, vyy); ctx.lineTo(vxx - vs, vyy + vs); ctx.closePath()
      ctx.moveTo(vxx + vs, vyy - vs); ctx.lineTo(vxx, vyy); ctx.lineTo(vxx + vs, vyy + vs); ctx.closePath()
      ctx.fill()
      sans(W * 0.018, '600'); ctx.fillStyle = fd > 0.3 ? BLUE : INK; ctx.textAlign = 'left'
      ctx.fillText('DÉTENDEUR', vxx + vs * 1.6, vyy + W * 0.006)
      mono(W * 0.016, '500'); ctx.textAlign = 'right'; ctx.fillStyle = BLUE
      ctx.fillText('VAPEUR', LX - W * 0.012, midY - W * 0.004)
      ctx.textAlign = 'left'; ctx.fillStyle = GRAY
      ctx.fillText('LIQUIDE', RX + W * 0.012, midY + W * 0.05)
      const ai = Math.floor(phase) % 4, st = STEPS[ai]
      const lab = st[0] + '   ·   ' + st[1] + '   ·   ' + st[2]
      mono(W * 0.017, '500'); const lw = trkw(lab, 2); ctx.fillStyle = RED; ctx.textAlign = 'left'
      trk(lab, cx - lw / 2, H * 0.95, 2)
      ctx.textAlign = 'left'
      rafId = requestAnimationFrame(frame)
    }

    function startNow() { resize(); rafId = requestAnimationFrame(frame) }
    window.addEventListener('resize', resize)
    if ((document as any).fonts && (document as any).fonts.load) {
      Promise.all([
        (document as any).fonts.load('500 16px "DM Sans"'),
        (document as any).fonts.load('600 16px "DM Sans"'),
        (document as any).fonts.load('500 16px "DM Mono"'),
      ]).then(startNow, startNow)
    } else { startNow() }

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <figure style={{ margin: '40px -20px 8px' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: 'clamp(380px, 56vw, 560px)',
          display: 'block',
          background: '#fff',
          borderTop: '1px solid #DDD9D2',
          borderBottom: '1px solid #DDD9D2',
        }}
        aria-label="Cycle du climatiseur : evaporateur, compresseur, condenseur, detendeur"
      />
      <figcaption style={{
        padding: '12px 4px 0',
        fontFamily: "'DM Mono', ui-monospace, monospace",
        fontSize: '10.5px',
        letterSpacing: '0.08em',
        color: '#8a7f72',
      }}>
        Le cycle frigorifique a compression. Le fluide circule en boucle : il s'evapore et capte la chaleur a l'interieur, est comprime, se condense en rejetant la chaleur a l'exterieur, puis se detend pour repartir froid. Animation Soara.
      </figcaption>
    </figure>
  )
}
