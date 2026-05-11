'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './signal-map.module.css'

const COLOR: Record<string,string> = {
  crisis:'#FC8181', tension:'#F6AD55', watch:'#F6E05E',
  climate:'#4dd9ac', calm:'#68D391'
}
const TRENDCOL: Record<string,string> = {up:'#FC8181',down:'#68D391',stable:'rgba(255,255,255,0.35)'}
const TRENDSYM: Record<string,string> = {up:'↑',down:'↓',stable:'→'}

interface Zone {
  name:string; region:string; status:string; trend:string;
  desc:string; tags:string[]; tagColors:string[]; figures:string[];
  affected:string; france:number; updated:string;
}

export default function SignalMapPage() {
  const [zone, setZone] = useState<Zone|null>(null)
  const [idx, setIdx] = useState(0)
  const [total, setTotal] = useState(12)
  const [panelMounted, setPanelMounted] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'ZONE_CHANGE') {
        setZone(e.data.zone)
        setIdx(e.data.index)
        setTotal(e.data.total)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (zone && !panelMounted) {
      const id = requestAnimationFrame(() => setPanelMounted(true))
      return () => cancelAnimationFrame(id)
    }
  }, [zone, panelMounted])

  const call = (fn: string, arg?: number) => {
    iframeRef.current?.contentWindow?.postMessage({type:'CALL', fn, arg}, '*')
    if (iframeRef.current?.contentWindow) {
      (iframeRef.current.contentWindow as any)[fn]?.(arg)
    }
  }

  const col = zone ? COLOR[zone.status] : '#C8A96E'
  const franceColor = zone ? (zone.france >= 7 ? '#FC8181' : zone.france >= 5 ? '#F6AD55' : '#68D391') : '#68D391'

  return (
    <>
      <iframe
        ref={iframeRef}
        src="/signal-globe.html"
        style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', border:'none', zIndex:0 }}
        title="Soara Signal"
        allowFullScreen
      />

      {zone && (
        <div style={{
          position:'fixed', bottom:0, left:0, right:0,
          zIndex:200,
          paddingBottom:'calc(64px + env(safe-area-inset-bottom))',
          pointerEvents:'none',
        }}>
          <div
            className={`${styles.panel} ${panelMounted ? styles.panelMounted : ''}`}
            style={{
              margin:'0 12px',
              background:'rgba(4,6,13,0.96)',
              borderTop:`3px solid ${col}`,
              borderLeft:`none`,
              borderRight:'1px solid rgba(255,255,255,0.08)',
              borderBottom:'1px solid rgba(255,255,255,0.08)',
              backdropFilter:'blur(16px)',
              pointerEvents:'all',
              overflow:'hidden',
            }}
          >
            <div key={zone.name} className={styles.content}>
              {/* Header zone */}
              <div style={{ padding:'10px 14px 6px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontFamily:'DM Mono,monospace', fontSize:'7px', letterSpacing:'3px', textTransform:'uppercase', color:'rgba(200,169,110,0.5)', marginBottom:'3px' }}>
                      {zone.region}
                    </div>
                    <div style={{ fontFamily:'Playfair Display,serif', fontSize:'20px', color:'#ECE7DD', display:'flex', alignItems:'center', gap:'8px' }}>
                      {zone.name}
                      <span style={{ fontSize:'14px', fontWeight:700, color:TRENDCOL[zone.trend] }}>{TRENDSYM[zone.trend]}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily:'DM Mono,monospace', fontSize:'8px', color:'rgba(255,255,255,0.2)', letterSpacing:'1px', flexShrink:0, paddingTop:'4px' }}>
                    {idx+1} / {total}
                  </div>
                </div>
              </div>

              {/* Meta — personnes + France + date */}
              <div style={{ padding:'6px 14px', display:'flex', gap:'12px', flexWrap:'wrap', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.02)' }}>
                <span style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', color:'rgba(255,255,255,0.5)' }}>👥 {zone.affected}</span>
                <span style={{ fontFamily:'DM Mono,monospace', fontSize:'9px', color:'rgba(255,255,255,0.5)' }}>
                  🇫🇷 France : <strong style={{ color:franceColor, transition:'color var(--dur-base) var(--ease-out)' }}>{zone.france}/10</strong>
                </span>
                <span style={{ fontFamily:'DM Mono,monospace', fontSize:'8px', color:'rgba(255,255,255,0.25)' }}>Màj {zone.updated}</span>
              </div>

              {/* Description */}
              <div style={{ padding:'8px 14px 6px', fontSize:'12.5px', color:'rgba(236,231,221,0.85)', lineHeight:'1.55' }}>
                {zone.desc}
              </div>

              {/* Chiffres clés */}
              <div style={{ padding:'0 14px 8px', display:'flex', gap:'5px', flexWrap:'wrap' }}>
                {zone.figures?.map((f,i) => (
                  <span key={i} style={{
                    fontFamily:'DM Mono,monospace', fontSize:'9px', color:'rgba(255,255,255,0.7)',
                    background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.08)',
                    padding:'3px 8px', borderRadius:'2px'
                  }}>{f}</span>
                ))}
              </div>

              {/* Tags */}
              <div style={{ padding:'0 14px 8px', display:'flex', gap:'4px', flexWrap:'wrap' }}>
                {zone.tags?.map((tag,i) => (
                  <span key={i} style={{
                    fontFamily:'DM Mono,monospace', fontSize:'7px', fontWeight:700,
                    letterSpacing:'1.5px', textTransform:'uppercase',
                    padding:'2px 7px', border:`1px solid ${zone.tagColors[i]}44`,
                    color:zone.tagColors[i], borderRadius:'1px',
                    transition:'border-color var(--dur-base) var(--ease-out)'
                  }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Navigation — hors du content (pas de replay au zone change) */}
            <div style={{ padding:'6px 14px 10px', display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
              {/* Dots */}
              <div style={{ display:'flex', gap:'5px' }}>
                {Array.from({length:total}).map((_,i) => (
                  <div
                    key={i}
                    onClick={() => call('goToZone', i)}
                    className={`${styles.dot} ${i===idx ? styles.dotActive : ''}`}
                    style={{
                      background: i===idx ? '#C8A96E' : i<idx ? 'rgba(200,169,110,0.3)' : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
              {/* Boutons */}
              <div style={{ display:'flex', gap:'6px' }}>
                <button onClick={() => call('prevZone')} className={styles.btn}>← Préc.</button>
                <button
                  onClick={() => call(idx === total-1 ? 'goToZone' : 'nextZone', idx === total-1 ? 0 : undefined)}
                  className={styles.btnAccent}
                  style={{ border:`1px solid ${col}66`, color:col }}
                >
                  {idx === total-1 ? '↺ Début' : 'Suiv. →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
