// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

// ── FONDS PAR PÉRIODE ────────────────────────────────────────────────────────
const BGS = [
  { src:"/grands-formats/inegalites/02-ouvriers-nb.jpg",  kb:"kb1", yr:[1980,1985], label:"L'ère industrielle" },
  { src:"/grands-formats/inegalites/03-banlieue-70s.jpg", kb:"kb2", yr:[1985,1990], label:"La classe moyenne" },
  { src:"/grands-formats/inegalites/04-trading-90s.jpg",  kb:"kb3", yr:[1990,2000], label:"La bascule financière" },
  { src:"/grands-formats/inegalites/01-usine-1980.jpg",   kb:"kb4", yr:[2000,2010], label:"La mondialisation" },
  { src:"/grands-formats/inegalites/05-inegalites-now.jpg",kb:"kb5",yr:[2010,2024], label:"Le monde d'aujourd'hui" },
]

// ── DONNÉES WID — Top 10% part du revenu national ────────────────────────────
// Source : World Inequality Database / Chancel & Piketty 2021 / WIR 2022
const DATA = {
  USA:    [[1980,34],[1985,35],[1990,39],[1995,42],[2000,44],[2005,45],[2008,46],[2010,45],[2015,47],[2019,45],[2022,45]],
  France: [[1980,32],[1985,32],[1990,32],[1995,32],[2000,33],[2005,33],[2008,33],[2010,33],[2015,34],[2019,35],[2022,35]],
  Inde:   [[1980,31],[1985,32],[1990,33],[1995,35],[2000,38],[2005,43],[2008,50],[2010,52],[2015,55],[2019,57],[2022,58]],
  Chine:  [[1980,28],[1985,29],[1990,31],[1995,35],[2000,38],[2005,41],[2008,43],[2010,44],[2015,41],[2019,43],[2022,44]],
}

const PAYS = [
  { id:"USA",    label:"États-Unis", col:"#ef4444" },
  { id:"France", label:"France",     col:"#60a5fa" },
  { id:"Inde",   label:"Inde",       col:"#f97316" },
  { id:"Chine",  label:"Chine",      col:"#facc15" },
]

const EVENTS = [
  { yr:1980, label:"Reagan · Thatcher" },
  { yr:1991, label:"Chute de l'URSS" },
  { yr:2001, label:"Chine — OMC" },
  { yr:2008, label:"Crise financière" },
  { yr:2020, label:"Covid" },
]

function interp(series, yr) {
  if (yr <= series[0][0]) return series[0][1]
  if (yr >= series[series.length-1][0]) return series[series.length-1][1]
  for (let i=1;i<series.length;i++) {
    if (yr <= series[i][0]) {
      const t=(yr-series[i-1][0])/(series[i][0]-series[i-1][0])
      return series[i-1][1]+(series[i][1]-series[i-1][1])*t
    }
  }
  return series[series.length-1][1]
}

function gBg(yr) {
  for(let i=0;i<BGS.length;i++) if(yr>=BGS[i].yr[0]&&yr<=BGS[i].yr[1]) return i
  return BGS.length-1
}

export default function InegalitesClient() {
  const [prog, setP]      = useState(0)
  const [play, setPlay]   = useState(false)
  const [bg, setBg]       = useState(0)
  const [ok, setOk]       = useState(false)
  const raf=useRef(null), last=useRef(null), pr=useRef(0)
  const DUR=22000
  const YR_START=1980, YR_END=2022

  useEffect(()=>{ setOk(true); setTimeout(()=>setPlay(true),400) },[])

  const tick=useCallback((ts)=>{
    if(!last.current) last.current=ts
    const dt=ts-last.current; last.current=ts
    const sp = pr.current>0.9?0.3:1
    pr.current=Math.min(pr.current+(dt/DUR)*sp,1)
    const yr=YR_START+(YR_END-YR_START)*pr.current
    setBg(gBg(yr)); setP(pr.current)
    if(pr.current<1) raf.current=requestAnimationFrame(tick)
    else setPlay(false)
  },[])

  useEffect(()=>{
    if(play){last.current=null;raf.current=requestAnimationFrame(tick)}
    else cancelAnimationFrame(raf.current)
    return()=>cancelAnimationFrame(raf.current)
  },[play,tick])

  const onPlay=()=>{
    if(pr.current>=1){pr.current=0;setP(0);setBg(0)}
    setPlay(x=>!x)
  }
  const onSlide=(e)=>{
    pr.current=Number(e.target.value)
    const yr=YR_START+(YR_END-YR_START)*pr.current
    setBg(gBg(yr)); setP(pr.current); setPlay(false)
  }

  const currentYr = YR_START+(YR_END-YR_START)*prog

  // SVG
  const W=860,H=220,PL=46,PR=12,PT=18,PB=36
  const cW=W-PL-PR, cH=H-PT-PB
  const YMIN=25, YMAX=62
  const xS=(yr)=>PL+(yr-YR_START)/(YR_END-YR_START)*cW
  const yS=(v)=>PT+cH-(v-YMIN)/(YMAX-YMIN)*cH

  if(!ok) return null

  return (
    <div style={{background:"#04060d",minHeight:"100vh",color:"#fff",fontFamily:"'DM Mono',monospace",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb1{from{transform:scale(1.0)translate(0,0)}to{transform:scale(1.18)translate(-3%,-2%)}}
        @keyframes kb2{from{transform:scale(1.05)translate(2%,0)}to{transform:scale(1.2)translate(-2%,-1%)}}
        @keyframes kb3{from{transform:scale(1.0)translate(-2%,1%)}to{transform:scale(1.16)translate(2%,-2%)}}
        @keyframes kb4{from{transform:scale(1.1)translate(1%,-1%)}to{transform:scale(1.0)translate(-2%,1%)}}
        @keyframes kb5{from{transform:scale(1.05)translate(-1%,1%)}to{transform:scale(1.18)translate(2%,-2%)}}
      `}</style>

      {/* FOND KB */}
      {BGS.map((b,i)=>(
        <div key={i} style={{
          position:"fixed",inset:0,zIndex:0,
          backgroundImage:`url(${b.src})`,backgroundSize:"cover",backgroundPosition:"center",
          opacity:i===bg?0.82:0,transition:"opacity 2.5s ease",
          filter:"brightness(0.65) saturate(0.9)",
          animation:`${b.kb} 22s ease-in-out infinite alternate`,
        }}/>
      ))}
      <div style={{position:"fixed",inset:0,zIndex:1,background:"rgba(4,6,13,0.32)"}}/>

      {/* CONTENU */}
      <div style={{position:"relative",zIndex:2,padding:"20px 32px 28px",display:"flex",flexDirection:"column",gap:12}}>

        {/* Titre */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div>
            <div style={{fontSize:8,letterSpacing:4,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:8}}>
              Soara · World Inequality Database · Chancel & Piketty 2021
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,40px)",fontWeight:300,color:"#fff",margin:"0 0 4px",lineHeight:1.1}}>
              En 1980, ils étaient tous pareils.<br/><em style={{fontWeight:600}}>Depuis, leurs chemins ont divergé.</em>
            </h1>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(12px,1.4vw,16px)",fontWeight:300,color:"rgba(255,255,255,0.6)",margin:0}}>
              Part du revenu national captée par les 10% les plus riches · 4 pays · 1980–2022
            </p>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.4)",marginBottom:4}}>
              {Math.round(currentYr)}
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:"clamp(8px,1vw,11px)",display:"flex",flexDirection:"column",gap:2}}>
              {PAYS.map(p=>(
                <div key={p.id} style={{color:p.col,letterSpacing:1}}>
                  {p.label} : <strong>{interp(DATA[p.id],currentYr).toFixed(1)}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Légende pays */}
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {PAYS.map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:24,height:2,background:p.col,borderRadius:1}}/>
              <span style={{fontSize:8,color:"rgba(255,255,255,0.6)",letterSpacing:1}}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* GRAPHIQUE */}
        <div style={{border:"1px solid rgba(255,255,255,0.15)",background:"rgba(4,6,13,0.35)",backdropFilter:"blur(4px)"}}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
            <defs>
              <filter id="gl"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="dg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              {PAYS.map(p=>(
                <filter key={p.id} id={`gl-${p.id}`}>
                  <feGaussianBlur stdDeviation="1" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              ))}
            </defs>

            {/* Grid Y */}
            {[25,30,35,40,45,50,55,60].map(v=>(
              <g key={v}>
                <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)}
                  stroke={v===35?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.06)"}
                  strokeWidth={v===35?0.8:0.5} strokeDasharray={v===35?"none":"3 8"}/>
                <text x={PL-6} y={yS(v)+4} textAnchor="end"
                  fill={v===35?"#fff":"rgba(255,255,255,0.4)"}
                  fontSize={8} fontFamily="'DM Mono',monospace">
                  {v}%
                </text>
              </g>
            ))}

            {/* Annotation 35% */}
            <text x={PL+cW-2} y={yS(35)-4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={6.5} fontFamily="'DM Mono',monospace">
              niveau moyen 1980
            </text>

            {/* Événements */}
            {EVENTS.filter(e=>e.yr<=currentYr).map((ev,i)=>(
              <g key={i}>
                <line x1={xS(ev.yr)} y1={PT} x2={xS(ev.yr)} y2={PT+cH}
                  stroke="rgba(255,255,255,0.12)" strokeWidth={0.6} strokeDasharray="3 6"/>
                <text x={xS(ev.yr)+3} y={PT+10} fill="rgba(255,255,255,0.3)" fontSize={6} fontFamily="'DM Mono',monospace">
                  {ev.label}
                </text>
              </g>
            ))}

            {/* X ticks */}
            {[1980,1985,1990,1995,2000,2005,2010,2015,2020,2022].map(yr=>(
              <g key={yr}>
                <line x1={xS(yr)} y1={PT+cH} x2={xS(yr)} y2={PT+cH+4} stroke="rgba(255,255,255,0.2)"/>
                <text x={xS(yr)} y={PT+cH+16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={7} fontFamily="'DM Mono',monospace">{yr}</text>
              </g>
            ))}

            {/* Courbes */}
            <g filter="url(#gl)">
              {PAYS.map(p=>{
                const pts=DATA[p.id].filter(d=>d[0]<=currentYr)
                if(pts.length<2) return null
                let d=`M${xS(pts[0][0])},${yS(pts[0][1])}`
                for(let i=1;i<pts.length;i++) d+=` L${xS(pts[i][0])},${yS(pts[i][1])}`
                // Interpoler jusqu'au curseur
                const lastPt=pts[pts.length-1]
                const nextIdx=DATA[p.id].findIndex(d=>d[0]>lastPt[0])
                if(nextIdx>0&&currentYr<DATA[p.id][nextIdx][0]) {
                  const cv=interp(DATA[p.id],currentYr)
                  d+=` L${xS(currentYr)},${yS(cv)}`
                }
                return <path key={p.id} d={d} fill="none" stroke={p.col} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
              })}
            </g>

            {/* Dots têtes */}
            {PAYS.map(p=>{
              if(prog<0.01) return null
              const v=interp(DATA[p.id],Math.min(currentYr,YR_END))
              return(
                <g key={p.id} filter="url(#dg)">
                  <circle cx={xS(Math.min(currentYr,YR_END))} cy={yS(v)} r={4} fill={p.col} opacity={0.9}/>
                  <circle cx={xS(Math.min(currentYr,YR_END))} cy={yS(v)} r={1.8} fill="#fff" opacity={0.9}/>
                </g>
              )
            })}

          </svg>
        </div>

        {/* Contrôles */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onPlay} style={{background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:3,padding:"7px 14px",cursor:"pointer",textTransform:"uppercase",flexShrink:0}}>
            {play?"⏸ Pause":prog>=1?"↺ Rejouer":"▶ Play"}
          </button>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.3)",flexShrink:0}}>1980</span>
          <input type="range" min={0} max={1} step={0.001} value={prog} onChange={onSlide} style={{flex:1,accentColor:"#c9a84c",cursor:"pointer"}}/>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.3)",flexShrink:0}}>2022</span>
        </div>

        {/* Fond contextuel */}
        <div style={{background:"rgba(4,6,13,0.5)",backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.1)",padding:"12px 16px"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"rgba(255,255,255,0.3)",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>
            {BGS[bg]?.label} · {Math.round(currentYr)}
          </div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(12px,1.5vw,16px)",fontWeight:300,color:"#fff",margin:0,lineHeight:1.7}}>
            En 1980, les quatre pays captaient tous entre <strong style={{fontWeight:600}}>28% et 34%</strong> du revenu national pour leur top 10%. Depuis, leurs trajectoires ont divergé. L'Inde a atteint <strong style={{fontWeight:600,color:"#f97316"}}>58%</strong> en 2022. La France est restée à <strong style={{fontWeight:600,color:"#60a5fa"}}>35%</strong>. La différence n'est pas économique — elle est <strong style={{fontWeight:600}}>politique</strong>.
          </p>
        </div>

        {/* Sources */}
        <div style={{fontSize:7,color:"rgba(255,255,255,0.18)",lineHeight:1.8,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:6}}>
          World Inequality Database (WID.world) · Chancel & Piketty (2021) · World Inequality Report 2022 · Part du revenu national avant impôts captée par le décile supérieur
        </div>
      </div>
    </div>
  )
}
