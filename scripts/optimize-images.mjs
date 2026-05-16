#!/usr/bin/env node
// Optimise des images en générant à côté un .avif (primary) et un .jpg
// (fallback q85, mozjpeg). L'original n'est pas modifié : à supprimer
// manuellement après vérification visuelle.
//
// Usage :
//   node scripts/optimize-images.mjs <file...> [--width N] [--quality-avif N] [--quality-jpeg N]
//
// Exemples :
//   node scripts/optimize-images.mjs public/afrique-hero.png --width 1600
//   node scripts/optimize-images.mjs public/portraits/*.jpg --width 800

import { stat } from 'node:fs/promises'
import { parse } from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const files = []
let width = null
let qAvif = 72
let qJpeg = 85

for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--width') { width = parseInt(args[++i], 10); continue }
  if (a === '--quality-avif') { qAvif = parseInt(args[++i], 10); continue }
  if (a === '--quality-jpeg') { qJpeg = parseInt(args[++i], 10); continue }
  if (a.startsWith('--')) { console.error(`Flag inconnu: ${a}`); process.exit(1) }
  files.push(a)
}

if (files.length === 0) {
  console.error('Usage: node scripts/optimize-images.mjs <file...> [--width N]')
  process.exit(1)
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

let totalBefore = 0
let totalAfter = 0

for (const file of files) {
  const { dir, name } = parse(file)
  const outAvif = `${dir}/${name}.avif`
  const outJpeg = `${dir}/${name}.jpg`

  const before = (await stat(file)).size
  totalBefore += before

  let pipe = sharp(file)
  if (width) {
    const meta = await sharp(file).metadata()
    if (meta.width && meta.width > width) pipe = pipe.resize({ width })
  }
  const buf = await pipe.toBuffer()

  await sharp(buf).avif({ quality: qAvif, effort: 6 }).toFile(outAvif)
  await sharp(buf).jpeg({ quality: qJpeg, mozjpeg: true }).toFile(outJpeg)

  const aAvif = (await stat(outAvif)).size
  const aJpeg = (await stat(outJpeg)).size
  totalAfter += aAvif + aJpeg

  console.log(`${file}`)
  console.log(`  in   ${fmt(before)}`)
  console.log(`  avif ${fmt(aAvif).padEnd(10)} (-${Math.round((1 - aAvif / before) * 100)}%)`)
  console.log(`  jpeg ${fmt(aJpeg).padEnd(10)} (-${Math.round((1 - aJpeg / before) * 100)}%)`)
}

console.log(`\nTotal in:  ${fmt(totalBefore)}`)
console.log(`Total out: ${fmt(totalAfter)} (avif + jpeg)`)
