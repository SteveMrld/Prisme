'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './BackButton.module.css'

interface Props {
  fallback?: string
  label?: string
}

/**
 * Bouton de retour discret affiché en haut des pages internes
 * (articles, grands formats, etc.). Utilise router.back() s'il
 * existe un historique de navigation côté client, sinon retombe
 * sur un lien explicite (par défaut la home), pour gérer le cas
 * où le visiteur arrive directement depuis un lien externe.
 */
export default function BackButton({ fallback = '/', label = 'Retour' }: Props) {
  const router = useRouter()
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    setHasHistory(typeof window !== 'undefined' && window.history.length > 1)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (hasHistory) {
      router.back()
    } else {
      router.push(fallback)
    }
  }

  return (
    <div className={styles.wrap}>
      <a href={fallback} onClick={handleClick} className={styles.btn} aria-label={label}>
        <span className={styles.arrow} aria-hidden="true">←</span>
        <span className={styles.label}>{label}</span>
      </a>
    </div>
  )
}
