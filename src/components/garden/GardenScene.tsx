import { cn } from '@/lib/cn'
import { MAX_STAGE } from '@/lib/garden'

interface GardenSceneProps {
  stage: number
  className?: string
}

// ---- Petites briques réutilisables ----

function Leaf({ x, y, angle, scale = 1 }: { x: number; y: number; angle: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <ellipse rx="15" ry="8" fill="var(--c-primary)" />
      <line x1="-11" y1="0" x2="12" y2="0" stroke="var(--c-primary-ink)" strokeWidth="1.2" opacity="0.4" />
    </g>
  )
}

function Flower({
  x,
  y,
  scale = 1,
  petal = 'var(--c-pink)',
}: {
  x: number
  y: number
  scale?: number
  petal?: string
}) {
  const petals = [0, 72, 144, 216, 288]
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="anim-bloom">
      {petals.map((a) => (
        <ellipse key={a} cx={0} cy={-9} rx={6.5} ry={10} fill={petal} transform={`rotate(${a})`} />
      ))}
      <circle r={6} fill="var(--c-sun)" />
      <circle r={6} fill="none" stroke="var(--c-sun-ink)" strokeWidth={1} opacity={0.35} />
    </g>
  )
}

function Butterfly({
  x,
  y,
  delay,
  color,
}: {
  x: number
  y: number
  delay: string
  color: string
}) {
  return (
    <g className="anim-float" style={{ animationDelay: delay }} transform={`translate(${x} ${y})`}>
      <ellipse cx={-5} cy={-3} rx={5.5} ry={7} fill={color} transform="rotate(-22)" />
      <ellipse cx={5} cy={-3} rx={5.5} ry={7} fill={color} transform="rotate(22)" />
      <ellipse cx={-4.5} cy={4} rx={4.5} ry={5.5} fill={color} opacity={0.85} transform="rotate(22)" />
      <ellipse cx={4.5} cy={4} rx={4.5} ry={5.5} fill={color} opacity={0.85} transform="rotate(-22)" />
      <line x1={0} y1={-6} x2={0} y2={6} stroke="var(--c-ink)" strokeWidth={1.6} strokeLinecap="round" opacity={0.6} />
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

/**
 * ⛳ SWAP SEAM
 * Tout l'art du jardin est dessiné en SVG ci-dessous, piloté par `stage`.
 * Pour brancher des illustrations AI plus tard, il suffira de remplacer le contenu
 * de <svg> par un <image href={`/garden/stage-${stage}.png`} .../> (ou un <img> autour),
 * sans toucher au reste de l'app (barre de progression, célébrations, etc.).
 */
export function GardenScene({ stage, className }: GardenSceneProps) {
  const s = Math.max(0, Math.min(stage, MAX_STAGE))

  const stemH = [0, 26, 46, 66, 82, 92, 100, 106][s] ?? 106
  const potTopY = 206
  const topY = potTopY - stemH

  const showSeed = s === 0
  const showSprout = s === 1
  const leafPairs = s >= 4 ? 3 : s >= 3 ? 2 : s >= 2 ? 1 : 0
  const showBud = s === 4
  const showTopFlower = s >= 5
  const showSideFlowers = s >= 6
  const showButterflies = s >= 6
  const showGrass = s >= 3
  const showMagic = s >= 7

  const leaves: Array<{ x: number; y: number; angle: number; scale: number }> = []
  for (let i = 0; i < leafPairs; i++) {
    const ly = potTopY - stemH * (0.34 + i * 0.26)
    const sc = 0.85 + i * 0.12
    leaves.push({ x: 160 - 13, y: ly, angle: 22, scale: sc })
    leaves.push({ x: 160 + 13, y: ly, angle: -22, scale: sc })
  }

  return (
    <svg
      viewBox="0 0 320 300"
      className={cn('h-full w-full', className)}
      role="img"
      aria-label={`Jardin — étape ${s} sur ${MAX_STAGE}`}
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

      {/* Ciel */}
      <rect x="0" y="0" width="320" height="300" rx="30" fill="url(#mg-sky)" />

      {/* Soleil / lune douce */}
      <g className="anim-glow" style={{ transformOrigin: '250px 62px', transformBox: 'view-box' }}>
        <circle cx="250" cy="62" r="34" fill="var(--c-sun)" opacity="0.28" />
        <circle cx="250" cy="62" r="22" fill="var(--c-sun)" />
      </g>

      {/* Étoiles (nuit) */}
      <g className="only-night">
        <Sparkle x={60} y={50} size={4} delay="0s" />
        <Sparkle x={110} y={80} size={3} delay="0.6s" />
        <Sparkle x={40} y={110} size={3} delay="1.2s" />
        <Sparkle x={200} y={45} size={3} delay="0.9s" />
        <Sparkle x={280} y={120} size={3} delay="1.5s" />
      </g>

      {/* Nuages (jour) */}
      <g className="only-day anim-drift" opacity="0.9">
        <g fill="var(--c-surface)" opacity="0.85">
          <ellipse cx="70" cy="70" rx="26" ry="15" />
          <ellipse cx="92" cy="66" rx="20" ry="14" />
          <ellipse cx="52" cy="66" rx="16" ry="11" />
        </g>
      </g>
      <g className="only-day anim-drift" style={{ animationDelay: '3s' }} opacity="0.7">
        <g fill="var(--c-surface)" opacity="0.75">
          <ellipse cx="150" cy="110" rx="20" ry="12" />
          <ellipse cx="168" cy="106" rx="15" ry="10" />
        </g>
      </g>

      {/* Sol */}
      <path d="M0 236 Q 160 200 320 236 L 320 300 L 0 300 Z" fill="url(#mg-ground)" />
      <ellipse cx="160" cy="250" rx="120" ry="16" fill="var(--ground-1)" opacity="0.5" />

      {/* Halo magique (étape 7) */}
      {showMagic && (
        <circle className="anim-glow" cx="160" cy="150" r="120" fill="url(#mg-magic)" />
      )}

      {/* Pierres décoratives (étape 7) */}
      {showMagic && (
        <g>
          <ellipse cx="96" cy="250" rx="15" ry="8" fill="var(--c-neutral)" />
          <ellipse cx="228" cy="254" rx="18" ry="9" fill="var(--c-neutral)" />
          <ellipse cx="96" cy="247" rx="15" ry="6" fill="var(--c-surface)" opacity="0.35" />
        </g>
      )}

      {/* Touffes d'herbe (dès étape 3) */}
      {showGrass && (
        <g stroke="var(--c-primary)" strokeWidth="3" strokeLinecap="round" fill="none">
          <g className="anim-sway" style={{ transformOrigin: '108px 244px', transformBox: 'view-box' }}>
            <path d="M104 244 q -2 -12 -5 -16" />
            <path d="M108 244 q 0 -14 0 -18" />
            <path d="M112 244 q 2 -12 5 -16" />
          </g>
          <g className="anim-sway" style={{ transformOrigin: '214px 248px', transformBox: 'view-box', animationDelay: '1.2s' }}>
            <path d="M210 248 q -2 -12 -5 -16" />
            <path d="M214 248 q 0 -14 0 -18" />
            <path d="M218 248 q 2 -12 5 -16" />
          </g>
        </g>
      )}

      {/* Pot */}
      <g>
        <path d="M126 206 L 194 206 L 186 254 Q 160 262 134 254 Z" fill="var(--c-peach)" />
        <path d="M126 206 L 194 206 L 190 220 Q 160 228 130 220 Z" fill="var(--c-peach)" />
        <rect x="122" y="198" width="76" height="14" rx="7" fill="var(--c-peach)" />
        <rect x="122" y="198" width="76" height="6" rx="3" fill="var(--c-surface)" opacity="0.28" />
        <ellipse cx="160" cy="206" rx="32" ry="6" fill="#7a4a34" opacity="0.35" />
      </g>

      {/* Graine (étape 0) */}
      {showSeed && (
        <g className="anim-float">
          <ellipse cx="160" cy="202" rx="6" ry="8" fill="#8a5a3a" />
          <ellipse cx="158" cy="200" rx="2" ry="3" fill="var(--c-surface)" opacity="0.5" />
        </g>
      )}

      {/* Plante (tige + feuilles + sommet) — sway groupé */}
      {stemH > 0 && (
        <g className="anim-sway" style={{ transformOrigin: '160px 206px', transformBox: 'view-box' }}>
          <path
            d={`M160 206 Q ${160 - 7} ${206 - stemH / 2} 160 ${topY}`}
            stroke="var(--c-primary)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />

          {showSprout && (
            <g>
              <Leaf x={152} y={topY + 2} angle={40} scale={0.7} />
              <Leaf x={168} y={topY + 2} angle={-40} scale={0.7} />
            </g>
          )}

          {leaves.map((l, i) => (
            <Leaf key={i} x={l.x} y={l.y} angle={l.angle} scale={l.scale} />
          ))}

          {showBud && (
            <g className="anim-bloom">
              <path d={`M160 ${topY} q -8 -6 0 -18 q 8 12 0 18 Z`} fill="var(--c-pink)" />
              <circle cx="160" cy={topY - 16} r="3" fill="var(--c-primary)" />
            </g>
          )}

          {showTopFlower && <Flower x={160} y={topY - 6} scale={1.15} />}

          {showSideFlowers && (
            <>
              <Flower x={139} y={topY + 14} scale={0.8} petal="var(--c-lavender)" />
              <Flower x={182} y={topY + 20} scale={0.85} petal="var(--c-sun)" />
            </>
          )}
        </g>
      )}

      {/* Papillons (dès étape 6) */}
      {showButterflies && (
        <>
          <Butterfly x={108} y={150} delay="0s" color="var(--c-lavender)" />
          <Butterfly x={224} y={128} delay="1.4s" color="var(--c-pink)" />
        </>
      )}

      {/* Lucioles + sparkles (étape 7) */}
      {showMagic && (
        <>
          <Firefly x={92} y={180} delay="0s" />
          <Firefly x={240} y={186} delay="0.7s" />
          <Firefly x={198} y={96} delay="1.1s" />
          <Sparkle x={132} y={92} delay="0.2s" size={5} />
          <Sparkle x={210} y={150} delay="0.9s" size={4} />
        </>
      )}
    </svg>
  )
}
