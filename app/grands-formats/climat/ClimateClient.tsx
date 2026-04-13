// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

const BACKGROUNDS = [
  { src:"/grands-formats/climat/01-ocean-cambrien.jpg",    era:"Cambrien · Ordovicien",  kb:"kb1", maRange:[500, 420] },
  { src:"/grands-formats/climat/02-glacier-ordovicien.jpg", era:"Glaciation Ordovicien",  kb:"kb2", maRange:[420, 300] },
  { src:"/grands-formats/climat/03-jungle-cretace.jpg",    era:"Crétacé · Mésozoïque",   kb:"kb3", maRange:[300, 66]  },
  { src:"/grands-formats/climat/04-volcan-permien.jpg",    era:"Fin-Permien · PETM",      kb:"kb4", maRange:[66, 2.5]  },
  { src:"/grands-formats/climat/05-glace-glaciaire.jpg",   era:"Maximum glaciaire",       kb:"kb5", maRange:[2.5, 0.0005] },
  { src:"/grands-formats/climat/06-hiver-petitAge.jpg",    era:"Petit Âge Glaciaire → Aujourd'hui", kb:"kb6", maRange:[0.0005, 0] },
]

// Anomalie °C vs. pré-industriel (Scotese 2021 · PAGES 2k · HadCRUT5)
// Simplifié sur 7 ères clés pour une lecture linéaire claire
const ERAS = [
  { id:0, name:"Cambrien",     ma:500,  temp:6.2,  col:"#fb923c" },
  { id:1, name:"Ordovicien",   ma:445,  temp:-4.8, col:"#7dd3fc" },
  { id:2, name:"Crétacé",      ma:100,  temp:9.2,  col:"#f97316" },
  { id:3, name:"Fin-Permien",  ma:252,  temp:9.8,  col:"#ef4444" },
  { id:4, name:"Éocène",       ma:50,   temp:6.2,  col:"#fbbf24" },
  { id:5, name:"Glac. max",    ma:0.020,temp:-5.8, col:"#93c5fd" },
  { id:6, name:"Auj.",         ma:0,    temp:1.62, col:"#dc2626" },
]

// Courbe complète (Ma → °C)
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
  [3.5,0.5],[2.8,-0.8],[2.5,-2.5],[2.0,-1.2],[1.5,-2.2],[1.0,-1.8],
  [0.8,-2.5],[0.6,-3.2],[0.4,-1.8],[0.12,-1.2],
  [0.020,-5.8],[0.012,-2.8],[0.010,-1.2],
  [0.008,0.1],[0.005,-0.1],[0.003,-0.2],[0.0015,-0.35],
  [0.00050,-0.22],[0.00030,-0.42],[0.00015,-0.08],
  [0.00010,0.0],[0.00004,0.22],[0.00002,0.37],
  [0.000005,0.68],[0.000002,0.90],[0.0000008,1.15],
  [0.0000004,1.45],[0.00000001,1.62],
]

const SLOPES = [
  { label:"Ordovicien",    duration:500000, delta:8,   col:"#7dd3fc" },
  { label:"Fin-Permien",  duration:60000,  delta:9,   col:"#fb923c" },
  { label:"PETM",         duration:20000,  delta:5,   col:"#f87171" },
  { label:"Post-glac.",   duration:10000,  delta:6,   col:"#93c5fd" },
  { label:"Aujourd'hui",  duration:150,    delta:1.62,col:"#dc2626", current:true },
]

function getTemp(ma) {
  for (let i=1;i<GEO.length;i++) {
    if (ma>=GEO[i][0]) {
      const t=(ma-GEO[i-1][0])/(GEO[i][0]-GEO[i-1][0])
      return GEO[i-1][1]+(GEO[i][1]-GEO[i-1][1])*t
    }
  }
  return GEO[GEO.length-1][1]
}
function tc(v) {
  const s=[[-6,[100,180,255]],[-3,[140,195,240]],[-1,[175,205,225]],
    [0,[200,190,165]],[1,[240,185,100]],[2,[230,140,60]],
    [4,[210,80,40]],[6,[180,35,25]],[8,[130,10,10]],[10,[80,0,0]]]
  for(let i=1;i<s.length;i++){
    if(v<=s[i][0]){
      const t=(v-s[i-1][0])/(s[i][0]-s[i-1][0])
      const [r,g,b]=s[i-1][1].map((c,j)=>Math.round(c+(s[i][1][j]-c)*t))
      return `rgb(${r},${g},${b})`
    }
  }
  return `rgb(80,0,0)`
}

// Ère active selon Ma courant
function getActiveEra(ma) {
  if (ma > 420) return 0
  if (ma > 300) return 1
  if (ma > 66)  return 2
  if (ma > 2.5) return 3
  if (ma > 0.0005) return 4
  return 5
}

export default function ClimateClient() {
  const [prog, setProg]         = useState(0)
  const [playing, setPlaying]   = useState(false)
  const [activeBg, setActiveBg] = useState(0)
  const [activeEra, setActiveEra] = useState(0)
  const [mounted, setMounted]   = useState(false)
  const rafRef  = useRef(null)
  const lastRef = useRef(null)
  const progRef = useRef(0)
  const DURATION = 24000

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setPlaying(true), 500)
  }, [])

  const tick = useCallback((ts) => {
    if (!lastRef.current) lastRef.current = ts
    const dt = ts - lastRef.current
    lastRef.current = ts
    progRef.current = Math.min(progRef.current + dt/DURATION, 1)
    const ma = 500*(1-progRef.current)
    for (let i=0;i<BACKGROUNDS.length;i++) {
      if (ma<=BACKGROUNDS[i].maRange[0]&&ma>=BACKGROUNDS[i].maRange[1]) { setActiveBg(i); break }
    }
    setActiveEra(getActiveEra(ma))
    setProg(progRef.current)
    if (progRef.current<1) rafRef.current = requestAnimationFrame(tick)
    else setPlaying(false)
  }, [])

  useEffect(() => {
    if (playing) { lastRef.current=null; rafRef.current=requestAnimationFrame(tick) }
    else cancelAnimationFrame(rafRef.current)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, tick])

  const handlePlay = () => {
    if (progRef.current>=1) { progRef.current=0; setProg(0); setActiveBg(0); setActiveEra(0) }
    setPlaying(p=>!p)
  }
  const handleSlide = (e) => {
    progRef.current=Number(e.target.value)
    const ma=500*(1-progRef.current)
    for(let i=0;i<BACKGROUNDS.length;i++) {
      if(ma<=BACKGROUNDS[i].maRange[0]&&ma>=BACKGROUNDS[i].maRange[1]){setActiveBg(i);break}
    }
    setActiveEra(getActiveEra(ma))
    setProg(progRef.current); setPlaying(false)
  }

  const currentMa = 500*(1-prog)
  const currentT  = getTemp(currentMa)

  // SVG — axe log pour bien voir les 500M ans ET les derniers siècles
  const W=860, H=220, PL=44, PR=12, PT=20, PB=36
  const cW=W-PL-PR, cH=H-PT-PB
  const xLog=(ma)=>{
    const lm=Math.log10(Math.max(ma,5e-9))
    return PL+(lm-Math.log10(5e-9))/(Math.log10(500)-Math.log10(5e-9))*cW
  }
  const yS=(t)=>PT+cH-(t-(-7))/(11-(-7))*cH

  // Segments colorés
  const segs=[]
  for(let i=1;i<GEO.length;i++){
    if(GEO[i][0]>currentMa) continue
    const steps=Math.max(2,Math.ceil((GEO[i-1][0]-GEO[i][0])/0.8))
    for(let s=0;s<steps;s++){
      const m1=GEO[i-1][0]-(GEO[i-1][0]-GEO[i][0])*s/steps
      const m2=GEO[i-1][0]-(GEO[i-1][0]-GEO[i][0])*(s+1)/steps
      if(m2>currentMa) break
      const t1=getTemp(m1),t2=getTemp(m2)
      segs.push({x1:xLog(m1),y1:yS(t1),x2:xLog(m2),y2:yS(t2),col:tc((t1+t2)/2)})
    }
  }
  const hx=xLog(Math.max(currentMa,5e-9)), hy=yS(currentT)

  // Panneaux vitesse — ligne animée CSS
  const WINDOW=150
  const PW=140,PH=160,PPL=8,PPR=6,PPT=14,PPB=24
  const pcW=PW-PPL-PPR, pcH=PH-PPT-PPB
  const T0=-0.5,T1=2.0
  const pys=(t)=>PPT+pcH-(t-T0)/(T1-T0)*pcH

  // Ère active détermine quel panneau illuminer
  const activeSlopeIdx = Math.min(activeEra, SLOPES.length-1)

  if(!mounted) return null

  return (
    <div style={{ minHeight:"100vh", background:"#04060d", color:"#e8e4de", fontFamily:"'DM Mono',monospace", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb1{from{transform:scale(1.0) translate(0%,0%)} to{transform:scale(1.18) translate(-3%,-2%)}}
        @keyframes kb2{from{transform:scale(1.05) translate(2%,0%)} to{transform:scale(1.2) translate(-2%,-1%)}}
        @keyframes kb3{from{transform:scale(1.0) translate(-2%,1%)} to{transform:scale(1.16) translate(2%,-2%)}}
        @keyframes kb4{from{transform:scale(1.1) translate(1%,-1%)} to{transform:scale(1.0) translate(-2%,1%)}}
        @keyframes kb5{from{transform:scale(1.0) translate(3%,0%)} to{transform:scale(1.18) translate(-3%,-1%)}}
        @keyframes kb6{from{transform:scale(1.05) translate(-1%,1%)} to{transform:scale(1.18) translate(2%,-2%)}}
        @keyframes draw-h{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
        @keyframes draw-v{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
      `}</style>

      {/* ── HERO FULL-SCREEN ──────────────────────────────────────────────── */}
      <div style={{ position:"relative", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>

        {/* Fonds Ken Burns */}
        {BACKGROUNDS.map((bg,i) => (
          <div key={i} style={{
            position:"absolute", inset:0,
            backgroundImage:`url(${bg.src})`,
            backgroundSize:"cover", backgroundPosition:"center",
            opacity:i===activeBg?1:0, transition:"opacity 2.5s ease",
            filter:"brightness(0.5) saturate(0.9)",
            animation:`${bg.kb} 22s ease-in-out infinite alternate`,
          }}/>
        ))}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(4,6,13,0.15) 0%, rgba(4,6,13,0.4) 55%, rgba(4,6,13,0.92) 100%)", zIndex:1 }}/>

        {/* Contenu */}
        <div style={{ position:"relative", zIndex:2, flex:1, display:"flex", flexDirection:"column", padding:"32px 40px 20px" }}>

          {/* Titre */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:8, letterSpacing:5, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", marginBottom:14 }}>
              Soara · Environnement · Scotese 2021 · HadCRUT5 · NASA GISS
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:24, flexWrap:"wrap" }}>
              <div>
                <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4.5vw,58px)", fontWeight:300, color:"#f0ede8", margin:"0 0 6px", lineHeight:1.05 }}>
                  La Terre a toujours changé<br/><em style={{ fontWeight:600 }}>de température.</em>
                </h1>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(14px,1.8vw,20px)", fontWeight:300, color:"#dc2626", margin:0 }}>
                  Ce qui est sans précédent, c'est la vitesse.
                </p>
              </div>
              <div style={{ textAlign:"right", paddingBottom:2, marginLeft:"auto", flexShrink:0 }}>
                <div style={{ fontSize:8, letterSpacing:3, color:"rgba(255,255,255,0.2)", marginBottom:4 }}>
                  {currentMa>1?`${Math.round(currentMa)} Ma`:currentMa>0.001?`${Math.round(currentMa*1000)} 000 ans`:"aujourd'hui"}
                  {" · "}{BACKGROUNDS[activeBg]?.era}
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,5vw,64px)", fontWeight:700, lineHeight:1, color:tc(currentT), letterSpacing:"-2px", textShadow:`0 0 40px ${tc(currentT)}55`, transition:"color 0.4s" }}>
                  {currentT>=0?"+":""}{currentT.toFixed(2)}<span style={{ fontSize:"0.4em", fontWeight:300, opacity:0.6 }}>°C</span>
                </div>
              </div>
            </div>
          </div>

          {/* Courbe principale */}
          <div style={{ border:"1px solid rgba(255,255,255,0.06)", background:"rgba(4,6,13,0.6)", backdropFilter:"blur(4px)", marginBottom:12 }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block" }}>
              <defs>
                <filter id="gl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="dg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              {/* Grid Y */}
              {[-4,0,4,8].map(v=>(
                <g key={v}>
                  <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)} stroke={v===0?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.03)"} strokeWidth={v===0?0.8:0.5} strokeDasharray={v===0?"none":"2 8"}/>
                  <text x={PL-6} y={yS(v)+4} textAnchor="end" fill={v===0?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.07)"} fontSize={8} fontFamily="'DM Mono',monospace">{v>=0?`+${v}`:v}°</text>
                </g>
              ))}
              {/* Seuil aujourd'hui */}
              <line x1={PL} y1={yS(1.62)} x2={PL+cW} y2={yS(1.62)} stroke="#dc2626" strokeWidth={0.6} strokeDasharray="4 6" strokeOpacity={0.4}/>
              {/* X labels */}
              {[[500,"500 Ma"],[100,"100 Ma"],[10,"10 Ma"],[0.1,"100 ka"],[0.001,"1 000 ans"]].map(([ma,l])=>(
                <text key={ma} x={xLog(ma)} y={PT+cH+16} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize={7} fontFamily="'DM Mono',monospace">{l}</text>
              ))}
              {/* Courbe */}
              <g filter="url(#gl)">
                {segs.map((s,i)=>(
                  <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.col} strokeWidth={2} strokeLinecap="round"/>
                ))}
              </g>
              {/* Dot */}
              {prog>0.005&&(
                <g filter="url(#dg)">
                  <circle cx={hx} cy={hy} r={4.5} fill={tc(currentT)} opacity={0.9}/>
                  <circle cx={hx} cy={hy} r={2} fill="#fff" opacity={0.85}/>
                </g>
              )}
            </svg>
          </div>

          {/* Contrôles */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={handlePlay} style={{ background:"none", border:"1px solid rgba(255,255,255,0.2)", color:"#e8e4de", fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:3, padding:"8px 18px", cursor:"pointer", textTransform:"uppercase", flexShrink:0 }}>
              {playing?"⏸ Pause":prog>=1?"↺ Rejouer":"▶ Play"}
            </button>
            <input type="range" min={0} max={1} step={0.0005} value={prog} onChange={handleSlide} style={{ flex:1, accentColor:"#c9a84c", cursor:"pointer" }}/>
            <span style={{ fontSize:8, color:"rgba(255,255,255,0.2)", flexShrink:0 }}>maintenant</span>
          </div>
        </div>
      </div>

      {/* ── SECTION VITESSE — fond propre ───────────────────────────────────── */}
      <div style={{ background:"#070a14", padding:"40px 40px 60px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,3vw,38px)", fontWeight:300, color:"#f0ede8", margin:"0 0 6px", lineHeight:1.15 }}>
          Ces cinq réchauffements, vus à la <em style={{ fontWeight:600 }}>même échelle de temps.</em>
        </h2>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(12px,1.5vw,16px)", color:"rgba(255,255,255,0.25)", margin:"0 0 28px" }}>
          Chaque panneau = 150 ans · Axe vertical identique (−0,5°C → +2°C)
        </p>

        {/* 5 panneaux */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:3 }}>
          {SLOPES.map((s,idx)=>{
            const endT=Math.min(T1-0.05,(s.delta/s.duration)*WINDOW)
            const isNow=s.current
            const isActive=idx===activeSlopeIdx
            return (
              <div key={idx} style={{
                background:isNow?"rgba(25,4,4,0.95)":"rgba(8,12,24,0.95)",
                border:`1px solid ${isActive?"rgba(255,255,255,0.2)":isNow?"rgba(220,38,38,0.2)":"rgba(255,255,255,0.05)"}`,
                transition:"border-color 0.5s",
                boxShadow:isActive?`0 0 20px ${s.col}22`:"none",
              }}>
                <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" style={{ display:"block" }}>
                  <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(0)} stroke="rgba(255,255,255,0.07)" strokeWidth={0.8}/>
                  <line x1={PPL} y1={pys(1.5)} x2={PPL+pcW} y2={pys(1.5)} stroke="#dc2626" strokeWidth={0.5} strokeDasharray="2 4" strokeOpacity={0.2}/>
                  {[0,1.0,2.0].map(v=>(
                    <text key={v} x={PPL-1} y={pys(v)+3} textAnchor="end" fill="rgba(255,255,255,0.1)" fontSize={5.5} fontFamily="'DM Mono',monospace">{v>0?`+${v}`:v}°</text>
                  ))}
                  {isNow?(
                    <>
                      <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)}
                        stroke={s.col} strokeWidth={3} strokeLinecap="round"
                        strokeDasharray="200" style={{ animation:"draw-v 0.5s ease-out forwards", strokeDashoffset:200 }}/>
                      <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)}
                        stroke={s.col} strokeWidth={8} strokeOpacity={0.12}/>
                    </>
                  ):(
                    <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(endT)}
                      stroke={s.col} strokeWidth={1.5} strokeOpacity={isActive?1:0.6}
                      strokeDasharray="300" style={{ animation:`draw-h ${0.8+idx*0.25}s ease-out ${idx*0.15}s forwards`, strokeDashoffset:300 }}/>
                  )}
                  <text x={PPL+pcW*0.5} y={PH-PPB+13} textAnchor="middle" fill={isNow?s.col:"rgba(255,255,255,0.3)"} fontSize={isNow?8.5:7} fontFamily="'Cormorant Garamond',serif" fontWeight={isNow?700:300}>
                    {isNow?`+${s.delta}°C`:`+${endT.toFixed(endT<0.01?5:3)}°C`}
                  </text>
                  <text x={PPL+pcW*0.5} y={PH-PPB+22} textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize={6} fontFamily="'DM Mono',monospace">en 150 ans</text>
                </svg>
                <div style={{ padding:"8px 6px 10px", borderTop:"1px solid rgba(255,255,255,0.04)", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:isNow?700:300, fontSize:"clamp(11px,1.3vw,13px)", color:isActive?s.col:isNow?"#ef4444":"rgba(255,255,255,0.6)", lineHeight:1.3, transition:"color 0.5s" }}>{s.label}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"rgba(255,255,255,0.18)", marginTop:2 }}>{s.note}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Phrase clé */}
        <div style={{ borderLeft:"3px solid #dc2626", paddingLeft:20, marginTop:36 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(14px,1.8vw,20px)", fontWeight:300, color:"#e8e4de", margin:"0 0 8px", lineHeight:1.8 }}>
            Le réchauffement actuel est <strong style={{ fontWeight:700, color:"#ef4444" }}>18 fois plus rapide</strong> que le PETM — l'événement naturel le plus brutal de l'histoire de la vie complexe sur Terre.
          </p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(12px,1.5vw,16px)", fontWeight:300, color:"rgba(255,255,255,0.25)", margin:0, lineHeight:1.8 }}>
            Ce n'est pas l'amplitude qui est sans précédent. C'est la vitesse.
          </p>
        </div>

        <div style={{ marginTop:28, fontSize:8, color:"rgba(255,255,255,0.1)", lineHeight:2 }}>
          <strong style={{ color:"rgba(255,255,255,0.15)" }}>Sources :</strong> Scotese et al. (2021) · PAGES 2k Consortium (2019) · HadCRUT5 Met Office UK · NASA GISS · EPICA
        </div>
      </div>
    </div>
  )
}
