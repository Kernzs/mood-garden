import type { Trigger, UrgeHandledBy } from '@/types'
import {
  triggerEmojis,
  triggerLabels,
  urgeHandledEmojis,
  urgeHandledLabels,
} from '@/lib/copy'
import type { ChipOption } from '@/components/ui/ChipSelect'

export const urgeOptions: ChipOption<UrgeHandledBy>[] = (
  Object.keys(urgeHandledLabels) as UrgeHandledBy[]
).map((value) => ({
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
