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
  const [baseline, setBaseline] = useState(settings.baselinePerDay ?? 3)
  const [plantName, setPlantName] = useState('')

  const isSetup = step === SLIDES.length
  const total = SLIDES.length + 1

  const finish = () => {
    updateSettings({
      costPerJoint: cost,
      goalValue: goal,
      baselinePerDay: baseline > 0 ? baseline : null,
      plantName: plantName.trim() || null,
      onboardingDone: true,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto no-scrollbar">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col px-6 pb-8 pt-[max(env(safe-area-inset-top),2rem)]">
        {/* Illustration (compacte sur l'écran de réglages) */}
        <div className={cn('grid place-items-center', isSetup ? 'mt-1' : 'mt-4 flex-1')}>
          <div className={cn('w-full', isSetup ? 'max-w-[150px]' : 'max-w-[280px]')}>
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
                Quelques petits réglages, modifiables à tout moment.
              </p>

              <div className="space-y-3">
                <div className="card-soft p-4">
                  <p className="mb-1 text-sm font-bold text-ink">D'où je pars 🧭</p>
                  <p className="mb-2 text-xs text-ink-soft">
                    Ta conso actuelle, sans jugement — juste pour voir ta progression.
                  </p>
                  <Stepper
                    value={baseline}
                    min={0}
                    max={30}
                    onChange={setBaseline}
                    format={(v) => (v > 0 ? `~${v} joint${v > 1 ? 's' : ''} / jour` : 'Je préfère ne pas dire')}
                  />
                </div>
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
                <div className="card-soft p-4">
                  <p className="mb-1 text-sm font-bold text-ink">Un prénom pour ta plante ? 🌱</p>
                  <p className="mb-2 text-xs text-ink-soft">Optionnel — mais ça aide à en prendre soin.</p>
                  <input
                    type="text"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="Ex. : Basile, Pousse, Léon…"
                    maxLength={20}
                    className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
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
