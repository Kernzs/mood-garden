import { nextStageInfo } from '@/lib/garden'
import { copy } from '@/lib/copy'

export function StageProgress({ totalSunlight }: { totalSunlight: number }) {
  const info = nextStageInfo(totalSunlight)

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-ink-soft">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-primary-ink">
          🌱 {info.current.name}
        </span>
        {info.isMax ? (
          <span className="text-sun-ink">{copy.maxStage}</span>
        ) : (
          <span>
            {copy.nextStagePrefix} <b className="text-sun-ink">{info.remaining} ☀️</b>
          </span>
        )}
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sun to-primary transition-[width] duration-700 ease-out"
          style={{ width: `${Math.round(info.progress * 100)}%` }}
        />
      </div>
      {!info.isMax && (
        <p className="mt-1.5 text-center text-xs text-ink-soft">
          Prochaine étape · {info.next?.name}
        </p>
      )}
    </div>
  )
}
