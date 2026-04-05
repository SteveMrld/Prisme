'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUnlock() {
  const router = useRouter()
  useEffect(() => {
    document.cookie = 'confins_premium=true; path=/; max-age=31536000'
    setTimeout(() => router.push('/'), 1500)
  }, [])
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'DM Sans, sans-serif',background:'#FAF9F7'}}>
      <div style={{fontFamily:'Playfair Display, serif',fontSize:'32px',marginBottom:'16px'}}>Con<em style={{color:'#C8A96E'}}>fins</em></div>
      <div style={{fontSize:'12px',letterSpacing:'2px',textTransform:'uppercase',color:'#999'}}>Accès premium activé ✓</div>
      <div style={{fontSize:'11px',color:'#bbb',marginTop:'8px'}}>Redirection...</div>
    </div>
  )
}
