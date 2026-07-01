import type { ActionType, Entry, Settings, Trigger } from '@/types'
import { dayKey, isSameDay, lastNDays, startOfDay } from '@/lib/date'

export const POSITIVE_ACTIONS: ActionType[] = ['avoided', 'postponed', 'didSomethingElse']
/** Actions qui comptent comme « un joint pas fumé » (pour l'argent économisé). */
export const JOINT_AVOIDED_ACTIONS: ActionType[] = ['avoided', 'didSomethingElse']

export function isPositive(action: ActionType): boolean {
  return POSITIVE_ACTIONS.includes(action)
}

export interface Totals {
  avoided: number
  postponed: number
  didSomethingElse: number
  smoked: number
  positive: number
  jointsAvoided: number
}

export function countByAction(entries: Entry[]): Totals {
  const t: Totals = {
    avoided: 0,
    postponed: 0,
    didSomethingElse: 0,
    smoked: 0,
    positive: 0,
    jointsAvoided: 0,
  }
  for (const e of entries) {
    t[e.actionType]++
    if (isPositive(e.actionType)) t.positive++
    if (JOINT_AVOIDED_ACTIONS.includes(e.actionType)) t.jointsAvoided++
  }
  return t
}

export function entriesForDay(entries: Entry[], dayStart: number): Entry[] {
  return entries.filter((e) => isSameDay(e.timestamp, dayStart))
}

export function todayTotals(entries: Entry[], now = Date.now()): Totals {
  return countByAction(entriesForDay(entries, now))
}

export function moneySaved(entries: Entry[], costPerJoint: number): number {
  return countByAction(entries).jointsAvoided * costPerJoint
}

/**
 * Série douce : nb de jours consécutifs (finissant aujourd'hui ou hier) avec ≥1 choix positif.
 * Aucun jugement — juste un petit encouragement.
 */
export function currentStreak(entries: Entry[], now = Date.now()): number {
  const positiveDays = new Set(
    entries.filter((e) => isPositive(e.actionType)).map((e) => dayKey(e.timestamp)),
  )
  if (positiveDays.size === 0) return 0

  const today = startOfDay(now)
  // La série peut se terminer aujourd'hui ou hier (on ne "casse" pas si la journée n'est pas finie).
  let cursor = positiveDays.has(dayKey(today)) ? today : today - 86_400_000
  if (!positiveDays.has(dayKey(cursor))) return 0

  let streak = 0
  while (positiveDays.has(dayKey(cursor))) {
    streak++
    cursor -= 86_400_000
  }
  return streak
}

export function bestStreak(entries: Entry[]): number {
  const positiveDays = Array.from(
    new Set(entries.filter((e) => isPositive(e.actionType)).map((e) => startOfDay(e.timestamp))),
  ).sort((a, b) => a - b)

  let best = 0
  let run = 0
  let prev = 0
  for (const day of positiveDays) {
    if (prev && day - prev === 86_400_000) run++
    else run = 1
    if (run > best) best = run
    prev = day
  }
  return best
}

export interface DayBucket {
  dayStart: number
  avoided: number
  positive: number
  smoked: number
}

/** Série des N derniers jours pour les mini-graphes. */
export function dailySeries(entries: Entry[], n: number, now = Date.now()): DayBucket[] {
  const days = lastNDays(n, now)
  return days.map((dayStart) => {
    const dayEntries = entriesForDay(entries, dayStart)
    const t = countByAction(dayEntries)
    return {
      dayStart,
      avoided: t.jointsAvoided,
      positive: t.positive,
      smoked: t.smoked,
    }
  })
}

export interface TriggerCount {
  trigger: Trigger
  count: number
}

export function triggerBreakdown(entries: Entry[]): TriggerCount[] {
  const map = new Map<Trigger, number>()
  for (const e of entries) {
    if (e.trigger) map.set(e.trigger, (map.get(e.trigger) ?? 0) + 1)
  }
  return Array.from(map.entries())
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
}

export interface GoalProgress {
  value: number // positive/avoided moments in the current period
  target: number
  ratio: number // 0..1
  scopeLabel: string
}

/** Progression vers l'objectif doux (moments évités sur la période). */
export function goalProgress(entries: Entry[], settings: Settings, now = Date.now()): GoalProgress {
  const target = Math.max(1, settings.goalValue)
  let value = 0

  if (settings.goalScope === 'daily') {
    value = todayTotals(entries, now).jointsAvoided
  } else {
    // 7 derniers jours
    const from = startOfDay(now) - 6 * 86_400_000
    value = countByAction(entries.filter((e) => startOfDay(e.timestamp) >= from)).jointsAvoided
  }

  return {
    value,
    target,
    ratio: Math.min(1, value / target),
    scopeLabel: settings.goalScope === 'daily' ? 'aujourd’hui' : 'cette semaine',
  }
}
