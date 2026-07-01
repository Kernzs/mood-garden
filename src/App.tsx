import { useState } from 'react'
import { useGarden } from '@/context/GardenContext'
import { BottomNav, type TabKey } from '@/components/layout/BottomNav'
import { HomeScreen } from '@/screens/HomeScreen'
import { JournalScreen } from '@/screens/JournalScreen'
import { StatsScreen } from '@/screens/StatsScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { Onboarding } from '@/components/onboarding/Onboarding'

export default function App() {
  const { settings, hydrated } = useGarden()
  const [tab, setTab] = useState<TabKey>('home')

  // Évite un flash avant hydratation du localStorage
  if (!hydrated) return <div className="min-h-full" />

  if (!settings.onboardingDone) {
    return <Onboarding />
  }

  return (
    <div className="min-h-full">
      {tab === 'home' && <HomeScreen />}
      {tab === 'journal' && <JournalScreen />}
      {tab === 'stats' && <StatsScreen />}
      {tab === 'settings' && <SettingsScreen />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
