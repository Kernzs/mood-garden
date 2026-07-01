interface EncouragementBannerProps {
  title: string
  message: string
  emoji?: string
}

export function EncouragementBanner({ title, message, emoji = '🌼' }: EncouragementBannerProps) {
  return (
    <div className="flex items-center gap-3 rounded-[1.5rem] bg-gradient-to-br from-primary-soft to-sun-soft px-4 py-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-[0.95rem] font-extrabold text-ink">{title}</p>
        <p className="text-xs text-ink-soft">{message}</p>
      </div>
    </div>
  )
}
