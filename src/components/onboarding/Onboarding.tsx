import { useState } from 'react'
import { useGarden } from '@/context/GardenContext'
import { GardenScene } from '@/components/garden/GardenScene'
import { Button } from '@/components/ui/Button'
import { Stepper } from '@/components/ui/Stepper'
import { cn } from '@/lib/cn'

const SLIDES = [
  {
    stage: 1,
    title: 'Bienvenue dans Mood Garden 🌱',
    text: 'Un espace doux pour réduire les joints, à ton rythme. Zéro jugement, zéro culpabilité.',
  },
  {
    stage: 4,
    title: 'Ton jardin grandit avec toi',
    text: "À chaque fois que tu choisis de ne pas fumer, il pousse un peu. Et même les jours difficiles, il ne recule jamais.",
  },
]

export function Onboarding() {
  const { settings, updateSettings } = useGarden()
  const [step, setStep] = useState(0)
  const [cost, setCost] = useState(settings.costPerJoint)
  const [goal, setGoal] = useState(settings.goalValue)

  const isSetup = step === SLIDES.length
  const total = SLIDES.length + 1

  const finish = () => {
    updateSettings({ costPerJoint: cost, goalValue: goal, onboardingDone: true })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col px-6 pb-8 pt-[max(env(safe-area-inset-top),2rem)]">
        {/* Illustration */}
        <div className="mt-4 grid flex-1 place-items-center">
          <div className="w-full max-w-[280px]">
            <div className="overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-soft)]">
              <div className="aspect-square">
                <GardenScene stage={isSetup ? 6 : SLIDES[step].stage} />
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div key={step} className="anim-pop">
          {!isSetup ? (
            <div className="text-center">
              <h1 className="text-2xl text-ink">{SLIDES[step].title}</h1>
              <p className="mx-auto mt-2 max-w-xs text-sm text-ink-soft">{SLIDES[step].text}</p>
            </div>
          ) : (
            <div>
              <h1 className="text-center text-2xl text-ink">On personnalise ? ✨</h1>
              <p className="mx-auto mt-2 mb-5 max-w-xs text-center text-sm text-ink-soft">
                Deux petits réglages, modifiables à tout moment.
              </p>

              <div className="space-y-4">
                <div className="card-soft p-4">
                  <p className="mb-2 text-sm font-bold text-ink">Coût d'un joint (estim.)</p>
                  <Stepper
                    value={cost}
                    step={0.5}
                    min={0}
                    max={100}
                    onChange={setCost}
                    format={(v) => `${v.toLocaleString('fr-FR')} €`}
                  />
                </div>
                <div className="card-soft p-4">
                  <p className="mb-2 text-sm font-bold text-ink">Objectif doux · moments évités / jour</p>
                  <Stepper
                    value={goal}
                    min={1}
                    max={30}
                    onChange={setGoal}
                    format={(v) => `${v} moment${v > 1 ? 's' : ''}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Points + navigation */}
        <div className="mt-6">
          <div className="mb-4 flex justify-center gap-2">
            {Array.from({ length: total }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === step ? 'w-6 bg-primary' : 'w-2 bg-ink-soft/25',
                )}
              />
            ))}
          </div>

          {!isSetup ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={finish} className="flex-1">
                Passer
              </Button>
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                Suivant
              </Button>
            </div>
          ) : (
            <Button size="lg" fullWidth onClick={finish}>
              Planter ma première graine 🌱
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
