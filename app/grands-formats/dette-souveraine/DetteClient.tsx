"use client";
import { useState, useEffect, useRef } from "react";
import CourbesRacing from "./DetteRacingClient";
import styles from "./dette.module.css";

// ── DATA ──────────────────────────────────────────────────────────────────────
const SECS_JAN1 = 96 * 86400;
const BASE_FR   = 3_408_000_000_000;

// base = milliards $, gdp = milliards $ (même unité), ratio = base/gdp*100
const PAYS = [
  { k:"USA", label:"États-Unis", color:"#B91C1C", rate:57077, gdp:29000,  base:36200,  hist:[{y:2000,v:54},{y:2005,v:62},{y:2008,v:68},{y:2010,v:90},{y:2015,v:104},{y:2019,v:107},{y:2020,v:129},{y:2021,v:127},{y:2022,v:121},{y:2023,v:122},{y:2024,v:123},{y:2025,v:125}] },
  { k:"JP",  label:"Japon",      color:"#92400E", rate:6342,  gdp:4200,  base:9800,   hist:[{y:2000,v:135},{y:2005,v:175},{y:2008,v:175},{y:2010,v:194},{y:2015,v:223},{y:2019,v:226},{y:2020,v:236},{y:2021,v:232},{y:2022,v:226},{y:2023,v:227},{y:2024,v:229},{y:2025,v:230}] },
  { k:"FR",  label:"France",     color:"#1E3A8A", rate:4534,  gdp:2800,  base:3408,   hist:[{y:2000,v:57},{y:2005,v:67},{y:2008,v:68},{y:2010,v:82},{y:2015,v:95},{y:2019,v:97},{y:2020,v:115},{y:2021,v:113},{y:2022,v:111},{y:2023,v:110},{y:2024,v:113},{y:2025,v:116}] },
  { k:"IT",  label:"Italie",     color:"#065F46", rate:1902,  gdp:2300,  base:3050,   hist:[{y:2000,v:105},{y:2005,v:102},{y:2008,v:102},{y:2010,v:115},{y:2015,v:132},{y:2019,v:134},{y:2020,v:155},{y:2021,v:150},{y:2022,v:141},{y:2023,v:137},{y:2024,v:136},{y:2025,v:137}] },
  { k:"CN",  label:"Chine *",    color:"#7C3AED", rate:12000, gdp:18500, base:14230,  hist:[{y:2000,v:23},{y:2005,v:27},{y:2008,v:27},{y:2010,v:34},{y:2015,v:42},{y:2019,v:53},{y:2020,v:68},{y:2021,v:69},{y:2022,v:72},{y:2023,v:75},{y:2024,v:76},{y:2025,v:77}] },
];

const EQUIV = [
  { phrase:"écoles primaires construites",       detail:"200 élèves · 8 classes · terrain compris",    cout:4_500_000 },
  { phrase:"lits de réanimation équipés",        detail:"médicalisés · prêts à accueillir",             cout:500_000   },
  { phrase:"étudiants financés un an",           detail:"frais pédagogiques · logement · encadrement",  cout:15_000    },
  { phrase:"crèches de 50 places",               detail:"construites · équipées · personnel inclus",    cout:3_200_000 },
  { phrase:"logements sociaux livrés",           detail:"T3 BBC · clé en main · Île-de-France",         cout:180_000   },
  { phrase:"chercheurs financés un an",          detail:"salaire chargé · laboratoire · publications",  cout:65_000    },
];

const EVICTION = [
  { label:"Charge de la dette", year:"2024", val:60.2, color:"#B91C1C", live:true,
    note:"1er poste de dépenses, devant la Défense" },
  { label:"Budget Défense",     year:"2025", val:47.2, color:"#1E3A8A", live:false,
    note:"Pays doté de l'arme nucléaire, membre du CS ONU" },
  { label:"Budget Éducation",   year:"2025", val:63.0, color:"#065F46", live:false,
    note:"Hors pensions, 1er employeur de France" },
  { label:"Budget Recherche",   year:"2025", val:25.7, color:"#92400E", live:false,
    note:"Enseignement supérieur + recherche publique" },
];

const CHARGE_HIST = [
  {y:"2015",v:44.3},{y:"2017",v:41.5},{y:"2019",v:37.2},{y:"2020",v:35.1},
  {y:"2021",v:38.4},{y:"2022",v:46.1},{y:"2023",v:52.9},{y:"2024",v:60.2},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function grand(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(".", ",") + " milliards";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".", ",") + " millions";
  return Math.floor(n).toLocaleString("fr-FR");
}

function splitDebt(n: number) {
  const s = (n / 1e12).toFixed(7);
  const i = s.indexOf(".");
  return { int: parseInt(s.slice(0, i)).toLocaleString("fr-FR"), dec: s.slice(i + 1) };
}

function smoothPath(pts: {x:number,y:number}[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)];
    const p1 = pts[i - 1];
    const p2 = pts[i];
    const p3 = pts[Math.min(pts.length - 1, i + 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function areaPath(pts: {x:number,y:number}[], base: number) {
  if (pts.length < 2) return "";
  const last = pts[pts.length - 1];
  return smoothPath(pts) + ` L${last.x.toFixed(1)},${base} L${pts[0].x.toFixed(1)},${base} Z`;
}

// ── COURBES ───────────────────────────────────────────────────────────────────
function Courbes({ ratios }: { ratios: Record<string,number> }) {
  const W = 780, H = 320;
  const m = { t: 20, r: 110, b: 40, l: 48 };
  const iW = W - m.l - m.r;
  const iH = H - m.t - m.b;
  const YMIN = 20, YMAX = 248;
  const XMIN = 2000, XMAX = 2027;
  const xs = (y: number) => m.l + (y - XMIN) / (XMAX - XMIN) * iW;
  const ys = (v: number) => m.t + iH - (v - YMIN) / (YMAX - YMIN) * iH;
  const nowX = xs(2026.25);
  const gridVals = [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240];
  const xLabels  = [2000, 2005, 2010, 2015, 2020, 2025];

  return (
    <div style={{ width:"100%", overflow:"hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:"block", overflow:"visible" }}>
        <defs>
          {PAYS.map(({ k, color }) => (
            <linearGradient key={k} id={`gr-${k}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity="0.10"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          ))}
          {PAYS.map(({ k }, i) => (
            <clipPath key={k} id={`cl-${k}`}>
              <rect x={m.l - 2} y={m.t - 10} height={iH + 20} width="0">
                <animate attributeName="width" from="0" to={String(iW + m.r + 4)}
                  dur="2.2s" begin={`${i * 0.18}s`} fill="freeze"
                  calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/>
              </rect>
            </clipPath>
          ))}
        </defs>

        {gridVals.map(v => (
          <g key={v}>
            <line x1={m.l} x2={m.l + iW} y1={ys(v)} y2={ys(v)}
              stroke={v === 100 ? "#94A3B8" : "#E8EDF2"}
              strokeWidth={1} strokeDasharray={v === 100 ? "none" : "3 5"}/>
            <text x={m.l - 6} y={ys(v) + 3.5} textAnchor="end"
              fontSize="9" fontFamily="'DM Mono',monospace"
              fill={v === 100 ? "#64748B" : "#CBD5E1"}>{v}%</text>
          </g>
        ))}

        <text x={m.l + 4} y={ys(100) - 6} fontSize="8"
          fontFamily="'DM Mono',monospace" fill="#94A3B8" letterSpacing="0.1">
          SEUIL 100% DU PIB
        </text>

        {xLabels.map(yr => (
          <text key={yr} x={xs(yr)} y={H - m.b + 16} textAnchor="middle"
            fontSize="9" fontFamily="'DM Mono',monospace" fill="#94A3B8">{yr}</text>
        ))}

        <line x1={nowX} x2={nowX} y1={m.t} y2={m.t + iH}
          stroke="#DC2626" strokeWidth="1" strokeDasharray="4 4" opacity="0.45"/>
        <text x={nowX + 4} y={m.t + 12} fontSize="8"
          fontFamily="'DM Mono',monospace" fill="#DC2626" letterSpacing="1">MAINTENANT</text>

        {PAYS.map(({ k, color, hist }, i) => {
          const lv   = ratios[k] ?? hist[hist.length - 1].v;
          const data = [...hist, { y: 2026.25, v: lv }];
          const pts  = data.map(d => ({ x: xs(d.y), y: ys(d.v) }));
          const lx   = xs(2026.25);
          const ly   = ys(lv);
          const delay = i * 0.18;
          const dotDelay = delay + 2.2;

          return (
            <g key={k}>
              <path d={areaPath(pts, m.t + iH)} fill={`url(#gr-${k})`} clipPath={`url(#cl-${k})`}/>
              <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={2} clipPath={`url(#cl-${k})`}/>
              <circle cx={lx} cy={ly} r="5" fill="none" stroke={color} strokeWidth="1.5" opacity="0">
                <animate attributeName="opacity" values="0;0;0.6;0" dur="2.4s" begin={`${dotDelay+0.5}s`} repeatCount="indefinite"/>
                <animate attributeName="r" values="5;5;20;20" dur="2.4s" begin={`${dotDelay+0.5}s`} repeatCount="indefinite"/>
              </circle>
              <circle cx={lx} cy={ly} r="4.5" fill={color} stroke="white" strokeWidth="2" opacity="0">
                <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin={`${dotDelay}s`} fill="freeze"/>
              </circle>
              <text x={lx + 8} y={ly + 4} fontSize="9" fontFamily="'DM Mono',monospace"
                fontWeight="500" fill={color} opacity="0">
                {PAYS.find(p => p.k === k)?.label}
                <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin={`${dotDelay}s`} fill="freeze"/>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── ÉVICTION ──────────────────────────────────────────────────────────────────
function VueEviction({ detteVal }: { detteVal: number }) {
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const liveVal = parseFloat((detteVal / 1e9).toFixed(1));

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShown(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const mono  = "'DM Mono', monospace";
  const serif = "'Playfair Display', Georgia, serif";
  const BORDER = "1px solid #DDD9D2";
  const maxVal = 70;

  const bars = EVICTION.map(b => ({ ...b, val: b.live ? liveVal : b.val }));

  // Mini sparkline for charge evolution
  const sparkW = 220, sparkH = 60;
  const sxMin = 0, sxMax = CHARGE_HIST.length - 1;
  const syMin = 30, syMax = 65;
  const sx = (i: number) => 10 + (i / sxMax) * (sparkW - 20);
  const sy = (v: number) => sparkH - 10 - ((v - syMin) / (syMax - syMin)) * (sparkH - 20);
  const sparkPts = CHARGE_HIST.map((d, i) => ({ x: sx(i), y: sy(d.v) }));

  return (
    <div ref={ref} style={{ flex:1, display:"flex", flexDirection:"column", padding:"28px 44px 20px", overflow:"hidden" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"20px", flexShrink:0, flexWrap:"wrap", gap:"12px" }}>
        <div>
          <h2 style={{ fontFamily:serif, fontWeight:700, color:"#111", fontSize:"clamp(14px,1.9vw,20px)", letterSpacing:"-0.01em", marginBottom:"4px" }}>
            Ce que la dette empêche
          </h2>
          <div style={{ fontFamily:mono, fontSize:"9px", letterSpacing:"0.15em", color:"#9CA3AF", textTransform:"uppercase" }}>
            Charge annuelle des intérêts vs. budgets publics · France · milliards €
          </div>
        </div>
        {/* Mini sparkline */}
        <div style={{ flexShrink:0 }}>
          <div style={{ fontFamily:mono, fontSize:"8px", color:"#9CA3AF", letterSpacing:"0.1em", marginBottom:"4px", textAlign:"right" }}>
            CHARGE DETTE 2015 → 2024
          </div>
          <svg width={sparkW} height={sparkH} viewBox={`0 0 ${sparkW} ${sparkH}`}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#B91C1C" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#B91C1C" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={areaPath(sparkPts, sparkH - 10)} fill="url(#sparkGrad)"/>
            <path d={smoothPath(sparkPts)} fill="none" stroke="#B91C1C" strokeWidth="1.5"/>
            {CHARGE_HIST.map((d, i) => (
              <text key={d.y} x={sx(i)} y={sparkH - 1} textAnchor="middle"
                fontSize="7" fontFamily="'DM Mono',monospace" fill="#CBD5E1">
                {i % 2 === 0 ? d.y.slice(2) : ""}
              </text>
            ))}
            <circle cx={sx(CHARGE_HIST.length-1)} cy={sy(CHARGE_HIST[CHARGE_HIST.length-1].v)} r="3"
              fill="#B91C1C"/>
          </svg>
        </div>
      </div>

      {/* Bars */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"16px", justifyContent:"center" }}>
        {bars.map((b, i) => {
          const pct = Math.min((b.val / maxVal) * 100, 100);
          return (
            <div key={i}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"6px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ fontFamily:serif, fontWeight:700, color:"#111", fontSize:"clamp(12px,1.3vw,15px)" }}>
                    {b.label}
                  </span>
                  <span style={{ fontFamily:mono, fontSize:"8px", color:"#9CA3AF", letterSpacing:"0.08em" }}>
                    {b.year}
                  </span>
                  {b.live && (
                    <span style={{ display:"inline-flex", alignItems:"center", gap:"4px",
                      fontFamily:mono, fontSize:"8px", color:"#DC2626", letterSpacing:"0.1em" }}>
                      <span style={{ width:"5px", height:"5px", borderRadius:"50%",
                        background:"#DC2626", display:"inline-block",
                        animation:"blink 1.3s ease-in-out infinite" }}/>
                      LIVE
                    </span>
                  )}
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"clamp(13px,1.5vw,17px)",
                  fontWeight:500, color:b.color }}>
                  {b.val.toFixed(1)} Mds €
                </span>
              </div>
              <div style={{ height:"10px", background:"#F1EDE6", borderRadius:"2px", overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:"2px",
                  background: b.live
                    ? `linear-gradient(90deg, ${b.color} 0%, #DC2626cc 100%)`
                    : b.color,
                  width: shown ? `${pct}%` : "0%",
                  transition: shown ? `width ${0.8 + i * 0.15}s cubic-bezier(0.4,0,0.2,1)` : "none",
                }}/>
              </div>
              <div style={{ fontFamily:mono, fontSize:"8px", color:"#9CA3AF",
                letterSpacing:"0.06em", marginTop:"4px" }}>
                {b.note}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:"12px", fontFamily:mono, fontSize:"8px", color:"#CBD5E1",
        letterSpacing:"0.06em", borderLeft:"2px solid #DDD9D2", paddingLeft:"10px", flexShrink:0 }}>
        * Chine : dette officielle. Hors dettes des collectivités locales hors bilan (estimées 110–130% PIB réel)
        <br/>Sources : DGFiP · PLF 2025 · Cour des comptes · Banque mondiale · FMI
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function DetteClient() {
  const [vue,  setVue]  = useState<"france"|"monde"|"eviction">("france");
  const [secs, setSecs] = useState(0);
  const [cS,   setCS]   = useState(SECS_JAN1);
  const [idx,  setIdx]  = useState(0);
  const [vis,  setVis]  = useState(true);
  const t0  = useRef<number>(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    t0.current = performance.now();
    const tick = () => {
      setSecs((performance.now() - t0.current) / 1000);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setCS(SECS_JAN1 + (performance.now() - t0.current) / 1000), 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % EQUIV.length); setVis(true); }, 500);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  const totalS    = SECS_JAN1 + secs;
  const detteNow  = BASE_FR + totalS * 4534;
  const depuisJan = totalS * 4534;
  const { int, dec } = splitDebt(detteNow);
  const item  = EQUIV[idx];
  const count = Math.floor(depuisJan / item.cout);
  const eMin  = Math.floor(secs / 60);
  const eSec  = Math.floor(secs % 60);

  const ratios: Record<string,number> = {};
  PAYS.forEach(({ k, rate, base, gdp }) => {
    ratios[k] = parseFloat(((base + cS * rate / 1e9) / gdp).toFixed(2));
  });

  const mono  = "'DM Mono', monospace";
  const serif = "'Playfair Display', Georgia, serif";
  const BORDER = "1px solid #DDD9D2";

  const VUES = [
    { k:"france",   l:"France · Temps réel" },
    { k:"monde",    l:"Trajectoires comparées" },
    { k:"eviction", l:"Ce que la dette empêche" },
  ];

  return (
    <div className={styles.widget}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.1} }
        @keyframes rise  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 44px", borderBottom:"1.5px solid #DDD9D2", flexWrap:"wrap", gap:"8px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"20px", flexWrap:"wrap" }}>
          <span style={{ fontFamily:mono, fontSize:"11px", letterSpacing:"0.26em",
            color:"#92400E", textTransform:"uppercase" }}>PRISME</span>
          <div style={{ display:"flex", border:BORDER, flexWrap:"wrap" }}>
            {VUES.map(({ k, l }, i) => (
              <button
                key={k}
                onClick={() => setVue(k as typeof vue)}
                onMouseEnter={(e) => { if (vue !== k) (e.currentTarget as HTMLButtonElement).style.color = "#374151" }}
                onMouseLeave={(e) => { if (vue !== k) (e.currentTarget as HTMLButtonElement).style.color = "#9CA3AF" }}
                style={{
                  fontFamily:mono, fontSize:"9px", letterSpacing:"0.12em", textTransform:"uppercase",
                  padding:"7px 15px",
                  background: vue === k ? "#1a1a1a" : "transparent",
                  color:      vue === k ? "#F9F7F3" : "#9CA3AF",
                  border:"none",
                  borderRight: i < VUES.length - 1 ? BORDER : "none",
                  cursor:"pointer",
                  transition:"background-color var(--dur-base) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                }}
              >{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
          <span style={{ display:"inline-block", width:"6px", height:"6px", borderRadius:"50%",
            background:"#DC2626", animation:"blink 1.3s ease-in-out infinite" }}/>
          <span style={{ fontFamily:mono, fontSize:"9px", letterSpacing:"0.2em",
            color:"#DC2626", textTransform:"uppercase" }}>Live</span>
        </div>
      </div>

      {/* ── VUE FRANCE ── */}
      {vue === "france" && (
        <div style={{ flex:1, display:"grid", gridTemplateColumns:"54% 1px 46%", overflow:"hidden" }}>
          <div style={{ padding:"36px 44px 28px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:mono, fontSize:"9px", letterSpacing:"0.2em",
                color:"#9CA3AF", textTransform:"uppercase", marginBottom:"20px" }}>
                Dette publique · France · INSEE · T4 2025
              </div>
              <div style={{ lineHeight:1, marginBottom:"6px" }}>
                <span style={{ fontFamily:serif, fontWeight:"900", color:"#DC2626",
                  fontSize:"clamp(28px,5vw,60px)", letterSpacing:"-0.03em" }}>{int}</span>
                <span style={{ fontFamily:mono, color:"#DC2626", opacity:.5,
                  fontSize:"clamp(14px,2.5vw,34px)", letterSpacing:"-0.02em" }}>,{dec}</span>
              </div>
              <div style={{ fontFamily:mono, fontSize:"10px", color:"#9CA3AF",
                letterSpacing:"0.14em", marginBottom:"28px" }}>milliards d'euros</div>
              <div style={{ height:"1px", background:"#DDD9D2", marginBottom:"24px" }}/>
              <div>
                <div style={{ fontFamily:mono, fontSize:"9px", letterSpacing:"0.18em",
                  color:"#9CA3AF", textTransform:"uppercase", marginBottom:"8px" }}>
                  Accumulée depuis le 1<sup>er</sup> janvier 2026
                </div>
                <div style={{ fontFamily:serif, fontWeight:700, color:"#92400E",
                  fontSize:"clamp(17px,2.6vw,32px)", letterSpacing:"-0.02em", lineHeight:1 }}>
                  +{grand(depuisJan)} €
                </div>
              </div>
            </div>
            <div>
              <div style={{ height:"1px", background:"#DDD9D2", marginBottom:"14px" }}/>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
                {([["seconde","4 534 €"],["minute","272 k€"],["heure","16,3 M€"],["jour","392 M€"]] as [string,string][]).map(([l,v],i)=>(
                  <div key={l} style={{ borderLeft:i>0?BORDER:"none", paddingLeft:i>0?"12px":"0" }}>
                    <div style={{ fontFamily:mono, fontSize:"8px", color:"#CBD5E1",
                      letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"3px" }}>/{l}</div>
                    <div style={{ fontFamily:mono, fontSize:"11px", color:"#92400E" }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:"12px", fontFamily:mono, fontSize:"8px",
                color:"#CBD5E1", letterSpacing:"0.06em" }}>
                Page ouverte depuis {eMin > 0 ? `${eMin}min ` : ""}{eSec}s
                &nbsp;·&nbsp; +{Math.floor(secs * 4534).toLocaleString("fr-FR")} € depuis votre arrivée
              </div>
            </div>
          </div>

          <div style={{ background:"#DDD9D2" }}/>

          <div style={{ padding:"36px 44px 28px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:mono, fontSize:"9px", letterSpacing:"0.18em",
                color:"#9CA3AF", textTransform:"uppercase", marginBottom:"22px" }}>
                Ce que représente cette somme
              </div>
              <div key={idx} style={{
                animation: vis ? "rise var(--dur-slow) var(--ease-out)" : "none",
                opacity:   vis ? 1 : 0,
                transition: vis ? "none" : "opacity var(--dur-base) var(--ease-out)",
              }}>
                <div style={{ fontFamily:serif, fontStyle:"italic",
                  fontSize:"clamp(11px,1.1vw,13px)", color:"#9CA3AF",
                  marginBottom:"14px", lineHeight:2 }}>
                  Depuis le 1<sup>er</sup> janvier 2026,<br/>cette dette aurait pu financer
                </div>
                <div style={{ fontFamily:serif, fontWeight:"900", color:"#111",
                  fontSize:"clamp(36px,6.5vw,80px)",
                  letterSpacing:"-0.04em", lineHeight:.9, marginBottom:"10px" }}>
                  {grand(count).split(" ")[0]}
                </div>
                {grand(count).includes(" ") && (
                  <div style={{ fontFamily:mono, color:"#92400E",
                    fontSize:"clamp(10px,1.2vw,13px)", letterSpacing:"0.06em",
                    marginBottom:"10px", textTransform:"uppercase" }}>
                    {grand(count).split(" ").slice(1).join(" ")}
                  </div>
                )}
                <div style={{ fontFamily:serif, fontWeight:700, color:"#374151",
                  fontSize:"clamp(13px,1.8vw,20px)", lineHeight:1.2, marginBottom:"12px" }}>
                  {item.phrase}
                </div>
                <div style={{ fontFamily:mono, fontSize:"9px", color:"#9CA3AF",
                  letterSpacing:"0.08em", lineHeight:1.9,
                  borderLeft:"2px solid #DDD9D2", paddingLeft:"13px" }}>
                  {item.detail}
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              {EQUIV.map((_,i) => (
                <div key={i}
                  onClick={() => { setVis(false); setTimeout(() => { setIdx(i); setVis(true); }, 300); }}
                  style={{ width:i===idx?"24px":"6px", height:"3px",
                    background:i===idx?"#1a1a1a":"#DDD9D2",
                    transition:"width var(--dur-slow) var(--ease-out), background-color var(--dur-base) var(--ease-out)",
                    borderRadius:"2px", cursor:"pointer" }}/>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VUE MONDE ── */}
      {vue === "monde" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column",
          padding:"22px 44px 12px", overflow:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", marginBottom:"14px", flexShrink:0, flexWrap:"wrap", gap:"12px" }}>
            <div>
              <h2 style={{ fontFamily:serif, fontWeight:700, color:"#111",
                fontSize:"clamp(14px,1.9vw,20px)", letterSpacing:"-0.01em", marginBottom:"4px" }}>
                Trajectoires de la dette souveraine
              </h2>
              <div style={{ fontFamily:mono, fontSize:"9px", letterSpacing:"0.15em",
                color:"#9CA3AF", textTransform:"uppercase" }}>
                Dette publique en % du PIB · 2000 – maintenant
              </div>
            </div>
            <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
              {PAYS.map(({ k, label, color }) => (
                <div key={k} style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:mono, fontSize:"8px", color:"#9CA3AF",
                    letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"2px" }}>{label}</div>
                  <div style={{ fontFamily:serif, fontWeight:700, color,
                    fontSize:"clamp(11px,1.3vw,15px)" }}>
                    {ratios[k] != null ? ratios[k].toFixed(1) : "—"}
                    <span style={{ fontSize:"0.6em", color:"#CBD5E1" }}>%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex:1, minHeight:0 }}>
            <CourbesRacing />
          </div>
          <div style={{ marginTop:"6px", fontFamily:mono, fontSize:"8px", color:"#CBD5E1",
            letterSpacing:"0.06em", flexShrink:0 }}>
            * Chine : chiffres officiels. Dette réelle estimée 110–130% PIB (hors collectivités locales hors bilan) · Sources : FMI · OCDE · Banque mondiale
          </div>
        </div>
      )}

      {/* ── VUE ÉVICTION ── */}
      {vue === "eviction" && <VueEviction detteVal={depuisJan}/>}

      {/* FOOTER */}
      <div style={{ padding:"9px 44px", borderTop:BORDER,
        display:"flex", justifyContent:"space-between", flexShrink:0, flexWrap:"wrap", gap:"4px" }}>
        <span style={{ fontFamily:mono, fontSize:"8px", color:"#CBD5E1",
          letterSpacing:"0.1em", textTransform:"uppercase" }}>
          Soara · soara.media · Avril 2026
        </span>
        <span style={{ fontFamily:mono, fontSize:"8px", color:"#CBD5E1" }}>
          {vue === "france"
            ? "INSEE mars 2026 · Cour des comptes · DGFiP"
            : vue === "monde"
            ? "FMI · OCDE · Banque mondiale · calculs Soara"
            : "DGFiP · PLF 2025 · Cour des comptes · FMI"}
        </span>
      </div>
    </div>
  );
}
