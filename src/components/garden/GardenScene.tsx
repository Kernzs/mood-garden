import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import { MAX_STAGE } from '@/lib/garden'

interface GardenSceneProps {
  stage: number
  className?: string
}

const stageSrc = (s: number) => `${import.meta.env.BASE_URL}garden/stage-${s}.png`

const preloaded = new Set<number>()
function preloadStage(s: number) {
  if (s < 0 || s > MAX_STAGE || preloaded.has(s)) return
  preloaded.add(s)
  const img = new Image()
  img.src = stageSrc(s)
}

// ---- Accents animés (dessinés PAR-DESSUS l'illustration) ----

function Butterfly({ x, y, delay, color }: { x: number; y: number; delay: string; color: string }) {
  return (
    <g className="anim-float" style={{ animationDelay: delay }} transform={`translate(${x} ${y})`}>
      <ellipse cx={-5} cy={-3} rx={5.5} ry={7} fill={color} transform="rotate(-22)" />
      <ellipse cx={5} cy={-3} rx={5.5} ry={7} fill={color} transform="rotate(22)" />
      <ellipse cx={-4.5} cy={4} rx={4.5} ry={5.5} fill={color} opacity={0.85} transform="rotate(22)" />
      <ellipse cx={4.5} cy={4} rx={4.5} ry={5.5} fill={color} opacity={0.85} transform="rotate(-22)" />
      <line x1={0} y1={-6} x2={0} y2={6} stroke="var(--c-ink)" strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
    </g>
  )
}

function Sparkle({ x, y, delay = '0s', size = 6 }: { x: number; y: number; delay?: string; size?: number }) {
  return (
    <path
      className="anim-twinkle"
      style={{ animationDelay: delay }}
      transform={`translate(${x} ${y})`}
      d={`M0 ${-size} C 0.6 -1.5 1.5 -0.6 ${size} 0 C 1.5 0.6 0.6 1.5 0 ${size} C -0.6 1.5 -1.5 0.6 ${-size} 0 C -1.5 -0.6 -0.6 -1.5 0 ${-size} Z`}
      fill="var(--c-sun)"
    />
  )
}

function Firefly({ x, y, delay }: { x: number; y: number; delay: string }) {
  return (
    <g className="anim-twinkle" style={{ animationDelay: delay }} transform={`translate(${x} ${y})`}>
      <circle r={5} fill="var(--c-sun)" opacity={0.3} />
      <circle r={2} fill="var(--c-sun)" />
    </g>
  )
}

/** Ciel + décor animés, thémables (derrière l'illustration). */
function SceneBackdrop({ stage }: { stage: number }) {
  return (
    <svg
      viewBox="0 0 320 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id="mg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-1)" />
          <stop offset="100%" stopColor="var(--sky-2)" />
        </linearGradient>
        <linearGradient id="mg-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ground-1)" />
          <stop offset="100%" stopColor="var(--ground-2)" />
        </linearGradient>
        <radialGradient id="mg-magic" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--c-sun)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--c-sun)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="320" height="300" fill="url(#mg-sky)" />

      {/* Soleil / lune douce */}
      <g className="anim-glow" style={{ transformOrigin: '250px 60px', transformBox: 'view-box' }}>
        <circle cx="250" cy="60" r="34" fill="var(--c-sun)" opacity="0.28" />
        <circle cx="250" cy="60" r="22" fill="var(--c-sun)" />
      </g>

      {/* Étoiles (nuit) */}
      <g className="only-night">
        <Sparkle x={60} y={48} size={4} delay="0s" />
        <Sparkle x={104} y={78} size={3} delay="0.6s" />
        <Sparkle x={40} y={104} size={3} delay="1.2s" />
        <Sparkle x={196} y={44} size={3} delay="0.9s" />
      </g>

      {/* Nuages (jour) */}
      <g className="only-day anim-drift" opacity="0.85">
        <g fill="var(--c-surface)" opacity="0.8">
          <ellipse cx="66" cy="66" rx="26" ry="15" />
          <ellipse cx="88" cy="62" rx="20" ry="14" />
          <ellipse cx="48" cy="62" rx="16" ry="11" />
        </g>
      </g>

      {/* Halo magique (étape 7) — derrière la plante */}
      {stage >= 7 && <circle className="anim-glow" cx="160" cy="170" r="120" fill="url(#mg-magic)" />}

      {/* Sol */}
      <path d="M0 246 Q 160 214 320 246 L 320 300 L 0 300 Z" fill="url(#mg-ground)" />

      {/* Touffes d'herbe sur les côtés (dès l'étape 3) */}
      {stage >= 3 && (
        <g stroke="var(--c-primary)" strokeWidth="3" strokeLinecap="round" fill="none">
          <g className="anim-sway" style={{ transformOrigin: '58px 262px', transformBox: 'view-box' }}>
            <path d="M54 262 q -2 -12 -5 -16" />
            <path d="M58 262 q 0 -14 0 -18" />
            <path d="M62 262 q 2 -12 5 -16" />
          </g>
          <g
            className="anim-sway"
            style={{ transformOrigin: '266px 264px', transformBox: 'view-box', animationDelay: '1.1s' }}
          >
            <path d="M262 264 q -2 -12 -5 -16" />
            <path d="M266 264 q 0 -14 0 -18" />
            <path d="M270 264 q 2 -12 5 -16" />
          </g>
        </g>
      )}

      {/* Ombre de contact sous le pot */}
      <ellipse cx="160" cy="270" rx="82" ry="12" fill="#3a2a20" opacity="0.14" />
    </svg>
  )
}

/** Papillons + lucioles + étincelles (par-dessus l'illustration). */
function SceneAccents({ stage }: { stage: number }) {
  return (
    <svg
      viewBox="0 0 320 300"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    >
      {stage >= 6 && (
        <>
          <Butterfly x={64} y={150} delay="0s" color="var(--c-lavender)" />
          <Butterfly x={262} y={118} delay="1.4s" color="var(--c-pink)" />
        </>
      )}
      {stage >= 7 && (
        <>
          <Firefly x={70} y={196} delay="0s" />
          <Firefly x={252} y={190} delay="0.7s" />
          <Firefly x={200} y={92} delay="1.1s" />
          <Sparkle x={110} y={96} delay="0.2s" size={5} />
          <Sparkle x={224} y={150} delay="0.9s" size={4} />
          <Sparkle x={150} y={70} delay="1.5s" size={4} />
        </>
      )}
    </svg>
  )
}

/**
 * ⛳ SWAP SEAM
 * L'illustration du jardin vient de public/garden/stage-<n>.png (normalisées via
 * scripts/process-garden.mjs). Le ciel, le sol et les accents (papillons, lucioles,
 * étincelles, halo magique) restent en SVG animé et thémable, dessinés autour.
 */
export function GardenScene({ stage, className }: GardenSceneProps) {
  const s = Math.max(0, Math.min(stage, MAX_STAGE))

  // Précharge l'étape suivante (évite le flash lors de la célébration de montée)
  // puis, tranquillement, toutes les autres.
  useEffect(() => {
    preloadStage(s + 1)
    const preloadAll = () => {
      for (let i = 0; i <= MAX_STAGE; i++) preloadStage(i)
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(preloadAll)
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(preloadAll, 3000)
    return () => window.clearTimeout(id)
  }, [s])

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      role="img"
      aria-label={`Jardin — étape ${s} sur ${MAX_STAGE}`}
    >
      <SceneBackdrop stage={s} />
      <img
        src={stageSrc(s)}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-contain object-bottom"
        style={{ padding: '4% 8% 6%', filter: 'drop-shadow(0 6px 6px rgba(60,40,30,0.12))' }}
      />
      <SceneAccents stage={s} />
    </div>
  )
}
