import { useMemo } from 'react'
import { useGarden } from '@/context/GardenContext'
import { baselineComparison } from '@/lib/insights'

/**
 * « D'où je pars » : compare la moyenne de moments fumés notés (7 derniers jours)
 * au point de départ défini par l'utilisateur. Framing toujours doux — si ça ne
 * baisse pas, on reste neutre et encourageant, jamais accusateur.
 */
export function BaselineCard() {
  const { entries, settings } = useGarden()

  const cmp = useMemo(
    () => baselineComparison(entries, settings.baselinePerDay),
    [entries, settings.baselinePerDay],
  )
  if (!cmp) return null

  const fmt = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 })

  return (
    <div className="card-soft p-4">
      <h2 className="mb-1 text-base text-ink">D'où tu pars 🧭</h2>
      <p className="mb-3 text-xs text-ink-soft">
        D'après ce que tu notes — pas besoin d'être parfait·e, juste honnête.
      </p>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 rounded-2xl bg-surface2 px-3 py-2.5 text-center">
          <p className="text-lg font-extrabold text-ink tabular-nums">{fmt(cmp.baseline)}/j</p>
          <p className="text-[0.68rem] font-semibold text-ink-soft">ton point de départ</p>
        </div>
        <span className="text-xl text-ink-soft" aria-hidden>
          →
        </span>
        <div className="flex-1 rounded-2xl bg-primary-soft px-3 py-2.5 text-center">
          <p className="text-lg font-extrabold text-primary-ink tabular-nums">
            {fmt(cmp.avgLast7)}/j
          </p>
          <p className="text-[0.68rem] font-semibold text-ink-soft">ces 7 derniers jours</p>
        </div>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-mint to-primary transition-[width] duration-700 ease-out"
          style={{ width: `${Math.round(cmp.progress * 100)}%` }}
        />
      </div>

      <p className="mt-2 text-center text-xs font-semibold text-ink-soft">
        {cmp.improvementPct !== null ? (
          <>
            Environ <b className="text-primary-ink">−{cmp.improvementPct}%</b> en douceur 🌱
          </>
        ) : (
          <>Ton point de départ est posé — chaque moment noté compte, à ton rythme 💛</>
        )}
      </p>
    </div>
  )
}
