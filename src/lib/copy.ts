// Tous les textes FR centralisés ici — ton doux, bienveillant, jamais culpabilisant.
import type { ActionType, UrgeHandledBy, Trigger } from '@/types'

export const APP_NAME = 'Mood Garden'
export const APP_TAGLINE = 'Ton jardin doux, à ton rythme.'

export const actionLabels: Record<ActionType, string> = {
  avoided: "J'ai évité un joint",
  postponed: "J'ai reporté l'envie",
  didSomethingElse: "J'ai fait autre chose",
  smoked: "J'ai fumé",
}

/** Libellé court pour le journal / résumés. */
export const actionShortLabels: Record<ActionType, string> = {
  avoided: 'Évité',
  postponed: 'Reporté',
  didSomethingElse: 'Autre chose',
  smoked: 'Fumé',
}

export const actionEmojis: Record<ActionType, string> = {
  avoided: '🌿',
  postponed: '⏳',
  didSomethingElse: '✨',
  smoked: '🍃',
}

export const urgeHandledLabels: Record<UrgeHandledBy, string> = {
  waited: "J'ai attendu",
  drank: 'Bu quelque chose',
  walked: 'Marché un peu',
  distracted: "Je me suis distrait·e",
  breathed: 'Respiré / médité',
  cigarette: 'Fumé une cigarette',
  other: 'Autre',
}

export const urgeHandledEmojis: Record<UrgeHandledBy, string> = {
  waited: '🫧',
  drank: '🫖',
  walked: '🚶',
  distracted: '🎧',
  breathed: '🌬️',
  cigarette: '🚬',
  other: '💭',
}

export const triggerLabels: Record<Trigger, string> = {
  stress: 'Stress',
  boredom: 'Ennui',
  social: 'Social',
  habit: 'Habitude',
  afterMeal: 'Après le repas',
  other: 'Autre',
}

export const triggerEmojis: Record<Trigger, string> = {
  stress: '😮‍💨',
  boredom: '🥱',
  social: '👋',
  habit: '🔁',
  afterMeal: '🍽️',
  other: '💭',
}

// ---- Affirmations douces ----

export const positiveAffirmations = [
  'Un petit pas, c’est déjà un pas.',
  'Ton jardin grandit à chaque choix.',
  'Le progrès, pas la perfection.',
  'Tu t’en sors mieux que tu ne crois.',
  'Une jolie victoire, savoure-la.',
  'Bravo, ce moment compte pour toi.',
  'Tout doux — tu avances.',
]

/** Petit mot d’accueil qui tourne sur l’écran d’accueil. */
export const homeGreetings = [
  'Content de te revoir 🌼',
  'Prends soin de toi aujourd’hui.',
  'Ton jardin t’attendait.',
  'Respire. Tu es au bon endroit.',
  'Chaque jour est une nouvelle pousse.',
]

/** Messages doux après « J’ai fumé » — zéro jugement. */
export const smokedMessages = [
  'Merci d’être honnête avec toi 💛',
  'Un instant, pas une rechute.',
  'Ton jardin ne recule pas, promis.',
  'Demain est une nouvelle graine.',
]

export function pickFrom<T>(list: T[], seed: number): T {
  return list[Math.abs(seed) % list.length]
}

// ---- Textes récurrents ----

export const copy = {
  todayTitle: 'Aujourd’hui',
  yesterday: 'Hier',
  streakSingular: 'jour de suite',
  streakPlural: 'jours de suite',
  streakZero: 'Nouvelle série à cultiver',
  sunlight: 'soleil',
  nextStagePrefix: 'Encore',
  nextStageSuffix: 'avant la prochaine étape',
  maxStage: 'Jardin au sommet de sa magie ✨',
  howHandled: 'Comment as-tu géré l’envie ?',
  howHandledHint: 'Optionnel — juste pour toi.',
  triggerQuestion: 'Un déclencheur ?',
  noteHint: 'Une note ? (optionnel)',
  skip: 'Passer',
  save: 'Enregistrer',
  gentleWin: 'Une gentle win 🌱',
  localDataNotice:
    'Tes données restent uniquement sur ton appareil. Rien n’est envoyé, rien n’est partagé.',
  emptyJournal:
    'Ton journal est encore vide 🌱 — chaque choix que tu notes fait pousser ton jardin.',
  emptyStats:
    'Pas encore de données. Note ton premier moment et regarde ton jardin s’animer 🌼',
}
