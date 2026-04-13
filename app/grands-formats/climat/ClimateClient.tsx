// @ts-nocheck
"use client"
import { useState, useEffect, useRef, useCallback } from "react"

const BACKGROUNDS = [
  { src:"/grands-formats/climat/01-ocean-cambrien.jpg",    kb:"kb1", maRange:[500,300] },
  { src:"/grands-formats/climat/03-jungle-cretace.jpg",    kb:"kb3", maRange:[300,66]  },
  { src:"/grands-formats/climat/04-volcan-permien.jpg",    kb:"kb4", maRange:[66,2.5]  },
  { src:"/grands-formats/climat/05-glace-glaciaire.jpg",   kb:"kb5", maRange:[2.5,0.001] },
  { src:"/grands-formats/climat/06-hiver-petitAge.jpg",    kb:"kb6", maRange:[0.001,0] },
]

// Données — anomalie °C vs pré-industriel
const GEO = [
  [500,6.2],[480,4.2],[460,1.5],[450,0.2],[445,-4.8],[440,-3.5],[430,1.5],
  [420,4.2],[400,5.2],[380,4.2],[360,2.2],[340,0.0],[330,-1.5],
  [310,-3.2],[290,1.2],[270,3.5],[252,9.8],[240,7.5],[220,5.8],
  [200,4.8],[180,5.8],[160,6.5],[140,7.5],[100,9.2],
  [90,8.8],[70,7.0],[66,6.5],[55.5,8.2],[50,6.2],[40,4.2],[34,2.2],
  [20,2.5],[10,1.5],[5,1.0],[2.8,-0.8],[2.5,-2.5],[1.0,-1.8],
  [0.6,-3.2],[0.020,-5.8],[0.010,-1.2],[0.008,0.1],[0.003,-0.2],
  [0.00050,-0.22],[0.00015,-0.08],[0.00010,0.0],[0.00004,0.22],
  [0.00002,0.37],[0.000005,0.68],[0.0000008,1.15],[0.00000001,1.62],
]

const EVENTS_ON_CURVE = [
  { ma:445,  label:"Glaciation\nOrdovicien", temp:-4.8 },
  { ma:252,  label:"Fin-Permien\n−96% espèces", temp:9.8 },
  { ma:55.5, label:"PETM", temp:8.2 },
  { ma:0.020,label:"Ère glaciaire\n−6°C", temp:-5.8 },
  { ma:0.00000001, label:"2024\n+1,62°C", temp:1.62 },
]

const SLOPES = [
  { label:"Ordovicien",   duration:500000, delta:8,   col:"#7dd3fc", note:"500 000 ans" },
  { label:"Fin-Permien",  duration:60000,  delta:9,   col:"#fb923c", note:"60 000 ans" },
  { label:"PETM",         duration:20000,  delta:5,   col:"#f87171", note:"20 000 ans" },
  { label:"Post-glaciaire",duration:10000, delta:6,   col:"#93c5fd", note:"10 000 ans" },
  { label:"Aujourd'hui",  duration:150,    delta:1.62,col:"#dc2626", note:"150 ans", current:true },
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

function getActiveBg(ma) {
  for(let i=0;i<BACKGROUNDS.length;i++)
    if(ma<=BACKGROUNDS[i].maRange[0]&&ma>=BACKGROUNDS[i].maRange[1]) return i
  return BACKGROUNDS.length-1
}
function getActiveSlopeIdx(ma) {
  if(ma>420) return 0
  if(ma>66)  return 1
  if(ma>2.5) return 2
  if(ma>0.001) return 3
  return 4
}

export default function ClimateClient() {
  const [prog, setProg]       = useState(0)
  const [playing, setPlaying] = useState(false)
  const [activeBg, setActiveBg]   = useState(0)
  const [activeSl, setActiveSl]   = useState(0)
  const [mounted, setMounted] = useState(false)
  const rafRef  = useRef(null)
  const lastRef = useRef(null)
  const progRef = useRef(0)
  const DURATION = 28000

  useEffect(() => { setMounted(true); setTimeout(()=>setPlaying(true),500) }, [])

  const tick = useCallback((ts) => {
    if(!lastRef.current) lastRef.current=ts
    const dt=ts-lastRef.current; lastRef.current=ts
    const speed = progRef.current>0.88 ? 0.25 : 1.0
    progRef.current=Math.min(progRef.current+(dt/DURATION)*speed,1)
    const ma=500*(1-progRef.current)
    setActiveBg(getActiveBg(ma))
    setActiveSl(getActiveSlopeIdx(ma))
    setProg(progRef.current)
    if(progRef.current<1) rafRef.current=requestAnimationFrame(tick)
    else setPlaying(false)
  },[])

  useEffect(() => {
    if(playing){lastRef.current=null;rafRef.current=requestAnimationFrame(tick)}
    else cancelAnimationFrame(rafRef.current)
    return()=>cancelAnimationFrame(rafRef.current)
  },[playing,tick])

  const handlePlay=()=>{
    if(progRef.current>=1){progRef.current=0;setProg(0);setActiveBg(0);setActiveSl(0)}
    setPlaying(p=>!p)
  }
  const handleSlide=(e)=>{
    progRef.current=Number(e.target.value)
    const ma=500*(1-progRef.current)
    setActiveBg(getActiveBg(ma)); setActiveSl(getActiveSlopeIdx(ma))
    setProg(progRef.current); setPlaying(false)
  }

  const currentMa=500*(1-prog)
  const currentT=getTemp(currentMa)

  // SVG courbe
  const W=860,H=200,PL=52,PR=12,PT=16,PB=32
  const cW=W-PL-PR,cH=H-PT-PB
  const TMIN=-7,TMAX=11
  const xLog=(ma)=>{
    const lm=Math.log10(Math.max(ma,5e-9))
    return PL+(lm-Math.log10(5e-9))/(Math.log10(500)-Math.log10(5e-9))*cW
  }
  const yS=(t)=>PT+cH-(t-TMIN)/(TMAX-TMIN)*cH

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
  const hx=xLog(Math.max(currentMa,5e-9)),hy=yS(currentT)

  // Panneaux
  const PW=130,PH=130,PPL=8,PPR=6,PPT=12,PPB=20
  const pcW=PW-PPL-PPR,pcH=PH-PPT-PPB
  const T0=-0.5,T1=2.0
  const pys=(t)=>PPT+pcH-(t-T0)/(T1-T0)*pcH

  if(!mounted) return null

  return (
    <div style={{minHeight:"100vh",background:"#04060d",color:"#fff",fontFamily:"'DM Mono',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb1{from{transform:scale(1.0)translate(0%,0%)}to{transform:scale(1.18)translate(-3%,-2%)}}
        @keyframes kb3{from{transform:scale(1.0)translate(-2%,1%)}to{transform:scale(1.16)translate(2%,-2%)}}
        @keyframes kb4{from{transform:scale(1.1)translate(1%,-1%)}to{transform:scale(1.0)translate(-2%,1%)}}
        @keyframes kb5{from{transform:scale(1.0)translate(3%,0%)}to{transform:scale(1.18)translate(-3%,-1%)}}
        @keyframes kb6{from{transform:scale(1.05)translate(-1%,1%)}to{transform:scale(1.18)translate(2%,-2%)}}
        @keyframes dh{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
        @keyframes dv{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}
      `}</style>

      {/* ── TOUT EN UNE VUE ── */}
      <div style={{position:"relative",minHeight:"100vh",overflow:"hidden",display:"flex",flexDirection:"column"}}>

        {/* Fonds KB */}
        {BACKGROUNDS.map((bg,i)=>(
          <div key={i} style={{
            position:"absolute",inset:0,
            backgroundImage:`url(${bg.src})`,backgroundSize:"cover",backgroundPosition:"center",
            opacity:i===activeBg?1:0,transition:"opacity 2.5s ease",
            filter:"brightness(0.45) saturate(0.85)",
            animation:`${bg.kb} 22s ease-in-out infinite alternate`,
          }}/>
        ))}
        {/* Overlay léger — laisse voir les images */}
        <div style={{position:"absolute",inset:0,background:"rgba(4,6,13,0.45)",zIndex:1}}/>

        {/* Contenu */}
        <div style={{position:"relative",zIndex:2,flex:1,display:"flex",flexDirection:"column",padding:"20px 36px 16px",gap:10}}>

          {/* Titre + température */}
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontSize:8,letterSpacing:4,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:8}}>
                Soara · Scotese 2021 · HadCRUT5 · NASA GISS
              </div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,40px)",fontWeight:300,color:"#fff",margin:0,lineHeight:1.1}}>
                La Terre a toujours changé <em style={{fontWeight:600}}>de température.</em>
              </h1>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(12px,1.5vw,18px)",fontWeight:300,color:"#dc2626",margin:"4px 0 0"}}>
                Ce qui est sans précédent, c'est la vitesse.
              </p>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.35)"}}>
                {currentMa>1?`−${Math.round(currentMa)} Ma`:currentMa>0.001?`−${Math.round(currentMa*1000)} 000 ans`:"aujourd'hui"}
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(30px,4vw,56px)",fontWeight:700,lineHeight:1,color:tc(currentT),letterSpacing:"-1px",textShadow:`0 0 30px ${tc(currentT)}55`,transition:"color 0.4s"}}>
                {currentT>=0?"+":""}{currentT.toFixed(2)}<span style={{fontSize:"0.4em",fontWeight:300,opacity:0.7}}>°C</span>
              </div>
            </div>
          </div>

          {/* ── LÉGENDE TEMPÉRATURES ── */}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:8,color:"rgba(255,255,255,0.5)",letterSpacing:2,textTransform:"uppercase"}}>Froid</span>
            <div style={{height:4,flex:1,borderRadius:2,background:"linear-gradient(to right,#7dd3fc,#bcd9ec,#d4c5a0,#f5b87a,#f07040,#e03020,#9b0000)"}}/>
            <span style={{fontSize:8,color:"rgba(255,255,255,0.5)",letterSpacing:2,textTransform:"uppercase"}}>Chaud</span>
          </div>

          {/* ── COURBE ── */}
          <div style={{border:"1px solid rgba(255,255,255,0.12)",background:"rgba(4,6,13,0.3)",backdropFilter:"blur(3px)",flex:"0 0 auto"}}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
              <defs>
                <filter id="gl"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="dg" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>

              {/* Zone froide / chaude */}
              <rect x={PL} y={PT} width={cW} height={yS(0)-PT} fill="rgba(220,80,40,0.04)"/>
              <rect x={PL} y={yS(0)} width={cW} height={cH-(yS(0)-PT)} fill="rgba(100,160,255,0.04)"/>

              {/* Grid Y — BLANC VISIBLE */}
              {[-6,-3,0,3,6,9].map(v=>(
                <g key={v}>
                  <line x1={PL} y1={yS(v)} x2={PL+cW} y2={yS(v)}
                    stroke={v===0?"rgba(255,255,255,0.35)":"rgba(255,255,255,0.08)"}
                    strokeWidth={v===0?1:0.6} strokeDasharray={v===0?"none":"3 8"}/>
                  <text x={PL-7} y={yS(v)+4} textAnchor="end"
                    fill={v===0?"#ffffff":"rgba(255,255,255,0.5)"}
                    fontSize={9} fontFamily="'DM Mono',monospace" fontWeight={v===0?"bold":"normal"}>
                    {v>=0?`+${v}°`:`${v}°`}
                  </text>
                </g>
              ))}

              {/* Labels "chaud" / "froid" */}
              <text x={PL+4} y={PT+12} fill="rgba(220,80,40,0.6)" fontSize={8} fontFamily="'DM Mono',monospace" letterSpacing={2}>CHAUD</text>
              <text x={PL+4} y={PT+cH-6} fill="rgba(100,160,255,0.6)" fontSize={8} fontFamily="'DM Mono',monospace" letterSpacing={2}>FROID</text>

              {/* Seuil +1.62 */}
              <line x1={PL} y1={yS(1.62)} x2={PL+cW} y2={yS(1.62)} stroke="#dc2626" strokeWidth={0.6} strokeDasharray="4 6" strokeOpacity={0.5}/>

              {/* X ticks */}
              {[[500,"500 Ma"],[100,"100 Ma"],[10,"10 Ma"],[0.1,"100 ka"],[0.001,"1 000 ans"]].map(([ma,l])=>(
                <g key={ma}>
                  <line x1={xLog(ma)} y1={PT+cH} x2={xLog(ma)} y2={PT+cH+4} stroke="rgba(255,255,255,0.2)"/>
                  <text x={xLog(ma)} y={PT+cH+16} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={7.5} fontFamily="'DM Mono',monospace">{l}</text>
                </g>
              ))}

              {/* Courbe */}
              <g filter="url(#gl)">
                {segs.map((s,i)=>(
                  <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.col} strokeWidth={2.2} strokeLinecap="round"/>
                ))}
              </g>

              {/* Dot tête */}
              {prog>0.005&&(
                <g filter="url(#dg)">
                  <circle cx={hx} cy={hy} r={4.5} fill={tc(currentT)}/>
                  <circle cx={hx} cy={hy} r={2} fill="#fff" opacity={0.9}/>
                </g>
              )}

              {/* Annotations clés sur la courbe */}
              {EVENTS_ON_CURVE.filter(e=>e.ma>=currentMa-1).map((ev,i)=>{
                const x=xLog(Math.max(ev.ma,5e-9)),y=yS(ev.temp)
                return(
                  <g key={i}>
                    <circle cx={x} cy={y} r={2.5} fill="rgba(255,255,255,0.6)"/>
                    <text x={x} y={y-6} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={6.5} fontFamily="'DM Mono',monospace"
                      style={{whiteSpace:"pre"}}>
                      {ev.label.split("\n")[0]}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* ── CONTRÔLES ── */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={handlePlay} style={{background:"none",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:3,padding:"7px 16px",cursor:"pointer",textTransform:"uppercase",flexShrink:0}}>
              {playing?"⏸ Pause":prog>=1?"↺ Rejouer":"▶ Play"}
            </button>
            <input type="range" min={0} max={1} step={0.0005} value={prog} onChange={handleSlide} style={{flex:1,accentColor:"#c9a84c",cursor:"pointer"}}/>
            <span style={{fontSize:8,color:"rgba(255,255,255,0.35)",flexShrink:0}}>aujourd'hui</span>
          </div>

          {/* ── PANNEAUX VITESSE — dans la même vue ── */}
          <div>
            <div style={{fontSize:8,letterSpacing:2,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",marginBottom:8}}>
              Même durée · 150 ans · Axe identique (−0,5°C → +2°C)
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:3}}>
              {SLOPES.map((s,idx)=>{
                const endT=Math.min(T1-0.05,(s.delta/s.duration)*150)
                const isNow=s.current
                const isActive=idx===activeSl
                return(
                  <div key={idx} style={{
                    background:isNow?"rgba(30,4,4,0.85)":"rgba(6,10,20,0.85)",
                    border:`1px solid ${isActive?"rgba(255,255,255,0.35)":isNow?"rgba(220,38,38,0.25)":"rgba(255,255,255,0.07)"}`,
                    transition:"border-color 0.4s",
                    boxShadow:isActive?`0 0 16px ${s.col}33`:"none",
                  }}>
                    <svg viewBox={`0 0 ${PW} ${PH}`} width="100%" style={{display:"block"}}>
                      <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(0)} stroke="rgba(255,255,255,0.15)" strokeWidth={0.8}/>
                      <line x1={PPL} y1={pys(1.5)} x2={PPL+pcW} y2={pys(1.5)} stroke="#dc2626" strokeWidth={0.5} strokeDasharray="2 4" strokeOpacity={0.3}/>
                      {/* Y labels blancs */}
                      {[0,1.0,2.0].map(v=>(
                        <text key={v} x={PPL-2} y={pys(v)+3} textAnchor="end"
                          fill={v===0?"rgba(255,255,255,0.6)":"rgba(255,255,255,0.25)"}
                          fontSize={5.5} fontFamily="'DM Mono',monospace">
                          {v>0?`+${v}°`:v===0?"0°":`${v}°`}
                        </text>
                      ))}
                      {isNow?(
                        <>
                          <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)}
                            stroke={s.col} strokeWidth={3} strokeLinecap="round"
                            strokeDasharray="200" style={{animation:"dv 0.5s ease-out forwards",strokeDashoffset:200}}/>
                          <line x1={PPL+pcW*0.5} y1={pys(0)} x2={PPL+pcW*0.5} y2={pys(endT)}
                            stroke={s.col} strokeWidth={8} strokeOpacity={0.12}/>
                        </>
                      ):(
                        <line x1={PPL} y1={pys(0)} x2={PPL+pcW} y2={pys(endT)}
                          stroke={s.col} strokeWidth={1.5} strokeOpacity={isActive?1:0.5}
                          strokeDasharray="300" style={{animation:`dh ${0.8+idx*0.2}s ease-out ${idx*0.12}s forwards`,strokeDashoffset:300}}/>
                      )}
                      <text x={PPL+pcW*0.5} y={PH-PPB+11} textAnchor="middle"
                        fill={isNow?s.col:"rgba(255,255,255,0.5)"}
                        fontSize={isNow?8:7} fontFamily="'Cormorant Garamond',serif" fontWeight={isNow?700:300}>
                        {isNow?`+${s.delta}°C`:`+${endT.toFixed(endT<0.01?5:3)}°C`}
                      </text>
                    </svg>
                    <div style={{padding:"5px 4px 7px",borderTop:"1px solid rgba(255,255,255,0.05)",textAlign:"center"}}>
                      <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:isNow?700:300,fontSize:"clamp(9px,1.1vw,12px)",color:isActive?s.col:isNow?"#ef4444":"rgba(255,255,255,0.65)",lineHeight:1.2,transition:"color 0.4s"}}>{s.label}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:6,color:"rgba(255,255,255,0.25)",marginTop:1}}>{s.note}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Phrase finale — scroll optionnel */}
      <div style={{background:"#070a14",padding:"32px 36px 48px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{borderLeft:"3px solid #dc2626",paddingLeft:20,marginBottom:24}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(14px,1.8vw,20px)",fontWeight:300,color:"#fff",margin:"0 0 8px",lineHeight:1.8}}>
            Le réchauffement actuel est <strong style={{fontWeight:700,color:"#ef4444"}}>18 fois plus rapide</strong> que le PETM — l'événement naturel le plus brutal de l'histoire de la vie complexe sur Terre.
          </p>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(12px,1.5vw,16px)",fontWeight:300,color:"rgba(255,255,255,0.3)",margin:0,lineHeight:1.8}}>
            Ce n'est pas l'amplitude qui est sans précédent. C'est la vitesse.
          </p>
        </div>
        <div style={{fontSize:8,color:"rgba(255,255,255,0.15)",lineHeight:2}}>
          <strong style={{color:"rgba(255,255,255,0.2)"}}>Sources :</strong> Scotese et al. (2021) · PAGES 2k Consortium (2019) · HadCRUT5 Met Office UK · NASA GISS · Carottes glaciaires EPICA
        </div>
      </div>
    </div>
  )
}
