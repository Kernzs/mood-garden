import { cn } from '@/lib/cn'

interface StepperProps {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  suffix?: string
  format?: (value: number) => string
}

/** Grand sélecteur numérique tactile avec + / -. */
export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = Infinity,
  suffix,
  format,
}: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100))
  const display = format ? format(value) : `${value}${suffix ? ` ${suffix}` : ''}`

  return (
    <div
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={Number.isFinite(max) ? max : undefined}
      aria-valuetext={display}
      className="flex items-center justify-between gap-3 rounded-full border border-border bg-surface2 p-1.5"
    >
      <StepBtn label="−" onClick={() => onChange(clamp(value - step))} disabled={value <= min} />
      <div className="min-w-0 flex-1 text-center text-lg font-extrabold text-ink tabular-nums">
        {display}
      </div>
      <StepBtn label="+" onClick={() => onChange(clamp(value + step))} disabled={value >= max} />
    </div>
  )
}

function StepBtn({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      aria-label={label === '−' ? 'Diminuer' : 'Augmenter'}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'tap grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface text-2xl font-bold text-primary-ink shadow-[var(--shadow-soft)]',
        'disabled:opacity-40',
      )}
    >
      {label}
    </button>
  )
}
