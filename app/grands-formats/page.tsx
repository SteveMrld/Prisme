import Link from 'next/link'
import Header from '../../components/Header'
import BottomNav from '../../components/BottomNav'

const FORMATS = [
  {
    slug: 'palantir',
    title: 'Palantir. L\'ontologie de l\'ennemi',
    desc: 'Comment une entreprise de data a vendu à l\'État la capacité de penser la menace — et ce que ça change pour nous.',
    category: 'Tech · Puissance',
    image: '/articles/palantir.jpg',
    color: '#1a1a2e',
  },
  {
    slug: 'bases-militaires',
    title: 'Les bases militaires américaines',
    desc: 'Un empire de 750 bases dans 80 pays. La géographie secrète de la puissance américaine.',
    category: 'Géopolitique',
    image: '/grands-formats/bases-hero.jpg',
    color: '#1A3E6B',
  },
  {
    slug: 'chambre-ratification',
    title: 'La chambre de ratification',
    desc: 'Comment se décide vraiment une guerre — pas dans les capitales, mais dans les pièces où personne ne regarde.',
    category: 'Géopolitique · Pouvoir',
    image: '/grands-formats/chambre-hero.jpg',
    color: '#2d1a1a',
  },
  {
    slug: 'skunkworks',
    title: 'Skunk Works — L\'usine à l\'impossible',
    desc: 'Comment Lockheed a inventé l\'avion invisible, le U-2 et SR-71 dans un hangar secret en Californie.',
    category: 'Tech · Défense',
    image: '/grands-formats/skunkworks-hero.jpg',
    color: '#1a1a1a',
  },
  {
    slug: 'terres-rares',
    title: 'Terres rares : la guerre invisible',
    desc: 'Du cobalt du Katanga au verrou chinois du raffinage, la transition énergétique a créé une nouvelle géographie de la dépendance.',
    category: 'Géopolitique · Environnement',
    image: '/articles/terres-rares.png',
    color: '#1a2d1a',
  },
  {
    slug: 'medias',
    title: 'Médias — Les prédateurs',
    desc: 'Qui possède l\'information ? La carte mondiale de la concentration des médias.',
    category: 'Société · Pouvoir',
    image: '/grands-formats/medias-hero.jpg',
    color: '#2d1a2d',
  },
  {
    slug: 'dette-souveraine',
    title: 'Dette souveraine',
    desc: 'Quand la dette devient une arme géopolitique. Les États pris en otage par leurs créanciers.',
    category: 'Économie · Géopolitique',
    image: '/grands-formats/dette-hero.jpg',
    color: '#1a1a2d',
  },
  {
    slug: 'architecture-desordre',
    title: 'L\'architecture du désordre',
    desc: 'Pourquoi le droit international ne fonctionne que quand les grandes puissances veulent bien qu\'il fonctionne.',
    category: 'Géopolitique · Droit',
    image: '/grands-formats/architecture-hero.jpg',
    color: '#2d2d1a',
  },
  {
    slug: 'climat',
    title: 'La Terre a toujours changé de température',
    desc: '500 millions d\'années de données paléoclimatiques. Ce qui est sans précédent, c\'est la vitesse.',
    category: 'Environnement · Sciences',
    image: '/grands-formats/climat-hero.jpg',
    color: '#1a2d2d',
  },
  {
    slug: 'inegalites',
    title: 'En 1980, ils étaient tous pareils',
    desc: 'USA, France, Inde, Chine — 40 ans de divergence des inégalités mondiales. Les chiffres qui contredisent la fatalité.',
    category: 'Économie · Société',
    image: '/grands-formats/inegalites-hero.jpg',
    color: '#2d1a1a',
  },
]

export const metadata = {
  title: 'Grands formats — Soara',
  description: 'Les enquêtes longues et les analyses de fond de Soara.',
}

export default function GrandsFormatsPage() {
  return (
    <>
      <Header activeNav="concept" />
      <main style={{ minHeight: '100vh', background: '#0a0908', paddingBottom: 100 }}>

        {/* Hero */}
        <div style={{
          padding: '80px 24px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          maxWidth: 900, margin: '0 auto',
        }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: '#C8A96E', marginBottom: 16 }}>
            Soara · Grands formats
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300, color: '#ECE7DD', lineHeight: 1.1, marginBottom: 16 }}>
            Les enquêtes qui<br /><em style={{ fontWeight: 600 }}>prennent le temps.</em>
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontStyle: 'italic', color: 'rgba(236,231,221,0.5)', lineHeight: 1.6, maxWidth: 600 }}>
            Analyses de fond, visualisations interactives, décryptages en profondeur. Ce que le flux d'information quotidien ne peut pas faire.
          </p>
        </div>

        {/* Grille */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          {FORMATS.map((f, i) => (
            <Link key={f.slug} href={`/grands-formats/${f.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                gap: 0,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Numéro */}
                <div style={{
                  width: 48, flexShrink: 0, paddingTop: 28,
                  fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.15)',
                  letterSpacing: 2, textAlign: 'center',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Contenu */}
                <div style={{ flex: 1, padding: '24px 16px 24px 0' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 7, letterSpacing: 3, textTransform: 'uppercase', color: '#C8A96E', marginBottom: 8 }}>
                    {f.category}
                  </div>
                  <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 700, color: '#ECE7DD', lineHeight: 1.2, marginBottom: 8 }}>
                    {f.title}
                  </h2>
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontStyle: 'italic', color: 'rgba(236,231,221,0.55)', lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>

                {/* Flèche */}
                <div style={{ width: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(200,169,110,0.3)', fontSize: 18 }}>
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  )
}
