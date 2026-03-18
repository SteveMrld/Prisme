'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1]

export function AnimBand({ children, color, className }: { children: ReactNode; color: string; className?: string }) {
  return (
    <motion.div
      className={className}
      style={{ borderColor: color }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  )
}

export function AnimFeatured({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease }}
    >
      {children}
    </motion.div>
  )
}

export function AnimGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } }
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } }
      }}
    >
      {children}
    </motion.div>
  )
}
