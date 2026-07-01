interface NoteFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function NoteField({ value, onChange, placeholder }: NoteFieldProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full resize-none rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-4 focus:ring-primary/20"
    />
  )
}
