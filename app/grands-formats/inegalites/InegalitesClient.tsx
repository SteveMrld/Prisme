// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

const BGS = [
  { src:"/grands-formats/inegalites/02-ouvriers-nb.jpg",   kb:"kb1", yr:[1980,1985], label:"L'ère industrielle" },
  { src:"/grands-formats/inegalites/03-banlieue-70s.jpg",  kb:"kb2", yr:[1985,1990], label:"La classe moyenne" },
  { src:"/grands-formats/inegalites/04-trading-90s.jpg",   kb:"kb3", yr:[1990,2000], label:"La bascule financière" },
  { src:"/grands-formats/inegalites/01-usine-1980.jpg",    kb:"kb4", yr:[2000,2010], label:"La mondialisation" },
  { src:"/grands-formats/inegalites/05-inegalites-now.jpg",kb:"kb5", yr:[2010,2024], label:"Le monde d'aujourd'hui" },
]

// Top 10% — part du revenu national · WID / Chancel & Piketty 2021
const TOP10 = {
  USA:    [[1980,34],[1985,35],[1990,39],[1995,42],[2000,44],[2005,45],[2008,46],[2010,45],[2015,47],[2019,45],[2022,45]],
  France: [[1980,32],[1985,32],[1990,32],[1995,32],[2000,33],[2005,33],[2008,33],[2010,33],[2015,34],[2019,35],[2022,35]],
  Inde:   [[1980,31],[1985,32],[1990,33],[1995,35],[2000,38],[2005,43],[2008,50],[2010,52],[2015,55],[2019,57],[2022,58]],
  Chine:  [[1980,28],[1985,29],[1990,31],[1995,35],[2000,38],[2005,41],[2008,43],[2010,44],[2015,41],[2019,43],[2022,44]],
}

// Bottom 50% — part du revenu national · WID
const BOT50 = {
  USA:    [[1980,20],[1985,19],[1990,17],[1995,15],[2000,13],[2005,13],[2008,12],[2010,12],[2015,12],[2019,13],[2022,13]],
  France: [[1980,23],[1985,23],[1990,23],[1995,22],[2000,22],[2005,22],[2008,21],[2010,21],[2015,21],[2019,22],[2022,22]],
  Inde:   [[1980,24],[1985,23],[1990,22],[1995,21],[2000,19],[2005,16],[2008,14],[2010,13],[2015,13],[2019,13],[2022,13]],
  Chine:  [[1980,27],[1985,25],[1990,23],[1995,19],[2000,17],[2005,15],[2008,14],[2010,14],[2015,15],[2019,14],[2022,14]],
}

const PAYS = [
  { id:"USA",    label:"États-Unis", col:"#ef4444" },
  { id:"France", label:"France",     col:"#60a5fa" },
  { id:"Inde",   label:"Inde",       col:"#f97316" },
  { id:"Chine",  label:"Chine",      col:"#facc15" },
]

const EVENTS = [
  { yr:1980, label:"Reagan · Thatcher", note:"Déréglementation financière, recul de l'État-providence" },
  { yr:1991, label:"Chute de l'URSS",   note:"Mondialisation sans contrepoids idéologique" },
  { yr:2001, label:"Chine — OMC",       note:"750M de travailleurs chinois entrent dans l'économie mondiale" },
  { yr:2008, label:"Crise financière",  note:"Les États sauvent les banques. Les salaires stagnent." },
  { yr:2020, label:"Covid",             note:"Les actifs explosent. Les revenus du travail s'effondrent." },
]

function interp(series, yr) {
  if(yr<=series[0][0]) return series[0][1]
  if(yr>=series[series.length-1][0]) return series[series.length-1][1]
  for(let i=1;i<series.length;i++) {
    if(yr<=series[i][0]) {
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

function buildPath(data, xS, yS, currentYr) {
  const pts = data.filter(d=>d[0]<=currentYr)
  if(pts.length<1) return ""
  let d = `M${xS(pts[0][0])},${yS(pts[0][1])}`
  for(let i=1;i<pts.length;i++) d+=` L${xS(pts[i][0])},${yS(pts[i][1])}`
  if(pts.length>0 && currentYr < data[data.length-1][0]) {
    d += ` L${xS(currentYr)},${yS(interp(data, currentYr))}`
  }
  return d
}

export default function InegalitesClient() {
  const [prog, setP]    = useState(0)
  const [play, setPlay] = useState(false)
  const [bg, setBg]     = useState(0)
  const [mode, setMode] = useState("top10") // top10 | bot50
  const [activeEv, setActiveEv] = useState(null)
  const [ok, setOk]     = useState(false)
  const raf=useRef(null), last=useRef(null), pr=useRef(0)
  const DUR=22000
  const YR_START=1980, YR_END=2022

  useEffect(()=>{ setOk(true); setTimeout(()=>setPlay(true),400) },[])

  const tick=useCallback((ts)=>{
    if(!last.current) last.current=ts
    const dt=ts-last.current; last.current=ts
    const sp=pr.current>0.9?0.3:1
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

  const currentYr=YR_START+(YR_END-YR_START)*prog
  const DATA = mode==="top10" ? TOP10 : BOT50
  const YMIN = mode==="top10" ? 25 : 10
  const YMAX = mode==="top10" ? 62 : 28

  // SVG
  const W=860,H=220,PL=46,PR=60,PT=20,PB=36
  const cW=W-PL-PR, cH=H-PT-PB
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
        .ev-tooltip{position:absolute;background:rgba(4,6,13,0.92);border:1px solid rgba(255,255,255,0.12);padding:8px 12px;pointer-events:none;z-index:10;max-width:200px;}
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

      <div style={{position:"relative",zIndex:2,padding:"20px 32px 28px",display:"flex",flexDirection:"column",gap:12}}>

        {/* Titre */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:8,letterSpacing:4,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:8}}>
              Soara · World Inequality Database · Chancel &amp; Piketty 2021
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(18px,2.8vw,38px)",fontWeight:300,color:"#fff",margin:"0 0 4px",lineHeight:1.1}}>
              En 1980, ils étaient tous pareils.<br/><em style={{fontWeight:600}}>Depuis, leurs chemins ont divergé.</em>
            </h1>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(11px,1.3vw,15px)",fontWeight:300,color:"rgba(255,255,255,0.55)",margin:0}}>
              {mode==="top10"
                ? "Part du revenu national captée par les 10% les plus riches · 4 pays · 1980–2022"
                : "Part du revenu national captée par les 50% les plus pauvres · 4 pays · 1980–2022"}
            </p>
          </div>
          {/* Compteur live */}
          <div style={{textAlign:"right",flexShrink:0,background:"rgba(4,6,13,0.5)",border:"1px solid rgba(255,255,255,0.1)",padding:"10px 14px",backdropFilter:"blur(4px)"}}>
            <div style={{fontSize:7,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:6}}>
              {Math.round(currentYr)}
            </div>
            {PAYS.map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:3}}>
                <span style={{fontSize:8,color:p.col,letterSpacing:1}}>{p.label}</span>
                <strong style={{fontSize:9,color:p.col}}>{interp(DATA[p.id],currentYr).toFixed(1)}%</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Basculer top10 / bot50 */}
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          {[["top10","Top 10% — les plus riches"],["bot50","Bottom 50% — les plus pauvres"]].map(([k,l])=>(
            <button key={k} onClick={()=>setMode(k)} style={{
              background:mode===k?"rgba(255,255,255,0.12)":"none",
              border:`1px solid ${mode===k?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)"}`,
              color:mode===k?"#fff":"rgba(255,255,255,0.4)",
              fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:2,
              padding:"6px 12px",cursor:"pointer",textTransform:"uppercase",transition:"all 0.2s"
            }}>{l}</button>
          ))}
          {/* Légende pays */}
          <div style={{display:"flex",gap:12,marginLeft:"auto",flexWrap:"wrap"}}>
            {PAYS.map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:20,height:2,background:p.col,borderRadius:1}}/>
                <span style={{fontSize:7,color:"rgba(255,255,255,0.55)",letterSpacing:1}}>{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GRAPHIQUE */}
        <div style={{border:"1px solid rgba(255,255,255,0.15)",background:"rgba(4,6,13,0.35)",backdropFilter:"blur(4px)",position:"relative"}}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
            <defs>
              <filter id="gl"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="dg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Grid Y */}
            {(mode==="top10"?[25,30,35,40,45,50,55,60]:[10,13,16,19,22,25,28]).map(v=>(
              <g key={v}>
                <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)}
                  stroke={v===(mode==="top10"?35:22)?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.06)"}
                  strokeWidth={v===(mode==="top10"?35:22)?0.8:0.5}
                  strokeDasharray={v===(mode==="top10"?35:22)?"none":"3 8"}/>
                <text x={PL-6} y={yS(v)+4} textAnchor="end"
                  fill={v===(mode==="top10"?35:22)?"#fff":"rgba(255,255,255,0.4)"}
                  fontSize={8} fontFamily="'DM Mono',monospace">{v}%</text>
              </g>
            ))}

            {/* Label référence */}
            <text x={PL+4} y={yS(mode==="top10"?35:22)-5}
              fill="rgba(255,255,255,0.25)" fontSize={6.5} fontFamily="'DM Mono',monospace">
              niveau moyen 1980
            </text>

            {/* Événements */}
            {EVENTS.filter(e=>e.yr<=currentYr).map((ev,i)=>(
              <g key={i} style={{cursor:"pointer"}}
                onMouseEnter={()=>setActiveEv(ev)}
                onMouseLeave={()=>setActiveEv(null)}>
                <line x1={xS(ev.yr)} y1={PT} x2={xS(ev.yr)} y2={PT+cH}
                  stroke="rgba(255,255,255,0.15)" strokeWidth={0.7} strokeDasharray="3 6"/>
                <circle cx={xS(ev.yr)} cy={PT+cH+8} r={3} fill="rgba(255,255,255,0.2)"/>
                <text x={xS(ev.yr)} y={PT+cH+20} textAnchor="middle"
                  fill="rgba(255,255,255,0.35)" fontSize={5.5} fontFamily="'DM Mono',monospace">
                  {ev.label.split(" · ")[0]}
                </text>
              </g>
            ))}

            {/* X ticks */}
            {[1980,1990,2000,2010,2022].map(yr=>(
              <text key={yr} x={xS(yr)} y={PT+cH+30} textAnchor="middle"
                fill="rgba(255,255,255,0.3)" fontSize={7} fontFamily="'DM Mono',monospace">{yr}</text>
            ))}

            {/* Courbes */}
            <g filter="url(#gl)">
              {PAYS.map(p=>(
                <path key={p.id}
                  d={buildPath(DATA[p.id], xS, yS, currentYr)}
                  fill="none" stroke={p.col} strokeWidth={2.2}
                  strokeLinecap="round" strokeLinejoin="round"/>
              ))}
            </g>

            {/* Labels au bout des courbes */}
            {prog>0.05 && PAYS.map(p=>{
              const v=interp(DATA[p.id], Math.min(currentYr,YR_END))
              const x=xS(Math.min(currentYr,YR_END))
              return(
                <g key={p.id}>
                  <text x={x+6} y={yS(v)+4} fill={p.col} fontSize={8}
                    fontFamily="'DM Mono',monospace" fontWeight="bold">
                    {v.toFixed(0)}%
                  </text>
                </g>
              )
            })}

            {/* Dots */}
            {prog>0.01 && PAYS.map(p=>{
              const v=interp(DATA[p.id],Math.min(currentYr,YR_END))
              return(
                <g key={p.id} filter="url(#dg)">
                  <circle cx={xS(Math.min(currentYr,YR_END))} cy={yS(v)} r={4} fill={p.col} opacity={0.9}/>
                  <circle cx={xS(Math.min(currentYr,YR_END))} cy={yS(v)} r={1.8} fill="#fff" opacity={0.9}/>
                </g>
              )
            })}
          </svg>

          {/* Tooltip événement */}
          {activeEv && (
            <div style={{
              position:"absolute",bottom:48,left:`${(xS(activeEv.yr)/W)*100}%`,
              transform:"translateX(-50%)",
              background:"rgba(4,6,13,0.95)",border:"1px solid rgba(255,255,255,0.15)",
              padding:"8px 12px",maxWidth:200,zIndex:10,pointerEvents:"none"
            }}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"rgba(255,255,255,0.5)",marginBottom:4,letterSpacing:2}}>
                {activeEv.yr} · {activeEv.label}
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:12,color:"rgba(255,255,255,0.8)",lineHeight:1.5}}>
                {activeEv.note}
              </div>
            </div>
          )}
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

        {/* Encadré divergence */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
          <div style={{background:"rgba(4,6,13,0.55)",backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.1)",padding:"12px 14px"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"rgba(255,255,255,0.3)",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>
              Pourquoi 1980 ?
            </div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(11px,1.3vw,14px)",fontWeight:300,color:"#fff",margin:0,lineHeight:1.7}}>
              Reagan et Thatcher instaurent la déréglementation financière, baissent les impôts sur le capital, affaiblissent les syndicats. Le compromis keynésien de l'après-guerre — croissance partagée, État-providence — est abandonné simultanément dans la plupart des pays développés.
            </p>
          </div>
          <div style={{background:"rgba(4,6,13,0.55)",backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.1)",padding:"12px 14px"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"rgba(255,255,255,0.3)",letterSpacing:2,marginBottom:6,textTransform:"uppercase"}}>
              Ce que dit la divergence
            </div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(11px,1.3vw,14px)",fontWeight:300,color:"#fff",margin:0,lineHeight:1.7}}>
              La France reste à <strong style={{color:"#60a5fa"}}>35%</strong>. L'Inde atteint <strong style={{color:"#f97316"}}>58%</strong>. L'écart n'est pas économique — les deux pays ont connu une forte croissance. Il est <strong>politique</strong> : fiscalité, redistribution, rapport de force capital/travail.
            </p>
          </div>
        </div>

        {/* Sources */}
        <div style={{fontSize:7,color:"rgba(255,255,255,0.18)",lineHeight:1.8,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:6}}>
          World Inequality Database (WID.world) · Chancel &amp; Piketty (2021) · World Inequality Report 2022 · Part du revenu national avant impôts
        </div>
      </div>
    </div>
  )
}
