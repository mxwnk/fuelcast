import { useEffect, useState } from 'react'

interface SliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  ariaLabel: string
}

export function Slider({ min, max, step, value, onChange, ariaLabel }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      className="fc-slider"
      style={{ '--fill': `${pct}%` } as React.CSSProperties}
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  )
}

interface NumberFieldProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  unit: string
  ariaLabel: string
}

export function NumberField({
  min,
  max,
  step,
  value,
  onChange,
  unit,
  ariaLabel,
}: NumberFieldProps) {
  // Local draft so the field can be emptied while typing. A controlled numeric
  // value would coerce an empty input back to a number and block clearing it.
  const [draft, setDraft] = useState(String(value))

  // Keep the draft in sync when the value changes from outside (e.g. slider).
  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const clamp = (candidate: number) => Math.min(max, Math.max(min, candidate))

  const commit = (raw: string) => {
    const parsed = Number(raw)
    if (raw.trim() === '' || !Number.isFinite(parsed)) {
      const fallback = clamp(0)
      onChange(fallback)
      setDraft(String(fallback))
      return
    }
    const next = clamp(parsed)
    onChange(next)
    setDraft(String(next))
  }

  return (
    <label className="flex items-baseline gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 focus-within:border-accent transition-colors">
      <input
        type="number"
        className="fc-num data w-16 bg-transparent text-right text-lg font-semibold text-ink outline-none"
        min={min}
        max={max}
        step={step}
        value={draft}
        aria-label={ariaLabel}
        onChange={(e) => {
          const raw = e.target.value
          setDraft(raw)
          const parsed = Number(raw)
          // Live-commit only genuine, in-range values so typing stays smooth
          // while still allowing an empty or out-of-range intermediate state.
          if (raw.trim() !== '' && Number.isFinite(parsed)) {
            const clamped = clamp(parsed)
            if (clamped === parsed) onChange(clamped)
          }
        }}
        onBlur={(e) => commit(e.target.value)}
      />
      <span className="data text-xs text-muted">{unit}</span>
    </label>
  )
}
