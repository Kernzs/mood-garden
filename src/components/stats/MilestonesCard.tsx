import { useMemo } from 'react'
import { useGarden } from '@/context/GardenContext'
import { MILESTONES, achievedMilestones, computeMilestoneStats } from '@/lib/milestones'
import { cn } from '@/lib/cn'

export function MilestonesCard() {
  const { entries, progress, settings } = useGarden()

  const achievedIds = useMemo(
    () =>
      new Set(
        achievedMilestones(computeMilestoneStats(entries, progress, settings)).map((m) => m.id),
      ),
    [entries, progress, settings],
  )

  return (
    <div className="card-soft p-4">
      <h2 className="mb-1 text-base text-ink">Tes jalons</h2>
      <p className="mb-3 text-xs text-ink-soft">
        Des petites fêtes en chemin — {achievedIds.size}/{MILESTONES.length} pour l'instant.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {MILESTONES.map((m) => {
          const done = achievedIds.has(m.id)
          return (
            <div
              key={m.id}
              className={cn(
                'flex items-center gap-2.5 rounded-2xl px-3 py-2.5',
                done ? 'bg-primary-soft' : 'bg-surface2 opacity-60',
              )}
            >
              <span className={cn('text-xl', !done && 'grayscale')}>{m.emoji}</span>
              <div className="min-w-0">
                <p className={cn('truncate text-xs font-extrabold', done ? 'text-primary-ink' : 'text-ink')}>
                  {m.name}
                </p>
                <p className="truncate text-[0.65rem] text-ink-soft">{m.blurb}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
