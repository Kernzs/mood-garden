import { useEffect, useRef, useState } from 'react'
import type { ActionType } from '@/types'
import { useGarden } from '@/context/GardenContext'
import { useToast } from '@/hooks/useToast'
import { todayTotals, currentStreak } from '@/lib/stats'
import { APP_NAME, homeGreetings, positiveAffirmations, actionEmojis, pickFrom } from '@/lib/copy'
import { GardenScene } from '@/components/garden/GardenScene'
import { StageProgress } from '@/components/garden/StageProgress'
import { SunlightBurst } from '@/components/garden/SunlightBurst'
import { StepUpCelebration } from '@/components/garden/StepUpCelebration'
import { StreakPill } from '@/components/home/StreakPill'
import { EncouragementBanner } from '@/components/home/EncouragementBanner'
import { QuickActions } from '@/components/home/QuickActions'
import { TodaySummary } from '@/components/home/TodaySummary'
import { UrgeFollowUpSheet, type UrgeDetails } from '@/components/log/UrgeFollowUpSheet'
import { SmokedSheet, type SmokedDetails } from '@/components/log/SmokedSheet'
import { Screen } from '@/components/layout/Screen'

export function HomeScreen() {
  const { entries, progress, logAction, setEntryDetails } = useGarden()
  const { toast } = useToast()

  const [burst, setBurst] = useState<{ id: number; amount: number } | null>(null)
  const [celebration, setCelebration] = useState<{ from: number; to: number } | null>(null)
  const [followUpId, setFollowUpId] = useState<string | null>(null)
  const [smokedOpen, setSmokedOpen] = useState(false)
  const burstCounter = useRef(0)

  const [greetingSeed] = useState(() => Math.floor(Math.random() * 1000))

  const totals = todayTotals(entries)
  const streak = currentStreak(entries)

  useEffect(() => {
    if (!burst) return
    const t = window.setTimeout(() => setBurst(null), 1500)
    return () => window.clearTimeout(t)
  }, [burst])

  const handleAction = (action: ActionType) => {
    if (action === 'smoked') {
      setSmokedOpen(true)
      return
    }
    const res = logAction(action)
    setBurst({ id: ++burstCounter.current, amount: res.sunlightGained })
    toast(pickFrom(positiveAffirmations, burstCounter.current), actionEmojis[action])
    if (res.stageUp) setCelebration(res.stageUp)
    setFollowUpId(res.entry.id)
  }

  const handleFollowUpSave = (details: UrgeDetails) => {
    if (followUpId) setEntryDetails(followUpId, details)
  }

  const handleSmokedConfirm = (details: SmokedDetails) => {
    logAction('smoked', details)
    toast("C'est noté, prends soin de toi 💛")
  }

  return (
    <Screen>
      {/* En-tête */}
      <header className="px-1 pt-1">
        <h1 className="text-[1.7rem] leading-tight text-ink">
          {APP_NAME} <span aria-hidden>🌱</span>
        </h1>
        <p className="text-sm text-ink-soft">{pickFrom(homeGreetings, greetingSeed)}</p>
      </header>

      {/* Jardin */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-soft)]">
        <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between p-3">
          <StreakPill streak={streak} />
          <span className="inline-flex items-center gap-1 rounded-full bg-surface/85 px-2.5 py-1 text-xs font-extrabold text-sun-ink shadow-[var(--shadow-soft)] backdrop-blur">
            ☀️ {progress.totalSunlight}
          </span>
        </div>
        <div className="relative aspect-[10/9] w-full">
          <GardenScene stage={progress.gardenStage} />
          {burst && <SunlightBurst key={burst.id} amount={burst.amount} />}
        </div>
        <div className="border-t border-border bg-surface/70 px-4 py-3 backdrop-blur">
          <StageProgress totalSunlight={progress.totalSunlight} />
        </div>
      </div>

      {/* Invitation + actions */}
      <EncouragementBanner
        title="Comment tu te sens, là ?"
        message="Choisis ce qui te correspond — chaque note fait pousser ton jardin."
      />
      <QuickActions onAction={handleAction} />

      {/* Résumé du jour */}
      <div className="card-soft p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-base text-ink">Aujourd'hui</h2>
          <span className="text-xs font-semibold text-ink-soft">
            {totals.positive} moment{totals.positive > 1 ? 's' : ''} pour toi 💚
          </span>
        </div>
        <TodaySummary totals={totals} />
      </div>

      {/* Feuilles / sheets */}
      <UrgeFollowUpSheet
        open={followUpId !== null}
        onClose={() => setFollowUpId(null)}
        onSave={handleFollowUpSave}
      />
      <SmokedSheet
        open={smokedOpen}
        onClose={() => setSmokedOpen(false)}
        onConfirm={handleSmokedConfirm}
      />

      {celebration && (
        <StepUpCelebration
          from={celebration.from}
          to={celebration.to}
          onClose={() => setCelebration(null)}
        />
      )}
    </Screen>
  )
}
