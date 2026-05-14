import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import Header from '../../../components/Header'
import AtlasWrapHeader from '../../../components/AtlasWrapHeader'
import visuels from '../../../lib/visuels'

// Liste tous les fichiers HTML statiques sous /public/visuels/, sert de
// whitelist : chaque .html devient automatiquement une route /visuels/[slug]
// avec le chrome Soara (Header + cadre + bouton retour Atlas) autour.
function getVisuelSlugs(): string[] {
  const dir = path.join(process.cwd(), 'public/visuels')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, ''))
}

// Fallback pour les slugs publics absents du catalogue lib/visuels.ts
// (typiquement : versions HTML "compagnon" d'articles longs comme predateurs
// ou taiwan, dont la fiche Atlas pointe ailleurs).
const ORPHAN_FALLBACK: Record<string, { title: string; desc: string; category: string }> = {
  'predateurs': {
    title: 'Le monde des prédateurs',
    desc: "Trois puissances, trois doctrines. États-Unis, Chine, Russie face à face.",
    category: 'Géopolitique',
  },
  'taiwan': {
    title: 'Taïwan, autoroute maritime stratégique',
    desc: "Joyau convoité de l'industrie électronique, pivot de l'Asie-Pacifique.",
    category: 'Géopolitique',
  },
}

type AtlasMeta = { title: string; description?: string; category: string }

function getAtlasMeta(slug: string): AtlasMeta {
  const hit = visuels.find(v => v.href === `/visuels/${slug}`)
  if (hit) {
    const category = (hit.eyebrow || '').split('·')[0]?.trim() || 'Visualisation'
    return { title: hit.title, description: hit.description, category }
  }
  const fb = ORPHAN_FALLBACK[slug]
  if (fb) return { title: fb.title, description: fb.desc, category: fb.category }
  const title = slug.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return { title, category: 'Visualisation' }
}

export function generateStaticParams() {
  return getVisuelSlugs().map(slug => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const meta = getAtlasMeta(params.slug)
  return {
    title: `${meta.title}, Atlas Soara`,
    description: meta.description ?? `Visualisation interactive de l'Atlas Soara.`,
  }
}

export default function AtlasWrapperPage({ params }: { params: { slug: string } }) {
  const slugs = getVisuelSlugs()
  if (!slugs.includes(params.slug)) notFound()

  const meta = getAtlasMeta(params.slug)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header activeNav="concept" />
      <AtlasWrapHeader category={meta.category} title={meta.title} description={meta.description} />
      <iframe
        src={`/visuels/${params.slug}.html`}
        title={meta.title}
        style={{
          flex: 1,
          width: '100%',
          border: 0,
          display: 'block',
          minHeight: 'calc(100dvh - 280px)',
        }}
      />
    </div>
  )
}
