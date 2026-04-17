// @ts-nocheck
'use client'
import { useState, useEffect, useRef } from 'react'

const C = {
  bg: '#ffffff', surface: '#f8f7f4', border: '#e5e0d8',
  gold: '#b8922a', goldLight: '#c9a84c', amber: '#d97706',
  red: '#991b1b', redLight: '#ef4444',
  text: '#111111', dim: '#6b7280', muted: '#d1cdc5',
}

const TIMELINE = [
  { year: 1970, loss: 5,  label: 'Premières monocultures intensives' },
  { year: 1980, loss: 8,  label: 'Généralisation des pesticides organochlorés' },
  { year: 1994, loss: 11, label: 'Introduction des néonicotinoïdes — Bayer' },
  { year: 2000, loss: 15, label: 'Déclin documenté en Europe et Amérique du Nord' },
  { year: 2006, loss: 24, label: '"Colony Collapse Disorder" nommé aux États-Unis' },
  { year: 2010, loss: 30, label: '30% de pertes annuelles aux États-Unis' },
  { year: 2013, loss: 34, label: 'UE suspend 3 néonicotinoïdes' },
  { year: 2018, loss: 40, label: 'Walmart dépose les brevets drones pollinisateurs' },
  { year: 2020, loss: 43, label: 'France accorde des dérogations aux néonicotinoïdes' },
  { year: 2023, loss: 48, label: '48% des colonies américaines perdues en un hiver' },
]

const CROPS = [
  { name: 'Amandes',  dep: 100, color: '#ef4444' },
  { name: 'Café',     dep: 95,  color: '#ef4444' },
  { name: 'Fraises',  dep: 90,  color: '#f87171' },
  { name: 'Cacao',    dep: 80,  color: '#fca5a5' },
  { name: 'Tomates',  dep: 75,  color: '#fca5a5' },
  { name: 'Colza',    dep: 50,  color: '#d97706' },
  { name: 'Soja',     dep: 40,  color: '#d97706' },
  { name: 'Coton',    dep: 25,  color: '#6b7280' },
  { name: 'Maïs',     dep: 5,   color: '#374151' },
  { name: 'Blé',      dep: 5,   color: '#374151' },
]

const FRACTURE = [
  { region: 'Amérique du Nord', access: 85, farmers: 3,   risk: 'low' },
  { region: 'Europe',           access: 78, farmers: 10,  risk: 'low' },
  { region: 'Chine',            access: 60, farmers: 240, risk: 'medium' },
  { region: 'Amérique latine',  access: 20, farmers: 60,  risk: 'high' },
  { region: 'Asie du Sud',      access: 8,  farmers: 300, risk: 'critical' },
  { region: 'Afrique subsaharienne', access: 3, farmers: 400, risk: 'critical' },
]

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  return [ref, v]
}

function Counter({ to, dur = 1800, suffix = '' }) {
  const [ref, v] = useInView(0.5)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!v) return
    let s = null
    const fn = (t) => {
      if (!s) s = t
      const p = Math.min((t - s) / dur, 1)
      const e = p < 0.5 ? 2*p*p : -1+(4-2*p)*p
      setN(Math.round(e * to))
      if (p < 1) requestAnimationFrame(fn)
    }
    requestAnimationFrame(fn)
  }, [v])
  return <span ref={ref}>{n.toLocaleString('fr-FR')}{suffix}</span>
}

function Honeycomb({ progress }) {
  const cols = 14, rows = 6
  const W = 26, H = 22
  const hex = (cx, cy, s) => Array.from({length:6},(_,i)=>{
    const a = Math.PI/180*(60*i-30)
    return `${cx+s*Math.cos(a)},${cy+s*Math.sin(a)}`
  }).join(' ')
  const total = cols * rows
  return (
    <svg viewBox={`0 0 ${cols*W*1.5+13} ${rows*H+12}`}
      style={{width:'100%', maxHeight:'200px', display:'block'}}>
      {Array.from({length:rows}, (_,r) =>
        Array.from({length:cols}, (_,c) => {
          const idx = r*cols+c
          const thr = idx/total
          const alive = progress < thr
          const fade = alive ? 1 : Math.max(0, 1-(progress-thr)*10)
          const x = c*W*1.5+(r%2?W*0.75:0)+13
          const y = r*H+12
          return (
            <polygon key={idx} points={hex(x,y,10)}
              fill={alive?`rgba(201,168,76,${0.1+fade*0.5})`:`rgba(153,27,27,${0.08+(1-fade)*0.12})`}
              stroke={alive?C.gold:C.red}
              strokeWidth="0.4"
              opacity={0.2+fade*0.8}
              style={{transition:'all 0.4s ease'}}
            />
          )
        })
      )}
    </svg>
  )
}

function Intro() {
  const ref = useRef(null)
  const [prog, setProg] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true) }, {threshold:0.3})
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [])
  useEffect(() => {
    if (!on) return
    let s = null
    const fn = (t) => {
      if (!s) s = t
      const p = Math.min((t-s)/4200, 1)
      setProg(p)
      if (p < 1) requestAnimationFrame(fn)
    }
    const id = setTimeout(() => requestAnimationFrame(fn), 500)
    return () => clearTimeout(id)
  }, [on])
  const lost = Math.round(prog * 48)
  return (
    <div ref={ref} style={{background:C.bg, padding:'72px 24px 56px', borderTop:`1px solid ${C.border}`}}>
      <div style={{maxWidth:'660px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'40px'}}>
          <div style={{fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:C.dim, fontFamily:"'DM Sans',sans-serif", marginBottom:'14px'}}>Visualisation · Données</div>
          <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,4vw,40px)', fontWeight:400, color:C.text, lineHeight:1.15, margin:'0 0 14px'}}>La ruche vide</h2>
          <p style={{fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:C.dim, fontSize:'14px', lineHeight:1.65, maxWidth:'420px', margin:'0 auto'}}>
            Chaque hexagone représente une fraction des colonies d'abeilles américaines. Le rouge signale ce qui a déjà disparu.
          </p>
        </div>
        <Honeycomb progress={prog} />
        <div style={{display:'flex', justifyContent:'center', gap:'40px', marginTop:'36px', flexWrap:'wrap'}}>
          {[
            {val: 100-lost, suf:'%', label:'Colonies survivantes', color: C.gold},
            {val: lost, suf:'%', label:'Pertes · Hiver 2022–23', color: prog>0.3?C.redLight:C.dim},
          ].map(({val,suf,label,color},i) => (
            <div key={i} style={{textAlign:'center'}}>
              <div style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(40px,7vw,68px)', fontWeight:400, color, lineHeight:1, transition:'color 0.5s'}}>{val}{suf}</div>
              <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:C.dim, marginTop:'8px'}}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center', marginTop:'28px', fontSize:'9px', color:C.muted, fontFamily:"'DM Sans',sans-serif", letterSpacing:'1px'}}>SOURCE : USDA HONEY BEE COLONIES REPORT 2023</div>
      </div>
    </div>
  )
}

function Timeline() {
  const [ref, v] = useInView(0.1)
  const [active, setActive] = useState(null)
  const max = Math.max(...TIMELINE.map(d=>d.loss))
  return (
    <div ref={ref} style={{background:C.surface, padding:'72px 24px', borderTop:`1px solid ${C.border}`}}>
      <div style={{maxWidth:'660px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'48px'}}>
          <div style={{fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:C.dim, fontFamily:"'DM Sans',sans-serif", marginBottom:'12px'}}>Acte I</div>
          <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(19px,3vw,28px)', fontWeight:400, color:C.text, margin:0}}>
            Cinquante ans de destruction <em style={{color:C.gold}}>documentée</em>
          </h3>
        </div>
        <div style={{position:'relative', paddingBottom:'36px'}}>
          <div style={{position:'absolute', bottom:'36px', left:0, right:0, height:'1px', background:C.border}} />
          <div style={{display:'flex', alignItems:'flex-end', height:'180px', gap:'2px'}}>
            {TIMELINE.map((d,i) => {
              const h = (d.loss/max)*150
              const hot = d.year >= 2006
              const isA = active?.year===d.year
              return (
                <div key={d.year} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer'}}
                  onMouseEnter={()=>setActive(d)} onMouseLeave={()=>setActive(null)}>
                  <div style={{
                    width:'100%', maxWidth:'36px',
                    height: v?`${h}px`:'0px',
                    background: hot?`linear-gradient(to top,${C.red},${C.redLight})`:`linear-gradient(to top,${C.muted},${C.dim})`,
                    borderRadius:'2px 2px 0 0',
                    transition:`height 0.7s cubic-bezier(.22,1,.36,1) ${i*70}ms`,
                    opacity: isA?1:0.72,
                    outline: isA?`1px solid ${C.gold}`:'none',
                  }}>
                    {isA && <div style={{position:'absolute', top:'-5px', left:'50%', transform:'translateX(-50%)', width:'7px', height:'7px', borderRadius:'50%', background:C.gold}} />}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{display:'flex', gap:'2px', marginTop:'8px'}}>
            {TIMELINE.map(d => (
              <div key={d.year} style={{flex:1, textAlign:'center', fontFamily:"'DM Sans',sans-serif", fontSize:'8px', color:active?.year===d.year?C.gold:C.muted, transform:'rotate(-40deg)', transformOrigin:'top center', whiteSpace:'nowrap', transition:'color .2s'}}>
                {d.year}
              </div>
            ))}
          </div>
        </div>
        <div style={{marginTop:'16px', padding:'16px 20px', background:C.bg, border:`1px solid ${C.border}`, borderLeft:`3px solid ${active?C.gold:C.border}`, minHeight:'60px', transition:'border-color .3s'}}>
          {active ? (
            <>
              <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'10px', color:C.gold, letterSpacing:'1px', marginBottom:'4px'}}>{active.year} — {active.loss}% de pertes annuelles</div>
              <div style={{fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:C.text, fontSize:'14px'}}>{active.label}</div>
            </>
          ) : (
            <div style={{fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:C.dim, fontSize:'13px'}}>Passez sur une barre pour voir les jalons historiques</div>
          )}
        </div>
        <div style={{textAlign:'center', marginTop:'48px', padding:'32px', borderTop:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(52px,9vw,92px)', fontWeight:400, color:C.redLight, lineHeight:1}}>
            <Counter to={48} suffix="%" />
          </div>
          <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', color:C.dim, marginTop:'12px'}}>Des colonies américaines perdues en un seul hiver · 2022–2023</div>
        </div>
      </div>
    </div>
  )
}

function Assiette() {
  const [ref, v] = useInView(0.1)
  const [hov, setHov] = useState(null)
  return (
    <div ref={ref} style={{background:C.bg, padding:'72px 24px', borderTop:`1px solid ${C.border}`}}>
      <div style={{maxWidth:'660px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'48px'}}>
          <div style={{fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:C.dim, fontFamily:"'DM Sans',sans-serif", marginBottom:'12px'}}>Acte II</div>
          <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(19px,3vw,28px)', fontWeight:400, color:C.text, margin:0}}>
            Ce qui disparaîtrait <em style={{color:C.gold}}>de notre assiette</em>
          </h3>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'3px'}}>
          {CROPS.map((c,i) => (
            <div key={c.name}
              onMouseEnter={()=>setHov(c)} onMouseLeave={()=>setHov(null)}
              style={{
                display:'flex', alignItems:'center', gap:'14px', padding:'10px 14px',
                background:hov?.name===c.name?C.surface:'transparent',
                border:`1px solid ${hov?.name===c.name?C.border:'transparent'}`,
                borderRadius:'2px',
                opacity:v?1:0, transform:v?'translateX(0)':'translateX(-20px)',
                transition:`all .5s cubic-bezier(.22,1,.36,1) ${i*55}ms`,
              }}>
              <div style={{width:'80px', flexShrink:0, fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:600, color:C.text}}>{c.name}</div>
              <div style={{flex:1, height:'4px', background:C.muted, borderRadius:'2px', overflow:'hidden'}}>
                <div style={{height:'100%', width:v?`${c.dep}%`:'0%', background:c.color, borderRadius:'2px', transition:`width .9s cubic-bezier(.22,1,.36,1) ${i*55}ms`}} />
              </div>
              <div style={{width:'44px', textAlign:'right', fontFamily:"'DM Sans',sans-serif", fontSize:'13px', fontWeight:700, color:c.color, flexShrink:0}}>{c.dep}%</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:'40px', padding:'22px', background:C.surface, borderLeft:`3px solid ${C.gold}`}}>
          <div style={{fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'15px', color:'#333', lineHeight:1.6}}>
            La valeur économique annuelle des services de pollinisation est estimée à <strong style={{color:C.gold, fontStyle:'normal'}}>577 milliards de dollars</strong>. Aucun modèle technologique actuel ne peut en assurer le remplacement à cette échelle.
          </div>
          <div style={{fontSize:'9px', color:C.dim, marginTop:'10px', fontFamily:"'DM Sans',sans-serif", letterSpacing:'1px'}}>SOURCE : IPBES 2016 · FAO 2023</div>
        </div>
      </div>
    </div>
  )
}

function Fracture() {
  const [ref, v] = useInView(0.1)
  const rc = {low:C.gold, medium:C.amber, high:'#f97316', critical:C.redLight}
  const rl = {low:'Accès probable', medium:'Accès partiel', high:'Accès limité', critical:'Aucun accès'}
  return (
    <div ref={ref} style={{background:C.surface, padding:'72px 24px', borderTop:`1px solid ${C.border}`}}>
      <div style={{maxWidth:'660px', margin:'0 auto'}}>
        <div style={{textAlign:'center', marginBottom:'48px'}}>
          <div style={{fontSize:'9px', letterSpacing:'4px', textTransform:'uppercase', color:C.dim, fontFamily:"'DM Sans',sans-serif", marginBottom:'12px'}}>Acte III</div>
          <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(19px,3vw,28px)', fontWeight:400, color:C.text, margin:'0 0 8px'}}>Qui pourra se payer</h3>
          <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(19px,3vw,28px)', fontWeight:400, color:C.redLight, fontStyle:'italic', margin:0}}>la pollinisation artificielle ?</h3>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {FRACTURE.map((d,i) => {
            const col = rc[d.risk]
            return (
              <div key={d.region} style={{
                display:'grid', gridTemplateColumns:'170px 1fr 52px',
                alignItems:'center', gap:'14px', padding:'16px',
                border:`1px solid ${C.border}`, background:C.bg, borderLeft:`3px solid ${col}`,
                opacity:v?1:0, transform:v?'translateY(0)':'translateY(18px)',
                transition:`all .6s cubic-bezier(.22,1,.36,1) ${i*75}ms`,
              }}>
                <div>
                  <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'12px', fontWeight:600, color:C.text, marginBottom:'3px'}}>{d.region}</div>
                  <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'9px', color:col, letterSpacing:'1px', textTransform:'uppercase'}}>{rl[d.risk]}</div>
                </div>
                <div>
                  <div style={{height:'5px', background:C.muted, borderRadius:'3px', overflow:'hidden', marginBottom:'4px'}}>
                    <div style={{height:'100%', width:v?`${d.access}%`:'0%', background:col, borderRadius:'3px', transition:`width 1s cubic-bezier(.22,1,.36,1) ${i*75+200}ms`}} />
                  </div>
                  <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'9px', color:C.dim}}>{d.farmers}M agriculteurs</div>
                </div>
                <div style={{textAlign:'right', fontFamily:"'Playfair Display',serif", fontSize:'20px', fontWeight:400, color:col}}>{d.access}%</div>
              </div>
            )
          })}
        </div>
        <div style={{marginTop:'56px', textAlign:'center', padding:'44px 24px', border:`1px solid ${C.border}`, background:C.bg, position:'relative', overflow:'hidden'}}>
          <div style={{position:'absolute', inset:0, background:`radial-gradient(ellipse at center, rgba(153,27,27,0.1) 0%, transparent 70%)`, pointerEvents:'none'}} />
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'clamp(52px,9vw,96px)', fontWeight:400, color:C.redLight, lineHeight:1, position:'relative'}}>
            <Counter to={700} suffix="M" dur={2000} />
          </div>
          <div style={{fontFamily:"'Playfair Display',serif", fontStyle:'italic', fontSize:'clamp(13px,2vw,16px)', color:C.dim, marginTop:'14px', maxWidth:'420px', margin:'14px auto 0', lineHeight:1.65, position:'relative'}}>
            d'agriculteurs dans les pays à faible revenu sans aucune alternative possible à la pollinisation naturelle
          </div>
          <div style={{fontFamily:"'DM Sans',sans-serif", fontSize:'9px', color:C.muted, marginTop:'14px', letterSpacing:'2px', textTransform:'uppercase', position:'relative'}}>Source : FAO · The State of Food and Agriculture 2023</div>
        </div>
      </div>
    </div>
  )
}

export default function PollinisationViz() {
  return (
    <div style={{background:C.bg, color:C.text, width:'100%', overflow:'hidden'}}>
      <Intro />
      <Timeline />
      <Assiette />
      <Fracture />
    </div>
  )
}
