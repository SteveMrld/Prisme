// @ts-nocheck
'use client'
import { useState, useEffect, useRef } from 'react'

/* ════════════════════════════════════════════════════════════════
   COUNT UP
   ════════════════════════════════════════════════════════════════ */
export default function CountUp({ target, duration = 1600, decimals = 0, suffix = '', trigger = true }) {
  const [val, setVal] = useState(0)
  const startRef = useRef(null)
  useEffect(() => {
    if (!trigger) return
    startRef.current = null
    let raf
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const p = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, trigger])
  return <>{val.toFixed(decimals).replace('.', ',')}{suffix}</>
}
