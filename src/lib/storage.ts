import type { ActionType, Entry, PersistedState, Progress, Settings } from '@/types'
import { stageForSunlight } from '@/lib/garden'

const STORAGE_KEY = 'moodgarden.state'
const STATE_VERSION = 1

const VALID_ACTIONS: ActionType[] = ['avoided', 'postponed', 'didSomethingElse', 'smoked']

export const defaultSettings: Settings = {
  goalScope: 'daily',
  goalValue: 1,
  costPerJoint: 5,
  currency: '€',
  reminderFrequency: 'off',
  theme: 'daylight',
  language: 'fr',
  onboardingDone: false,
  rewardGoal: null,
  baselinePerDay: null,
  plantName: null,
}

export const defaultProgress: Progress = {
  totalSunlight: 0,
  gardenStage: 0,
  lastWateredDay: null,
  milestonesSeen: [],
}

export function defaultState(): PersistedState {
  return {
    version: STATE_VERSION,
    entries: [],
    settings: { ...defaultSettings },
    progress: { ...defaultProgress },
  }
}

function isValidEntry(e: unknown): e is Entry {
  if (!e || typeof e !== 'object') return false
  const x = e as Record<string, unknown>
  return (
    typeof x.id === 'string' &&
    typeof x.timestamp === 'number' &&
    Number.isFinite(x.timestamp) &&
    VALID_ACTIONS.includes(x.actionType as ActionType)
  )
}

function reconcileProgress(progress: Progress): Progress {
  // Le jardin ne recule jamais : le total stocké fait foi, l'étape en découle.
  const total = Math.max(0, Number(progress.totalSunlight) || 0)
  return {
    ...progress,
    totalSunlight: total,
    gardenStage: stageForSunlight(total),
    milestonesSeen: Array.isArray(progress.milestonesSeen) ? progress.milestonesSeen : [],
    lastWateredDay: typeof progress.lastWateredDay === 'string' ? progress.lastWateredDay : null,
  }
}

/**
 * Normalise un objet quelconque (localStorage, fichier importé…) vers un
 * PersistedState valide : merge des défauts, filtrage des entrées invalides,
 * recalcul de l'étape. Lève une erreur si la forme est irrécupérable.
 */
export function normalizeState(raw: unknown): PersistedState {
  if (!raw || typeof raw !== 'object') throw new Error('format invalide')
  const parsed = raw as Partial<PersistedState>

  const entries = Array.isArray(parsed.entries) ? parsed.entries.filter(isValidEntry) : []

  const merged: PersistedState = {
    version: STATE_VERSION,
    entries,
    settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
    progress: { ...defaultProgress, ...(parsed.progress ?? {}) },
  }
  merged.progress = reconcileProgress(merged.progress)
  return merged
}

export function loadState(): PersistedState {
  if (typeof localStorage === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return normalizeState(JSON.parse(raw))
  } catch {
    return defaultState()
  }
}

export function saveState(state: PersistedState): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // silencieux — pas de stockage disponible (mode privé, quota…)
  }
}

export function clearState(): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function exportStateJSON(state: PersistedState): string {
  return JSON.stringify(state, null, 2)
}
