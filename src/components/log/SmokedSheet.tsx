import { useEffect, useState } from 'react'
import type { Trigger } from '@/types'
import { Sheet } from '@/components/ui/Sheet'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { NoteField } from '@/components/ui/NoteField'
import { Button } from '@/components/ui/Button'
import { copy, pickFrom, smokedMessages } from '@/lib/copy'
import { triggerOptions } from '@/lib/options'

export interface SmokedDetails {
  trigger?: Trigger
  note?: string
}

interface SmokedSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: (details: SmokedDetails) => void
}

export function SmokedSheet({ open, onClose, onConfirm }: SmokedSheetProps) {
  const [trigger, setTrigger] = useState<Trigger | undefined>()
  const [note, setNote] = useState('')
  const [seed] = useState(() => Math.floor(Math.random() * 1000))

  useEffect(() => {
    if (open) {
      setTrigger(undefined)
      setNote('')
    }
  }, [open])

  const confirm = () => {
    onConfirm({ trigger, note: note.trim() || undefined })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="C'est noté 💛" subtitle={pickFrom(smokedMessages, seed)}>
      <div className="space-y-5">
        <div className="rounded-2xl bg-primary-soft px-4 py-3 text-center text-sm font-semibold text-primary-ink">
          Ton jardin ne recule pas. Merci d'être honnête avec toi.
        </div>

        <div>
          <p className="mb-2.5 text-sm font-bold text-ink">{copy.triggerQuestion}</p>
          <ChipSelect options={triggerOptions} value={trigger} onChange={setTrigger} />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-ink">{copy.noteHint}</p>
          <NoteField value={note} onChange={setNote} placeholder="Sans jugement — juste pour toi." />
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button variant="neutral" onClick={confirm} className="flex-1">
            Enregistrer
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
