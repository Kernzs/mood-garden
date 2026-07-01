import type { GoalProgress } from '@/lib/stats'

interface GoalRingProps {
  goal: GoalProgress
}

export function GoalRing({ goal }: GoalRingProps) {
  const size = 96
  const stroke = 11
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - goal.ratio)
  const reached = goal.value >= goal.target

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--c-surface2)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--c-primary)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.7s ease' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-lg font-extrabold text-ink tabular-nums">
            {goal.value}
            <span className="text-sm text-ink-soft">/{goal.target}</span>
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-extrabold text-ink">
          {reached ? 'Objectif atteint 🎉' : 'En chemin, tout doux'}
        </p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {reached
            ? `Bravo pour ${goal.scopeLabel} — savoure ce moment.`
            : `Moments évités ${goal.scopeLabel}. Chaque pas compte.`}
        </p>
      </div>
    </div>
  )
}
