import { useMemo } from 'react'
import { useGarden } from '@/context/GardenContext'
import { Screen, ScreenHeader } from '@/components/layout/Screen'
import { StatCard } from '@/components/stats/StatCard'
import { TrendChart } from '@/components/stats/TrendChart'
import { GoalRing } from '@/components/stats/GoalRing'
import { TriggerBreakdown } from '@/components/stats/TriggerBreakdown'
import { MilestonesCard } from '@/components/stats/MilestonesCard'
import { RewardCard } from '@/components/stats/RewardCard'
import { UrgePatternsCard } from '@/components/stats/UrgePatternsCard'
import { EmptyState } from '@/components/journal/EmptyState'
import {
  countByAction,
  moneySaved,
  currentStreak,
  bestStreak,
  dailySeries,
  triggerBreakdown,
  goalProgress,
} from '@/lib/stats'
import { copy } from '@/lib/copy'

export function StatsScreen() {
  const { entries, settings } = useGarden()

  const stats = useMemo(() => {
    const totals = countByAction(entries)
    return {
      totals,
      money: moneySaved(entries, settings.costPerJoint),
      streak: currentStreak(entries),
      best: bestStreak(entries),
      series: dailySeries(entries, 7),
      triggers: triggerBreakdown(entries),
      goal: goalProgress(entries, settings),
    }
  }, [entries, settings])

  const moneyLabel = `${stats.money.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${settings.currency}`

  if (entries.length === 0) {
    return (
      <Screen>
        <ScreenHeader emoji="📈" title="Tes progrès" subtitle="Doux et sans pression." />
        <EmptyState emoji="🌼" title="Bientôt plein de couleurs" message={copy.emptyStats} />
      </Screen>
    )
  }

  return (
    <Screen>
      <ScreenHeader emoji="📈" title="Tes progrès" subtitle="Doux, motivant, sans pression." />

      {/* Objectif */}
      <div className="card-soft p-4">
        <GoalRing goal={stats.goal} />
      </div>

      {/* Récompense réelle (si définie) */}
      <RewardCard />

      {/* Cartes clés */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard emoji="🌿" value={stats.totals.avoided} label="Moments évités" tint="green" />
        <StatCard emoji="💰" value={moneyLabel} label="Économisé (estim.)" tint="sun" />
        <StatCard emoji="⏳" value={stats.totals.postponed} label="Envies reportées" tint="lavender" />
        <StatCard emoji="🍃" value={stats.totals.smoked} label="Moments fumés" tint="neutral" />
      </div>

      {/* Séries douces */}
      <div className="card-soft flex items-center justify-around p-4 text-center">
        <div>
          <p className="text-2xl font-extrabold text-primary-ink tabular-nums">{stats.streak}</p>
          <p className="text-xs font-semibold text-ink-soft">série en cours 🌤️</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-2xl font-extrabold text-ink tabular-nums">{stats.best}</p>
          <p className="text-xs font-semibold text-ink-soft">meilleure série ✨</p>
        </div>
      </div>

      {/* Tendance 7 jours */}
      <div className="card-soft p-4">
        <h2 className="mb-1 text-base text-ink">Ces 7 derniers jours</h2>
        <p className="mb-3 text-xs text-ink-soft">Tes moments positifs, jour après jour.</p>
        <TrendChart data={stats.series} />
      </div>

      {/* Moments d'envie (créneaux + tendance douce) */}
      <UrgePatternsCard />

      {/* Déclencheurs */}
      <div className="card-soft p-4">
        <h2 className="mb-1 text-base text-ink">Tes déclencheurs</h2>
        <p className="mb-3 text-xs text-ink-soft">Sans jugement — juste pour mieux te connaître.</p>
        <TriggerBreakdown data={stats.triggers} />
      </div>

      {/* Jalons */}
      <MilestonesCard />
    </Screen>
  )
}
