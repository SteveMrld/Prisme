'use client'
import { useEffect, useRef, useState } from 'react'
import styles from './retrospective.module.css'

export function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <div style={{ position:'fixed', top:0, left:0, right:0, height:'2px', zIndex:999, background:'var(--bord)' }}>
      <div style={{ height:'100%', background:'var(--encre)', width:`${pct}%`, transition:'width 0.1s linear' }} />
    </div>
  )
}

export function HeroAnimated({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function AnimatedItem({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity='1'; el.style.transform='translateY(0)'; obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} style={{ opacity:0, transform:'translateY(40px)', transition:`opacity 0.8s ease ${index*0.04}s, transform 0.8s ease ${index*0.04}s` }}>{children}</div>
}

export function AnimatedStat({ num, label }: { num: string, label: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const target = parseFloat(num.replace(/[^0-9.]/g, '')); if (isNaN(target)) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const dur=1400, t0=performance.now()
        const go=(now:number)=>{ const p=Math.min((now-t0)/dur,1), ease=1-Math.pow(1-p,3)
          el.textContent=num.includes('.')?((ease*target).toFixed(1)):String(Math.round(ease*target))
          if(p<1) requestAnimationFrame(go); else el.textContent=num.replace(/[0-9.]+/,String(target)) }
        requestAnimationFrame(go); obs.disconnect()
      }
    }, { threshold:0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [num])
  return <span ref={ref}>{num}</span>
}

/* ── 1. BAR CHART vertical ── */
function BarChart({ data, color }: { data:{label:string,value:number}[], color:string }) {
  const ref = useRef<SVGGElement>(null)
  const max = Math.max(...data.map(d=>d.value))
  const W=200,H=80,bar=W/data.length-6
  useEffect(() => {
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        el.querySelectorAll('rect').forEach((r,i)=>{
          const h=parseFloat(r.getAttribute('data-h')||'0')
          setTimeout(()=>{ r.style.transition=`height 0.7s ease ${i*0.1}s, y 0.7s ease ${i*0.1}s`; r.style.height=`${h}px`; r.style.y=`${H-h}px` },100)
        }); obs.disconnect()
      }
    },{ threshold:0.3 }); obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return <svg width={W} height={H+18} style={{overflow:'visible'}}><g ref={ref}>
    {data.map((d,i)=>{ const h=(d.value/max)*(H-4),x=i*(bar+6)
      return <g key={i}><rect x={x} y={H-h} width={bar} data-h={h} height={0} fill={color} opacity={0.85} rx={2}/><text x={x+bar/2} y={H+14} textAnchor="middle" fontSize={8} fill="var(--gris-l)">{d.label}</text></g>
    })}
  </g></svg>
}

/* ── 2. DONUT ── */
function DonutChart({ pct, color, label }:{ pct:number, color:string, label:string }) {
  const ref=useRef<SVGCircleElement>(null)
  const r=30,cx=40,cy=40,circ=2*Math.PI*r
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.strokeDashoffset=String(circ)
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.transition='stroke-dashoffset 1.2s ease'; el.style.strokeDashoffset=String(circ*(1-pct/100)); obs.disconnect() }
    },{threshold:0.4}); obs.observe(el)
    return ()=>obs.disconnect()
  },[pct,circ])
  return <svg width={80} height={80}>
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bord)" strokeWidth={8}/>
    <circle ref={ref} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={8}
      strokeDasharray={circ} strokeDashoffset={circ} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
    <text x={cx} y={cy+5} textAnchor="middle" fontSize={13} fontWeight="600" fill="var(--encre)">{pct}%</text>
    <text x={cx} y={cy+18} textAnchor="middle" fontSize={7} fill="var(--gris-l)">{label}</text>
  </svg>
}

/* ── 3. LINE CHART ── */
function LineChart({ data, color }:{ data:number[], color:string }) {
  const ref=useRef<SVGPathElement>(null)
  const W=200,H=70,max=Math.max(...data),min=Math.min(...data)
  const pts=data.map((v,i)=>{ const x=(i/(data.length-1))*W,y=H-((v-min)/(max-min||1))*(H-8)-4; return `${x},${y}` })
  const d=`M ${pts.join(' L ')}`
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const len=el.getTotalLength()
    el.style.strokeDasharray=String(len); el.style.strokeDashoffset=String(len)
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.transition='stroke-dashoffset 1.5s ease'; el.style.strokeDashoffset='0'; obs.disconnect() }
    },{threshold:0.3}); obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return <svg width={W} height={H} style={{overflow:'visible'}}>
    <polyline points={pts.join(' ')} fill="none" stroke="var(--bord)" strokeWidth={1}/>
    <path ref={ref} d={d} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

/* ── 4. THERMO ── */
function Thermometer({ value, max, color }:{ value:number, max:number, color:string }) {
  const ref=useRef<SVGRectElement>(null)
  const pct=value/max
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.transition='height 1.2s ease, y 1.2s ease'; el.style.height=`${pct*60}px`; el.style.y=`${60-pct*60}px`; obs.disconnect() }
    },{threshold:0.3}); obs.observe(el)
    return ()=>obs.disconnect()
  },[pct])
  return <svg width={80} height={90}>
    <rect x={32} y={4} width={16} height={66} rx={8} fill="var(--bord)"/>
    <rect ref={ref} x={32} y={64} width={16} height={0} rx={8} fill={color}/>
    <circle cx={40} cy={76} r={10} fill={color}/>
    <text x={40} y={80} textAnchor="middle" fontSize={9} fontWeight="700" fill="#fff">{value}°</text>
  </svg>
}

/* ── 5. GAUGE ── */
function TensionGauge({ level, color }:{ level:number, color:string }) {
  const r=35,cx=50,cy=50,toRad=(a:number)=>a*Math.PI/180
  const arc=(a1:number,a2:number)=>{
    const x1=cx+r*Math.cos(toRad(a1)),y1=cy+r*Math.sin(toRad(a1)),x2=cx+r*Math.cos(toRad(a2)),y2=cy+r*Math.sin(toRad(a2))
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }
  const angle=-180+(level/10)*180
  const nx=cx+(r-8)*Math.cos(toRad(angle)),ny=cy+(r-8)*Math.sin(toRad(angle))
  return <svg width={100} height={60}>
    <path d={arc(-180,0)} fill="none" stroke="var(--bord)" strokeWidth={8}/>
    <path d={arc(-180,-180+(level/10)*180)} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"/>
    <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--encre)" strokeWidth={2} strokeLinecap="round"/>
    <circle cx={cx} cy={cy} r={3} fill="var(--encre)"/>
    <text x={cx} y={cy+14} textAnchor="middle" fontSize={8} fill="var(--gris-l)">{level}/10</text>
  </svg>
}

/* ── 6. HORIZONTAL BARS ── */
function HorizBar({ data, color }:{ data:{label:string,value:number}[], color:string }) {
  const ref=useRef<SVGGElement>(null)
  const max=Math.max(...data.map(d=>d.value))
  const W=180,rowH=18
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        el.querySelectorAll('rect').forEach((r,i)=>{
          const w=parseFloat(r.getAttribute('data-w')||'0')
          setTimeout(()=>{ r.style.transition=`width 0.7s ease ${i*0.12}s`; r.style.width=`${w}px` },100)
        }); obs.disconnect()
      }
    },{threshold:0.3}); obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return <svg width={W} height={data.length*rowH+4} style={{overflow:'visible'}}><g ref={ref}>
    {data.map((d,i)=>{ const w=(d.value/max)*(W-50); return <g key={i}>
      <text x={0} y={i*rowH+13} fontSize={8} fill="var(--gris-l)">{d.label}</text>
      <rect x={46} y={i*rowH+4} width={0} data-w={w} height={10} fill={color} opacity={0.8} rx={2}/>
      <text x={46+w+4} y={i*rowH+13} fontSize={8} fill={color}>{d.value}%</text>
    </g>})}
  </g></svg>
}

/* ── 7. DOT GRID (population) ── */
function DotGrid({ total, highlighted, color }:{ total:number, highlighted:number, color:string }) {
  const cols=8, rows=Math.ceil(total/cols)
  const ref=useRef<SVGGElement>(null)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const circles=el.querySelectorAll('circle')
    circles.forEach(c=>{ c.style.opacity='0'; c.style.r='0' })
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        circles.forEach((c,i)=>{ setTimeout(()=>{ c.style.transition='opacity 0.3s ease, r 0.3s ease'; c.style.opacity='1'; c.style.r='5' },i*30) })
        obs.disconnect()
      }
    },{threshold:0.3}); obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return <svg width={cols*14} height={rows*14} style={{overflow:'visible'}}><g ref={ref}>
    {Array.from({length:total}).map((_,i)=>{
      const x=(i%cols)*14+7, y=Math.floor(i/cols)*14+7
      return <circle key={i} cx={x} cy={y} r={0} fill={i<highlighted?color:'var(--bord)'} style={{opacity:0}}/>
    })}
  </g></svg>
}

/* ── 8. BUBBLE CHART ── */
function BubbleChart({ data, color }:{ data:{label:string,value:number}[], color:string }) {
  const ref=useRef<SVGGElement>(null)
  const max=Math.max(...data.map(d=>d.value))
  const positions=[{cx:50,cy:55},{cx:130,cy:45},{cx:95,cy:80},{cx:170,cy:75}]
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const circles=el.querySelectorAll('circle')
    circles.forEach(c=>{ c.style.r='0' })
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        circles.forEach((c,i)=>{ const r=c.getAttribute('data-r')||'0'; setTimeout(()=>{ c.style.transition=`r 0.8s ease ${i*0.15}s`; c.style.r=r },100) })
        obs.disconnect()
      }
    },{threshold:0.3}); obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return <svg width={210} height={110} style={{overflow:'visible'}}><g ref={ref}>
    {data.map((d,i)=>{ const r=8+(d.value/max)*32, pos=positions[i]||{cx:50+i*40,cy:55}; return <g key={i}>
      <circle cx={pos.cx} cy={pos.cy} r={0} data-r={r} fill={color} opacity={i===0?0.85:0.45}/>
      <text x={pos.cx} y={pos.cy+4} textAnchor="middle" fontSize={8} fill="#fff" fontWeight="600">{d.label}</text>
    </g>})}
  </g></svg>
}

/* ── 9. AREA CHART ── */
function AreaChart({ data, color }:{ data:number[], color:string }) {
  const ref=useRef<SVGPathElement>(null)
  const W=200,H=70,max=Math.max(...data),min=Math.min(...data)
  const pts=data.map((v,i)=>{ const x=(i/(data.length-1))*W,y=H-((v-min)/(max-min||1))*(H-8)-4; return [x,y] })
  const linePath=`M ${pts.map(p=>p.join(',')).join(' L ')}`
  const areaPath=`${linePath} L ${W},${H} L 0,${H} Z`
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const len=el.getTotalLength()
    el.style.strokeDasharray=String(len); el.style.strokeDashoffset=String(len)
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.transition='stroke-dashoffset 1.5s ease'; el.style.strokeDashoffset='0'; obs.disconnect() }
    },{threshold:0.3}); obs.observe(el)
    return ()=>obs.disconnect()
  },[])
  return <svg width={W} height={H} style={{overflow:'visible'}}>
    <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
    <path d={areaPath} fill="url(#areaGrad)"/>
    <path ref={ref} d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

/* ── 10. RADIAL BARS ── */
function RadialBars({ data, color }:{ data:{label:string,value:number}[], color:string }) {
  const cx=55,cy=55,minR=18,maxR=48
  const max=Math.max(...data.map(d=>d.value))
  const refs=useRef<(SVGCircleElement|null)[]>([])
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){
        refs.current.forEach((el,i)=>{
          if(!el) return
          const circ=parseFloat(el.getAttribute('data-circ')||'0')
          const pct=parseFloat(el.getAttribute('data-pct')||'0')
          el.style.strokeDasharray=String(circ)
          el.style.strokeDashoffset=String(circ)
          setTimeout(()=>{ el.style.transition=`stroke-dashoffset 1s ease ${i*0.2}s`; el.style.strokeDashoffset=String(circ*(1-pct)) },100)
        }); obs.disconnect()
      }
    },{threshold:0.3})
    if(refs.current[0]) obs.observe(refs.current[0])
    return ()=>obs.disconnect()
  },[])
  return <svg width={110} height={110} style={{overflow:'visible'}}>
    {data.map((d,i)=>{
      const r=minR+i*(maxR-minR)/(data.length-1||1)
      const circ=2*Math.PI*r, pct=d.value/max
      return <g key={i}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bord)" strokeWidth={5}/>
        <circle ref={el=>{ refs.current[i]=el }} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeLinecap="round" data-circ={circ} data-pct={pct}
          strokeDasharray={circ} strokeDashoffset={circ}
          transform={`rotate(-90 ${cx} ${cy})`} opacity={0.6+i*0.1}/>
        <text x={cx+r+6} y={cy-minR+(i*(maxR-minR)/(data.length-1||1))+4} fontSize={7} fill="var(--gris-l)">{d.label}</text>
      </g>
    })}
    <text x={cx} y={cy+5} textAnchor="middle" fontSize={10} fontWeight="700" fill="var(--encre)">{data.length}</text>
    <text x={cx} y={cy+16} textAnchor="middle" fontSize={7} fill="var(--gris-l)">entités</text>
  </svg>
}

/* ── SELECTOR ── */
export function MonthChart({ chartType, chartData, color }:{ cat:string, chartType:string, chartData:any, color:string }) {
  if(chartType==='bar') return <BarChart data={chartData} color={color}/>
  if(chartType==='donut') return <DonutChart pct={chartData.pct} color={color} label={chartData.label}/>
  if(chartType==='line') return <LineChart data={chartData} color={color}/>
  if(chartType==='thermo') return <Thermometer value={chartData.value} max={chartData.max} color={color}/>
  if(chartType==='gauge') return <TensionGauge level={chartData} color={color}/>
  if(chartType==='horizbar') return <HorizBar data={chartData} color={color}/>
  if(chartType==='dotgrid') return <DotGrid total={chartData.total} highlighted={chartData.highlighted} color={color}/>
  if(chartType==='bubble') return <BubbleChart data={chartData} color={color}/>
  if(chartType==='area') return <AreaChart data={chartData} color={color}/>
  if(chartType==='radial') return <RadialBars data={chartData} color={color}/>
  return null
}
