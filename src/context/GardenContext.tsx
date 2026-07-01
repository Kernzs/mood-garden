import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { ActionType, Entry, PersistedState, Settings } from '@/types'
import { loadState, saveState, defaultState, normalizeState } from '@/lib/storage'
import { sunlightForAction, stageForSunlight } from '@/lib/garden'
import { dayKey } from '@/lib/date'

export interface LogResult {
  entry: Entry
  sunlightGained: number
  newTotal: number
  stageUp: { from: number; to: number } | null
}

export interface WaterResult {
  newTotal: number
  stageUp: { from: number; to: number } | null
}

type EntryDetails = Partial<Pick<Entry, 'urgeHandledBy' | 'trigger' | 'note'>>

interface GardenContextValue {
  entries: Entry[]
  settings: Settings
  progress: PersistedState['progress']
  hydrated: boolean
  logAction: (actionType: ActionType, details?: EntryDetails) => LogResult
  setEntryDetails: (id: string, details: EntryDetails) => void
  deleteEntry: (id: string) => void
  updateSettings: (partial: Partial<Settings>) => void
  /** Arrose le jardin (1×/jour max). Retourne null si déjà arrosé aujourd'hui. */
  waterGarden: () => WaterResult | null
  markMilestonesSeen: (ids: string[]) => void
  /** Remplace tout l'état par des données importées (déjà validées/normalisées). */
  importState: (raw: unknown) => void
  resetAll: () => void
  seedDemoData: () => void
}

const GardenContext = createContext<GardenContextValue | null>(null)

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
}

/** Couleur de la barre du navigateur, alignée sur --c-bg de chaque thème. */
const THEME_BAR_COLOR: Record<string, string> = {
  daylight: '#fff6ea',
  dusk: '#221c39',
}

export function GardenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => loadState())
  const [hydrated, setHydrated] = useState(false)

  // Miroir synchrone de l'état, pour que logAction puisse calculer son résultat
  // sans dépendre du timing (asynchrone) des updaters de setState.
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    setHydrated(true)
  }, [])

  // Persist on any change (skip the very first render to avoid a redundant write).
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    saveState(state)
  }, [state])

  // Applique le thème à <html data-theme="..."> + met à jour la barre du navigateur.
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme
    const meta = document.querySelector('meta[name="theme-color"]:not([media])')
    const color = THEME_BAR_COLOR[state.settings.theme] ?? THEME_BAR_COLOR.daylight
    if (meta) {
      meta.setAttribute('content', color)
    } else {
      const m = document.createElement('meta')
      m.name = 'theme-color'
      m.content = color
      document.head.appendChild(m)
    }
  }, [state.settings.theme])

  /** Cœur commun log/arrosage : applique un gain de soleil et détecte la montée d'étape. */
  const commit = useCallback((next: PersistedState) => {
    stateRef.current = next
    setState(next)
  }, [])

  const logAction = useCallback<GardenContextValue['logAction']>(
    (actionType, details) => {
      const prev = stateRef.current
      const entry: Entry = {
        id: newId(),
        timestamp: Date.now(),
        actionType,
        ...details,
      }
      const gained = sunlightForAction(actionType)
      const newTotal = prev.progress.totalSunlight + gained
      const fromStage = prev.progress.gardenStage
      const toStage = stageForSunlight(newTotal)

      commit({
        ...prev,
        entries: [entry, ...prev.entries],
        progress: { ...prev.progress, totalSunlight: newTotal, gardenStage: toStage },
      })

      return {
        entry,
        sunlightGained: gained,
        newTotal,
        stageUp: toStage > fromStage ? { from: fromStage, to: toStage } : null,
      }
    },
    [commit],
  )

  const waterGarden = useCallback<GardenContextValue['waterGarden']>(() => {
    const prev = stateRef.current
    const today = dayKey(Date.now())
    if (prev.progress.lastWateredDay === today) return null // déjà arrosé aujourd'hui

    const newTotal = prev.progress.totalSunlight + 1
    const fromStage = prev.progress.gardenStage
    const toStage = stageForSunlight(newTotal)

    commit({
      ...prev,
      progress: {
        ...prev.progress,
        totalSunlight: newTotal,
        gardenStage: toStage,
        lastWateredDay: today,
      },
    })

    return {
      newTotal,
      stageUp: toStage > fromStage ? { from: fromStage, to: toStage } : null,
    }
  }, [commit])

  const markMilestonesSeen = useCallback<GardenContextValue['markMilestonesSeen']>(
    (ids) => {
      if (ids.length === 0) return
      const prev = stateRef.current
      const seen = new Set([...prev.progress.milestonesSeen, ...ids])
      commit({
        ...prev,
        progress: { ...prev.progress, milestonesSeen: Array.from(seen) },
      })
    },
    [commit],
  )

  const importState = useCallback<GardenContextValue['importState']>(
    (raw) => {
      const normalized = normalizeState(raw) // lève si invalide — géré par l'appelant
      // On ne renvoie jamais l'utilisateur dans l'onboarding après un import.
      normalized.settings.onboardingDone =
        normalized.settings.onboardingDone || stateRef.current.settings.onboardingDone
      commit(normalized)
    },
    [commit],
  )

  const setEntryDetails = useCallback<GardenContextValue['setEntryDetails']>(
    (id, details) => {
      const prev = stateRef.current
      commit({
        ...prev,
        entries: prev.entries.map((e) => (e.id === id ? { ...e, ...details } : e)),
      })
    },
    [commit],
  )

  const deleteEntry = useCallback<GardenContextValue['deleteEntry']>(
    (id) => {
      // Supprimer une entrée ne fait PAS reculer le jardin (progression non punitive).
      const prev = stateRef.current
      commit({ ...prev, entries: prev.entries.filter((e) => e.id !== id) })
    },
    [commit],
  )

  const updateSettings = useCallback<GardenContextValue['updateSettings']>(
    (partial) => {
      const prev = stateRef.current
      commit({ ...prev, settings: { ...prev.settings, ...partial } })
    },
    [commit],
  )

  const resetAll = useCallback(() => {
    const prev = stateRef.current
    const fresh = defaultState()
    // On garde les préférences (thème, coûts, objectif) et l'onboarding déjà fait.
    // La récompense repart de zéro (ses économies seraient périmées).
    fresh.settings = {
      ...fresh.settings,
      theme: prev.settings.theme,
      onboardingDone: prev.settings.onboardingDone,
      costPerJoint: prev.settings.costPerJoint,
      currency: prev.settings.currency,
      goalScope: prev.settings.goalScope,
      goalValue: prev.settings.goalValue,
    }
    commit(fresh)
  }, [commit])

  const seedDemoData = useCallback(() => {
    const prev = stateRef.current
    const now = Date.now()
    const demo: Entry[] = []
    let total = 0
    const day = 86_400_000
    // 6 derniers jours, quelques moments par jour
    const plan: Array<[number, ActionType[]]> = [
      [6, ['avoided', 'postponed', 'smoked']],
      [5, ['avoided', 'didSomethingElse']],
      [4, ['avoided']],
      [3, ['postponed', 'avoided', 'avoided']],
      [2, ['didSomethingElse', 'avoided', 'smoked']],
      [1, ['avoided', 'avoided']],
      [0, ['avoided', 'postponed', 'didSomethingElse']],
    ]
    const triggers = ['stress', 'boredom', 'social', 'habit', 'afterMeal'] as const
    for (const [ago, actions] of plan) {
      actions.forEach((a, i) => {
        const ts = now - ago * day + i * 3_600_000
        total += sunlightForAction(a)
        demo.push({
          id: newId(),
          timestamp: ts,
          actionType: a,
          trigger: triggers[(ago + i) % triggers.length],
        })
      })
    }
    demo.sort((a, b) => b.timestamp - a.timestamp)
    commit({
      ...prev,
      entries: demo,
      progress: {
        ...prev.progress,
        totalSunlight: total,
        gardenStage: stageForSunlight(total),
      },
    })
  }, [commit])

  const value = useMemo<GardenContextValue>(
    () => ({
      entries: state.entries,
      settings: state.settings,
      progress: state.progress,
      hydrated,
      logAction,
      setEntryDetails,
      deleteEntry,
      updateSettings,
      waterGarden,
      markMilestonesSeen,
      importState,
      resetAll,
      seedDemoData,
    }),
    [
      state,
      hydrated,
      logAction,
      setEntryDetails,
      deleteEntry,
      updateSettings,
      waterGarden,
      markMilestonesSeen,
      importState,
      resetAll,
      seedDemoData,
    ],
  )

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>
}

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext)
  if (!ctx) throw new Error('useGarden doit être utilisé dans <GardenProvider>')
  return ctx
}
