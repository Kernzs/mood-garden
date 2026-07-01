import type { ReminderFrequency } from '@/types'

// Rappels « best-effort » : sans serveur push, on s'appuie sur l'API Periodic
// Background Sync (Chrome/Edge Android avec l'app installée). Ailleurs, on est
// honnête avec l'utilisateur plutôt que de faire semblant.

const TAG = 'gentle-reminder'

export type ReminderSetupResult = 'ok' | 'denied' | 'unsupported'

interface PeriodicSyncManager {
  register: (tag: string, options?: { minInterval: number }) => Promise<void>
  unregister: (tag: string) => Promise<void>
}

function periodicSyncOf(reg: ServiceWorkerRegistration | undefined): PeriodicSyncManager | null {
  if (!reg) return null
  const ps = (reg as unknown as { periodicSync?: PeriodicSyncManager }).periodicSync
  return ps ?? null
}

/** L'appareil peut-il, en théorie, faire des rappels en arrière-plan ? */
export function periodicSyncSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'ServiceWorkerRegistration' in window &&
    'periodicSync' in ServiceWorkerRegistration.prototype
  )
}

export async function setupReminders(frequency: ReminderFrequency): Promise<ReminderSetupResult> {
  if (frequency === 'off') {
    await cancelReminders()
    return 'ok'
  }
  if (typeof Notification === 'undefined' || !('serviceWorker' in navigator)) {
    return 'unsupported'
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return 'denied'

  const reg = await navigator.serviceWorker.getRegistration()
  const ps = periodicSyncOf(reg ?? undefined)
  if (!ps) return 'unsupported'

  try {
    await ps.register(TAG, {
      // Le navigateur décide du moment exact ; on donne juste une cadence minimale.
      minInterval: frequency === 'daily' ? 20 * 3_600_000 : 6 * 86_400_000,
    })
    return 'ok'
  } catch {
    return 'unsupported'
  }
}

export async function cancelReminders(): Promise<void> {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    await periodicSyncOf(reg ?? undefined)?.unregister(TAG)
  } catch {
    // rien à annuler
  }
}
