import { useRef, useState, type ChangeEventHandler, type ReactNode } from 'react'
import { useGarden } from '@/context/GardenContext'
import { useToast } from '@/hooks/useToast'
import { Screen, ScreenHeader } from '@/components/layout/Screen'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Stepper } from '@/components/ui/Stepper'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Button } from '@/components/ui/Button'
import { copy } from '@/lib/copy'
import { periodicSyncSupported, setupReminders } from '@/lib/notifications'
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
  const { settings, updateSettings, resetAll, seedDemoData, entries, progress, importState } =
    useGarden()
  const { toast } = useToast()
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [pendingImport, setPendingImport] = useState<unknown | null>(null)
  const [rewardLabel, setRewardLabel] = useState('')
  const [rewardCost, setRewardCost] = useState(30)

  const defineReward = () => {
    const label = rewardLabel.trim()
    if (!label) return
    updateSettings({ rewardGoal: { label, cost: rewardCost, startedAt: Date.now() } })
    setRewardLabel('')
    toast('Récompense définie 🎁 — chaque évité te rapproche.')
  }

  const handleFileChosen: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de re-choisir le même fichier plus tard
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.entries)) {
          throw new Error('forme inattendue')
        }
        setPendingImport(parsed) // confirmation avant remplacement
      } catch {
        toast('Ce fichier ne ressemble pas à une sauvegarde Mood Garden 🫧')
      }
    }
    reader.onerror = () => toast('Impossible de lire ce fichier 🫧')
    reader.readAsText(file)
  }

  const confirmImport = () => {
    try {
      importState(pendingImport)
      setPendingImport(null)
      toast('Ton jardin est de retour 🌱')
    } catch {
      setPendingImport(null)
      toast('Ce fichier ne ressemble pas à une sauvegarde Mood Garden 🫧')
    }
  }

  const handleReminderChange = (reminderFrequency: ReminderFrequency) => {
    updateSettings({ reminderFrequency })
    void setupReminders(reminderFrequency).then((result) => {
      if (reminderFrequency === 'off') return
      if (result === 'ok') toast('Rappels doux activés 🔔')
      else if (result === 'denied') toast('Notifications refusées — tu peux changer ça dans ton navigateur.')
      else toast('Ton appareil ne permet pas les rappels en arrière-plan 🫧')
    })
  }

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

      <Section title="Ma plante 🌱" hint="Un prénom, et on en prend deux fois plus soin.">
        <input
          type="text"
          value={settings.plantName ?? ''}
          onChange={(e) => updateSettings({ plantName: e.target.value.trim() ? e.target.value : null })}
          placeholder="Ex. : Basile, Pousse, Léon…"
          maxLength={20}
          className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
        />
      </Section>

      <Section
        title="D'où je pars 🧭"
        hint="Ta conso avant Mood Garden — la carte « D'où tu pars » de l'écran Progrès s'en sert."
      >
        <Stepper
          value={settings.baselinePerDay ?? 0}
          min={0}
          max={30}
          onChange={(v) => updateSettings({ baselinePerDay: v > 0 ? v : null })}
          format={(v) => (v > 0 ? `~${v} joint${v > 1 ? 's' : ''} / jour` : 'Non renseigné')}
        />
      </Section>

      <Section title="Ton objectif doux" hint="Un cap bienveillant, jamais une limite qui punit.">
        <SegmentedControl<GoalScope>
          options={[
            { value: 'daily', label: 'Par jour' },
            { value: 'weekly', label: '7 derniers jours' },
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

      <Section
        title="Ma récompense 🎁"
        hint="Un vrai plaisir que tes joints évités vont financer. La jauge vit dans l'écran Progrès."
      >
        {settings.rewardGoal ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface2 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-ink">
                {settings.rewardGoal.label}
              </p>
              <p className="text-xs text-ink-soft">
                {settings.rewardGoal.cost.toLocaleString('fr-FR')} {settings.currency}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateSettings({ rewardGoal: null })}
            >
              Retirer
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={rewardLabel}
              onChange={(e) => setRewardLabel(e.target.value)}
              placeholder="Ex. : un resto, un jeu, des baskets…"
              maxLength={40}
              className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
            />
            <Stepper
              value={rewardCost}
              step={5}
              min={5}
              max={1000}
              onChange={setRewardCost}
              format={(v) => `${v.toLocaleString('fr-FR')} ${settings.currency}`}
            />
            <Button fullWidth variant="soft" disabled={!rewardLabel.trim()} onClick={defineReward}>
              🎁 Définir ma récompense
            </Button>
          </div>
        )}
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

      <Section
        title="Rappels doux 🔔"
        hint={
          periodicSyncSupported()
            ? 'Une pensée de ton jardin, de temps en temps. Le moment exact dépend de ton téléphone.'
            : 'Ton navigateur ne permet pas encore les rappels en arrière-plan (iPhone notamment) — on préfère te le dire honnêtement.'
        }
      >
        <SegmentedControl<ReminderFrequency>
          options={[
            { value: 'off', label: 'Aucun' },
            { value: 'daily', label: 'Chaque jour' },
            { value: 'weekly', label: 'Chaque semaine' },
          ]}
          value={settings.reminderFrequency}
          onChange={handleReminderChange}
        />
      </Section>

      <Section title="Tes données" hint={copy.localDataNotice}>
        <div className="flex flex-col gap-2">
          <Button variant="soft" fullWidth onClick={handleExport}>
            📤 Exporter mes données
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChosen}
            className="hidden"
          />
          {pendingImport === null ? (
            <Button variant="soft" fullWidth onClick={() => fileInputRef.current?.click()}>
              📥 Importer des données
            </Button>
          ) : (
            <div className="anim-fade rounded-2xl bg-surface2 p-3 text-center">
              <p className="mb-2 text-sm font-semibold text-ink">
                Remplacer tes données actuelles par cette sauvegarde ?
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setPendingImport(null)}>
                  Annuler
                </Button>
                <Button className="flex-1" onClick={confirmImport}>
                  Restaurer 🌱
                </Button>
              </div>
            </div>
          )}
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
