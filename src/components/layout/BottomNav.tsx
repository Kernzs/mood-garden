import { cn } from '@/lib/cn'

export type TabKey = 'home' | 'journal' | 'stats' | 'settings'

interface NavItem {
  key: TabKey
  label: string
  icon: string
}

const ITEMS: NavItem[] = [
  { key: 'home', label: 'Accueil', icon: '🌻' },
  { key: 'journal', label: 'Journal', icon: '📖' },
  { key: 'stats', label: 'Progrès', icon: '📈' },
  { key: 'settings', label: 'Réglages', icon: '⚙️' },
]

interface BottomNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.6rem)]">
      <div className="pointer-events-auto flex w-full max-w-md items-stretch justify-between gap-1 rounded-[1.7rem] border border-border bg-surface/90 p-1.5 shadow-[var(--shadow-lift)] backdrop-blur-lg">
        {ITEMS.map((item) => {
          const isActive = item.key === active
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={cn(
                'tap relative flex flex-1 flex-col items-center gap-0.5 rounded-[1.3rem] py-2 text-[0.68rem] font-bold transition-colors',
                isActive ? 'bg-primary-soft text-primary-ink' : 'text-ink-soft',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={cn('text-xl transition-transform', isActive && '-translate-y-0.5')}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
