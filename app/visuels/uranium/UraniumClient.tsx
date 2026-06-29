// @ts-nocheck
'use client'
import { useState, useEffect, useRef } from 'react'
import Header from '../../../components/Header'
import { C, PALIERS, hex } from './data'
import Hero from './sections/Hero'
import Origine from './sections/Origine'
import Mecanique from './sections/Mecanique'
import Cascade from './sections/Cascade'
import Paliers from './sections/Paliers'
import Installations from './sections/Installations'
import Dependance from './sections/Dependance'
import Sources from './sections/Sources'

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

      <style jsx global>{`
        body { background: ${C.bg}; }

        /* ── animations des centrifugeuses ── */
        @keyframes cfStripes {
          from { transform: translateY(0); }
          to { transform: translateY(-20px); }
        }
        @keyframes cfParticle {
          0% { bottom: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; }
        }

        /* ── autres animations ── */
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.04); filter: brightness(1.15); }
        }
        @keyframes sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes flowRight {
          0% { left: -4px; opacity: 0; }
          8% { opacity: 1; }
          92% { opacity: 1; }
          100% { left: calc(100% + 4px); opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.55; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @keyframes pulseRed {
          0%, 100% { box-shadow: 0 0 0 0 ${C.red}; }
          50% { box-shadow: 0 0 0 14px rgba(142, 58, 43, 0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.25; }
          50% { transform: translate(18px, -22px); opacity: 0.9; }
        }

        /* ── animations anatomiques ── */
        @keyframes u235Rise {
          0% { bottom: 0%; opacity: 0; transform: translateX(0); }
          10% { opacity: 1; }
          50% { transform: translateX(-2px); }
          90% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; transform: translateX(0); }
        }
        @keyframes u238Fall {
          0% { top: 0%; opacity: 0; }
          12% { opacity: 0.8; }
          88% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes feedPulse {
          0%, 100% { opacity: 0.5; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(-4px); }
        }
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

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

      <style jsx>{`
        @media (max-width: 800px) {
          :global(.uranium-grid-2) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          :global(.uranium-hero-cf) {
            opacity: 0.22 !important;
            padding-right: 0 !important;
            justify-content: center !important;
          }
          :global(.uranium-hero-veil) {
            background: linear-gradient(to bottom, ${hex(C.bg, 0.3)} 0%, ${hex(C.bg, 0.8)} 100%) !important;
          }
        }
      `}</style>
    </>
  )
}
