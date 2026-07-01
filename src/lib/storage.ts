import type { Entry, PersistedState, Progress, Settings } from '@/types'
import { stageForSunlight } from '@/lib/garden'

const STORAGE_KEY = 'moodgarden.state'
const STATE_VERSION = 1

export const defaultSettings: Settings = {
  goalScope: 'daily',
  goalValue: 1,
  costPerJoint: 5,
  currency: '€',
  reminderFrequency: 'off',
  theme: 'daylight',
  language: 'fr',
  onboardingDone: false,
}

export const defaultProgress: Progress = {
  totalSunlight: 0,
  gardenStage: 0,
}

export function defaultState(): PersistedState {
  return {
    version: STATE_VERSION,
    entries: [],
    settings: { ...defaultSettings },
    progress: { ...defaultProgress },
  }
}

function reconcileProgress(entries: Entry[], progress: Progress): Progress {
  // Le jardin ne recule jamais : on garde le max entre le total stocké et le total recalculé
  // à partir des entrées (robustesse si les données divergent).
  const total = Math.max(0, progress.totalSunlight)
  return {
    totalSunlight: total,
    gardenStage: stageForSunlight(total),
  }
}

export function loadState(): PersistedState {
  if (typeof localStorage === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<PersistedState>

    const merged: PersistedState = {
      version: STATE_VERSION,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      progress: { ...defaultProgress, ...(parsed.progress ?? {}) },
    }
    merged.progress = reconcileProgress(merged.entries, merged.progress)
    return merged
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
