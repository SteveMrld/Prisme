'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}

export default function CountUp({ value, suffix = '', prefix = '', duration = 2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const start = Date.now()
    const end = start + duration * 1000

    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - start) / (duration * 1000), 1)
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress >= 1) clearInterval(timer)
    }, 16)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}
