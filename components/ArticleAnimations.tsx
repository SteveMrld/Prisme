'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

const ease = [0.22, 1, 0.36, 1]

// Hero image avec effet parallax subtil
export function ParallaxHero({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.img
        src={src}
        alt={alt}
        className={className}
        style={{ y }}
      />
    </div>
  )
}

// Titre article qui apparaît en fondu
export function ArticleTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease }}
    >
      {children}
    </motion.div>
  )
}

// Progress bar de lecture
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'var(--or)',
        scaleX: scrollYProgress,
        transformOrigin: '0%',
        zIndex: 100,
      }}
    />
  )
}
