import { useState, type ReactNode } from 'react'
import { useGarden } from '@/context/GardenContext'
import { useToast } from '@/hooks/useToast'
import { Screen, ScreenHeader } from '@/components/layout/Screen'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Stepper } from '@/components/ui/Stepper'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Button } from '@/components/ui/Button'
import { copy } from '@/lib/copy'
import type { GoalScope, ReminderFrequency, ThemeName } from '@/types'

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="card-soft p-4">
      <h2 className="text-base text-ink">{title}</h2>
      {hint && <p className="mb-3 mt-0.5 text-xs text-ink-soft">{hint}</p>}
      <div className={hint ? '' : 'mt-3'}>{children}</div>
    </div>
  )
}

const CURRENCIES = ['€', '$', '£', 'CHF'].map((c) => ({ value: c, label: c }))

export function SettingsScreen() {
  const { settings, updateSettings, resetAll, seedDemoData, entries, progress } = useGarden()
  const { toast } = useToast()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleExport = () => {
    const payload = JSON.stringify({ version: 1, entries, settings, progress }, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mood-garden.json'
    a.click()
    URL.revokeObjectURL(url)
    toast('Données exportées 📤')
  }

  return (
    <Screen>
      <ScreenHeader emoji="⚙️" title="Réglages" subtitle="À ton rythme, à ta façon." />

      <Section title="Ton objectif doux" hint="Un cap bienveillant, jamais une limite qui punit.">
        <SegmentedControl<GoalScope>
          options={[
            { value: 'daily', label: 'Par jour' },
            { value: 'weekly', label: 'Par semaine' },
          ]}
          value={settings.goalScope}
          onChange={(goalScope) => updateSettings({ goalScope })}
        />
        <p className="mb-2 mt-4 text-sm font-bold text-ink">Moments à éviter</p>
        <Stepper
          value={settings.goalValue}
          min={1}
          max={50}
          onChange={(goalValue) => updateSettings({ goalValue })}
          format={(v) => `${v} moment${v > 1 ? 's' : ''}`}
        />
      </Section>

      <Section title="Argent économisé" hint="Sert à estimer ce que chaque joint évité te fait garder.">
        <p className="mb-2 text-sm font-bold text-ink">Coût par joint</p>
        <Stepper
          value={settings.costPerJoint}
          step={0.5}
          min={0}
          max={100}
          onChange={(costPerJoint) => updateSettings({ costPerJoint })}
          format={(v) => `${v.toLocaleString('fr-FR')} ${settings.currency}`}
        />
        <p className="mb-2 mt-4 text-sm font-bold text-ink">Devise</p>
        <ChipSelect
          options={CURRENCIES}
          value={settings.currency}
          clearable={false}
          onChange={(currency) => currency && updateSettings({ currency })}
        />
      </Section>

      <Section title="Apparence">
        <SegmentedControl<ThemeName>
          options={[
            { value: 'daylight', label: '☀️ Jour' },
            { value: 'dusk', label: '🌙 Crépuscule' },
          ]}
          value={settings.theme}
          onChange={(theme) => updateSettings({ theme })}
        />
      </Section>

      <Section title="Rappels doux" hint="Visuel pour l'instant — les notifications arriveront plus tard.">
        <SegmentedControl<ReminderFrequency>
          options={[
            { value: 'off', label: 'Aucun' },
            { value: 'daily', label: 'Chaque jour' },
            { value: 'weekly', label: 'Chaque semaine' },
          ]}
          value={settings.reminderFrequency}
          onChange={(reminderFrequency) => updateSettings({ reminderFrequency })}
        />
      </Section>

      <Section title="Tes données" hint={copy.localDataNotice}>
        <div className="flex flex-col gap-2">
          <Button variant="soft" fullWidth onClick={handleExport}>
            📤 Exporter mes données
          </Button>
          {entries.length === 0 && (
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                seedDemoData()
                toast('Exemple chargé 🌼')
              }}
            >
              🌼 Charger un exemple
            </Button>
          )}

          {!confirmReset ? (
            <Button variant="ghost" fullWidth onClick={() => setConfirmReset(true)}>
              🧹 Réinitialiser mon jardin
            </Button>
          ) : (
            <div className="anim-fade rounded-2xl bg-surface2 p-3 text-center">
              <p className="mb-2 text-sm font-semibold text-ink">
                Tout effacer ? Cette action est définitive.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setConfirmReset(false)}>
                  Annuler
                </Button>
                <Button
                  variant="neutral"
                  className="flex-1"
                  onClick={() => {
                    resetAll()
                    setConfirmReset(false)
                    toast('Jardin réinitialisé 🌱')
                  }}
                >
                  Effacer
                </Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <p className="pb-2 pt-1 text-center text-xs text-ink-soft/80">
        Mood Garden · pensé avec douceur · 100% local 💚
      </p>
    </Screen>
  )
}
