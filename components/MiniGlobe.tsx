'use client'
import { useEffect, useRef } from 'react'

export default function MiniGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.onload = () => initGlobe(canvas)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

function initGlobe(canvas: HTMLCanvasElement) {
  const THREE = (window as any).THREE
  if (!THREE) return

  const w = canvas.offsetWidth
  const h = canvas.offsetHeight

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h)

  const scene = new THREE.Scene()
  const cam = new THREE.PerspectiveCamera(45, w/h, 0.1, 100)
  cam.position.z = 2.4

  scene.add(new THREE.AmbientLight(0x334466, 2))
  const sun = new THREE.DirectionalLight(0x8899cc, 2.5)
  sun.position.set(5, 3, 5)
  scene.add(sun)

  // Stars
  const sg = new THREE.BufferGeometry()
  const sp: number[] = []
  for (let i = 0; i < 800; i++) {
    sp.push((Math.random()-.5)*200,(Math.random()-.5)*200,(Math.random()-.5)*200)
  }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3))
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({color:0xffffff,size:.3,transparent:true,opacity:.4})))

  // Globe texture
  const tc = document.createElement('canvas')
  tc.width = 512; tc.height = 256
  const ctx = tc.getContext('2d')!
  const g = ctx.createLinearGradient(0,0,0,256)
  g.addColorStop(0,'#06090e')
  g.addColorStop(1,'#070c12')
  ctx.fillStyle = g
  ctx.fillRect(0,0,512,256)
  ctx.strokeStyle = 'rgba(20,40,75,.2)'
  ctx.lineWidth = .3
  for (let x=-180;x<=180;x+=30) { const px=(x+180)/360*512; ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,256);ctx.stroke() }
  for (let y=-90;y<=90;y+=30) { const py=(90-y)/180*256; ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(512,py);ctx.stroke() }

  const tex = new THREE.CanvasTexture(tc)
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 48),
    new THREE.MeshPhongMaterial({ map: tex, specular: 0x112244, shininess: 10 })
  )
  const group = new THREE.Group()
  group.add(globe)

  // Atmosphere
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 24, 24),
    new THREE.MeshPhongMaterial({ color: 0x152540, transparent: true, opacity: .08, side: THREE.BackSide })
  ))

  scene.add(group)

  // Crisis points
  const POINTS = [
    { lat:32.4, lng:53.6, color:'#FC8181' },
    { lat:26.5, lng:56.3, color:'#FC8181' },
    { lat:23.6, lng:121.0, color:'#F6AD55' },
    { lat:14.0, lng:-2.0, color:'#F6AD55' },
    { lat:49.0, lng:31.0, color:'#F6AD55' },
    { lat:8.0, lng:-66.0, color:'#F6E05E' },
  ]

  POINTS.forEach(p => {
    const phi = (90-p.lat)*Math.PI/180
    const theta = (p.lng+180)*Math.PI/180
    const pos = new THREE.Vector3(
      -Math.sin(phi)*Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi)*Math.sin(theta)
    ).multiplyScalar(1.02)

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(.022, 6, 6),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(p.color) })
    )
    dot.position.copy(pos)
    group.add(dot)
  })

  // Load countries
  fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(r => r.json())
    .then(world => {
      const topo = (window as any).topojson
      if (!topo) return
      const countries = topo.feature(world, world.objects.countries)
      const dc = document.createElement('canvas')
      dc.width = 512; dc.height = 256
      const dctx = dc.getContext('2d')!
      dctx.drawImage(tc, 0, 0)
      dctx.fillStyle = 'rgba(18,35,65,.8)'
      dctx.strokeStyle = 'rgba(35,60,110,.4)'
      dctx.lineWidth = .5
      countries.features.forEach((f: any) => {
        const coords = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
        coords.forEach((poly: any) => {
          poly.forEach((ring: any) => {
            dctx.beginPath()
            ring.forEach(([lng, lat]: number[], i: number) => {
              const x = (lng+180)/360*512
              const y = (90-lat)/180*256
              i === 0 ? dctx.moveTo(x,y) : dctx.lineTo(x,y)
            })
            dctx.closePath()
            dctx.fill()
            dctx.stroke()
          })
        })
      })
      tex.image = dc
      tex.needsUpdate = true
    }).catch(() => {})

  let rotY = 0.5
  const animate = () => {
    requestAnimationFrame(animate)
    rotY += 0.004
    group.rotation.y = rotY
    renderer.render(scene, cam)
  }
  animate()
}
