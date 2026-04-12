// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

// ─── IMAGES PAR ÈRE ──────────────────────────────────────────────────────────
const BACKGROUNDS = [
  {
    src: "/grands-formats/climat/01-ocean-cambrien.jpg",
    // Zoom lent vers le centre + dérive droite
    kb: "kenburns-ocean",
    era: "Cambrien · Ordovicien",
    maRange: [500, 420],
  },
  {
    src: "/grands-formats/climat/02-glacier-ordovicien.jpg",
    kb: "kenburns-glacier1",
    era: "Glaciation Ordovicien",
    maRange: [420, 300],
  },
  {
    src: "/grands-formats/climat/03-jungle-cretace.jpg",
    kb: "kenburns-jungle",
    era: "Carbonifère · Permien · Mésozoïque",
    maRange: [300, 66],
  },
  {
    src: "/grands-formats/climat/04-volcan-permien.jpg",
    kb: "kenburns-volcan",
    era: "Fin-Permien · PETM",
    maRange: [66, 2.5],
  },
  {
    src: "/grands-formats/climat/05-glace-glaciaire.jpg",
    kb: "kenburns-glace",
    era: "Quaternaire · Maximum glaciaire",
    maRange: [2.5, 0.0005],
  },
  {
    src: "/grands-formats/climat/06-hiver-petitAge.jpg",
    kb: "kenburns-hiver",
    era: "Petit Âge Glaciaire · Révolution industrielle",
    maRange: [0.0005, 0],
  },
]

// ─── DONNÉES PALÉOCLIMATIQUES ────────────────────────────────────────────────
const GEO = [
  [500,6.2],[490,5.8],[480,4.2],[470,3.0],[460,1.5],[450,0.2],
  [445,-4.8],[440,-3.5],[435,-1.0],[430,1.5],[425,3.0],
  [420,4.2],[410,4.8],[400,5.2],[390,4.8],[380,4.2],[370,3.2],
  [360,2.2],[350,0.8],[340,0.0],[330,-1.5],
  [310,-3.2],[300,-1.5],[290,1.2],[280,2.5],[270,3.5],[260,4.0],
  [252,9.8],[248,8.5],[240,7.5],[230,6.5],[220,5.8],[210,5.2],
  [200,4.8],[190,5.2],[180,5.8],[170,6.2],[160,6.5],[150,6.8],
  [140,7.5],[130,7.8],[120,8.2],[110,8.8],[100,9.2],
  [90,8.8],[80,8.0],[70,7.0],[66,6.5],[62,6.0],
  [55.5,8.2],[53,7.0],[50,6.2],[45,5.2],[40,4.2],[38,3.5],
  [34,2.2],[30,1.8],[25,2.2],[20,2.5],[15,2.0],[10,1.5],[5,1.0],
  [3.5,0.5],[2.8,-0.8],[2.5,-2.5],
  [2.0,-1.2],[1.5,-2.2],[1.0,-1.8],[0.8,-2.5],[0.6,-3.2],
  [0.4,-1.8],[0.12,-1.2],
  [0.020,-5.8],[0.012,-2.8],[0.010,-1.2],
  [0.008,0.1],[0.005,-0.1],[0.003,-0.2],[0.0015,-0.35],
  [0.00050,-0.22],[0.00040,-0.30],[0.00030,-0.42],[0.00025,-0.48],
  [0.00020,-0.38],[0.00018,-0.22],[0.00015,-0.08],
  [0.00010,+0.00],[0.00006,+0.10],[0.00004,+0.22],
  [0.00002,+0.37],[0.00001,+0.52],[0.000005,+0.68],[0.000002,+0.90],
  [0.0000008,+1.15],[0.0000004,+1.45],[0.00000001,+1.62],
]

const EVENTS = [
  { ma:445,  label:"Glaciation Ordovicien",    sub:"−96% des espèces marines · −5°C en ~500 000 ans" },
  { ma:252,  label:"Fin-Permien",              sub:"Pire extinction · +9°C en ~60 000 ans" },
  { ma:55.5, label:"PETM",                     sub:"+5°C en ~20 000 ans — le plus rapide avant aujourd'hui" },
  { ma:0.020,label:"Maximum glaciaire",        sub:"−6°C en ~10 000 ans" },
  { ma:0.000150,label:"Révolution industrielle",sub:"Point de bascule — le CO₂ commence à s'accumuler" },
]

const SLOPES = [
  { label:"Ordovicien",   duration:500000, delta:8,   col:"#7dd3fc", note:"−8°C · 500 000 ans" },
  { label:"Fin-Permien",  duration:60000,  delta:9,   col:"#fb923c", note:"+9°C · 60 000 ans" },
  { label:"PETM",         duration:20000,  delta:5,   col:"#f87171", note:"+5°C · 20 000 ans" },
  { label:"Post-glaciaire",duration:10000, delta:6,   col:"#93c5fd", note:"+6°C · 10 000 ans" },
  { label:"Aujourd'hui",  duration:150,    delta:1.62,col:"#dc2626", note:"+1,6°C · 150 ans", current:true },
]

function getTemp(ma) {
  for (let i = 1; i < GEO.length; i++) {
    if (ma >= GEO[i][0]) {
      const t = (ma - GEO[i-1][0]) / (GEO[i][0] - GEO[i-1][0])
      return GEO[i-1][1] + (GEO[i][1] - GEO[i-1][1]) * t
    }
  }
  return GEO[GEO.length-1][1]
}

function tempColor(v) {
  const stops = [
    [-6,[100,180,255]],[-3,[140,195,240]],[-1,[175,205,225]],
    [0,[200,190,165]],[1,[240,185,100]],[2,[230,140,60]],
    [4,[210,80,40]],[6,[180,35,25]],[8,[130,10,10]],[10,[80,0,0]],
  ]
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const t = (v - stops[i-1][0]) / (stops[i][0] - stops[i-1][0])
      return stops[i-1][1].map((c,j) => Math.round(c + (stops[i][1][j]-c)*t))
    }
  }
  return stops[stops.length-1][1]
}
const tc  = (v) => { const [r,g,b] = tempColor(v); return `rgb(${r},${g},${b})` }
const tcA = (v,a) => { const [r,g,b] = tempColor(v); return `rgba(${r},${g},${b},${a})` }

function getCurrentBg(ma) {
  for (const bg of BACKGROUNDS) {
    if (ma <= bg.maRange[0] && ma >= bg.maRange[1]) return bg
  }
  return BACKGROUNDS[BACKGROUNDS.length - 1]
}

export default function ClimateClient() {
  const [prog, setProg]       = useState(0)
  const [playing, setPlaying] = useState(false)
  const [reveal, setReveal]   = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeBg, setActiveBg] = useState(0)
  const rafRef  = useRef(null)
  const lastRef = useRef(null)
  const progRef = useRef(0)
  const DURATION = 26000

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setPlaying(true), 600)
  }, [])

  const tick = useCallback((ts) => {
    if (!lastRef.current) lastRef.current = ts
    const dt = ts - lastRef.current
    lastRef.current = ts
    progRef.current = Math.min(progRef.current + dt / DURATION, 1)
    const ma = 500 * (1 - progRef.current)
    // Trouver le bon fond
    for (let i = 0; i < BACKGROUNDS.length; i++) {
      const bg = BACKGROUNDS[i]
      if (ma <= bg.maRange[0] && ma >= bg.maRange[1]) {
        setActiveBg(i)
        break
      }
    }
    setProg(progRef.current)
    if (progRef.current < 1) rafRef.current = requestAnimationFrame(tick)
    else { setPlaying(false); setTimeout(() => setReveal(true), 800) }
  }, [])

  useEffect(() => {
    if (playing) { lastRef.current = null; rafRef.current = requestAnimationFrame(tick) }
    else cancelAnimationFrame(rafRef.current)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, tick])

  const handlePlay = () => {
    if (progRef.current >= 1) { progRef.current = 0; setProg(0); setReveal(false); setActiveBg(0) }
    setPlaying(p => !p)
  }
  const handleSlide = (e) => {
    progRef.current = Number(e.target.value)
    const ma = 500 * (1 - progRef.current)
    for (let i = 0; i < BACKGROUNDS.length; i++) {
      if (ma <= BACKGROUNDS[i].maRange[0] && ma >= BACKGROUNDS[i].maRange[1]) { setActiveBg(i); break }
    }
    setProg(progRef.current); setPlaying(false)
    if (progRef.current >= 1) setReveal(true)
  }

  const currentMa = 500 * (1 - prog)
  const currentT  = getTemp(currentMa)

  // SVG
  const W=960,H=400,PL=54,PR=20,PT=36,PB=50
  const cW=W-PL-PR,cH=H-PT-PB
  const TMIN=-7,TMAX=11
  const xLog=(ma)=>{
    const lm=Math.log10(Math.max(ma,0.000000015))
    const lmin=Math.log10(0.000000010),lmax=Math.log10(500)
    return PL+(lm-lmin)/(lmax-lmin)*cW
  }
  const yS=(t)=>PT+cH-(t-TMIN)/(TMAX-TMIN)*cH

  // Segments colorés
  const segments=[]
  for(let i=1;i<GEO.length;i++){
    if(GEO[i][0]>currentMa) continue
    const ma1=GEO[i-1][0],ma2=GEO[i][0]
    const steps=Math.max(2,Math.ceil((ma1-ma2)/0.6))
    for(let s=0;s<steps;s++){
      const m1=ma1-(ma1-ma2)*s/steps
      const m2=ma1-(ma1-ma2)*(s+1)/steps
      if(m2>currentMa) break
      const t1=getTemp(m1),t2=getTemp(m2)
      segments.push({x1:xLog(m1),y1:yS(t1),x2:xLog(m2),y2:yS(t2),col:tc((t1+t2)/2)})
    }
  }

  const headX=xLog(Math.max(currentMa,0.000000015))
  const headY=yS(currentT)

  const xLabels=[[500,"500 Ma"],[300,"300 Ma"],[100,"100 Ma"],[50,"50 Ma"],[10,"10 Ma"],[1,"1 Ma"],[0.1,"100 ka"],[0.01,"10 ka"],[0.001,"1 000 ans"]]

  // Ken Burns CSS styles — chaque image a son propre mouvement
  const kbStyles = {
    "kenburns-ocean":   { animation:"kb-ocean 20s ease-in-out infinite alternate" },
    "kenburns-glacier1":{ animation:"kb-glacier1 22s ease-in-out infinite alternate" },
    "kenburns-jungle":  { animation:"kb-jungle 18s ease-in-out infinite alternate" },
    "kenburns-volcan":  { animation:"kb-volcan 16s ease-in-out infinite alternate" },
    "kenburns-glace":   { animation:"kb-glace 24s ease-in-out infinite alternate" },
    "kenburns-hiver":   { animation:"kb-hiver 20s ease-in-out infinite alternate" },
  }

  return (
    <div style={{ background:"#04060d", minHeight:"100vh", color:"#e8e4de", opacity:mounted?1:0, transition:"opacity 1s" }}>

      {/* CSS Ken Burns keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb-ocean   { from{transform:scale(1.0) translate(0%,0%)}   to{transform:scale(1.18) translate(-3%,-2%)} }
        @keyframes kb-glacier1{ from{transform:scale(1.05) translate(2%,0%)}  to{transform:scale(1.20) translate(-2%,-1%)} }
        @keyframes kb-jungle  { from{transform:scale(1.0) translate(-2%,1%)}  to{transform:scale(1.15) translate(2%,-2%)} }
        @keyframes kb-volcan  { from{transform:scale(1.1) translate(1%,-1%)}  to{transform:scale(1.0) translate(-2%,1%)} }
        @keyframes kb-glace   { from{transform:scale(1.0) translate(3%,0%)}   to{transform:scale(1.18) translate(-3%,-1%)} }
        @keyframes kb-hiver   { from{transform:scale(1.05) translate(-1%,1%)} to{transform:scale(1.18) translate(2%,-2%)} }
        .bg-layer { position:absolute; inset:0; background-size:cover; background-position:center; transition:opacity 2s ease; will-change:transform; }
      `}</style>

      {/* ── FOND KEN BURNS FIXE ── couvre toute la page au scroll ─────────── */}
      <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden" }}>
        {BACKGROUNDS.map((bg, i) => (
          <div key={i} className="bg-layer"
            style={{
              backgroundImage:`url(${bg.src})`,
              opacity: i === activeBg ? 1 : 0,
              filter:"brightness(0.52) blur(3px) saturate(0.95)",
              ...kbStyles[bg.kb],
            }}
          />
        ))}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(4,6,13,0.05) 0%, rgba(4,6,13,0.45) 65%, rgba(4,6,13,0.88) 100%)" }}/>
      </div>

      {/* ── CONTENU au-dessus du fond ────────────────────────────────────── */}
      <div style={{ position:"relative", zIndex:1, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column" }}>

          {/* Header */}
          <div style={{ padding:"52px 52px 40px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9, letterSpacing:5, color:"rgba(255,255,255,0.2)", textTransform:"uppercase", marginBottom:18 }}>
              Soara · Environnement · Scotese 2021 · HadCRUT5 · NASA GISS
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:40, flexWrap:"wrap" }}>
              <div style={{ flex:1 }}>
                <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(34px,5.5vw,76px)", fontWeight:300, color:"#f0ede8", margin:"0 0 10px", lineHeight:1.05, letterSpacing:"-0.01em" }}>
                  La Terre a toujours changé<br/>
                  <em style={{ fontWeight:600 }}>de température.</em>
                </h1>
                <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:"clamp(16px,2.2vw,26px)", fontWeight:300, color:"#dc2626", margin:0, lineHeight:1.4 }}>
                  Ce qui est sans précédent, c'est la vitesse.
                </p>
              </div>
              <div style={{ textAlign:"right", paddingBottom:6, flexShrink:0 }}>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9, letterSpacing:3, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:6 }}>
                  {currentMa > 1 ? `il y a ${Math.round(currentMa)} Ma` : currentMa > 0.001 ? `il y a ${Math.round(currentMa*1000)} 000 ans` : "aujourd'hui"}
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(46px,6vw,84px)", fontWeight:700, lineHeight:1, color:tc(currentT), letterSpacing:"-2px", textShadow:`0 0 60px ${tcA(currentT,0.5)}`, transition:"color 0.4s, text-shadow 0.4s" }}>
                  {currentT >= 0 ? "+" : ""}{currentT.toFixed(2)}<span style={{ fontSize:"0.42em", fontWeight:300, opacity:0.6 }}>°C</span>
                </div>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9, color:"rgba(255,255,255,0.25)", marginTop:4, letterSpacing:2 }}>
                  {BACKGROUNDS[activeBg]?.era}
                </div>
              </div>
            </div>
          </div>

          {/* Graphique */}
          <div style={{ padding:"24px 52px 0", flex:1 }}>
            <div style={{ position:"relative", border:"1px solid rgba(255,255,255,0.07)", background:"rgba(4,6,13,0.15)", backdropFilter:"blur(2px)" }}>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block" }}>
                <defs>
                  <filter id="lg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                  <filter id="dg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {/* Grid */}
                {[-4,-2,0,2,4,6,8].map(v=>(
                  <g key={v}>
                    <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)} stroke={v===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)"} strokeWidth={v===0?0.8:0.5} strokeDasharray={v===0?"none":"2 8"}/>
                    <text x={PL-7} y={yS(v)+4} textAnchor="end" fill={v===0?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.07)"} fontSize={9} fontFamily="'DM Mono',monospace">{v>=0?`+${v}`:v}°</text>
                  </g>
                ))}
                {/* Seuil aujourd'hui */}
                <line x1={PL} y1={yS(1.62)} x2={PL+cW} y2={yS(1.62)} stroke="#dc2626" strokeWidth={0.7} strokeDasharray="5 6" strokeOpacity={0.4}/>
                {/* X labels */}
                {xLabels.map(([ma,label])=>(
                  <g key={ma}>
                    <line x1={xLog(ma)} y1={PT+cH} x2={xLog(ma)} y2={PT+cH+5} stroke="rgba(255,255,255,0.06)"/>
                    <text x={xLog(ma)} y={PT+cH+18} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={7.5} fontFamily="'DM Mono',monospace">{label}</text>
                  </g>
                ))}
                {/* Courbe */}
                <g filter="url(#lg)">
                  {segments.map((s,i)=>(
                    <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.col} strokeWidth={2.2} strokeLinecap="round"/>
                  ))}
                </g>
                {/* Dot */}
                {prog>0.005 && (
                  <g filter="url(#dg)">
                    <circle cx={headX} cy={headY} r={5} fill={tc(currentT)} opacity={0.9}/>
                    <circle cx={headX} cy={headY} r={2.5} fill="#fff" opacity={0.85}/>
                  </g>
                )}
              </svg>
            </div>

            {/* Contrôles */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:16, marginBottom:32 }}>
              <button onClick={handlePlay} style={{ background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"#e8e4de", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:3, padding:"10px 24px", cursor:"pointer", textTransform:"uppercase", flexShrink:0 }}>
                {playing ? "⏸ Pause" : prog>=1 ? "↺ Rejouer" : "▶ Play"}
              </button>
              <input type="range" min={0} max={1} step={0.0005} value={prog} onChange={handleSlide} style={{ flex:1, accentColor:"#c9a84c", cursor:"pointer" }}/>
              <span style={{ fontSize:9, color:"rgba(255,255,255,0.2)", flexShrink:0 }}>maintenant</span>
            </div>
          </div>
      </div>

      {/* ── COMPARAISON DES VITESSES ────────────────────────────────────────── */}
      <div style={{ padding:"0 52px 80px", background:"rgba(4,6,13,0.3)", backdropFilter:"blur(2px)", opacity:reveal?1:0, transform:reveal?"translateY(0)":"translateY(32px)", transition:"opacity 1.4s ease, transform 1.4s ease" }}>

        <div style={{ paddingTop:64, marginBottom:36 }}>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(24px,3.5vw,46px)", fontWeight:300, color:"#f0ede8", margin:"0 0 10px", lineHeight:1.15 }}>
            Ces cinq réchauffements, vus à la <em style={{ fontWeight:600 }}>même échelle de temps.</em>
          </h2>
          <p style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:"italic", fontSize:"clamp(13px,1.6vw,17px)", color:"rgba(255,255,255,0.3)", margin:0, lineHeight:1.6 }}>
            Chaque panneau représente 150 ans. Axe vertical identique : −0,5°C à +2°C.
          </p>
        </div>

        {/* 5 panneaux */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:3, marginBottom:48 }}>
          {SLOPES.map((s,idx)=>{
            const PW=160,PH=200,PPL=10,PPR=8,PPT=18,PPB=28
            const pcW=PW-PPL-PPR,pcH=PH-PPT-PPB
            const T0=-0.5,T1=2.0
            const pys=(t)=>PPT+pcH-(t-T0)/(T1-T0)*pcH
            const ratePerYear=s.delta/s.duration
            const endT=Math.min(T1-0.05, ratePerYear*150)
            const isNow=s.current
            return (
              <div key={idx} style={{ background:isNow?"rgba(30,5,5,0.75)":"rgba(8,12,24,0.6)", border:`1px solid ${isNow?"rgba(220,38,38,0.25)":"rgba(255,255,255,0.06)"}`, position:"relative" }}>
                <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" style={{ display:"block" }}>
                  <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(0)} stroke="rgba(255,255,255,0.07)" strokeWidth={0.8}/>
                  <line x1={PPL} y1={pys(1.5)} x2={PPL+pcW} y2={pys(1.5)} stroke="#dc2626" strokeWidth={0.5} strokeDasharray="2 4" strokeOpacity={0.25}/>
                  {[0,1.0,2.0].map(v=>(
                    <text key={v} x={PPL-2} y={pys(v)+3} textAnchor="end" fill="rgba(255,255,255,0.1)" fontSize={6} fontFamily="'DM Mono',monospace">{v>0?`+${v}`:v}°</text>
                  ))}
                  {isNow ? (
                    <>
                      <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)} stroke={s.col} strokeWidth={3.5} strokeLinecap="round" filter="url(#dg)"/>
                      <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)} stroke={s.col} strokeWidth={10} strokeOpacity={0.12}/>
                    </>
                  ) : (
                    <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(endT)} stroke={s.col} strokeWidth={1.5} strokeOpacity={0.8}/>
                  )}
                  <text x={PPL+pcW*0.5} y={PH-PPB+14} textAnchor="middle" fill={isNow?s.col:"rgba(255,255,255,0.35)"} fontSize={isNow?9:8} fontFamily="'Cormorant Garamond',serif" fontWeight={isNow?700:300}>
                    {isNow?`+${s.delta}°C`:`+${endT.toFixed(endT<0.01?5:3)}°C`}
                  </text>
                  <text x={PPL+pcW*0.5} y={PH-PPB+23} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={6.5} fontFamily="'DM Mono',monospace">en 150 ans</text>
                </svg>
                <div style={{ padding:"10px 8px 12px", borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:isNow?700:300, fontSize:"clamp(11px,1.3vw,14px)", color:isNow?"#ef4444":"rgba(255,255,255,0.7)", lineHeight:1.3, marginBottom:3 }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, color:"rgba(255,255,255,0.2)" }}>
                    {s.note}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Phrase finale */}
        <div style={{ borderLeft:"3px solid #dc2626", paddingLeft:28, marginBottom:48 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(16px,2.2vw,24px)", fontWeight:300, color:"#e8e4de", margin:"0 0 12px", lineHeight:1.8 }}>
            Le réchauffement actuel est <strong style={{ fontWeight:700, color:"#ef4444" }}>18 fois plus rapide</strong> que le PETM — l'événement naturel le plus brutal de l'histoire de la vie complexe sur Terre.
          </p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(13px,1.7vw,18px)", fontWeight:300, color:"rgba(255,255,255,0.3)", margin:0, lineHeight:1.8 }}>
            Ce n'est pas l'amplitude qui est sans précédent. C'est la vitesse à laquelle les écosystèmes — et les civilisations — doivent s'adapter.
          </p>
        </div>

        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, color:"rgba(255,255,255,0.12)", lineHeight:2, letterSpacing:0.5 }}>
          <strong style={{ color:"rgba(255,255,255,0.18)" }}>Sources :</strong> Scotese et al. (2021) · PAGES 2k Consortium (2019) · HadCRUT5 Met Office UK · NASA GISS · Carottes glaciaires EPICA (Antarctique)
        </div>
      </div>
    </div>
  )
}
