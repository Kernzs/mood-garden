import { useEffect, useState } from 'react'
import type { Trigger, UrgeHandledBy } from '@/types'
import { Sheet } from '@/components/ui/Sheet'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { NoteField } from '@/components/ui/NoteField'
import { Button } from '@/components/ui/Button'
import { copy } from '@/lib/copy'
import { urgeOptions, triggerOptions } from '@/lib/options'

export interface UrgeDetails {
  urgeHandledBy?: UrgeHandledBy
  trigger?: Trigger
  note?: string
}

interface UrgeFollowUpSheetProps {
  open: boolean
  onClose: () => void
  onSave: (details: UrgeDetails) => void
}

export function UrgeFollowUpSheet({ open, onClose, onSave }: UrgeFollowUpSheetProps) {
  const [urge, setUrge] = useState<UrgeHandledBy | undefined>()
  const [trigger, setTrigger] = useState<Trigger | undefined>()
  const [note, setNote] = useState('')

  // Réinitialise à chaque ouverture
  useEffect(() => {
    if (open) {
      setUrge(undefined)
      setTrigger(undefined)
      setNote('')
    }
  }, [open])

  const save = () => {
    onSave({
      urgeHandledBy: urge,
      trigger,
      note: note.trim() || undefined,
    })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={copy.gentleWin} subtitle="+ ton jardin a un peu poussé 🌱">
      <div className="space-y-5">
        <div>
          <p className="mb-1 text-sm font-bold text-ink">{copy.howHandled}</p>
          <p className="mb-2.5 text-xs text-ink-soft">{copy.howHandledHint}</p>
          <ChipSelect options={urgeOptions} value={urge} onChange={setUrge} />
        </div>

        <div>
          <p className="mb-2.5 text-sm font-bold text-ink">{copy.triggerQuestion}</p>
          <ChipSelect options={triggerOptions} value={trigger} onChange={setTrigger} />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-ink">{copy.noteHint}</p>
          <NoteField value={note} onChange={setNote} placeholder="Ce qui s'est passé, comment tu te sens…" />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            {copy.skip}
          </Button>
          <Button onClick={save} className="flex-1">
            {copy.save}
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
