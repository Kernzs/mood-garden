import { cn } from '@/lib/cn'

interface StatCardProps {
  emoji: string
  value: string | number
  label: string
  tint?: 'green' | 'sun' | 'lavender' | 'neutral'
}

const tintClass: Record<NonNullable<StatCardProps['tint']>, string> = {
  green: 'from-primary-soft to-mint',
  sun: 'from-sun-soft to-peach',
  lavender: 'from-lavender to-primary-soft',
  neutral: 'from-neutral to-surface2',
}

export function StatCard({ emoji, value, label, tint = 'green' }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-[1.4rem] bg-gradient-to-br p-4 shadow-[var(--shadow-soft)]',
        tintClass[tint],
      )}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-2xl font-extrabold text-ink tabular-nums">{value}</span>
      <span className="text-xs font-semibold text-ink/70">{label}</span>
    </div>
  )
}
