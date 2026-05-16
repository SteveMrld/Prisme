import { useEffect, useRef, useState, type RefObject } from 'react'

export type RevealMode = 'once' | 'repeat' | 'distance'

export interface UseRevealOptions {
  /** 'once' (default): reveals once and stops observing.
   *  'repeat': toggles each time the element enters/leaves the viewport.
   *  'distance': reveals earlier (rootMargin pre-extended), then stops observing. */
  mode?: RevealMode
  /** 0–1, fraction of element that must be visible to trigger. Default 0.1. */
  threshold?: number
  /** rootMargin string; overrides mode default. */
  rootMargin?: string
}

const DEFAULTS: Record<RevealMode, { threshold: number; rootMargin: string }> = {
  once:     { threshold: 0.1, rootMargin: '0px' },
  repeat:   { threshold: 0.1, rootMargin: '0px' },
  distance: { threshold: 0,   rootMargin: '200px 0px 200px 0px' },
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { mode = 'once' } = options
  const defaults = DEFAULTS[mode]
  const threshold = options.threshold ?? defaults.threshold
  const rootMargin = options.rootMargin ?? defaults.rootMargin

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true)
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (mode === 'repeat') {
          setIsVisible(entry.isIntersecting)
        } else if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [mode, threshold, rootMargin])

  return [ref, isVisible]
}
