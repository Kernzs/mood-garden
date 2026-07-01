/** Overlay éphémère : « +N ☀️ » qui monte + petites étincelles de soleil. */
export function SunlightBurst({ amount }: { amount: number }) {
  const bits = [
    { left: '38%', delay: '0.02s' },
    { left: '52%', delay: '0.12s' },
    { left: '46%', delay: '0.22s' },
    { left: '60%', delay: '0.32s' },
    { left: '42%', delay: '0.42s' },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <div
        className="anim-fade absolute left-1/2 top-[42%] -translate-x-1/2"
        style={{ animation: 'rise-fade 1.4s ease-out forwards' }}
      >
        <span className="rounded-full bg-sun px-3 py-1 text-sm font-extrabold text-sun-ink shadow-[var(--shadow-soft)]">
          +{amount} ☀️
        </span>
      </div>
      {bits.map((b, i) => (
        <span
          key={i}
          className="absolute top-[48%] text-lg"
          style={{
            left: b.left,
            animation: `rise-fade 1.3s ease-out ${b.delay} forwards`,
          }}
        >
          ✨
        </span>
      ))}
    </div>
  )
}
