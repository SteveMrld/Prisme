'use client'
import { useState, useEffect } from 'react'

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false)
  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim())
    setIsPremium(cookies.some(c => c === 'confins_premium=true'))
  }, [])
  return isPremium
}
