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
  return (
    <label className="flex items-baseline gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 focus-within:border-accent transition-colors">
      <input
        type="number"
        className="fc-num data w-16 bg-transparent text-right text-lg font-semibold text-ink outline-none"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)))
        }}
      />
      <span className="data text-xs text-muted">{unit}</span>
    </label>
  )
}
