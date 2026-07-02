import {
  DURATION_MAX,
  DURATION_MIN,
  DURATION_STEP,
  formatDuration,
} from '../lib/fueling'
import { Slider } from './Slider'

interface DurationControlProps {
  value: number
  onChange: (min: number) => void
}

export function DurationControl({ value, onChange }: DurationControlProps) {
  const h = Math.floor(value / 60)
  const m = value % 60

  const setClamped = (min: number) =>
    onChange(Math.min(DURATION_MAX, Math.max(DURATION_MIN, min)))

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="data text-4xl font-bold tracking-tight text-ink">
          {formatDuration(value)}
        </p>
        <div className="flex items-center gap-1.5">
          <label className="flex items-baseline gap-1 rounded-lg border border-line bg-raised px-2.5 py-1.5 focus-within:border-accent transition-colors">
            <input
              type="number"
              className="fc-num data w-8 bg-transparent text-right text-base font-semibold outline-none"
              min={0}
              max={12}
              value={h}
              aria-label="Hours"
              onChange={(e) => setClamped(Number(e.target.value) * 60 + m)}
            />
            <span className="data text-xs text-muted">h</span>
          </label>
          <label className="flex items-baseline gap-1 rounded-lg border border-line bg-raised px-2.5 py-1.5 focus-within:border-accent transition-colors">
            <input
              type="number"
              className="fc-num data w-8 bg-transparent text-right text-base font-semibold outline-none"
              min={0}
              max={59}
              step={DURATION_STEP}
              value={m}
              aria-label="Minutes"
              onChange={(e) => setClamped(h * 60 + Number(e.target.value))}
            />
            <span className="data text-xs text-muted">m</span>
          </label>
        </div>
      </div>
      <div className="mt-3">
        <Slider
          min={DURATION_MIN}
          max={DURATION_MAX}
          step={DURATION_STEP}
          value={value}
          onChange={onChange}
          ariaLabel="Race duration in minutes"
        />
        <div className="data mt-1 flex justify-between text-[11px] text-muted">
          <span>30min</span>
          <span>3h</span>
          <span>6h</span>
          <span>9h</span>
          <span>12h</span>
        </div>
      </div>
    </div>
  )
}
