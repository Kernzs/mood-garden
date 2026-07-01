import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: ReactNode
  children: ReactNode
}

const DISMISS_THRESHOLD = 120 // px de glissement vers le bas pour fermer

export function Sheet({ open, onClose, title, subtitle, children }: SheetProps) {
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ startY: number; moved: number } | null>(null)

  // Montage + démontage (avec anim de sortie)
  useEffect(() => {
    if (open) {
      setMounted(true)
    } else if (mounted) {
      setShown(false)
      const t = window.setTimeout(() => setMounted(false), 280)
      return () => window.clearTimeout(t)
    }
  }, [open, mounted])

  // Déclenche l'anim d'entrée après le montage.
  // rAF = transition fluide (onglet visible) ; setTimeout = filet de sécurité
  // (rAF est mis en pause si l'onglet est en arrière-plan).
  useEffect(() => {
    if (!mounted) return
    setDragY(0)
    const raf = requestAnimationFrame(() => setShown(true))
    const timer = window.setTimeout(() => setShown(true), 60)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [mounted])

  // Verrou du scroll + Échap
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

  // Drag piloté par des écouteurs sur `window` (fiable : le mouvement et le
  // relâchement sont suivis même si le doigt sort de la poignée).
  const onPointerDown = (e: ReactPointerEvent) => {
    const startY = e.clientY
    drag.current = { startY, moved: 0 }
    setDragY(0)
    setDragging(true)

    const move = (ev: PointerEvent) => {
      if (!drag.current) return
      const dy = Math.max(0, ev.clientY - drag.current.startY)
      drag.current.moved = dy
      setDragY(dy)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      const d = drag.current
      drag.current = null
      setDragging(false)
      // Fermeture si on a assez glissé, sinon la carte revient à sa place.
      if (d && d.moved > DISMISS_THRESHOLD) {
        setShown(false)
        onClose()
      }
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  // Le décalage n'est appliqué QUE pendant le drag → le retour à 0 au relâchement
  // ne dépend pas d'un reset d'état (robuste).
  const panelStyle = {
    transform: shown ? `translateY(${dragging ? dragY : 0}px)` : 'translateY(100%)',
    transition: dragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1)',
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      <button
        aria-label="Fermer"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          shown ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={panelStyle}
        className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col rounded-t-[2rem] border border-border bg-surface shadow-[var(--shadow-lift)]"
      >
        {/* Zone de préhension : poignée + titre (glisser vers le bas pour fermer) */}
        <div
          className="shrink-0 cursor-grab touch-none select-none px-5 pt-3 active:cursor-grabbing"
          onPointerDown={onPointerDown}
        >
          <div className="mx-auto h-1.5 w-12 rounded-full bg-ink-soft/30" />
          {title && <h2 className="mt-3 text-center text-xl text-ink">{title}</h2>}
          {subtitle && <p className="mt-1 text-center text-sm text-ink-soft">{subtitle}</p>}
        </div>

        {/* Contenu défilable — les boutons du bas restent toujours atteignables */}
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
