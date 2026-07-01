import { useMemo } from 'react'
import { useGarden } from '@/context/GardenContext'
import { Screen, ScreenHeader } from '@/components/layout/Screen'
import { EmptyState } from '@/components/journal/EmptyState'
import { JournalEntryRow } from '@/components/journal/JournalEntryRow'
import { dayKey, formatDayLabel } from '@/lib/date'
import { copy } from '@/lib/copy'
import type { Entry } from '@/types'

interface DayGroup {
  key: string
  label: string
  ts: number
  entries: Entry[]
}

export function JournalScreen() {
  const { entries, deleteEntry } = useGarden()

  const groups = useMemo<DayGroup[]>(() => {
    const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp)
    const map = new Map<string, DayGroup>()
    for (const e of sorted) {
      const key = dayKey(e.timestamp)
      let g = map.get(key)
      if (!g) {
        g = { key, label: formatDayLabel(e.timestamp), ts: e.timestamp, entries: [] }
        map.set(key, g)
      }
      g.entries.push(e)
    }
    return Array.from(map.values())
  }, [entries])

  return (
    <Screen>
      <ScreenHeader emoji="📖" title="Ton journal" subtitle="Chaque moment que tu notes compte." />

      {groups.length === 0 ? (
        <EmptyState title="Encore vierge 🌱" message={copy.emptyJournal} />
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <section key={g.key}>
              <h2 className="mb-2 px-1 text-sm font-extrabold text-ink-soft">{g.label}</h2>
              <div className="space-y-2">
                {g.entries.map((e) => (
                  <JournalEntryRow key={e.id} entry={e} onDelete={deleteEntry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </Screen>
  )
}
