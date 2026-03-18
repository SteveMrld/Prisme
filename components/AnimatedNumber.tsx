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

export default function AnimatedNumber({ value, suffix = '', prefix = '', duration = 2.5, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const startTime = Date.now()
    const endTime = startTime + duration * 1000
    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCurrent(Math.round(eased * value))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{current.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}
