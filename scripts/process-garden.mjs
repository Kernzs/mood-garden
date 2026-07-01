// Normalise les cutouts de jardin (fonds retirés) pour l'app :
// 1) trim des bords transparents, 2) recomposition sur un canvas commun avec le
// pied du pot aligné en bas → les étapes ne "sautent" plus, 3) redimension + compression.
//
// Entrée : design/cutouts/stage-<n>-Photoroom.png
// Sortie : public/garden/stage-<n>.png
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dir, '..')
const inDir = path.join(root, 'design', 'cutouts')
const outDir = path.join(root, 'public', 'garden')

const N = 8
const TARGET_W = 720

// 1) trim de chaque cutout + mesure
const files = await readdir(inDir)
const pick = (n) => files.find((f) => f.startsWith(`stage-${n}`) && f.endsWith('.png'))

const items = []
for (let n = 0; n < N; n++) {
  const name = pick(n)
  if (!name) throw new Error(`Cutout manquant pour l'étape ${n} dans ${inDir}`)
  const { data, info } = await sharp(path.join(inDir, name))
    .trim({ threshold: 14 })
    .png()
    .toBuffer({ resolveWithObject: true })
  items.push({ n, data, w: info.width, h: info.height })
  console.log(`trim stage-${n}: ${info.width}×${info.height}`)
}

// 2) canvas commun : largeur = plus large + marge, hauteur = plus haut + petite marge basse
const wMax = Math.max(...items.map((i) => i.w))
const hMax = Math.max(...items.map((i) => i.h))
const padX = Math.round(wMax * 0.08)
const marginBottom = Math.round(hMax * 0.015)
const canvasW = wMax + padX * 2
const canvasH = hMax + marginBottom + Math.round(hMax * 0.02)

for (const it of items) {
  const left = Math.round((canvasW - it.w) / 2) // centré horizontalement
  const top = canvasH - marginBottom - it.h // pied aligné en bas

  // Étape 1 : composition au format plein (sharp applique resize AVANT composite,
  // donc on compose d'abord, puis on redimensionne dans un 2e passage).
  const composed = await sharp({
    create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: it.data, left, top }])
    .png()
    .toBuffer()

  // Étape 2 : redimension + compression
  await sharp(composed)
    .resize({ width: TARGET_W })
    .png({ compressionLevel: 9, palette: true, quality: 92 })
    .toFile(path.join(outDir, `stage-${it.n}.png`))
  console.log(`✓ public/garden/stage-${it.n}.png`)
}

console.log(`\nCanvas commun ${canvasW}×${canvasH} → redim. largeur ${TARGET_W}px 🌱`)
