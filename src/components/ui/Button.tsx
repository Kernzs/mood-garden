import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'sun' | 'soft' | 'ghost' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-[var(--shadow-soft)] hover:brightness-[1.03] active:brightness-95',
  sun: 'bg-sun text-sun-ink shadow-[var(--shadow-soft)] hover:brightness-[1.03]',
  soft: 'bg-primary-soft text-primary-ink hover:brightness-[0.99]',
  neutral: 'bg-neutral text-neutral-ink hover:brightness-[0.99]',
  ghost: 'bg-transparent text-ink-soft hover:bg-surface2',
}

const sizeClass: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-12 px-5 text-[0.95rem]',
  lg: 'h-14 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'tap inline-flex items-center justify-center gap-2 rounded-full font-bold',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
