import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
}

export function Sheet({ open, onClose, title, subtitle, children }: SheetProps) {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
    } else if (mounted) {
      setShown(false)
      const t = window.setTimeout(() => setMounted(false), 260)
      return () => window.clearTimeout(t)
    }
  }, [open, mounted])

  useEffect(() => {
    if (!mounted) return
    const r = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(r)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Fermer"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/35 transition-opacity duration-300',
          shown ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-10 max-h-[88vh] w-full max-w-md overflow-y-auto no-scrollbar',
          'rounded-t-[2rem] border border-border bg-surface px-5 pb-6 pt-3 shadow-[var(--shadow-lift)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] safe-bottom',
          shown ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink-soft/25" />
        {title && <h2 className="text-center text-xl text-ink">{title}</h2>}
        {subtitle && (
          <p className="mt-1 text-center text-sm text-ink-soft">{subtitle}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  )
}
