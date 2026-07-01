import type { ActionType } from '@/types'

/** Sunlight (☀️) earned per action. Positive only — smoking never subtracts. */
export const SUNLIGHT_BY_ACTION: Record<ActionType, number> = {
  avoided: 5,
  didSomethingElse: 4,
  postponed: 3,
  smoked: 0,
}

export function sunlightForAction(action: ActionType): number {
  return SUNLIGHT_BY_ACTION[action]
}

export interface GardenStage {
  index: number
  name: string
  threshold: number // cumulative sunlight required to reach this stage
  blurb: string
}

/**
 * Monotonic stages — the garden only ever moves forward.
 * Thresholds are cumulative total sunlight.
 */
export const GARDEN_STAGES: GardenStage[] = [
  { index: 0, name: 'Petite graine', threshold: 0, blurb: 'Tout commence ici.' },
  { index: 1, name: 'Première pousse', threshold: 10, blurb: 'Ça pointe le bout de son nez !' },
  { index: 2, name: 'Petites feuilles', threshold: 30, blurb: 'De jolies feuilles s’ouvrent.' },
  { index: 3, name: 'Plante feuillue', threshold: 70, blurb: 'Ça pousse pour de vrai.' },
  { index: 4, name: 'Premier bouton', threshold: 130, blurb: 'Un bouton se prépare à fleurir.' },
  { index: 5, name: 'Floraison', threshold: 220, blurb: 'Les fleurs s’épanouissent 🌸' },
  { index: 6, name: 'Jardin fleuri', threshold: 350, blurb: 'Les papillons arrivent 🦋' },
  { index: 7, name: 'Jardin magique', threshold: 550, blurb: 'Ton jardin scintille ✨' },
]

export const MAX_STAGE = GARDEN_STAGES.length - 1

export function stageForSunlight(total: number): number {
  let stage = 0
  for (const s of GARDEN_STAGES) {
    if (total >= s.threshold) stage = s.index
    else break
  }
  return stage
}

export function getStage(index: number): GardenStage {
  return GARDEN_STAGES[Math.max(0, Math.min(index, MAX_STAGE))]
}

export interface NextStageInfo {
  isMax: boolean
  current: GardenStage
  next: GardenStage | null
  remaining: number // sunlight remaining to reach next stage
  /** 0..1 progress within the current stage band. */
  progress: number
}

export function nextStageInfo(total: number): NextStageInfo {
  const currentIndex = stageForSunlight(total)
  const current = getStage(currentIndex)

  if (currentIndex >= MAX_STAGE) {
    return { isMax: true, current, next: null, remaining: 0, progress: 1 }
  }

  const next = getStage(currentIndex + 1)
  const bandStart = current.threshold
  const bandEnd = next.threshold
  const span = Math.max(1, bandEnd - bandStart)
  const progress = Math.min(1, Math.max(0, (total - bandStart) / span))
  const remaining = Math.max(0, bandEnd - total)

  return { isMax: false, current, next, remaining, progress }
}
