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

// Géologique — 500M ans, axe linéaire en Ma
const GEO_500M = [
  [500,6.2],[480,4.2],[460,1.5],[445,-4.8],[440,-3.5],[430,1.5],
  [420,4.2],[400,5.2],[380,4.2],[360,2.2],[340,0.0],[330,-1.5],
  [310,-3.2],[290,1.2],[270,3.5],[252,9.8],[240,7.5],[220,5.8],
  [200,4.8],[180,5.8],[160,6.5],[100,9.2],[90,8.8],[70,7.0],[66,6.5],
  [55.5,8.2],[50,6.2],[40,4.2],[34,2.2],[20,2.5],[10,1.5],[5,1.0],
  [2.8,-0.8],[2.5,-2.5],[1.0,-1.8],[0.6,-3.2],[0.020,-5.8],
  [0.010,-1.2],[0.001,-0.3],
]

// 500 dernières années — axe linéaire en années
const RECENT = [
  [1500,-0.22],[1520,-0.25],[1550,-0.32],[1580,-0.28],[1600,-0.40],
  [1620,-0.38],[1645,-0.44],[1650,-0.46],[1680,-0.34],[1700,-0.28],
  [1720,-0.25],[1750,-0.20],[1783,-0.38],[1800,-0.21],[1815,-0.53],
  [1820,-0.24],[1840,-0.17],[1850,-0.08],[1870,-0.06],[1890,-0.14],
  [1900,-0.08],[1910,-0.14],[1920,-0.05],[1930,+0.03],[1940,+0.10],
  [1950,+0.03],[1960,+0.07],[1970,+0.08],[1980,+0.22],[1985,+0.26],
  [1990,+0.37],[1995,+0.38],[2000,+0.52],[2005,+0.62],[2010,+0.68],
  [2015,+0.87],[2016,+1.01],[2018,+0.83],[2020,+1.15],[2022,+0.99],
  [2023,+1.45],[2024,+1.62],
]

const EVENTS_500M = [
  { ma:445,  label:"Glaciation", sub:"−5°C" },
  { ma:252,  label:"Fin-Permien", sub:"−96% espèces" },
  { ma:55.5, label:"PETM", sub:"+8°C" },
  { ma:0.020,label:"Ère glac.", sub:"−6°C" },
]

const EVENTS_RECENT = [
  { yr:1600, label:"Petit Âge Glaciaire" },
  { yr:1815, label:"Tambora" },
  { yr:1850, label:"Révolution\nindustrielle" },
  { yr:1988, label:"Alerte\nHansen" },
  { yr:2015, label:"Accord\nde Paris" },
]

function gT500(ma) {
  const d=GEO_500M
  for(let i=1;i<d.length;i++) {
    if(ma>=d[i][0]) {
      const t=(ma-d[i-1][0])/(d[i][0]-d[i-1][0])
      return d[i-1][1]+(d[i][1]-d[i-1][1])*t
    }
  }
  return d[d.length-1][1]
}
function gTR(yr) {
  const d=RECENT
  if(yr<=d[0][0]) return d[0][1]
  if(yr>=d[d.length-1][0]) return d[d.length-1][1]
  for(let i=1;i<d.length;i++) {
    if(yr<=d[i][0]) {
      const t=(yr-d[i-1][0])/(d[i][0]-d[i-1][0])
      return d[i-1][1]+(d[i][1]-d[i-1][1])*t
    }
  }
  return d[d.length-1][1]
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

export default function CC() {
  const [p, setP]     = useState(0)   // 0→1 pour le graphique 500M
  const [p2, setP2]   = useState(0)   // 0→1 pour le graphique récent
  const [play, setPlay] = useState(false)
  const [bg, setBg]   = useState(0)
  const [ok, setOk]   = useState(false)
  const raf=useRef(null), last=useRef(null), pr=useRef(0)
  const DUR1=18000, DUR2=10000 // 18s géo + 10s récent

  useEffect(()=>{setOk(true);setTimeout(()=>setPlay(true),400)},[])

  const tick=useCallback((ts)=>{
    if(!last.current) last.current=ts
    const dt=ts-last.current; last.current=ts

    // Phase 1 : graphique géologique
    if(pr.current<1) {
      pr.current=Math.min(pr.current+dt/DUR1,1)
      const ma=500*(1-pr.current)
      setBg(gBg(ma))
      setP(pr.current)
      if(pr.current<1) { raf.current=requestAnimationFrame(tick); return }
    }

    // Phase 2 : graphique récent (démarre quand phase 1 finie)
    // On utilise un ref séparé
    setP2(pp=>{
      const np=Math.min(pp+dt/DUR2,1)
      if(np>=1) setPlay(false)
      return np
    })
    if(true) raf.current=requestAnimationFrame(tick)
  },[])

  useEffect(()=>{
    if(play){last.current=null;raf.current=requestAnimationFrame(tick)}
    else cancelAnimationFrame(raf.current)
    return()=>cancelAnimationFrame(raf.current)
  },[play,tick])

  const onPlay=()=>{
    if(pr.current>=1&&p2>=1){pr.current=0;setP(0);setP2(0);setBg(0)}
    setPlay(x=>!x)
  }

  const ma=500*(1-p)
  const currentT=gT500(ma)

  // ── GRAPHIQUE 1 : 500M ans (axe linéaire en Ma) ──
  const W1=400,H1=200,PL1=44,PR1=8,PT1=16,PB1=32
  const cW1=W1-PL1-PR1,cH1=H1-PT1-PB1
  const TMIN=-7,TMAX=11
  // Axe linéaire — 500 Ma à gauche, 0 à droite
  const x1=(mav)=>PL1+(500-mav)/500*cW1
  const y1=(tv)=>PT1+cH1-(tv-TMIN)/(TMAX-TMIN)*cH1

  // Segments animés jusqu'à Ma courant
  const segs1=[]
  for(let i=1;i<GEO_500M.length;i++){
    if(GEO_500M[i][0]>ma) continue
    const m1=Math.min(GEO_500M[i-1][0],ma), m2=GEO_500M[i][0]
    const t1=gT500(m1), t2=gT500(m2)
    segs1.push({x1:x1(m1),y1:y1(t1),x2:x1(m2),y2:y1(t2),c:col((t1+t2)/2)})
  }

  // ── GRAPHIQUE 2 : 500 dernières années (axe linéaire) ──
  const W2=400,H2=200,PL2=44,PR2=8,PT2=16,PB2=32
  const cW2=W2-PL2-PR2,cH2=H2-PT2-PB2
  const TMIN2=-0.7, TMAX2=1.8
  const currentYr=1500+p2*(2024-1500)
  const x2=(yr)=>PL2+(yr-1500)/(2024-1500)*cW2
  const y2=(tv)=>PT2+cH2-(tv-TMIN2)/(TMAX2-TMIN2)*cH2

  const segs2=[]
  for(let i=1;i<RECENT.length;i++){
    if(RECENT[i][0]>currentYr) break
    segs2.push({
      x1:x2(RECENT[i-1][0]),y1:y2(RECENT[i-1][1]),
      x2:x2(Math.min(RECENT[i][0],currentYr)),y2:y2(gTR(Math.min(RECENT[i][0],currentYr))),
      c:col((RECENT[i-1][1]+RECENT[i][1])/2)
    })
  }
  const hx2=x2(Math.min(currentYr,2024))
  const hy2=y2(gTR(Math.min(currentYr,2024)))

  if(!ok) return null

  return (
    <div style={{background:"#04060d",color:"#fff",fontFamily:"'DM Mono',monospace",position:"relative",overflow:"hidden",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400&display=swap');
        @keyframes kb1{from{transform:scale(1.0)translate(0,0)}to{transform:scale(1.18)translate(-3%,-2%)}}
        @keyframes kb3{from{transform:scale(1.0)translate(-2%,1%)}to{transform:scale(1.16)translate(2%,-2%)}}
        @keyframes kb4{from{transform:scale(1.1)translate(1%,-1%)}to{transform:scale(1.0)translate(-2%,1%)}}
        @keyframes kb5{from{transform:scale(1.0)translate(3%,0)}to{transform:scale(1.18)translate(-3%,-1%)}}
        @keyframes kb6{from{transform:scale(1.05)translate(-1%,1%)}to{transform:scale(1.18)translate(2%,-2%)}}
      `}</style>

      {/* Fond KB */}
      {BGS.map((b,i)=>(
        <div key={i} style={{
          position:"fixed",inset:0,zIndex:0,
          backgroundImage:`url(${b.src})`,backgroundSize:"cover",backgroundPosition:"center",
          opacity:i===bg?0.88:0,transition:"opacity 2.5s ease",
          filter:"brightness(0.75) saturate(0.95)",
          animation:`${b.kb} 22s ease-in-out infinite alternate`,
        }}/>
      ))}
      <div style={{position:"fixed",inset:0,zIndex:1,background:"rgba(4,6,13,0.30)"}}/>

      {/* Contenu */}
      <div style={{position:"relative",zIndex:2,padding:"20px 32px 28px",display:"flex",flexDirection:"column",gap:14}}>

        {/* Titre */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12}}>
          <div>
            <div style={{fontSize:8,letterSpacing:4,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:8}}>
              Soara · Scotese 2021 · HadCRUT5 · NASA GISS
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(20px,3vw,38px)",fontWeight:300,color:"#fff",margin:"0 0 4px",lineHeight:1.1}}>
              La Terre a toujours changé <em style={{fontWeight:600}}>de température.</em>
            </h1>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(12px,1.4vw,16px)",fontWeight:300,color:"#dc2626",margin:0}}>
              Ce qui est sans précédent, c'est la vitesse.
            </p>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:7,letterSpacing:2,color:"rgba(255,255,255,0.35)",marginBottom:3}}>
              {p<1?(ma>1?`−${Math.round(ma)} Ma`:ma>0.001?`−${Math.round(ma*1000)}k ans`:"passé récent"):`${Math.round(currentYr)}`}
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,3.8vw,48px)",fontWeight:700,lineHeight:1,color:col(p<1?currentT:gTR(Math.min(currentYr,2024))),letterSpacing:"-1px",transition:"color 0.3s"}}>
              {(p<1?currentT:gTR(Math.min(currentYr,2024)))>=0?"+":""}{(p<1?currentT:gTR(Math.min(currentYr,2024))).toFixed(2)}<span style={{fontSize:"0.38em",opacity:0.6}}>°C</span>
            </div>
          </div>
        </div>

        {/* Barre couleur */}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.45)",letterSpacing:1,flexShrink:0}}>−7°C</span>
          <div style={{height:4,flex:1,borderRadius:2,background:"linear-gradient(to right,#7dd3fc,#bcd9ec,#cdc5a0,#f5b87a,#f07040,#e03020,#9b0000)"}}/>
          <span style={{fontSize:7,color:"rgba(255,255,255,0.45)",letterSpacing:1,flexShrink:0}}>+11°C</span>
        </div>

        {/* DEUX GRAPHIQUES CÔTE À CÔTE */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>

          {/* ── GRAPHIQUE 1 : 500 millions d'années ── */}
          <div style={{border:"1px solid rgba(255,255,255,0.15)",background:"rgba(4,6,13,0.4)",backdropFilter:"blur(4px)"}}>
            <div style={{padding:"8px 10px 4px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"clamp(11px,1.4vw,14px)",color:"#fff"}}>Il y a 500 millions d'années → aujourd'hui</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"rgba(255,255,255,0.35)",marginTop:2}}>Anomalie °C · Chaque point = millions d'années</div>
            </div>
            <svg viewBox={`0 0 ${W1} ${H1}`} style={{width:"100%",display:"block"}}>
              <defs>
                <filter id="g1"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="g2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>

              {/* Zones */}
              <rect x={PL1} y={PT1} width={cW1} height={y1(0)-PT1} fill="rgba(210,70,30,0.06)"/>
              <rect x={PL1} y={y1(0)} width={cW1} height={cH1-(y1(0)-PT1)} fill="rgba(100,160,255,0.06)"/>

              {/* Grid Y */}
              {[-6,-3,0,3,6,9].map(v=>(
                <g key={v}>
                  <line x1={PL1} y1={y1(v)} x2={PL1+cW1} y2={y1(v)}
                    stroke={v===0?"rgba(255,255,255,0.45)":"rgba(255,255,255,0.1)"}
                    strokeWidth={v===0?1:0.5} strokeDasharray={v===0?"none":"3 7"}/>
                  <text x={PL1-5} y={y1(v)+4} textAnchor="end"
                    fill={v===0?"#fff":"rgba(255,255,255,0.55)"}
                    fontSize={8.5} fontFamily="'DM Mono',monospace" fontWeight={v===0?600:300}>
                    {v>=0?`+${v}°`:`${v}°`}
                  </text>
                </g>
              ))}

              {/* X ticks linéaires */}
              {[500,400,300,200,100,50,0].map(ma=>(
                <g key={ma}>
                  <line x1={x1(ma)} y1={PT1+cH1} x2={x1(ma)} y2={PT1+cH1+4} stroke="rgba(255,255,255,0.2)"/>
                  <text x={x1(ma)} y={PT1+cH1+14} textAnchor="middle"
                    fill="rgba(255,255,255,0.45)" fontSize={6.5} fontFamily="'DM Mono',monospace">
                    {ma===0?"auj.":`${ma} Ma`}
                  </text>
                </g>
              ))}

              {/* Labels chaud/froid */}
              <text x={PL1+4} y={PT1+10} fill="rgba(220,80,40,0.8)" fontSize={7} fontFamily="'DM Mono',monospace" letterSpacing={1}>CHAUD</text>
              <text x={PL1+4} y={PT1+cH1-4} fill="rgba(100,160,255,0.8)" fontSize={7} fontFamily="'DM Mono',monospace" letterSpacing={1}>FROID</text>

              {/* Courbe animée */}
              <g filter="url(#g1)">
                {segs1.map((s,i)=><line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.c} strokeWidth={2} strokeLinecap="round"/>)}
              </g>

              {/* Dot */}
              {p>0.01&&p<1&&(
                <g filter="url(#g2)">
                  <circle cx={x1(ma)} cy={y1(currentT)} r={4} fill={col(currentT)}/>
                  <circle cx={x1(ma)} cy={y1(currentT)} r={1.8} fill="#fff" opacity={0.9}/>
                </g>
              )}

              {/* Annotations */}
              {EVENTS_500M.filter(e=>e.ma>=ma).map((ev,i)=>{
                const ex=x1(ev.ma), ey=y1(gT500(ev.ma))
                return(
                  <g key={i}>
                    <circle cx={ex} cy={ey} r={2.5} fill="rgba(255,255,255,0.5)"/>
                    <text x={ex} y={ey-7} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={6} fontFamily="'DM Mono',monospace">{ev.label}</text>
                  </g>
                )
              })}
            </svg>
            <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(11px,1.3vw,14px)",fontWeight:300,color:"rgba(255,255,255,0.75)",margin:0,lineHeight:1.7}}>
                Sur 500 millions d'années, la Terre a connu des variations de <strong style={{fontWeight:600,color:"#fff"}}>±10°C</strong>. Des glaciations profondes, des périodes tropicales. C'est la réalité du climat terrestre — changeant, cyclique, brutal parfois.
              </p>
            </div>
          </div>

          {/* ── GRAPHIQUE 2 : 500 dernières années ── */}
          <div style={{border:"1px solid rgba(255,255,255,0.15)",background:"rgba(4,6,13,0.4)",backdropFilter:"blur(4px)"}}>
            <div style={{padding:"8px 10px 4px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"clamp(11px,1.4vw,14px)",color:"#fff"}}>1500 → aujourd'hui · Zoom</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:7,color:"rgba(255,255,255,0.35)",marginTop:2}}>Même axe Y · Chaque point = années</div>
            </div>
            <svg viewBox={`0 0 ${W2} ${H2}`} style={{width:"100%",display:"block"}}>
              {/* Grid Y identique */}
              {[-6,-3,0,3,6,9].map(v=>(
                <g key={v}>
                  <line x1={PL2} y1={y2(v)} x2={PL2+cW2} y2={y2(v)}
                    stroke={v===0?"rgba(255,255,255,0.45)":"rgba(255,255,255,0.1)"}
                    strokeWidth={v===0?1:0.5} strokeDasharray={v===0?"none":"3 7"}/>
                  <text x={PL2-5} y={y2(v)+4} textAnchor="end"
                    fill={v===0?"#fff":"rgba(255,255,255,0.55)"}
                    fontSize={8.5} fontFamily="'DM Mono',monospace" fontWeight={v===0?600:300}>
                    {v>=0?`+${v}°`:`${v}°`}
                  </text>
                </g>
              ))}

              {/* Zone visible de la courbe (−0.7 à +1.8) */}
              {/* Rectangle qui montre le "zoom" */}
              <rect x={PL2} y={y2(1.8)} width={cW2} height={y2(-0.7)-y2(1.8)} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}/>

              {/* X ticks */}
              {[1500,1600,1700,1800,1850,1900,1950,2000,2024].map(yr=>(
                <g key={yr}>
                  <line x1={x2(yr)} y1={PT2+cH2} x2={x2(yr)} y2={PT2+cH2+4} stroke="rgba(255,255,255,0.2)"/>
                  <text x={x2(yr)} y={PT2+cH2+14} textAnchor="middle"
                    fill="rgba(255,255,255,0.45)" fontSize={6} fontFamily="'DM Mono',monospace">
                    {yr}
                  </text>
                </g>
              ))}

              {/* Séparateur 1850 */}
              <line x1={x2(1850)} y1={PT2} x2={x2(1850)} y2={PT2+cH2}
                stroke="rgba(255,255,255,0.2)" strokeWidth={0.7} strokeDasharray="3 5"/>
              <text x={x2(1850)+3} y={PT2+11} fill="rgba(255,255,255,0.3)" fontSize={6} fontFamily="'DM Mono',monospace">Révol. ind. →</text>

              {/* Seuil Paris */}
              <line x1={PL2} y1={y2(1.5)} x2={PL2+cW2} y2={y2(1.5)}
                stroke="#dc2626" strokeWidth={0.7} strokeDasharray="4 5" strokeOpacity={0.5}/>
              <text x={PL2+cW2-2} y={y2(1.5)-4} textAnchor="end" fill="#dc2626" fontSize={6} fontFamily="'DM Mono',monospace" fillOpacity={0.7}>Accord de Paris +1,5°C</text>

              {/* Courbe */}
              <g filter="url(#g1)">
                {segs2.map((s,i)=><line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={s.c} strokeWidth={2} strokeLinecap="round"/>)}
              </g>

              {/* Dot */}
              {p2>0.01&&(
                <g filter="url(#g2)">
                  <circle cx={hx2} cy={hy2} r={4} fill={col(gTR(Math.min(currentYr,2024)))}/>
                  <circle cx={hx2} cy={hy2} r={1.8} fill="#fff" opacity={0.9}/>
                </g>
              )}
            </svg>
            <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(11px,1.3vw,14px)",fontWeight:300,color:"rgba(255,255,255,0.75)",margin:0,lineHeight:1.7}}>
                Depuis 1850, la température monte. Ce n'est pas un phénomène naturel — c'est <strong style={{fontWeight:600,color:"#ef4444"}}>18 fois plus rapide</strong> que le PETM, le réchauffement naturel le plus brutal connu. Les écosystèmes n'ont pas le temps de s'adapter.
              </p>
            </div>
          </div>
        </div>

        {/* Message clé entre les deux */}
        <div style={{background:"rgba(4,6,13,0.6)",backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.1)",padding:"12px 16px",display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:"rgba(255,255,255,0.3)",letterSpacing:2,flexShrink:0,textTransform:"uppercase"}}>À retenir</div>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"clamp(12px,1.5vw,16px)",fontWeight:300,color:"#fff",margin:0,lineHeight:1.6}}>
            Les deux graphiques ont le <strong style={{fontWeight:700}}>même axe vertical</strong>. La Terre a connu des variations de ±10°C — sur des millions d'années. Notre +1,6°C est arrivé en <strong style={{fontWeight:700,color:"#ef4444"}}>150 ans</strong>.
          </p>
        </div>

        {/* Contrôles */}
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onPlay} style={{background:"none",border:"1px solid rgba(255,255,255,0.35)",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:3,padding:"7px 14px",cursor:"pointer",textTransform:"uppercase",flexShrink:0}}>
            {play?"⏸ Pause":(p>=1&&p2>=1)?"↺ Rejouer":"▶ Play"}
          </button>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:7,color:"rgba(255,255,255,0.3)",flexShrink:0}}>500 Ma</span>
            <div style={{flex:1,height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${p*100}%`,background:"#c9a84c",transition:"width 0.1s"}}/>
            </div>
            <span style={{fontSize:7,color:"rgba(255,255,255,0.3)",flexShrink:0}}>1500</span>
            <div style={{flex:1,height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${p2*100}%`,background:"#dc2626",transition:"width 0.1s"}}/>
            </div>
            <span style={{fontSize:7,color:"rgba(255,255,255,0.3)",flexShrink:0}}>2024</span>
          </div>
        </div>

        <div style={{fontSize:7,color:"rgba(255,255,255,0.15)",lineHeight:1.8,paddingTop:2,borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          Scotese et al. (2021) · PAGES 2k (2019) · HadCRUT5 · NASA GISS · EPICA — Anomalie vs. pré-industriel (1850–1900)
        </div>
      </div>
    </div>
  )
}
