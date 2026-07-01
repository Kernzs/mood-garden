import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

export type SosOutcome = 'avoided' | 'postponed' | 'smoked'

interface BreathingOverlayProps {
  open: boolean
  onClose: () => void
  /** L'utilisateur choisit comment s'est terminée l'envie. */
  onPick: (outcome: SosOutcome) => void
}

type Phase = 'intro' | 'inhale' | 'exhale' | 'done'

const INHALE_MS = 4000
const EXHALE_MS = 6000
const INTRO_MS = 2200
const CYCLES = 6 // ≈ 1 minute

const phaseLabel: Record<Phase, string> = {
  intro: 'Installe-toi…',
  inhale: 'Inspire…',
  exhale: 'Souffle doucement…',
  done: '',
}

export function BreathingOverlay({ open, onClose, onPick }: BreathingOverlayProps) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [cycle, setCycle] = useState(0)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  // Réinitialise à chaque ouverture
  useEffect(() => {
    if (open) {
      setPhase('intro')
      setCycle(0)
    }
  }, [open])

  // Machine à états de la respiration
  useEffect(() => {
    if (!open || phase === 'done') return
    let t: number
    if (phase === 'intro') {
      t = window.setTimeout(() => setPhase('inhale'), INTRO_MS)
    } else if (phase === 'inhale') {
      t = window.setTimeout(() => setPhase('exhale'), INHALE_MS)
    } else {
      t = window.setTimeout(() => {
        if (cycle + 1 >= CYCLES) {
          setPhase('done')
        } else {
          setCycle((c) => c + 1)
          setPhase('inhale')
        }
      }, EXHALE_MS)
    }
    return () => window.clearTimeout(t)
  }, [open, phase, cycle])

  if (!open) return null

  const breathing = phase === 'inhale' || phase === 'exhale'
  const circleScale = phase === 'inhale' ? 1.32 : 1
  const circleDuration = phase === 'inhale' ? INHALE_MS : phase === 'exhale' ? EXHALE_MS : 400

  return createPortal(
    <div className="anim-fade fixed inset-0 z-[80] flex flex-col items-center justify-between bg-bg/95 px-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-[max(env(safe-area-inset-top),2rem)] backdrop-blur-md">
      {/* En-tête */}
      <div className="w-full max-w-md text-center">
        <h2 className="text-xl text-ink">
          {phase === 'done' ? 'Comment tu te sens ?' : 'Respire avec moi'}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          {phase === 'done'
            ? 'Quoi que tu choisisses, merci d’avoir pris ce moment.'
            : 'L’envie est une vague — elle monte, puis elle redescend.'}
        </p>
      </div>

      {/* Cercle de respiration */}
      {phase !== 'done' ? (
        <div className="grid flex-1 place-items-center">
          <div className="relative grid place-items-center">
            {/* Halo */}
            <div
              className="absolute h-56 w-56 rounded-full bg-lavender/40 blur-2xl"
              style={
                reducedMotion
                  ? undefined
                  : {
                      transform: `scale(${circleScale})`,
                      transition: `transform ${circleDuration}ms ease-in-out`,
                    }
              }
            />
            <div
              className="relative grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-sky to-lavender shadow-[var(--shadow-lift)]"
              style={
                reducedMotion
                  ? undefined
                  : {
                      transform: `scale(${circleScale})`,
                      transition: `transform ${circleDuration}ms ease-in-out`,
                    }
              }
            >
              <span className="px-4 text-center text-lg font-extrabold text-ink">
                {phaseLabel[phase]}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Choix de fin — log en 1 tap, zéro jugement */
        <div className="grid w-full max-w-md flex-1 content-center gap-3">
          <Button size="lg" fullWidth onClick={() => onPick('avoided')}>
            🌿 Ça va mieux — j'ai évité
          </Button>
          <Button size="lg" fullWidth variant="soft" onClick={() => onPick('postponed')}>
            ⏳ Je reporte à plus tard
          </Button>
          <Button size="lg" fullWidth variant="neutral" onClick={() => onPick('smoked')}>
            🍃 J'ai fumé — sans jugement
          </Button>
          <Button
            size="lg"
            fullWidth
            variant="ghost"
            onClick={() => {
              setPhase('inhale')
              setCycle(Math.max(0, CYCLES - 3)) // 3 cycles de plus
            }}
          >
            🌬️ Encore un peu de respiration
          </Button>
        </div>
      )}

      {/* Pied : progression + sortie toujours possible */}
      <div className="flex w-full max-w-md flex-col items-center gap-3">
        {breathing && (
          <div className="flex gap-1.5" aria-label={`Cycle ${cycle + 1} sur ${CYCLES}`}>
            {Array.from({ length: CYCLES }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 w-5 rounded-full transition-colors',
                  i <= cycle ? 'bg-primary' : 'bg-ink-soft/20',
                )}
              />
            ))}
          </div>
        )}
        <button
          onClick={phase === 'done' ? onClose : () => setPhase('done')}
          className="tap rounded-full px-4 py-2 text-sm font-bold text-ink-soft hover:text-ink"
        >
          {phase === 'done' ? 'Fermer sans noter' : 'Passer'}
        </button>
      </div>
    </div>,
    document.body,
  )
}
