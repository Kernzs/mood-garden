// Rasterise public/icon.svg -> PNG icons for the PWA manifest.
// Usage: npm run gen:icons
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const dir = path.dirname(fileURLToPath(import.meta.url))
const pub = path.resolve(dir, '../public')

const svg = await readFile(path.join(pub, 'icon.svg'))

const targets = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['maskable-512.png', 512],
  ['apple-touch-icon.png', 180],
]

for (const [name, size] of targets) {
  await sharp(svg, { density: 512 })
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(path.join(pub, name))
  console.log('✓', name, `(${size}×${size})`)
}

console.log('Icônes générées dans /public 🌱')
