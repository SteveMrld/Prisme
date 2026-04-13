// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

const BGS = [
  { src:"/grands-formats/climat/01-ocean-cambrien.jpg",  kb:"kb1", r:[500,300] },
  { src:"/grands-formats/climat/03-jungle-cretace.jpg",  kb:"kb3", r:[300,66]  },
  { src:"/grands-formats/climat/04-volcan-permien.jpg",  kb:"kb4", r:[66,2.5]  },
  { src:"/grands-formats/climat/05-glace-glaciaire.jpg", kb:"kb5", r:[2.5,0.001] },
  { src:"/grands-formats/climat/06-hiver-petitAge.jpg",  kb:"kb6", r:[0.001,0] },
]

const GEO = [
  [500,6.2],[480,4.2],[460,1.5],[445,-4.8],[440,-3.5],[430,1.5],
  [420,4.2],[400,5.2],[380,4.2],[360,2.2],[340,0.0],[330,-1.5],
  [310,-3.2],[290,1.2],[270,3.5],[252,9.8],[240,7.5],[220,5.8],
  [200,4.8],[180,5.8],[160,6.5],[100,9.2],[90,8.8],[70,7.0],[66,6.5],
  [55.5,8.2],[50,6.2],[40,4.2],[34,2.2],[20,2.5],[10,1.5],[5,1.0],
  [2.8,-0.8],[2.5,-2.5],[1.0,-1.8],[0.6,-3.2],[0.020,-5.8],
  [0.010,-1.2],[0.008,0.1],[0.003,-0.2],[0.00050,-0.22],
  [0.00015,-0.08],[0.00010,0.0],[0.00004,0.22],[0.00002,0.37],
  [0.000005,0.68],[0.0000008,1.15],[0.00000001,1.62],
]

const SLOPES = [
  { l:"Ordovicien",    d:500000, v:8,   c:"#7dd3fc", n:"500 000 ans" },
  { l:"Fin-Permien",  d:60000,  v:9,   c:"#fb923c", n:"60 000 ans" },
  { l:"PETM",         d:20000,  v:5,   c:"#f87171", n:"20 000 ans" },
  { l:"Post-glaciaire",d:10000, v:6,   c:"#93c5fd", n:"10 000 ans" },
  { l:"Aujourd'hui",  d:150,    v:1.62,c:"#dc2626", n:"150 ans", now:true },
]

function gT(ma) {
  for(let i=1;i<GEO.length;i++) {
    if(ma>=GEO[i][0]) {
      const t=(ma-GEO[i-1][0])/(GEO[i][0]-GEO[i-1][0])
      return GEO[i-1][1]+(GEO[i][1]-GEO[i-1][1])*t
    }
  }
  return GEO[GEO.length-1][1]
}
function col(v) {
  const s=[[-6,[100,180,255]],[-3,[140,200,240]],[-1,[180,210,225]],
    [0,[205,190,160]],[1,[245,185,95]],[2,[230,135,55]],
    [4,[210,75,35]],[6,[180,30,20]],[8,[130,8,8]],[10,[80,0,0]]]
  for(let i=1;i<s.length;i++) {
    if(v<=s[i][0]) {
      const t=(v-s[i-1][0])/(s[i][0]-s[i-1][0])
      const [r,g,b]=s[i-1][1].map((c,j)=>Math.round(c+(s[i][1][j]-c)*t))
      return `rgb(${r},${g},${b})`
    }
  }
  return "rgb(80,0,0)"
}
function gBg(ma) {
  for(let i=0;i<BGS.length;i++) if(ma<=BGS[i].r[0]&&ma>=BGS[i].r[1]) return i
  return BGS.length-1
}
function gSl(ma) {
  if(ma>420) return 0; if(ma>66) return 1; if(ma>2.5) return 2
  if(ma>0.001) return 3; return 4
}

export default function CC() {
  const [p,setP]=useState(0)
  const [play,setPlay]=useState(false)
  const [bg,setBg]=useState(0)
  const [sl,setSl]=useState(0)
  const [ok,setOk]=useState(false)
  const raf=useRef(null), last=useRef(null), pr=useRef(0)
  const DUR=28000

  useEffect(()=>{setOk(true);setTimeout(()=>setPlay(true),400)},[])

  const tick=useCallback((ts)=>{
    if(!last.current) last.current=ts
    const dt=ts-last.current; last.current=ts
    const sp=pr.current>0.88?0.22:1
    pr.current=Math.min(pr.current+(dt/DUR)*sp,1)
    const ma=500*(1-pr.current)
    setBg(gBg(ma)); setSl(gSl(ma)); setP(pr.current)
    if(pr.current<1) raf.current=requestAnimationFrame(tick)
    else setPlay(false)
  },[])

  useEffect(()=>{
    if(play){last.current=null;raf.current=requestAnimationFrame(tick)}
    else cancelAnimationFrame(raf.current)
    return()=>cancelAnimationFrame(raf.current)
  },[play,tick])

  const onPlay=()=>{
    if(pr.current>=1){pr.current=0;setP(0);setBg(0);setSl(0)}
    setPlay(x=>!x)
  }
  const onSlide=(e)=>{
    pr.current=Number(e.target.value)
    const ma=500*(1-pr.current)
    setBg(gBg(ma));setSl(gSl(ma));setP(pr.current);setPlay(false)
  }

  const ma=500*(1-p), t=gT(ma)

  // SVG courbe
  const W=820,H=180,PL=46,PR=10,PT=14,PB=28
  const cW=W-PL-PR,cH=H-PT-PB
  const xL=(m)=>PL+(Math.log10(Math.max(m,5e-9))-Math.log10(5e-9))/(Math.log10(500)-Math.log10(5e-9))*cW
  const yS=(v)=>PT+cH-(v-(-7))/(11-(-7))*cH

  const segs=[]
  for(let i=1;i<GEO.length;i++){
    if(GEO[i][0]>ma) continue
    const steps=Math.max(2,Math.ceil((GEO[i-1][0]-GEO[i][0])/0.8))
    for(let s=0;s<steps;s++){
      const m1=GEO[i-1][0]-(GEO[i-1][0]-GEO[i][0])*s/steps
      const m2=GEO[i-1][0]-(GEO[i-1][0]-GEO[i][0])*(s+1)/steps
      if(m2>ma) break
      segs.push({x1:xL(m1),y1:yS(gT(m1)),x2:xL(m2),y2:yS(gT(m2)),c:col((gT(m1)+gT(m2))/2)})
    }
  }
  const hx=xL(Math.max(ma,5e-9)),hy=yS(t)

  // Panneaux
  const PW=120,PH=110,PPL=7,PPR=5,PPT=10,PPB=18
  const pW=PW-PPL-PPR,pH=PH-PPT-PPB
  const T0=-0.5,T1=2.0
  const py=(v)=>PPT+pH-(v-T0)/(T1-T0)*pH

  if(!ok) return null

  return (
    <div style={{background:"#04060d",minHeight:"100vh",color:"#fff",fontFamily:"'DM Mono',monospace",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb1{from{transform:scale(1.0)translate(0,0)}to{transform:scale(1.18)translate(-3%,-2%)}}
        @keyframes kb3{from{transform:scale(1.0)translate(-2%,1%)}to{transform:scale(1.16)translate(2%,-2%)}}
        @keyframes kb4{from{transform:scale(1.1)translate(1%,-1%)}to{transform:scale(1.0)translate(-2%,1%)}}
        @keyframes kb5{from{transform:scale(1.0)translate(3%,0)}to{transform:scale(1.18)translate(-3%,-1%)}}
        @keyframes kb6{from{transform:scale(1.05)translate(-1%,1%)}to{transform:scale(1.18)translate(2%,-2%)}}
        @keyframes dh{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
        @keyframes dv{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
      `}</style>

      {/* FOND KB — couvre toute la page */}
      {BGS.map((b,i)=>(
        <div key={i} style={{
          position:"fixed",inset:0,zIndex:0,
          backgroundImage:`url(${b.src})`,backgroundSize:"cover",backgroundPosition:"center",
          opacity:i===bg?0.5:0,transition:"opacity 2.5s ease",
          filter:"brightness(0.6) saturate(0.8)",
          animation:`${b.kb} 22s ease-in-out infinite alternate`,
        }}/>
      ))}
      {/* Voile sombre uniforme */}
      <div style={{position:"fixed",inset:0,zIndex:1,background:"rgba(4,6,13,0.55)"}}/>

      {/* TOUT LE CONTENU — au-dessus du fond */}
      <div style={{position:"relative",zIndex:2,padding:"20px 32px 32px",display:"flex",flexDirection:"column",gap:12,minHeight:"100vh"}}>

        {/* Titre + température */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16}}>
          <div>
            <div style={{fontSize:8,letterSpacing:4,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",marginBottom:8}}>
              Soara · Scotese 2021 · HadCRUT5 · NASA GISS
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3.2vw,38px)",fontWeight:300,color:"#fff",margin:"0 0 4px",lineHeight:1.1}}>
              La Terre a toujours changé <em style={{fontWeight:600}}>de température.</em>
            </h1>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(12px,1.5vw,16px)",fontWeight:300,color:"#dc2626",margin:0}}>
              Ce qui est sans précédent, c'est la vitesse.
            </p>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.4)",marginBottom:4,whiteSpace:"nowrap"}}>
              {ma>1?`−${Math.round(ma)} Ma`:ma>0.001?`−${Math.round(ma*1000)}k ans`:"aujourd'hui"}
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,52px)",fontWeight:700,lineHeight:1,color:col(t),letterSpacing:"-1px",textShadow:`0 0 30px ${col(t)}55`,transition:"color 0.3s"}}>
              {t>=0?"+":""}{t.toFixed(2)}<span style={{fontSize:"0.38em",opacity:0.6}}>°C</span>
            </div>
          </div>
        </div>

        {/* Barre couleur légende */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.5)",letterSpacing:2,flexShrink:0}}>FROID</span>
          <div style={{height:4,flex:1,borderRadius:2,background:"linear-gradient(to right,#7dd3fc,#bcd9ec,#cdc5a0,#f5b87a,#f07040,#e03020,#9b0000)"}}/>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.5)",letterSpacing:2,flexShrink:0}}>CHAUD</span>
        </div>

        {/* COURBE */}
        <div style={{border:"1px solid rgba(255,255,255,0.15)",background:"rgba(4,6,13,0.4)",backdropFilter:"blur(4px)"}}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
            <defs>
              <filter id="g1"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="g2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>

            {/* Zones chaud/froid */}
            <rect x={PL} y={PT} width={cW} height={yS(0)-PT} fill="rgba(210,70,30,0.05)"/>
            <rect x={PL} y={yS(0)} width={cW} height={cH-(yS(0)-PT)} fill="rgba(100,160,255,0.05)"/>

            {/* Grid Y blanc visible */}
            {[-6,-3,0,3,6,9].map(v=>(
              <g key={v}>
                <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)}
                  stroke={v===0?"rgba(255,255,255,0.5)":"rgba(255,255,255,0.12)"}
                  strokeWidth={v===0?1:0.6} strokeDasharray={v===0?"none":"3 8"}/>
                <text x={PL-6} y={yS(v)+4} textAnchor="end"
                  fill={v===0?"#ffffff":"rgba(255,255,255,0.6)"}
                  fontSize={9} fontFamily="'DM Mono',monospace" fontWeight={v===0?600:300}>
                  {v>=0?`+${v}°`:`${v}°`}
                </text>
              </g>
            ))}

            {/* CHAUD / FROID labels */}
            <text x={PL+4} y={PT+11} fill="rgba(220,80,40,0.7)" fontSize={7} fontFamily="'DM Mono',monospace" letterSpacing={2}>CHAUD</text>
            <text x={PL+4} y={PT+cH-4} fill="rgba(100,160,255,0.7)" fontSize={7} fontFamily="'DM Mono',monospace" letterSpacing={2}>FROID</text>

            {/* X labels */}
            {[[500,"500 Ma"],[100,"100 Ma"],[10,"10 Ma"],[0.1,"100 ka"],[0.001,"1 000 ans"]].map(([m,l])=>(
              <g key={m}>
                <line x1={xL(m)} y1={PT+cH} x2={xL(m)} y2={PT+cH+3} stroke="rgba(255,255,255,0.2)"/>
                <text x={xL(m)} y={PT+cH+14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={7} fontFamily="'DM Mono',monospace">{l}</text>
              </g>
            ))}

            {/* Courbe */}
            <g filter="url(#g1)">
              {segs.map((s,i)=><line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.c} strokeWidth={2.2} strokeLinecap="round"/>)}
            </g>

            {/* Dot */}
            {p>0.005&&(
              <g filter="url(#g2)">
                <circle cx={hx} cy={hy} r={4} fill={col(t)}/>
                <circle cx={hx} cy={hy} r={1.8} fill="#fff" opacity={0.9}/>
              </g>
            )}
          </svg>
        </div>

        {/* Contrôles */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onPlay} style={{background:"none",border:"1px solid rgba(255,255,255,0.35)",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:3,padding:"7px 14px",cursor:"pointer",textTransform:"uppercase",flexShrink:0}}>
            {play?"⏸ Pause":p>=1?"↺ Rejouer":"▶ Play"}
          </button>
          <input type="range" min={0} max={1} step={0.0005} value={p} onChange={onSlide} style={{flex:1,accentColor:"#c9a84c",cursor:"pointer"}}/>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.4)",flexShrink:0}}>aujourd'hui</span>
        </div>

        {/* Titre panneaux */}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:12}}>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(14px,2vw,22px)",fontWeight:300,color:"#fff",margin:"0 0 2px",lineHeight:1.2}}>
            Ces 5 réchauffements, <em style={{fontWeight:600}}>à la même échelle.</em>
          </h2>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(10px,1.2vw,13px)",color:"rgba(255,255,255,0.35)",margin:0}}>
            150 ans chacun · axe identique −0,5°C → +2°C
          </p>
        </div>

        {/* PANNEAUX */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:3}}>
          {SLOPES.map((s,i)=>{
            const eT=Math.min(T1-0.05,(s.v/s.d)*150)
            const isA=i===sl
            return(
              <div key={i} style={{
                background:s.now?"rgba(28,4,4,0.85)":"rgba(6,10,20,0.85)",
                border:`1px solid ${isA?"rgba(255,255,255,0.4)":s.now?"rgba(220,38,38,0.2)":"rgba(255,255,255,0.08)"}`,
                transition:"border-color 0.4s",
                boxShadow:isA?`0 0 14px ${s.c}44`:"none",
              }}>
                <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" style={{display:"block"}}>
                  <line x1={PPL} y1={py(0)} x2={PPL+pW} y2={py(0)} stroke="rgba(255,255,255,0.2)" strokeWidth={0.8}/>
                  <line x1={PPL} y1={py(1.5)} x2={PPL+pW} y2={py(1.5)} stroke="#dc2626" strokeWidth={0.5} strokeDasharray="2 4" strokeOpacity={0.3}/>
                  {/* Y labels blancs */}
                  {[-0.5,0,1.0,2.0].map(v=>(
                    <text key={v} x={PPL-2} y={py(v)+3} textAnchor="end"
                      fill={v===0?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.35)"}
                      fontSize={5} fontFamily="'DM Mono',monospace">
                      {v>0?`+${v}°`:v===0?"0°":`${v}°`}
                    </text>
                  ))}
                  {s.now?(
                    <>
                      <line x1={PPL+pW*0.5} y1={py(0)} x2={PPL+pW*0.5} y2={py(eT)}
                        stroke={s.c} strokeWidth={3} strokeLinecap="round"
                        strokeDasharray="200" style={{animation:"dv 0.5s ease-out forwards",strokeDashoffset:200}}/>
                      <line x1={PPL+pW*0.5} y1={py(0)} x2={PPL+pW*0.5} y2={py(eT)}
                        stroke={s.c} strokeWidth={8} strokeOpacity={0.12}/>
                    </>
                  ):(
                    <line x1={PPL} y1={py(0)} x2={PPL+pW} y2={py(eT)}
                      stroke={s.c} strokeWidth={1.5} strokeOpacity={isA?1:0.55}
                      strokeDasharray="300" style={{animation:`dh ${0.7+i*0.18}s ease-out ${i*0.1}s forwards`,strokeDashoffset:300}}/>
                  )}
                  <text x={PPL+pW*0.5} y={PH-PPB+11} textAnchor="middle"
                    fill={s.now?s.c:"rgba(255,255,255,0.6)"}
                    fontSize={s.now?8:6.5} fontFamily="'Cormorant Garamond',serif" fontWeight={s.now?700:300}>
                    {s.now?"+1,62°C":`+${eT.toFixed(eT<0.01?5:3)}°C`}
                  </text>
                </svg>
                <div style={{padding:"5px 4px 7px",borderTop:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:s.now?700:300,fontSize:"clamp(9px,1.1vw,12px)",color:isA?s.c:s.now?"#ef4444":"rgba(255,255,255,0.75)",lineHeight:1.2,transition:"color 0.4s"}}>{s.l}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:6,color:"rgba(255,255,255,0.3)",marginTop:1}}>{s.n}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Phrase clé */}
        <div style={{borderLeft:"3px solid #dc2626",paddingLeft:16,marginTop:4}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(13px,1.6vw,18px)",fontWeight:300,color:"#fff",margin:"0 0 4px",lineHeight:1.7}}>
            <strong style={{fontWeight:700,color:"#ef4444"}}>18× plus rapide</strong> que le PETM, l'événement naturel le plus brutal de l'histoire de la vie complexe sur Terre.
          </p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(10px,1.3vw,14px)",fontWeight:300,color:"rgba(255,255,255,0.3)",margin:0,lineHeight:1.7}}>
            Ce n'est pas l'amplitude. C'est la vitesse.
          </p>
        </div>

        {/* Sources */}
        <div style={{fontSize:7.5,color:"rgba(255,255,255,0.18)",lineHeight:1.8,paddingTop:4,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          Scotese et al. (2021) · PAGES 2k (2019) · HadCRUT5 · NASA GISS · EPICA
        </div>
      </div>
    </div>
  )
}
