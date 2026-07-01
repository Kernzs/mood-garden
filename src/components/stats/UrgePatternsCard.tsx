import { useMemo } from 'react'
import { useGarden } from '@/context/GardenContext'
import { urgesByPeriod, topTriggerLast7Days, gentleTrend } from '@/lib/insights'
import { triggerEmojis, triggerLabels } from '@/lib/copy'

/** À quels moments viennent tes envies + déclencheur n°1 + tendance douce. */
export function UrgePatternsCard() {
  const { entries } = useGarden()

  const { periods, topTrigger, trend, max } = useMemo(() => {
    const periods = urgesByPeriod(entries)
    return {
      periods,
      topTrigger: topTriggerLast7Days(entries),
      trend: gentleTrend(entries),
      max: Math.max(1, ...periods.map((p) => p.count)),
    }
  }, [entries])

  return (
    <div className="card-soft p-4">
      <h2 className="mb-1 text-base text-ink">Tes moments d'envie</h2>
      <p className="mb-3 text-xs text-ink-soft">
        Mieux les connaître, c'est déjà mieux les traverser.
      </p>

      <div className="space-y-2.5">
        {periods.map((p) => (
          <div key={p.period} className="flex items-center gap-2.5">
            <span className="w-28 shrink-0 text-sm font-semibold text-ink">
              {p.emoji} {p.label}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky to-lavender"
                style={{ width: `${(p.count / max) * 100}%` }}
              />
            </div>
            <span className="w-5 shrink-0 text-right text-sm font-extrabold text-ink-soft tabular-nums">
              {p.count}
            </span>
          </div>
        ))}
      </div>

      {(topTrigger || trend) && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {topTrigger && (
            <p className="text-xs text-ink-soft">
              Déclencheur n°1 cette semaine :{' '}
              <b className="text-ink">
                {triggerEmojis[topTrigger]} {triggerLabels[topTrigger]}
              </b>
            </p>
          )}
          {trend && <p className="text-xs font-semibold text-primary-ink">{trend}</p>}
        </div>
      )}
    </div>
  )
}
