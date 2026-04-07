'use client'
import { useState, useEffect } from 'react'
import { createClient } from './supabase'

const ADMIN_EMAIL = 'steve.moradel@gmail.com'

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    async function check() {
      // Cookie Stripe premium
      const cookies = document.cookie.split(';').map(c => c.trim())
      if (cookies.some(c => c === 'confins_premium=true')) {
        setIsPremium(true)
        return
      }
      // Bypass admin par email
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.email === ADMIN_EMAIL) {
          setIsPremium(true)
        }
      } catch {}
    }
    check()
  }, [])

  return isPremium
}
