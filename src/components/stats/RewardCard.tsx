import { useGarden } from '@/context/GardenContext'
import { moneySavedSince } from '@/lib/stats'
import { Button } from '@/components/ui/Button'

/**
 * Jauge vers la « récompense réelle » : un vrai plaisir financé par les
 * joints évités depuis la définition de l'objectif.
 */
export function RewardCard() {
  const { entries, settings, updateSettings } = useGarden()
  const goal = settings.rewardGoal
  if (!goal) return null

  const saved = moneySavedSince(entries, settings.costPerJoint, goal.startedAt)
  const ratio = goal.cost > 0 ? Math.min(1, saved / goal.cost) : 1
  const remaining = Math.max(0, goal.cost - saved)
  const reached = saved >= goal.cost

  const fmt = (n: number) =>
    `${n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${settings.currency}`

  return (
    <div className="card-soft p-4">
      {reached ? (
        <div className="text-center">
          <div className="anim-float text-4xl">🎁</div>
          <h2 className="mt-1 text-lg text-ink">C'est offert !</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Tes joints évités ont financé <b className="text-primary-ink">{goal.label}</b> (
            {fmt(goal.cost)}). Va te faire plaisir, tu l'as vraiment mérité. 💛
          </p>
          <Button
            variant="soft"
            className="mt-3"
            onClick={() => updateSettings({ rewardGoal: null })}
          >
            ✨ Définir une nouvelle récompense
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base text-ink">🎁 {goal.label}</h2>
            <span className="text-xs font-bold text-ink-soft">
              {fmt(saved)} / {fmt(goal.cost)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-surface2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-peach to-sun transition-[width] duration-700 ease-out"
              style={{ width: `${Math.round(ratio * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-ink-soft">
            Encore <b className="text-sun-ink">{fmt(remaining)}</b> d'évités et c'est pour toi 💛
          </p>
        </>
      )}
    </div>
  )
}
