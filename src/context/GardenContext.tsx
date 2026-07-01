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
import { loadState, saveState, defaultState } from '@/lib/storage'
import { sunlightForAction, stageForSunlight } from '@/lib/garden'

export interface LogResult {
  entry: Entry
  sunlightGained: number
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
  resetAll: () => void
  seedDemoData: () => void
}

const GardenContext = createContext<GardenContextValue | null>(null)

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`
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

  // Apply theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme
  }, [state.settings.theme])

  const logAction = useCallback<GardenContextValue['logAction']>((actionType, details) => {
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

    const next: PersistedState = {
      ...prev,
      entries: [entry, ...prev.entries],
      progress: { totalSunlight: newTotal, gardenStage: toStage },
    }
    stateRef.current = next
    setState(next)

    return {
      entry,
      sunlightGained: gained,
      newTotal,
      stageUp: toStage > fromStage ? { from: fromStage, to: toStage } : null,
    }
  }, [])

  const setEntryDetails = useCallback<GardenContextValue['setEntryDetails']>((id, details) => {
    setState((prev) => ({
      ...prev,
      entries: prev.entries.map((e) => (e.id === id ? { ...e, ...details } : e)),
    }))
  }, [])

  const deleteEntry = useCallback<GardenContextValue['deleteEntry']>((id) => {
    // Supprimer une entrée ne fait PAS reculer le jardin (progression non punitive).
    setState((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.id !== id) }))
  }, [])

  const updateSettings = useCallback<GardenContextValue['updateSettings']>((partial) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...partial } }))
  }, [])

  const resetAll = useCallback(() => {
    const fresh = defaultState()
    // On garde les préférences visuelles et l'onboarding déjà fait.
    fresh.settings = {
      ...fresh.settings,
      theme: state.settings.theme,
      onboardingDone: state.settings.onboardingDone,
      costPerJoint: state.settings.costPerJoint,
      currency: state.settings.currency,
      goalScope: state.settings.goalScope,
      goalValue: state.settings.goalValue,
    }
    setState(fresh)
  }, [state.settings])

  const seedDemoData = useCallback(() => {
    setState((prev) => {
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
      return {
        ...prev,
        entries: demo,
        progress: { totalSunlight: total, gardenStage: stageForSunlight(total) },
      }
    })
  }, [])

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
      resetAll,
      seedDemoData,
    }),
    [state, hydrated, logAction, setEntryDetails, deleteEntry, updateSettings, resetAll, seedDemoData],
  )

  return <GardenContext.Provider value={value}>{children}</GardenContext.Provider>
}

export function useGarden(): GardenContextValue {
  const ctx = useContext(GardenContext)
  if (!ctx) throw new Error('useGarden doit être utilisé dans <GardenProvider>')
  return ctx
}
