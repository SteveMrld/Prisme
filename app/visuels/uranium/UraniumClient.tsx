// @ts-nocheck
'use client'
import { useState, useEffect, useRef } from 'react'
import Header from '../../../components/Header'
import { C, PALIERS } from './data'
import Hero from './sections/Hero'
import Origine from './sections/Origine'
import Mecanique from './sections/Mecanique'
import Cascade from './sections/Cascade'
import Paliers from './sections/Paliers'
import Installations from './sections/Installations'
import Dependance from './sections/Dependance'
import Sources from './sections/Sources'
import './animations.css'

/* ════════════════════════════════════════════════════════════════
   URANIUM : LA CASCADE DU MONDE
   Atlas Soara. Refonte compacte mobile-first.
   Toutes les animations en pur CSS, démarrées au chargement.
   ════════════════════════════════════════════════════════════════ */

export default function UraniumClient() {
  const [reveal, setReveal] = useState(new Set(['hero'])) // hero actif dès le load
  const [autoPalier, setAutoPalier] = useState(0)
  const sectionRefs = useRef([])

  // Observer les sections pour les reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setReveal((prev) => new Set(prev).add(e.target.dataset.id))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )
    sectionRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Auto-avancée de la jauge des paliers dès que la section est visible
  useEffect(() => {
    if (!reveal.has('paliers')) return
    let i = 0
    setAutoPalier(0)
    const interval = setInterval(() => {
      i = (i + 1) % PALIERS.length
      setAutoPalier(i)
    }, 2400)
    return () => clearInterval(interval)
  }, [reveal])

  const isRevealed = (id) => reveal.has(id)
  const setRef = (i) => (el) => { sectionRefs.current[i] = el }

  return (
    <>
      <Header activeNav="concept" />

      <div style={{
        background: C.bg,
        color: C.text,
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        minHeight: '100vh',
        overflowX: 'hidden',
      }}>
        <Hero sectionRef={setRef(0)} />
        <Origine sectionRef={setRef(1)} revealed={isRevealed('origine')} />
        <Mecanique sectionRef={setRef(6)} revealed={isRevealed('mecanique')} />
        <Cascade sectionRef={setRef(2)} revealed={isRevealed('cascade')} />
        <Paliers sectionRef={setRef(3)} activeIndex={autoPalier} />
        <Installations sectionRef={setRef(4)} revealed={isRevealed('installations')} />
        <Dependance sectionRef={setRef(5)} revealed={isRevealed('dependance')} />
        <Sources />
      </div>
    </>
  )
}
