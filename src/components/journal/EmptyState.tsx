import type { ReactNode } from 'react'

interface EmptyStateProps {
  emoji?: string
  title: string
  message: string
  children?: ReactNode
}

export function EmptyState({ emoji = '🌱', title, message, children }: EmptyStateProps) {
  return (
    <div className="card-soft flex flex-col items-center gap-2 px-6 py-10 text-center">
      <div className="anim-float text-5xl">{emoji}</div>
      <h2 className="text-lg text-ink">{title}</h2>
      <p className="max-w-xs text-sm text-ink-soft">{message}</p>
      {children}
    </div>
  )
}
