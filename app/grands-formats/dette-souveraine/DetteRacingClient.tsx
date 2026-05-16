"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const PAYS_RACING = [
  { k:"USA", label:"États-Unis", col:"#B91C1C", gdp2024:29000, abs2024:36200,
    hist:[{y:2000,v:54},{y:2005,v:62},{y:2008,v:68},{y:2010,v:90},{y:2015,v:104},{y:2019,v:107},{y:2020,v:129},{y:2021,v:127},{y:2022,v:121},{y:2023,v:122},{y:2024,v:123}] },
  { k:"JP",  label:"Japon",      col:"#92400E", gdp2024:4200,  abs2024:9800,
    hist:[{y:2000,v:135},{y:2005,v:175},{y:2008,v:175},{y:2010,v:194},{y:2015,v:223},{y:2019,v:226},{y:2020,v:236},{y:2021,v:232},{y:2022,v:226},{y:2023,v:227},{y:2024,v:229}] },
  { k:"FR",  label:"France",     col:"#1E3A8A", gdp2024:2800,  abs2024:3408,
    hist:[{y:2000,v:57},{y:2005,v:67},{y:2008,v:68},{y:2010,v:82},{y:2015,v:95},{y:2019,v:97},{y:2020,v:115},{y:2021,v:113},{y:2022,v:111},{y:2023,v:110},{y:2024,v:113}] },
  { k:"IT",  label:"Italie",     col:"#065F46", gdp2024:2300,  abs2024:3050,
    hist:[{y:2000,v:105},{y:2005,v:102},{y:2008,v:102},{y:2010,v:115},{y:2015,v:132},{y:2019,v:134},{y:2020,v:155},{y:2021,v:150},{y:2022,v:141},{y:2023,v:137},{y:2024,v:136}] },
  { k:"CN",  label:"Chine *",    col:"#7C3AED", gdp2024:18500, abs2024:14230,
    hist:[{y:2000,v:23},{y:2005,v:27},{y:2008,v:27},{y:2010,v:34},{y:2015,v:42},{y:2019,v:53},{y:2020,v:68},{y:2021,v:69},{y:2022,v:72},{y:2023,v:75},{y:2024,v:76}] },
  { k:"DE",  label:"Allemagne",  col:"#0369A1", gdp2024:4200,  abs2024:2640,
    hist:[{y:2000,v:59},{y:2005,v:66},{y:2008,v:65},{y:2010,v:80},{y:2015,v:71},{y:2019,v:59},{y:2020,v:68},{y:2021,v:68},{y:2022,v:65},{y:2023,v:63},{y:2024,v:63}] },
];

const PROJ: Record<string,number>   = { USA:125, JP:230, FR:116, IT:137, CN:77, DE:64 };
const MARG: Record<string,number>   = { USA:6,   JP:8,   FR:5,   IT:5,  CN:3,  DE:3  };
const ANNS = [
  { year:2008, titre:"Lehman Brothers",  desc:"Injections massives pour sauver le système financier" },
  { year:2010, titre:"Crise zone euro",  desc:"Grèce, Portugal, Irlande sous tutelle. Allemagne au pic 80%" },
  { year:2020, titre:"Covid-19",         desc:"Plans de relance sans précédent : +20 à +25 pts en un an" },
];

type Pays = typeof PAYS_RACING[0];

function getRV(c: Pays, yr: number) {
  const h = c.hist;
  if (yr <= h[0].y) return h[0].v;
  if (yr >= h[h.length-1].y) return h[h.length-1].v;
  for (let i=1; i<h.length; i++) {
    if (yr <= h[i].y) {
      const t = (yr - h[i-1].y) / (h[i].y - h[i-1].y);
      return h[i-1].v + (h[i].v - h[i-1].v) * t;
    }
  }
  return h[h.length-1].v;
}

function getAbsV(c: Pays, yr: number) {
  const pct = getRV(c, yr);
  return (pct / getRV(c, 2024)) * c.abs2024 * Math.pow(1.04, yr - 2024);
}

function resolveL(items: {y:number;[k:string]:unknown}[], gap=15) {
  const s = [...items].sort((a,b) => (a.y as number)-(b.y as number));
  for (let iter=0; iter<30; iter++) {
    for (let i=1; i<s.length; i++) {
      const ov = (s[i-1].y as number) + gap - (s[i].y as number);
      if (ov>0) { (s[i-1] as {y:number}).y -= ov/2; (s[i] as {y:number}).y += ov/2; }
    }
  }
  return s;
}

export default function CourbesRacing() {
  const mono  = "'DM Mono', monospace";
  const serif = "'Playfair Display', Georgia, serif";
  const [yr, setYr]       = useState(2000);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode]   = useState<"pct"|"abs">("pct");
  const [showP, setShowP] = useState(false);
  const [hov, setHov]     = useState<string|null>(null);
  const [ann, setAnn]     = useState<typeof ANNS[0]|null>(null);
  const rafRef  = useRef<number>(0);
  const lastRef = useRef<number|null>(null);
  const yrRef   = useRef(2000);
  const SPEED = 3.0, YMIN=2000, YMAX=2024;

  const tick = useCallback((ts: number) => {
    if (!lastRef.current) lastRef.current = ts;
    const dt = (ts - lastRef.current) / 1000;
    lastRef.current = ts;
    const prev = Math.floor(yrRef.current);
    yrRef.current = Math.min(yrRef.current + dt*SPEED, YMAX);
    const curr = Math.floor(yrRef.current);
    const found = ANNS.find(a => a.year===curr && prev<curr);
    if (found) setAnn(found);
    setYr(yrRef.current);
    if (yrRef.current < YMAX) rafRef.current = requestAnimationFrame(tick);
    else setPlaying(false);
  }, []);

  useEffect(() => {
    if (playing) { lastRef.current=null; rafRef.current=requestAnimationFrame(tick); }
    else cancelAnimationFrame(rafRef.current);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, tick]);

  const handlePlay = () => {
    if (yrRef.current >= YMAX) { yrRef.current=YMIN; setYr(YMIN); setShowP(false); }
    setAnn(null); setPlaying(p => !p);
  };
  const handleSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    yrRef.current=Number(e.target.value); setYr(yrRef.current); setPlaying(false);
  };

  const W=780, H=380, PL=50, PT=18, PB=40;
  const cW=W-PL, cH=H-PT-PB;
  const gV = (c: Pays, y: number) => mode==="pct" ? getRV(c,y) : getAbsV(c,y);

  const allVals = PAYS_RACING.flatMap(c => c.hist.map(p => mode==="pct" ? p.v : getAbsV(c,p.y)));
  const VMIN = 0;
  const VMAX = mode==="pct" ? 250 : Math.ceil(Math.max(...allVals)*1.1/1000)*1000;

  const xS = (y: number) => (y-YMIN)/(YMAX-YMIN+1.5)*cW;
  const yS = (v: number) => cH-(v-VMIN)/(VMAX-VMIN)*cH;

  const buildLine = (c: Pays) => {
    const pts: string[] = [];
    for (let y=YMIN; y<=Math.min(yr,YMAX); y+=0.25) {
      pts.push(`${pts.length===0?"M":"L"}${(PL+xS(y)).toFixed(1)} ${(PT+yS(gV(c,y))).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const buildArea = (c: Pays) => {
    const pts: string[] = [];
    for (let y=YMIN; y<=Math.min(yr,YMAX); y+=0.25) {
      pts.push(`${pts.length===0?"M":"L"}${(PL+xS(y)).toFixed(1)} ${(PT+yS(gV(c,y))).toFixed(1)}`);
    }
    if (!pts.length) return "";
    const lx = (PL+xS(Math.min(yr,YMAX))).toFixed(1);
    return pts.join(" ")+` L${lx} ${PT+cH} L${(PL+xS(YMIN)).toFixed(1)} ${PT+cH} Z`;
  };

  const labels = resolveL(
    PAYS_RACING.map(c => ({ k:c.k, col:c.col, label:c.label, val:gV(c,yr), y:PT+yS(gV(c,yr)) }))
  ) as {k:string;col:string;label:string;val:number;y:number}[];

  const ranking = [...PAYS_RACING].map(c => ({...c, val:gV(c,yr)})).sort((a,b)=>b.val-a.val);
  const fmtV = (v: number) => mode==="pct" ? `${Math.round(v)}%` : v>=1000 ? `${(v/1000).toFixed(1)} T$` : `${Math.round(v)} Mds$`;
  const yTicks = mode==="pct" ? [60,100,140,180,220] : [0,5000,10000,15000,20000,25000,30000,35000].filter(v=>v<=VMAX);
  const x24=PL+xS(2024), x25=PL+xS(2025);

  return (
    <div>
      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, flexWrap:"wrap" }}>
        <button onClick={handlePlay} style={{
          background:"#1a1a1a", color:"#F9F7F3", border:"none",
          fontFamily:mono, fontSize:"9px", letterSpacing:"2px",
          padding:"7px 16px", cursor:"pointer", textTransform:"uppercase" }}>
          {playing ? "⏸ Pause" : yr>=YMAX ? "↺ Replay" : "▶ Play"}
        </button>
        <input type="range" min={YMIN} max={YMAX} step={0.05} value={yr}
          onChange={handleSlide}
          style={{ flex:1, minWidth:80, accentColor:"#1a1a1a", cursor:"pointer" }}/>
        <div style={{ display:"flex", border:"1px solid #DDD9D2" }}>
          {(["pct","abs"] as const).map(m => (
            <button key={m} onClick={()=>setMode(m)} style={{
              background:mode===m?"#1a1a1a":"transparent",
              color:mode===m?"#F9F7F3":"#9CA3AF", border:"none",
              fontFamily:mono, fontSize:"9px", letterSpacing:"1.5px",
              padding:"6px 12px", cursor:"pointer", textTransform:"uppercase" }}>
              {m==="pct" ? "% PIB" : "Mds USD"}
            </button>
          ))}
        </div>
      </div>

      {/* Année + annotation + ranking */}
      <div style={{ display:"flex", gap:14, marginBottom:8, alignItems:"flex-start", minHeight:48 }}>
        <div style={{ fontFamily:serif, fontSize:"clamp(32px,5vw,52px)", fontWeight:900, lineHeight:1, color:"#111", letterSpacing:"-2px", flexShrink:0 }}>
          {Math.floor(yr)}
        </div>
        {ann && (
          <div style={{ borderLeft:"3px solid #C9A84C", paddingLeft:10, paddingTop:2, flex:1 }}>
            <div style={{ fontFamily:serif, fontWeight:700, fontSize:"clamp(11px,1.2vw,13px)", color:"#111", marginBottom:2 }}>{ann.titre}</div>
            <div style={{ fontFamily:mono, fontSize:"8.5px", color:"#9CA3AF", lineHeight:1.5 }}>{ann.desc}</div>
          </div>
        )}
        <div style={{ marginLeft:"auto", display:"flex", gap:12, flexWrap:"wrap", paddingTop:4 }}>
          {ranking.map(c => (
            <div key={c.k} style={{ textAlign:"right" }}>
              <div style={{ fontFamily:mono, fontSize:"8px", color:"#9CA3AF", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:1 }}>{c.label}</div>
              <div style={{ fontFamily:serif, fontWeight:700, color:c.col, fontSize:"clamp(11px,1.2vw,14px)" }}>{fmtV(c.val)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG */}
      <div style={{ overflow:"visible", position:"relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:"block", overflow:"visible" }}>
        <defs>
          {PAYS_RACING.map(c => (
            <linearGradient key={c.k} id={`rg-${c.k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.col} stopOpacity="0.08"/>
              <stop offset="100%" stopColor={c.col} stopOpacity="0"/>
            </linearGradient>
          ))}
        </defs>
        {/* Grid */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PL} y1={PT+yS(v)} x2={PL+cW} y2={PT+yS(v)} stroke="#DDD9D2" strokeWidth={0.7} strokeDasharray="3 6"/>
            <text x={PL-5} y={PT+yS(v)+4} textAnchor="end" fill="#9CA3AF" fontSize={8} fontFamily={mono}>
              {mode==="pct" ? `${v}%` : v>=1000 ? `${v/1000}T` : v}
            </text>
          </g>
        ))}
        {/* Seuil 100% */}
        {mode==="pct" && <>
          <line x1={PL} y1={PT+yS(100)} x2={PL+cW} y2={PT+yS(100)} stroke="#DC2626" strokeWidth={1.2} strokeDasharray="5 4" strokeOpacity={0.5}/>
          <text x={PL+3} y={PT+yS(100)-4} fill="#DC2626" fontSize={8} fontFamily={mono} fillOpacity={0.6}>Seuil 100%</text>
        </>}
        {/* X ticks */}
        {[2000,2005,2010,2015,2020,2024].map(y => (
          <text key={y} x={PL+xS(y)} y={PT+cH+16} textAnchor="middle" fill="#9CA3AF" fontSize={8} fontFamily={mono}>{y}</text>
        ))}
        {/* Event verticals */}
        {ANNS.filter(a => a.year<=yr).map(a => (
          <line key={a.year} x1={PL+xS(a.year)} y1={PT} x2={PL+xS(a.year)} y2={PT+cH} stroke="#C9A84C" strokeWidth={1} strokeOpacity={0.25} strokeDasharray="3 5"/>
        ))}
        {/* Areas */}
        {PAYS_RACING.map(c => (
          <path key={`ra-${c.k}`} d={buildArea(c)} fill={`url(#rg-${c.k})`}
            fillOpacity={hov===null||hov===c.k?1:0.04} style={{ transition:"fill-opacity 0.25s" }}/>
        ))}
        {/* Lines */}
        {PAYS_RACING.map(c => (
          <path key={c.k} d={buildLine(c)} fill="none" stroke={c.col}
            strokeWidth={hov===null||hov===c.k?2.2:0.7}
            strokeOpacity={hov===null||hov===c.k?1:0.1}
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition:"stroke-opacity 0.2s, stroke-width 0.2s" }}/>
        ))}
        {/* Projection 2025 */}
        {showP && PAYS_RACING.map(c => {
          const v24=getRV(c,2024), v25=PROJ[c.k], mg=MARG[c.k];
          if (!v25) return null;
          const dv24=mode==="pct"?v24:getAbsV(c,2024);
          const dv25=mode==="pct"?v25:getAbsV(c,2024)*(v25/v24);
          const dmg=mode==="pct"?mg:getAbsV(c,2024)*(mg/v24);
          const active=hov===null||hov===c.k;
          return (
            <g key={`rp-${c.k}`} opacity={active?1:0.06} style={{ transition:"opacity 0.25s" }}>
              <path d={`M${x24.toFixed(1)} ${(PT+yS(dv24)).toFixed(1)} L${x25.toFixed(1)} ${(PT+yS(dv25-dmg)).toFixed(1)} L${x25.toFixed(1)} ${(PT+yS(dv25+dmg)).toFixed(1)} Z`}
                fill={c.col} fillOpacity={0.08}/>
              <line x1={x24} y1={PT+yS(dv24)} x2={x25} y2={PT+yS(dv25)}
                stroke={c.col} strokeWidth={1.5} strokeDasharray="4 3" strokeOpacity={0.55}/>
              <circle cx={x25} cy={PT+yS(dv25)} r={2.5} fill={c.col} fillOpacity={0.4}/>
            </g>
          );
        })}
        {showP && <line x1={x24} y1={PT} x2={x24} y2={PT+cH} stroke="#9CA3AF" strokeWidth={0.8} strokeDasharray="4 4" strokeOpacity={0.4}/>}
        {/* Dots */}
        {PAYS_RACING.map(c => {
          const v=gV(c,yr), cx=PL+xS(yr), cy=PT+yS(v), active=hov===null||hov===c.k;
          return <circle key={c.k} cx={cx} cy={cy} r={active?4:2} fill={c.col} fillOpacity={active?1:0.1} style={{ transition:"all 0.1s" }}/>;
        })}
        {/* Labels anti-overlap */}
        {labels.map(item => {
          const active=hov===null||hov===item.k;
          const cx=PL+xS(yr), dotY=PT+yS(item.val);
          return (
            <g key={item.k} onMouseEnter={()=>setHov(item.k)} onMouseLeave={()=>setHov(null)} style={{ cursor:"pointer" }}>
              <line x1={cx+5} y1={dotY} x2={cx+12} y2={item.y} stroke={item.col} strokeWidth={0.7} strokeOpacity={active?0.3:0.03} style={{ transition:"stroke-opacity 0.2s" }}/>
              <rect x={cx+14} y={item.y-7} width={74} height={15} rx={2} fill="#F9F7F3" fillOpacity={active?0.95:0.1} style={{ transition:"fill-opacity 0.2s" }}/>
              <text x={cx+19} y={item.y+3} fill={item.col} fontSize={9.5} fontFamily={mono} fontWeight="bold"
                fillOpacity={active?1:0.07} style={{ userSelect:"none" as const, transition:"fill-opacity 0.2s" }}>
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>

      </div>

      {/* Projection toggle */}
      <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
        <button onClick={()=>setShowP(p=>!p)} style={{
          background:"transparent", border:"1px solid #DDD9D2",
          color:showP?"#111":"#9CA3AF", fontFamily:mono, fontSize:"8.5px",
          letterSpacing:"1.5px", padding:"5px 12px", cursor:"pointer", textTransform:"uppercase" }}>
          {showP ? "✕ Masquer" : "＋"} projection 2025
        </button>
        {showP && <span style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"10px", color:"#9CA3AF" }}>
          Scénario central FMI, avant tout correctif politique ou choc économique
        </span>}
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:10 }}>
        {PAYS_RACING.map(c => (
          <div key={c.k} onMouseEnter={()=>setHov(c.k)} onMouseLeave={()=>setHov(null)}
            style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer",
              opacity:hov===null||hov===c.k?1:0.3, transition:"opacity 0.2s" }}>
            <div style={{ width:18, height:2.5, background:c.col, borderRadius:2 }}/>
            <span style={{ fontFamily:mono, fontSize:"9px", color:"#9CA3AF" }}>{c.label}</span>
            <span style={{ fontFamily:mono, fontSize:"9px", color:c.col, opacity:0.75 }}>{fmtV(gV(c,yr))}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
