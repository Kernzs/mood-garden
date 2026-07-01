import { useState } from 'react'
import type { Entry } from '@/types'
import {
  actionEmojis,
  actionShortLabels,
  triggerEmojis,
  triggerLabels,
  urgeHandledEmojis,
  urgeHandledLabels,
} from '@/lib/copy'
import { formatTime } from '@/lib/date'
import { isPositive } from '@/lib/stats'
import { cn } from '@/lib/cn'

interface JournalEntryRowProps {
  entry: Entry
  onDelete: (id: string) => void
}

export function JournalEntryRow({ entry, onDelete }: JournalEntryRowProps) {
  const [confirming, setConfirming] = useState(false)
  const positive = isPositive(entry.actionType)

  return (
    <div className="relative flex items-start gap-3 rounded-2xl bg-surface2 px-3 py-3">
      <div
        className={cn(
          'grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg',
          positive ? 'bg-primary-soft' : 'bg-neutral',
        )}
      >
        {actionEmojis[entry.actionType]}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-extrabold text-ink">
            {actionShortLabels[entry.actionType]}
          </span>
          <span className="shrink-0 text-xs font-semibold text-ink-soft">
            {formatTime(entry.timestamp)}
          </span>
        </div>

        {(entry.trigger || entry.urgeHandledBy) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {entry.urgeHandledBy && (
              <span className="rounded-full bg-surface px-2 py-0.5 text-[0.7rem] font-semibold text-ink-soft">
                {urgeHandledEmojis[entry.urgeHandledBy]} {urgeHandledLabels[entry.urgeHandledBy]}
              </span>
            )}
            {entry.trigger && (
              <span className="rounded-full bg-surface px-2 py-0.5 text-[0.7rem] font-semibold text-ink-soft">
                {triggerEmojis[entry.trigger]} {triggerLabels[entry.trigger]}
              </span>
            )}
          </div>
        )}

        {entry.note && <p className="mt-1.5 text-sm text-ink/90">{entry.note}</p>}
      </div>

      {!confirming ? (
        <button
          aria-label="Options"
          onClick={() => setConfirming(true)}
          className="tap -mr-1 shrink-0 rounded-full px-2 py-1 text-ink-soft/60 hover:text-ink-soft"
        >
          ⋯
        </button>
      ) : (
        <div className="anim-fade flex shrink-0 items-center gap-1">
          <button
            onClick={() => setConfirming(false)}
            className="tap rounded-full bg-surface px-2.5 py-1 text-xs font-bold text-ink-soft"
          >
            Annuler
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="tap rounded-full bg-neutral px-2.5 py-1 text-xs font-bold text-neutral-ink"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}
