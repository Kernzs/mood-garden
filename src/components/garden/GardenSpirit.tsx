import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

// Sprite sheet PixelLab : 4 frames de 86×192, animation d'idle (petite fleur qui danse).
const SHEET = `${import.meta.env.BASE_URL}garden/spirit.png`

interface GardenSpiritProps {
  /** Largeur d'affichage en px (la hauteur suit le ratio du sprite). */
  size?: number
  className?: string
}

/** L'esprit du jardin 🌸 — compagnon pixel-art animé. Purement décoratif. */
export function GardenSpirit({ size = 64, className }: GardenSpiritProps) {
  return (
    <div
      aria-hidden
      className={cn('spirit-sprite', className)}
      style={
        {
          '--spirit-w': `${size}px`,
          backgroundImage: `url(${SHEET})`,
        } as CSSProperties
      }
    />
  )
}
