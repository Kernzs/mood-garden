// Petits utilitaires de dates — tout en local, format FR.

export function startOfDay(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function dayKey(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b)
}

export function daysBetween(a: number, b: number): number {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86_400_000)
}

const timeFmt = new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' })
const dayFmt = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const shortDayFmt = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' })

export function formatTime(ts: number): string {
  return timeFmt.format(ts)
}

export function formatFullDay(ts: number): string {
  return dayFmt.format(ts)
}

/** "Aujourd'hui" / "Hier" / date longue. */
export function formatDayLabel(ts: number, now = Date.now()): string {
  const diff = daysBetween(ts, now)
  if (diff === 0) return "Aujourd'hui"
  if (diff === 1) return 'Hier'
  return capitalize(dayFmt.format(ts))
}

export function shortWeekday(ts: number): string {
  // "lun.", "mar." → on retire le point et on capitalise la 1re lettre
  return capitalize(shortDayFmt.format(ts).replace('.', ''))
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Retourne les timestamps de début des N derniers jours (du plus ancien au plus récent). */
export function lastNDays(n: number, now = Date.now()): number[] {
  const today = startOfDay(now)
  const out: number[] = []
  for (let i = n - 1; i >= 0; i--) {
    out.push(today - i * 86_400_000)
  }
  return out
}
