// Micro-retours haptiques (mobile). Sans effet là où l'API n'existe pas.

function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  } catch {
    // certains navigateurs lèvent si l'utilisateur a désactivé la vibration
  }
}

/** Petit tap de confirmation (log d'une action, arrosage…). */
export function hapticTap(): void {
  vibrate(10)
}

/** Motif de célébration (montée d'étape, jalon atteint…). */
export function hapticSuccess(): void {
  vibrate([15, 40, 20])
}
