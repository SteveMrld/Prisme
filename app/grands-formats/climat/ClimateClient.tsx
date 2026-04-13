// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

const BACKGROUNDS = [
  { src:"/grands-formats/climat/01-ocean-cambrien.jpg",    kb:"kb1", maRange:[500, 420] },
  { src:"/grands-formats/climat/02-glacier-ordovicien.jpg", kb:"kb2", maRange:[420, 300] },
  { src:"/grands-formats/climat/03-jungle-cretace.jpg",    kb:"kb3", maRange:[300, 66]  },
  { src:"/grands-formats/climat/04-volcan-permien.jpg",    kb:"kb4", maRange:[66, 2.5]  },
  { src:"/grands-formats/climat/05-glace-glaciaire.jpg",   kb:"kb5", maRange:[2.5, 0.0005] },
  { src:"/grands-formats/climat/06-hiver-petitAge.jpg",    kb:"kb6", maRange:[0.0005, 0] },
]

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
  { label:"Ordovicien",    duration:500000, delta:8,   col:"#7dd3fc", note:"−8°C en 500 000 ans" },
  { label:"Fin-Permien",  duration:60000,  delta:9,   col:"#fb923c", note:"+9°C en 60 000 ans" },
  { label:"PETM",         duration:20000,  delta:5,   col:"#f87171", note:"+5°C en 20 000 ans" },
  { label:"Post-glaciaire",duration:10000, delta:6,   col:"#93c5fd", note:"+6°C en 10 000 ans" },
  { label:"Aujourd'hui",  duration:150,    delta:1.62,col:"#dc2626", note:"+1,6°C en 150 ans", current:true },
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

export default function ClimateClient() {
  const [prog, setProg]         = useState(0)
  const [playing, setPlaying]   = useState(false)
  // reveal supprimé — section toujours visible
  const [activeBg, setActiveBg] = useState(0)
  const [mounted, setMounted]   = useState(false)
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
    progRef.current = Math.min(progRef.current + dt/DURATION, 1)
    const ma = 500*(1-progRef.current)
    for (let i=0;i<BACKGROUNDS.length;i++) {
      if (ma<=BACKGROUNDS[i].maRange[0] && ma>=BACKGROUNDS[i].maRange[1]) {
        setActiveBg(i); break
      }
    }
    setProg(progRef.current)
    if (progRef.current<1) rafRef.current = requestAnimationFrame(tick)
    else { setPlaying(false); }
  }, [])

  useEffect(() => {
    if (playing) { lastRef.current=null; rafRef.current=requestAnimationFrame(tick) }
    else cancelAnimationFrame(rafRef.current)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing, tick])

  const handlePlay = () => {
    if (progRef.current>=1) { progRef.current=0; setProg(0); setReveal(false); setActiveBg(0) }
    setPlaying(p=>!p)
  }
  const handleSlide = (e) => {
    progRef.current=Number(e.target.value)
    const ma=500*(1-progRef.current)
    for(let i=0;i<BACKGROUNDS.length;i++) {
      if(ma<=BACKGROUNDS[i].maRange[0]&&ma>=BACKGROUNDS[i].maRange[1]){setActiveBg(i);break}
    }
    setProg(progRef.current); setPlaying(false)
    
  }

  const currentMa = 500*(1-prog)
  const currentT  = getTemp(currentMa)
  const currentBg = BACKGROUNDS[activeBg]

  // SVG chart
  const W=900,H=380,PL=50,PR=16,PT=32,PB=48
  const cW=W-PL-PR,cH=H-PT-PB
  const xLog=(ma)=>{
    const lm=Math.log10(Math.max(ma,1e-8))
    return PL+(lm-Math.log10(1e-8))/(Math.log10(500)-Math.log10(1e-8))*cW
  }
  const yS=(t)=>PT+cH-(t-(-7))/(11-(-7))*cH

  const segments=[]
  for(let i=1;i<GEO.length;i++){
    if(GEO[i][0]>currentMa) continue
    const ma1=GEO[i-1][0],ma2=GEO[i][0]
    const steps=Math.max(2,Math.ceil((ma1-ma2)/0.8))
    for(let s=0;s<steps;s++){
      const m1=ma1-(ma1-ma2)*s/steps
      const m2=ma1-(ma1-ma2)*(s+1)/steps
      if(m2>currentMa) break
      const t1=getTemp(m1),t2=getTemp(m2)
      segments.push({x1:xLog(m1),y1:yS(t1),x2:xLog(m2),y2:yS(t2),col:tc((t1+t2)/2)})
    }
  }
  const hx=xLog(Math.max(currentMa,1e-8)), hy=yS(currentT)
  const xLabels=[[500,"500 Ma"],[100,"100 Ma"],[10,"10 Ma"],[1,"1 Ma"],[0.1,"100 ka"],[0.01,"10 ka"],[0.001,"1 000 ans"]]

  if (!mounted) return null

  return (
    <div style={{ minHeight:"100vh", background:"#04060d", color:"#e8e4de", fontFamily:"'DM Mono',monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb1{from{transform:scale(1.0) translate(0%,0%)}   to{transform:scale(1.18) translate(-3%,-2%)}}
        @keyframes kb2{from{transform:scale(1.05) translate(2%,0%)}  to{transform:scale(1.20) translate(-2%,-1%)}}
        @keyframes kb3{from{transform:scale(1.0) translate(-2%,1%)}  to{transform:scale(1.16) translate(2%,-2%)}}
        @keyframes kb4{from{transform:scale(1.1) translate(1%,-1%)}  to{transform:scale(1.0) translate(-2%,1%)}}
        @keyframes kb5{from{transform:scale(1.0) translate(3%,0%)}   to{transform:scale(1.18) translate(-3%,-1%)}}
        @keyframes kb6{from{transform:scale(1.05) translate(-1%,1%)} to{transform:scale(1.18) translate(2%,-2%)}}
        @keyframes draw-line{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
        @keyframes draw-vert{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
        .line-anim{stroke-dasharray:300;stroke-dashoffset:300;animation:draw-line 1.8s ease-out forwards}
        .line-vert{stroke-dasharray:200;stroke-dashoffset:200;animation:draw-vert 0.6s ease-out forwards}
      `}</style>

      {/* ── HERO SECTION avec fond Ken Burns ─────────────────────────────── */}
      <div style={{ position:"relative", minHeight:"92vh", overflow:"hidden", display:"flex", flexDirection:"column" }}>

        {/* Images Ken Burns empilées */}
        {BACKGROUNDS.map((bg,i) => (
          <div key={i} style={{
            position:"absolute", inset:0,
            backgroundImage:`url(${bg.src})`,
            backgroundSize:"cover", backgroundPosition:"center",
            opacity: i===activeBg ? 1 : 0,
            transition:"opacity 2.5s ease",
            filter:"brightness(0.55) saturate(0.9)",
            animation:`${bg.kb} 22s ease-in-out infinite alternate`,
            willChange:"transform",
          }}/>
        ))}

        {/* Gradient bas vers la page */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(4,6,13,0.2) 0%, rgba(4,6,13,0.5) 70%, #04060d 100%)", zIndex:1 }}/>

        {/* Contenu header */}
        <div style={{ position:"relative", zIndex:2, padding:"52px 48px 40px", flex:1, display:"flex", flexDirection:"column", justifyContent:"flex-end" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:5, color:"rgba(255,255,255,0.3)", textTransform:"uppercase", marginBottom:20 }}>
            Soara · Environnement · Scotese 2021 · HadCRUT5 · NASA GISS
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:32, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,5.5vw,72px)", fontWeight:300, color:"#f0ede8", margin:"0 0 10px", lineHeight:1.05 }}>
                La Terre a toujours changé<br/><em style={{ fontWeight:600 }}>de température.</em>
              </h1>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(15px,2vw,24px)", fontWeight:300, color:"#dc2626", margin:0 }}>
                Ce qui est sans précédent, c'est la vitesse.
              </p>
            </div>
            <div style={{ textAlign:"right", paddingBottom:4, flexShrink:0 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:3, color:"rgba(255,255,255,0.25)", marginBottom:6 }}>
                {currentMa>1?`il y a ${Math.round(currentMa)} Ma`:currentMa>0.001?`il y a ${Math.round(currentMa*1000)} 000 ans`:"aujourd'hui"}
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(44px,6vw,82px)", fontWeight:700, lineHeight:1, color:tc(currentT), letterSpacing:"-2px", textShadow:`0 0 50px ${tc(currentT)}66`, transition:"color 0.4s" }}>
                {currentT>=0?"+":""}{currentT.toFixed(2)}<span style={{ fontSize:"0.4em", fontWeight:300, opacity:0.6 }}>°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRAPHIQUE ────────────────────────────────────────────────────── */}
      <div style={{ padding:"0 48px 32px", background:"#04060d" }}>
        <div style={{ border:"1px solid rgba(255,255,255,0.07)", background:"rgba(8,12,24,0.9)" }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", display:"block" }}>
            <defs>
              <filter id="gl"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="dgl" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            {[-4,-2,0,2,4,6,8].map(v=>(
              <g key={v}>
                <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)} stroke={v===0?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)"} strokeWidth={v===0?0.8:0.5} strokeDasharray={v===0?"none":"2 8"}/>
                <text x={PL-7} y={yS(v)+4} textAnchor="end" fill={v===0?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.06)"} fontSize={9} fontFamily="'DM Mono',monospace">{v>=0?`+${v}`:v}°</text>
              </g>
            ))}
            <line x1={PL} y1={yS(1.62)} x2={PL+cW} y2={yS(1.62)} stroke="#dc2626" strokeWidth={0.7} strokeDasharray="5 6" strokeOpacity={0.4}/>
            {xLabels.map(([ma,l])=>(
              <g key={ma}>
                <line x1={xLog(ma)} y1={PT+cH} x2={xLog(ma)} y2={PT+cH+5} stroke="rgba(255,255,255,0.05)"/>
                <text x={xLog(ma)} y={PT+cH+18} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={7.5} fontFamily="'DM Mono',monospace">{l}</text>
              </g>
            ))}
            <g filter="url(#gl)">
              {segments.map((s,i)=>(
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.col} strokeWidth={2.2} strokeLinecap="round"/>
              ))}
            </g>
            {prog>0.005&&(
              <g filter="url(#dgl)">
                <circle cx={hx} cy={hy} r={5} fill={tc(currentT)} opacity={0.9}/>
                <circle cx={hx} cy={hy} r={2.5} fill="#fff" opacity={0.85}/>
              </g>
            )}
          </svg>
        </div>

        {/* Contrôles */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:14, marginBottom:0 }}>
          <button onClick={handlePlay} style={{ background:"none", border:"1px solid rgba(255,255,255,0.15)", color:"#e8e4de", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:3, padding:"10px 22px", cursor:"pointer", textTransform:"uppercase", flexShrink:0 }}>
            {playing?"⏸ Pause":prog>=1?"↺ Rejouer":"▶ Play"}
          </button>
          <input type="range" min={0} max={1} step={0.0005} value={prog} onChange={handleSlide} style={{ flex:1, accentColor:"#c9a84c", cursor:"pointer" }}/>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.2)", flexShrink:0 }}>maintenant</span>
        </div>
      </div>

      {/* ── COMPARAISON DES VITESSES ─────────────────────────────────────── */}
      <div style={{ padding:"48px 48px 80px", background:"#04060d", opacity:1 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,3.5vw,44px)", fontWeight:300, color:"#f0ede8", margin:"0 0 8px", lineHeight:1.15 }}>
          Ces cinq réchauffements, vus à la <em style={{ fontWeight:600 }}>même échelle de temps.</em>
        </h2>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(13px,1.6vw,17px)", color:"rgba(255,255,255,0.3)", margin:"0 0 32px" }}>
          Chaque panneau représente 150 ans. Axe vertical identique.
        </p>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:3, marginBottom:44 }}>
          {SLOPES.map((s,idx)=>{
            const PW=160,PH=200,PPL=10,PPR=8,PPT=18,PPB=28
            const pcW=PW-PPL-PPR,pcH=PH-PPT-PPB
            const T0=-0.5,T1=2.0
            const pys=(t)=>PPT+pcH-(t-T0)/(T1-T0)*pcH
            const endT=Math.min(T1-0.05,(s.delta/s.duration)*150)
            const isNow=s.current
            return (
              <div key={idx} style={{ background:isNow?"rgba(30,5,5,0.95)":"rgba(8,12,24,0.95)", border:`1px solid ${isNow?"rgba(220,38,38,0.3)":"rgba(255,255,255,0.07)"}` }}>
                <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" style={{ display:"block" }}>
                  <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(0)} stroke="rgba(255,255,255,0.07)" strokeWidth={0.8}/>
                  <line x1={PPL} y1={pys(1.5)} x2={PPL+pcW} y2={pys(1.5)} stroke="#dc2626" strokeWidth={0.5} strokeDasharray="2 4" strokeOpacity={0.2}/>
                  {[0,1.0,2.0].map(v=>(
                    <text key={v} x={PPL-2} y={pys(v)+3} textAnchor="end" fill="rgba(255,255,255,0.1)" fontSize={6} fontFamily="'DM Mono',monospace">{v>0?`+${v}`:v}°</text>
                  ))}
                  {isNow?(
                    <>
                      <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)} stroke={s.col} strokeWidth={3.5} strokeLinecap="round" strokeDasharray="200" style={{animation:"draw-vert 0.5s ease-out 1s forwards", strokeDashoffset:200}}/>
                      <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)} stroke={s.col} strokeWidth={10} strokeOpacity={0.15}/>
                    </>
                  ):(
                    <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(endT)} stroke={s.col} strokeWidth={1.5} strokeOpacity={0.8} strokeDasharray="300" style={{animation:`draw-line ${0.8+idx*0.3}s ease-out ${idx*0.2}s forwards`, strokeDashoffset:300}}/>
                  )}
                  <text x={PPL+pcW*0.5} y={PH-PPB+14} textAnchor="middle" fill={isNow?s.col:"rgba(255,255,255,0.35)"} fontSize={isNow?9:8} fontFamily="'Cormorant Garamond',serif" fontWeight={isNow?700:300}>
                    {isNow?`+${s.delta}°C`:`+${endT.toFixed(endT<0.01?5:3)}°C`}
                  </text>
                  <text x={PPL+pcW*0.5} y={PH-PPB+23} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={6.5} fontFamily="'DM Mono',monospace">en 150 ans</text>
                </svg>
                <div style={{ padding:"10px 8px 12px", borderTop:"1px solid rgba(255,255,255,0.05)", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:isNow?700:300, fontSize:"clamp(11px,1.3vw,14px)", color:isNow?"#ef4444":"rgba(255,255,255,0.7)", lineHeight:1.3, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, color:"rgba(255,255,255,0.2)" }}>{s.note}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ borderLeft:"3px solid #dc2626", paddingLeft:24, marginBottom:44 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(15px,2vw,22px)", fontWeight:300, color:"#e8e4de", margin:"0 0 10px", lineHeight:1.8 }}>
            Le réchauffement actuel est <strong style={{ fontWeight:700, color:"#ef4444" }}>18 fois plus rapide</strong> que le PETM — l'événement naturel le plus brutal de l'histoire de la vie complexe sur Terre.
          </p>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(13px,1.6vw,17px)", fontWeight:300, color:"rgba(255,255,255,0.3)", margin:0, lineHeight:1.8 }}>
            Ce n'est pas l'amplitude qui est sans précédent. C'est la vitesse à laquelle les écosystèmes — et les civilisations — doivent s'adapter.
          </p>
        </div>

        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8.5, color:"rgba(255,255,255,0.12)", lineHeight:2 }}>
          <strong style={{ color:"rgba(255,255,255,0.18)" }}>Sources :</strong> Scotese et al. (2021) · PAGES 2k Consortium (2019) · HadCRUT5 Met Office UK · NASA GISS · Carottes glaciaires EPICA
        </div>
      </div>
    </div>
  )
}
