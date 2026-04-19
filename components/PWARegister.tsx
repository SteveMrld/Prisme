'use client'
import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // On attend que la page soit chargée pour ne pas competitonner avec le rendu
    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // En dev on peut voir ça dans la console
          if (process.env.NODE_ENV === 'development') {
            console.log('[PWA] Service worker enregistré:', registration.scope)
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[PWA] Échec enregistrement SW:', error)
          }
        })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
