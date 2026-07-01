// Génère les icônes PWA à partir de l'illustration d'icône (design/icon-source.png).
// Usage: npm run gen:icons
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dir, '..')
const pub = path.join(root, 'public')
const src = path.join(root, 'design', 'icon-source.png')

// couleur de fond (moyenne du dégradé de l'icône) pour aplatir les coins transparents
const BG = '#ecf3dc'
const ZOOM = 1.12 // léger crop pour retirer la bordure arrondie de la source

/** Recadre la source (retire la bordure) à la taille voulue, fond aplati. */
async function cropped(size) {
  const big = Math.round(size * ZOOM)
  const off = Math.round((big - size) / 2)
  return sharp(src)
    .resize(big, big, { fit: 'cover' })
    .extract({ left: off, top: off, width: size, height: size })
    .flatten({ background: BG })
    .png()
    .toBuffer()
}

// Icônes "any" (plein cadre)
for (const [name, size] of [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(await cropped(size)).toFile(path.join(pub, name))
  console.log('✓', name, `(${size}×${size})`)
}

// Icône maskable : sujet dans la "safe zone" (≈80%), fond plein
const inner = 410
const innerBuf = await cropped(inner)
await sharp({
  create: { width: 512, height: 512, channels: 4, background: BG },
})
  .composite([{ input: innerBuf, gravity: 'center' }])
  .png()
  .toFile(path.join(pub, 'maskable-512.png'))
console.log('✓ maskable-512.png (512×512, safe zone)')

console.log('Icônes PWA générées 🌱')
