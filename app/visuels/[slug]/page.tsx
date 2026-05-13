import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Header from '../../../components/Header'

// Liste tous les fichiers HTML statiques sous /public/visuels/, sert de
// whitelist : chaque .html devient automatiquement une route /visuels/[slug]
// avec le chrome Soara (Header + cadre + bouton retour Atlas) autour.
// Plus besoin d'enregistrer les visualisations à la main.
function getVisuelSlugs(): string[] {
  const dir = path.join(process.cwd(), 'public/visuels')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, ''))
}

// Titres lisibles pour les visuels principaux. Si un slug n'est pas listé,
// on génère un titre par défaut à partir du slug.
const TITLES: Record<string, { title: string; desc: string }> = {
  'terres-rares': {
    title: 'Terres rares : la guerre invisible',
    desc: "Du cobalt du Katanga au verrou chinois du raffinage, la cartographie d'une dépendance.",
  },
  'naval': {
    title: 'Les mers du pouvoir',
    desc: "80 % du commerce mondial circule par voie maritime. Cartographie des verrous stratégiques.",
  },
  'predateurs': {
    title: 'Le monde des prédateurs',
    desc: "Trois puissances, trois doctrines. États-Unis, Chine, Russie face à face.",
  },
  'eau': {
    title: "L'eau, la prochaine grande fracture",
    desc: "Des glaciers himalayens au stress hydrique africain, la géopolitique du robinet.",
  },
  'france_maritime': {
    title: 'La France maritime',
    desc: "La 2e zone économique exclusive mondiale, et l'empire ignoré qu'elle dessine.",
  },
  'cables': {
    title: 'Câbles sous-marins',
    desc: "99 % d'Internet circule sous les océans. Carte d'une infrastructure invisible.",
  },
  'techgeo': {
    title: 'Tech et géopolitique',
    desc: 'Les nœuds technologiques qui redéfinissent les rapports de force.',
  },
  'taiwan': {
    title: 'Taïwan, autoroute maritime stratégique',
    desc: "Joyau convoité de l'industrie électronique, pivot de l'Asie-Pacifique.",
  },
  'pauvrete-france': {
    title: 'Pauvreté en France',
    desc: "Une cartographie départementale des fractures sociales.",
  },
  'science-race': {
    title: 'La course scientifique',
    desc: "Brevets, publications, talents : où se joue la science qui vient.",
  },
}

function humanTitle(slug: string): string {
  if (TITLES[slug]) return TITLES[slug].title
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function generateStaticParams() {
  return getVisuelSlugs().map(slug => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const t = humanTitle(params.slug)
  const desc = TITLES[params.slug]?.desc ?? `Visualisation interactive de l'Atlas Soara.`
  return {
    title: `${t} — Atlas Soara`,
    description: desc,
  }
}

export default function AtlasWrapperPage({ params }: { params: { slug: string } }) {
  const slugs = getVisuelSlugs()
  if (!slugs.includes(params.slug)) notFound()

  const title = humanTitle(params.slug)
  const desc = TITLES[params.slug]?.desc

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activeNav="concept" />
      <div
        style={{
          maxWidth: 1320,
          width: '100%',
          margin: '0 auto',
          padding: '16px 16px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span
            style={{
              fontFamily: "'DM Mono', 'IBM Plex Mono', ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#8B1A1A',
              fontWeight: 700,
              display: 'block',
              marginBottom: 6,
            }}
          >
            Atlas Soara
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(18px, 2.4vw, 24px)',
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.3px',
              color: '#0A0A0A',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {desc && (
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 14,
                color: '#555',
                margin: '6px 0 0',
                maxWidth: 720,
                lineHeight: 1.45,
              }}
            >
              {desc}
            </p>
          )}
        </div>
        <Link
          href="/visuels"
          style={{
            fontFamily: "'DM Mono', 'IBM Plex Mono', ui-monospace, monospace",
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#0A0A0A',
            textDecoration: 'none',
            borderBottom: '1px solid #0A0A0A',
            paddingBottom: 1,
            whiteSpace: 'nowrap',
          }}
        >
          ← Atlas
        </Link>
      </div>
      <iframe
        src={`/visuels/${params.slug}.html`}
        title={title}
        style={{
          flex: 1,
          width: '100%',
          border: 0,
          display: 'block',
          minHeight: 'calc(100dvh - 200px)',
        }}
      />
    </div>
  )
}
