'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/lib/hooks/useReveal'
import styles from './visuels.module.css'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
  threshold?: number
}

export function Reveal({
  children,
  delay = 0,
  className = '',
  style,
  threshold = 0.15,
}: RevealProps) {
  const [ref, visible] = useReveal<HTMLDivElement>({ mode: 'once', threshold })
  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealIn : ''} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
