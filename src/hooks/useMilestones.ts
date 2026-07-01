import { useEffect, useMemo, useRef } from 'react'
import { useGarden } from '@/context/GardenContext'
import { useToast } from '@/hooks/useToast'
import { achievedMilestones, computeMilestoneStats, type Milestone } from '@/lib/milestones'
import { hapticSuccess } from '@/lib/haptics'

/**
 * Surveille les jalons : quand un nouveau est atteint, petit toast de fête
 * (une seule fois — les jalons célébrés sont persistés dans progress.milestonesSeen).
 * Retourne la liste des jalons atteints (pour l'écran Progrès).
 */
export function useMilestones(): Milestone[] {
  const { entries, progress, settings, hydrated, markMilestonesSeen } = useGarden()
  const { toast } = useToast()

  const achieved = useMemo(
    () => achievedMilestones(computeMilestoneStats(entries, progress, settings)),
    [entries, progress, settings],
  )

  // Au premier rendu après hydratation, on marque silencieusement les jalons déjà
  // atteints par d'anciennes données (pas de rafale de toasts au premier lancement v2).
  const initialized = useRef(false)
  useEffect(() => {
    if (!hydrated) return
    const seen = new Set(progress.milestonesSeen)
    const fresh = achieved.filter((m) => !seen.has(m.id))
    if (!initialized.current) {
      initialized.current = true
      if (fresh.length > 0) markMilestonesSeen(fresh.map((m) => m.id))
      return
    }
    if (fresh.length === 0) return
    // Célébration douce (une seule à la fois pour ne pas noyer)
    const m = fresh[0]
    toast(`Nouveau jalon : ${m.name} ${m.emoji}`, '🎉')
    hapticSuccess()
    markMilestonesSeen(fresh.map((x) => x.id))
  }, [hydrated, achieved, progress.milestonesSeen, markMilestonesSeen, toast])

  return achieved
}
