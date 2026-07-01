import type { Trigger, UrgeHandledBy } from '@/types'
import {
  triggerEmojis,
  triggerLabels,
  urgeHandledEmojis,
  urgeHandledLabels,
} from '@/lib/copy'
import type { ChipOption } from '@/components/ui/ChipSelect'

// On ne propose PAS « cigarette » comme choix (on ne met pas le tabac en avant) —
// « Autre » couvre ce cas. Le libellé reste défini dans copy.ts pour l'affichage
// d'éventuelles anciennes entrées.
const HIDDEN_URGE_OPTIONS: UrgeHandledBy[] = ['cigarette']

export const urgeOptions: ChipOption<UrgeHandledBy>[] = (
  Object.keys(urgeHandledLabels) as UrgeHandledBy[]
)
  .filter((value) => !HIDDEN_URGE_OPTIONS.includes(value))
  .map((value) => ({
    value,
    label: urgeHandledLabels[value],
    emoji: urgeHandledEmojis[value],
  }))

export const triggerOptions: ChipOption<Trigger>[] = (
  Object.keys(triggerLabels) as Trigger[]
).map((value) => ({
  value,
  label: triggerLabels[value],
  emoji: triggerEmojis[value],
}))
