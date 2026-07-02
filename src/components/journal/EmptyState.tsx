import type { ReactNode } from 'react'
import { GardenSpirit } from '@/components/garden/GardenSpirit'

interface EmptyStateProps {
  title: string
  message: string
  children?: ReactNode
}

export function EmptyState({ title, message, children }: EmptyStateProps) {
  return (
    <div className="card-soft flex flex-col items-center gap-2 px-6 py-10 text-center">
      {/* L'esprit du jardin t'accueille */}
      <GardenSpirit size={56} className="mb-1" />
      <h2 className="text-lg text-ink">{title}</h2>
      <p className="max-w-xs text-sm text-ink-soft">{message}</p>
      {children}
    </div>
  )
}
