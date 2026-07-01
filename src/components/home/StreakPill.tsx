import { copy } from '@/lib/copy'

export function StreakPill({ streak }: { streak: number }) {
  const label =
    streak <= 0
      ? copy.streakZero
      : `${streak} ${streak === 1 ? copy.streakSingular : copy.streakPlural}`
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface/85 px-2.5 py-1 text-xs font-bold text-ink shadow-[var(--shadow-soft)] backdrop-blur">
      🌤️ {label}
    </span>
  )
}
