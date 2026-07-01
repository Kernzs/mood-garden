import type { Entry, Progress, Settings } from '@/types'
import { countByAction, currentStreak, moneySaved, type Totals } from '@/lib/stats'

export interface MilestoneStats {
  totals: Totals
  streak: number
  money: number
  stage: number
  hasSmokedEntry: boolean
}

export interface Milestone {
  id: string
  emoji: string
  name: string
  blurb: string
  achieved: (s: MilestoneStats) => boolean
}

/**
 * Jalons doux — toujours des célébrations, jamais des exigences.
 * « Honnêteté » valorise le fait d'oser noter un moment fumé : l'honnêteté
 * envers soi-même est une force, pas un échec.
 */
export const MILESTONES: Milestone[] = [
  {
    id: 'premiere-graine',
    emoji: '🌱',
    name: 'Première graine',
    blurb: 'Ton tout premier moment noté.',
    achieved: (s) => s.totals.positive >= 1,
  },
  {
    id: 'honnetete',
    emoji: '💛',
    name: 'Honnêteté',
    blurb: 'Noter un moment fumé, ça demande du courage.',
    achieved: (s) => s.hasSmokedEntry,
  },
  {
    id: 'serie-3',
    emoji: '🌤️',
    name: '3 jours de suite',
    blurb: 'Une jolie petite série.',
    achieved: (s) => s.streak >= 3,
  },
  {
    id: 'serie-7',
    emoji: '🌈',
    name: 'Une semaine',
    blurb: '7 jours avec au moins un choix pour toi.',
    achieved: (s) => s.streak >= 7,
  },
  {
    id: 'serie-30',
    emoji: '🏡',
    name: 'Un mois',
    blurb: '30 jours de douceur — impressionnant.',
    achieved: (s) => s.streak >= 30,
  },
  {
    id: 'evites-10',
    emoji: '🌿',
    name: '10 évités',
    blurb: 'Dix vagues traversées.',
    achieved: (s) => s.totals.jointsAvoided >= 10,
  },
  {
    id: 'evites-25',
    emoji: '🍀',
    name: '25 évités',
    blurb: 'Un quart de centaine, mine de rien.',
    achieved: (s) => s.totals.jointsAvoided >= 25,
  },
  {
    id: 'evites-50',
    emoji: '🌳',
    name: '50 évités',
    blurb: 'Cinquante fois où tu as choisi ton jardin.',
    achieved: (s) => s.totals.jointsAvoided >= 50,
  },
  {
    id: 'evites-100',
    emoji: '🏞️',
    name: '100 évités',
    blurb: 'Cent moments. Tu peux être fier·e.',
    achieved: (s) => s.totals.jointsAvoided >= 100,
  },
  {
    id: 'economies-25',
    emoji: '🪙',
    name: '25 économisés',
    blurb: 'De quoi se faire un petit plaisir.',
    achieved: (s) => s.money >= 25,
  },
  {
    id: 'economies-100',
    emoji: '💰',
    name: '100 économisés',
    blurb: 'Ton portefeuille te dit merci.',
    achieved: (s) => s.money >= 100,
  },
  {
    id: 'floraison',
    emoji: '🌸',
    name: 'Floraison',
    blurb: 'Ton jardin a fleuri (étape 5).',
    achieved: (s) => s.stage >= 5,
  },
  {
    id: 'jardin-magique',
    emoji: '✨',
    name: 'Jardin magique',
    blurb: 'La dernière étape — il scintille.',
    achieved: (s) => s.stage >= 7,
  },
]

export function computeMilestoneStats(
  entries: Entry[],
  progress: Progress,
  settings: Settings,
): MilestoneStats {
  const totals = countByAction(entries)
  return {
    totals,
    streak: currentStreak(entries),
    money: moneySaved(entries, settings.costPerJoint),
    stage: progress.gardenStage,
    hasSmokedEntry: totals.smoked >= 1,
  }
}

export function achievedMilestones(stats: MilestoneStats): Milestone[] {
  return MILESTONES.filter((m) => m.achieved(stats))
}
