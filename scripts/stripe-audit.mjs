#!/usr/bin/env node
// Audit lecture seule de l'état Stripe (produits + prices).
// Aucune mutation. Sert à comparer AVANT/APRÈS un renommage manuel
// dans le Dashboard.
//
// Usage : node scripts/stripe-audit.mjs
// Pré-requis : STRIPE_SECRET_KEY défini dans .env.local

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Stripe from 'stripe'

const here = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(here, '..', '.env.local')

function loadEnvKey(key) {
  if (process.env[key]) return process.env[key]
  try {
    const raw = readFileSync(envPath, 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      const k = trimmed.slice(0, idx).trim()
      if (k !== key) continue
      let v = trimmed.slice(idx + 1).trim()
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1)
      }
      return v
    }
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  return undefined
}

const key = loadEnvKey('STRIPE_SECRET_KEY')
if (!key) {
  console.error('STRIPE_SECRET_KEY introuvable (ni env ni .env.local)')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

function classify(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('soara')) return 'SOARA'
  if (n.includes('media')) return 'MEDIA'
  if (n.includes('prisme')) return 'PRISME'
  return 'AUTRE'
}

function fmtAmount(price) {
  if (price.unit_amount == null) return '—'
  const amt = (price.unit_amount / 100).toFixed(2)
  const cur = (price.currency || '').toUpperCase()
  const rec = price.recurring
    ? ` / ${price.recurring.interval}${price.recurring.interval_count > 1 ? `×${price.recurring.interval_count}` : ''}`
    : ''
  return `${amt} ${cur}${rec}`
}

async function main() {
  console.log(`\nMode clé : ${key.startsWith('sk_live') ? 'LIVE' : key.startsWith('sk_test') ? 'TEST' : 'INCONNU'}\n`)

  const products = []
  for await (const p of stripe.products.list({ limit: 100, active: true })) {
    products.push(p)
  }
  const archived = []
  for await (const p of stripe.products.list({ limit: 100, active: false })) {
    archived.push(p)
  }

  const buckets = { SOARA: [], MEDIA: [], PRISME: [], AUTRE: [] }
  for (const p of products) buckets[classify(p.name)].push(p)

  const order = ['SOARA', 'MEDIA', 'PRISME', 'AUTRE']
  for (const tag of order) {
    if (!buckets[tag].length) continue
    console.log(`\n=== ${tag} (actifs) ===`)
    for (const p of buckets[tag]) {
      console.log(`  • ${p.name}  (${p.id})`)
      if (p.description) console.log(`    desc: ${p.description}`)
      const prices = []
      for await (const pr of stripe.prices.list({ product: p.id, limit: 100 })) {
        prices.push(pr)
      }
      if (!prices.length) {
        console.log('    (aucun price)')
        continue
      }
      for (const pr of prices) {
        const flag = pr.active ? '✓' : '✗ archivé'
        console.log(`    - ${flag}  ${fmtAmount(pr)}  (${pr.id})${pr.nickname ? `  «${pr.nickname}»` : ''}`)
      }
    }
  }

  if (archived.length) {
    console.log(`\n=== Produits archivés (${archived.length}) ===`)
    for (const p of archived) {
      console.log(`  • [${classify(p.name)}] ${p.name}  (${p.id})`)
    }
  }

  console.log('\nDone (lecture seule, aucune modif).\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
