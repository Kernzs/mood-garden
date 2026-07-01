import type { TriggerCount } from '@/lib/stats'
import { triggerEmojis, triggerLabels } from '@/lib/copy'

export function TriggerBreakdown({ data }: { data: TriggerCount[] }) {
  if (data.length === 0) {
    return (
      <p className="py-2 text-center text-sm text-ink-soft">
        Note un déclencheur pour repérer tes moments 💭
      </p>
    )
  }
  const max = Math.max(...data.map((d) => d.count))

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.trigger} className="flex items-center gap-2.5">
          <span className="w-28 shrink-0 text-sm font-semibold text-ink">
            {triggerEmojis[d.trigger]} {triggerLabels[d.trigger]}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lavender to-primary"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="w-5 shrink-0 text-right text-sm font-extrabold text-ink-soft tabular-nums">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  )
}
