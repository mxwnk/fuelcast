import { useState } from 'react'
import type { Ratio } from '../lib/fueling'
import { RATIO_PRESETS } from '../lib/fueling'

interface RatioControlProps {
  value: Ratio
  onChange: (ratio: Ratio) => void
}

const isPreset = (ratio: Ratio) =>
  RATIO_PRESETS.some(
    (p) => p.ratio.glucose === ratio.glucose && p.ratio.fructose === ratio.fructose,
  )

export function RatioControl({ value, onChange }: RatioControlProps) {
  const [custom, setCustom] = useState(() => !isPreset(value))
  const customActive = custom || !isPreset(value)

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {RATIO_PRESETS.map(({ label, ratio }) => {
          const active =
            !customActive &&
            ratio.glucose === value.glucose &&
            ratio.fructose === value.fructose
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                setCustom(false)
                onChange(ratio)
              }}
              className={`data rounded-lg border px-2 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
                active
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line bg-raised text-muted hover:border-accent hover:text-ink'
              }`}
            >
              {label}
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setCustom(true)}
          className={`head rounded-lg border px-2 py-2.5 text-[11px] transition-all duration-150 active:scale-95 ${
            customActive
              ? 'border-accent bg-accent text-accent-ink'
              : 'border-line bg-raised text-muted hover:border-accent hover:text-ink'
          }`}
        >
          Custom
        </button>
      </div>

      <div
        className={`grid transition-all duration-300 ease-out ${
          customActive ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-raised px-3 py-2">
            <span className="text-xs text-muted">Glucose</span>
            <input
              type="number"
              className="fc-num data w-14 rounded border border-line bg-surface px-2 py-1 text-right text-sm font-semibold outline-none focus:border-accent"
              min={0.1}
              max={10}
              step={0.1}
              value={value.glucose}
              aria-label="Glucose ratio part"
              onChange={(e) => {
                const g = Number(e.target.value)
                if (g > 0) onChange({ ...value, glucose: g })
              }}
            />
            <span className="data text-lg text-muted">:</span>
            <input
              type="number"
              className="fc-num data w-14 rounded border border-line bg-surface px-2 py-1 text-right text-sm font-semibold outline-none focus:border-accent"
              min={0}
              max={10}
              step={0.1}
              value={value.fructose}
              aria-label="Fructose ratio part"
              onChange={(e) => {
                const f = Number(e.target.value)
                if (f >= 0) onChange({ ...value, fructose: f })
              }}
            />
            <span className="text-xs text-muted">Fructose</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
        Glucose and fructose use different gut transporters — combining them
        raises how many carbs you can absorb per hour.
      </p>
    </div>
  )
}
