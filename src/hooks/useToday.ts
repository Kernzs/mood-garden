import { useEffect, useState } from 'react'
import { dayKey } from '@/lib/date'

/**
 * Renvoie le dayKey du jour et force un re-render quand la date change
 * (tick 60 s + retour d'onglet). Évite les stats/séries périmées si
 * l'app reste ouverte à cheval sur minuit.
 */
export function useToday(): string {
  const [today, setToday] = useState(() => dayKey(Date.now()))

  useEffect(() => {
    const check = () => {
      const now = dayKey(Date.now())
      setToday((prev) => (prev === now ? prev : now))
    }
    const interval = window.setInterval(check, 60_000)
    document.addEventListener('visibilitychange', check)
    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', check)
    }
  }, [])

  return today
}
