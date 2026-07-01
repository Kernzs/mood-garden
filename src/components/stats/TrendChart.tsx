import type { DayBucket } from '@/lib/stats'
import { shortWeekday, isSameDay } from '@/lib/date'

interface TrendChartProps {
  data: DayBucket[]
}

const AREA = 108 // hauteur (px) réservée aux barres

/** Mini graphe en barres (SVG maison) : moments positifs par jour. */
export function TrendChart({ data }: TrendChartProps) {
  const max = Math.max(1, ...data.map((d) => d.positive))
  const now = Date.now()

  return (
    <div className="flex items-end justify-between gap-2">
      {data.map((d) => {
        const barH = d.positive === 0 ? 8 : Math.round(16 + (d.positive / max) * (AREA - 16))
        const today = isSameDay(d.dayStart, now)
        return (
          <div key={d.dayStart} className="flex flex-1 flex-col items-center justify-end gap-1.5">
            {d.positive > 0 && (
              <span className="text-[0.72rem] font-extrabold text-ink tabular-nums">
                {d.positive}
              </span>
            )}
            <div
              className="w-full max-w-[26px] rounded-full bg-gradient-to-t from-primary to-sun transition-[height] duration-500"
              style={{ height: barH, opacity: d.positive === 0 ? 0.3 : 1 }}
              title={`${d.positive} moment(s)`}
            />
            <span
              className={
                today
                  ? 'text-[0.7rem] font-extrabold text-primary-ink'
                  : 'text-[0.7rem] font-semibold text-ink-soft'
              }
            >
              {shortWeekday(d.dayStart)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
