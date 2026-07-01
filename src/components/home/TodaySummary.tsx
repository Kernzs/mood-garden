import type { Totals } from '@/lib/stats'

interface TodaySummaryProps {
  totals: Totals
}

const CELLS: Array<{ key: keyof Totals; emoji: string; label: string }> = [
  { key: 'avoided', emoji: '🌿', label: 'Évités' },
  { key: 'postponed', emoji: '⏳', label: 'Reportés' },
  { key: 'didSomethingElse', emoji: '✨', label: 'Autre' },
  { key: 'smoked', emoji: '🍃', label: 'Fumés' },
]

export function TodaySummary({ totals }: TodaySummaryProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CELLS.map((c) => (
        <div
          key={c.key}
          className="flex flex-col items-center gap-0.5 rounded-2xl bg-surface2 py-2.5"
        >
          <span className="text-lg leading-none">{c.emoji}</span>
          <span className="text-lg font-extrabold text-ink tabular-nums">{totals[c.key]}</span>
          <span className="text-[0.7rem] font-semibold text-ink-soft">{c.label}</span>
        </div>
      ))}
    </div>
  )
}
