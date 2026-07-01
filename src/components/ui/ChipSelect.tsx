import { cn } from '@/lib/cn'

export interface ChipOption<T extends string> {
  value: T
  label: string
  emoji?: string
}

interface ChipSelectProps<T extends string> {
  options: ChipOption<T>[]
  value?: T
  onChange: (value: T | undefined) => void
  /** allow tapping the selected chip again to clear it */
  clearable?: boolean
}

export function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  clearable = true,
}: ChipSelectProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            aria-pressed={active}
            onClick={() => onChange(active && clearable ? undefined : opt.value)}
            className={cn(
              'tap inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold',
              active
                ? 'border-transparent bg-primary text-white shadow-[var(--shadow-soft)]'
                : 'border-border bg-surface2 text-ink hover:brightness-[0.99]',
            )}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
