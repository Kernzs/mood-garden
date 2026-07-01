import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getStage } from '@/lib/garden'
import { GardenScene } from '@/components/garden/GardenScene'
import { Button } from '@/components/ui/Button'

const PETAL_EMOJIS = ['🌸', '🌼', '🍃', '✨', '🌷', '🦋']

interface StepUpCelebrationProps {
  from: number
  to: number
  onClose: () => void
}

export function StepUpCelebration({ from, to, onClose }: StepUpCelebrationProps) {
  const target = getStage(to)
  const previous = getStage(from)

  useEffect(() => {
    const t = window.setTimeout(onClose, 6000)
    return () => window.clearTimeout(t)
  }, [onClose])

  const petals = Array.from({ length: 16 }, (_, i) => ({
    left: `${(i * 6.3 + 4) % 100}%`,
    delay: `${(i % 8) * 0.32}s`,
    duration: `${3.4 + (i % 5) * 0.5}s`,
    emoji: PETAL_EMOJIS[i % PETAL_EMOJIS.length],
    size: 14 + (i % 4) * 5,
  }))

  return createPortal(
    <div
      className="anim-fade fixed inset-0 z-[80] grid place-items-center bg-black/45 px-6 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Pétales qui tombent */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {petals.map((p, i) => (
          <span
            key={i}
            className="absolute -top-8"
            style={{
              left: p.left,
              fontSize: p.size,
              animation: `petal-fall ${p.duration} linear ${p.delay} infinite`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <div
        className="anim-pop relative w-full max-w-xs rounded-[2rem] border border-border bg-surface p-6 text-center shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-bold uppercase tracking-wide text-primary-ink">
          Ton jardin grandit
        </p>
        <div className="mx-auto my-3 h-40 w-40">
          <GardenScene stage={to} />
        </div>
        <h2 className="text-2xl text-ink">{target.name} !</h2>
        <p className="mt-1 text-sm text-ink-soft">{target.blurb}</p>
        <p className="mt-2 text-xs text-ink-soft">
          {previous.name} → <b className="text-primary-ink">{target.name}</b>
        </p>
        <Button className="mt-5" fullWidth onClick={onClose}>
          Continuer 🌿
        </Button>
      </div>
    </div>,
    document.body,
  )
}
