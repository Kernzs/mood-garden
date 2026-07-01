import type { ActionType } from '@/types'
import { cn } from '@/lib/cn'

interface QuickActionsProps {
  onAction: (action: ActionType) => void
}

interface Tile {
  action: ActionType
  emoji: string
  label: string
  sublabel: string
  className: string
}

const TILES: Tile[] = [
  {
    action: 'avoided',
    emoji: '🌿',
    label: "J'ai évité",
    sublabel: 'un joint',
    className: 'bg-primary text-white',
  },
  {
    action: 'postponed',
    emoji: '⏳',
    label: "J'ai reporté",
    sublabel: "l'envie",
    className: 'bg-lavender text-ink',
  },
  {
    action: 'didSomethingElse',
    emoji: '✨',
    label: "J'ai fait",
    sublabel: 'autre chose',
    className: 'bg-sun text-sun-ink',
  },
  {
    action: 'smoked',
    emoji: '🍃',
    label: "J'ai fumé",
    sublabel: 'sans jugement',
    className: 'bg-neutral text-neutral-ink',
  },
]

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TILES.map((t) => (
        <button
          key={t.action}
          onClick={() => onAction(t.action)}
          className={cn(
            'tap flex min-h-[104px] flex-col items-center justify-center gap-1 rounded-[1.6rem] px-3 py-4 text-center shadow-[var(--shadow-soft)]',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25',
            t.className,
          )}
        >
          <span className="text-[2rem] leading-none">{t.emoji}</span>
          <span className="mt-1 text-[0.95rem] font-extrabold leading-tight">{t.label}</span>
          <span className="text-xs font-semibold opacity-80">{t.sublabel}</span>
        </button>
      ))}
    </div>
  )
}
