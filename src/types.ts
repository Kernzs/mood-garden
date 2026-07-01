// ---- Core domain types for Mood Garden ----

/**
 * The four things a user can log.
 * Positive actions (avoided / postponed / didSomethingElse) grow the garden.
 * `smoked` is tracked with kindness and NEVER shrinks the garden.
 */
export type ActionType = 'avoided' | 'postponed' | 'didSomethingElse' | 'smoked'

/**
 * Optional: how the user handled the urge after a positive action.
 * `cigarette` is loggable but intentionally never rewarded or encouraged.
 */
export type UrgeHandledBy =
  | 'waited'
  | 'drank'
  | 'walked'
  | 'distracted'
  | 'breathed'
  | 'cigarette'
  | 'other'

/** Optional: what triggered the urge. */
export type Trigger =
  | 'stress'
  | 'boredom'
  | 'social'
  | 'habit'
  | 'afterMeal'
  | 'other'

export interface Entry {
  id: string
  timestamp: number // Date.now()
  actionType: ActionType
  urgeHandledBy?: UrgeHandledBy
  trigger?: Trigger
  note?: string
}

export type ThemeName = 'daylight' | 'dusk'
export type GoalScope = 'daily' | 'weekly'
export type ReminderFrequency = 'off' | 'daily' | 'weekly'

/** Objectif « récompense réelle » : un vrai plaisir financé par les économies. */
export interface RewardGoal {
  label: string
  cost: number
  startedAt: number // les économies sont comptées à partir de cette date
}

export interface Settings {
  goalScope: GoalScope
  goalValue: number // gentle target of "avoided moments"
  costPerJoint: number
  currency: string
  reminderFrequency: ReminderFrequency
  theme: ThemeName
  language: 'fr'
  onboardingDone: boolean
  rewardGoal: RewardGoal | null
  /** Consommation estimée AVANT Mood Garden (joints/jour) — le point de départ. */
  baselinePerDay: number | null
  /** Le prénom de la plante 💛 (optionnel, pour l'attachement). */
  plantName: string | null
}

export interface Progress {
  totalSunlight: number
  gardenStage: number
  /** dayKey (YYYY-MM-DD) du dernier arrosage quotidien, null si jamais. */
  lastWateredDay: string | null
  /** Ids des jalons déjà célébrés (pour ne les fêter qu'une fois). */
  milestonesSeen: string[]
}

/** Everything we persist, versioned for future migrations. */
export interface PersistedState {
  version: number
  entries: Entry[]
  settings: Settings
  progress: Progress
}
