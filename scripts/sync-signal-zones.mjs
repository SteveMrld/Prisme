#!/usr/bin/env node
// Régénère le bloc `const ZONES = [...]` dans public/signal-globe.html
// à partir de lib/signal-zones.json (source de vérité éditoriale).
// Lancé automatiquement avant chaque build via le hook prebuild.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const jsonPath = resolve(root, 'lib/signal-zones.json')
const htmlPath = resolve(root, 'public/signal-globe.html')

const data = JSON.parse(await readFile(jsonPath, 'utf8'))
const slugToIndex = Object.fromEntries(data.zones.map((z, i) => [z.slug, i]))

const zones = data.zones.map(z => ({
  lat: z.lat,
  lng: z.lng,
  name: z.name,
  region: z.region,
  status: z.status,
  trend: z.trend,
  updated: z.updated,
  france: z.france,
  affected: z.affected,
  figures: z.figures,
  desc: z.desc,
  tags: z.tags,
  tagColors: z.tagColors,
  linkedTo: z.linkedTo.map(s => {
    if (!(s in slugToIndex)) {
      console.error(`sync-signal-zones: slug introuvable "${s}" dans linkedTo de ${z.slug}`)
      process.exit(1)
    }
    return slugToIndex[s]
  }),
}))

const block = 'const ZONES = ' + JSON.stringify(zones, null, 2) + ';'

const html = await readFile(htmlPath, 'utf8')
const pattern = /const ZONES = \[[\s\S]*?\n\];/
if (!pattern.test(html)) {
  console.error('sync-signal-zones: bloc `const ZONES = [...];` introuvable dans signal-globe.html')
  process.exit(1)
}
const updated = html.replace(pattern, block)
await writeFile(htmlPath, updated)
console.log(`sync-signal-zones: ${zones.length} zones synchronisées dans signal-globe.html`)
