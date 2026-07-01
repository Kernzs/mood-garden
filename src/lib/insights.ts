import type { Entry, Trigger } from '@/types'
import { isPositive } from '@/lib/stats'
import { startOfDay } from '@/lib/date'

// ---- Répartition des envies par moment de la journée ----

export type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night'

export interface PeriodCount {
  period: DayPeriod
  emoji: string
  label: string
  count: number
}

const PERIODS: Array<{ period: DayPeriod; emoji: string; label: string; from: number; to: number }> = [
  { period: 'morning', emoji: '🌅', label: 'Matin', from: 6, to: 12 },
  { period: 'afternoon', emoji: '☀️', label: 'Après-midi', from: 12, to: 18 },
  { period: 'evening', emoji: '🌇', label: 'Soir', from: 18, to: 24 },
  { period: 'night', emoji: '🌙', label: 'Nuit', from: 0, to: 6 },
]

/** Chaque entrée = un moment d'envie ; on regarde à quelles heures ils arrivent. */
export function urgesByPeriod(entries: Entry[]): PeriodCount[] {
  return PERIODS.map(({ period, emoji, label, from, to }) => ({
    period,
    emoji,
    label,
    count: entries.filter((e) => {
      const h = new Date(e.timestamp).getHours()
      return h >= from && h < to
    }).length,
  }))
}

// ---- Déclencheur n°1 des 7 derniers jours ----

export function topTriggerLast7Days(entries: Entry[], now = Date.now()): Trigger | null {
  const from = startOfDay(now) - 6 * 86_400_000
  const counts = new Map<Trigger, number>()
  for (const e of entries) {
    if (e.timestamp >= from && e.trigger) {
      counts.set(e.trigger, (counts.get(e.trigger) ?? 0) + 1)
    }
  }
  let best: Trigger | null = null
  let max = 0
  for (const [t, c] of counts) {
    if (c > max) {
      max = c
      best = t
    }
  }
  return best
}

// ---- Depuis ton point de départ (baseline) ----

export interface BaselineComparison {
  baseline: number
  /** Moyenne de moments fumés/jour sur les 7 derniers jours (d'après ce qui est noté). */
  avgLast7: number
  /** % de réduction vs le point de départ — null si pas (encore) en baisse. */
  improvementPct: number | null
  /** 0..1 : position actuelle entre baseline (0) et zéro (1), pour une jauge. */
  progress: number
}

export function baselineComparison(
  entries: Entry[],
  baselinePerDay: number | null,
  now = Date.now(),
): BaselineComparison | null {
  if (!baselinePerDay || baselinePerDay <= 0) return null
  const from = startOfDay(now) - 6 * 86_400_000
  const smoked = entries.filter(
    (e) => e.actionType === 'smoked' && e.timestamp >= from,
  ).length
  const avgLast7 = Math.round((smoked / 7) * 10) / 10
  const improvement = 1 - avgLast7 / baselinePerDay
  return {
    baseline: baselinePerDay,
    avgLast7,
    improvementPct: improvement > 0 ? Math.round(improvement * 100) : null,
    progress: Math.min(1, Math.max(0, improvement)),
  }
}

// ---- Tendance douce (jamais culpabilisante) ----

/**
 * Compare les moments positifs des 7 derniers jours aux 7 précédents.
 * Retourne toujours une phrase bienveillante : encourageante si ça progresse,
 * neutre sinon — JAMAIS négative ou culpabilisante.
 */
export function gentleTrend(entries: Entry[], now = Date.now()): string | null {
  const day = 86_400_000
  const today = startOfDay(now)
  const last7From = today - 6 * day
  const prev7From = today - 13 * day

  const positives = entries.filter((e) => isPositive(e.actionType))
  const recent = positives.filter((e) => e.timestamp >= last7From).length
  const previous = positives.filter(
    (e) => e.timestamp >= prev7From && e.timestamp < last7From,
  ).length

  if (recent === 0 && previous === 0) return null
  if (previous === 0 && recent > 0) return 'Tes premiers moments positifs prennent racine 🌱'
  if (recent > previous) return 'Tes envies gérées progressent — ton jardin le sent 🌱'
  if (recent === previous) return 'Un rythme régulier, tout en douceur 🌿'
  return 'Chaque semaine est différente, et c’est ok. Ton jardin t’attend 💛'
}
