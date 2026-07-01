import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ScreenProps {
  children: ReactNode
  className?: string
}

/** Conteneur scrollable, mobile-first, avec de l'espace pour la bottom-nav. */
export function Screen({ children, className }: ScreenProps) {
  return (
    <div className="mx-auto min-h-full w-full max-w-md px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-28">
      <div className={cn('anim-fade space-y-4', className)}>{children}</div>
    </div>
  )
}

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  emoji?: string
}

export function ScreenHeader({ title, subtitle, emoji }: ScreenHeaderProps) {
  return (
    <header className="px-1 pt-1">
      <h1 className="flex items-center gap-2 text-2xl text-ink">
        {emoji && <span>{emoji}</span>}
        {title}
      </h1>
      {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
    </header>
  )
}
