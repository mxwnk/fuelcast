import { CARB_PRESETS, CARBS_MAX, CARBS_MIN } from '../lib/fueling'
import { NumberField, Slider } from './Slider'

interface CarbControlProps {
  value: number
  onChange: (grams: number) => void
}

export function CarbControl({ value, onChange }: CarbControlProps) {
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <p className="data text-4xl font-bold tracking-tight text-ink">
          {value}
          <span className="ml-1 text-base font-medium text-muted">g/h</span>
        </p>
        <NumberField
          min={CARBS_MIN}
          max={CARBS_MAX}
          step={5}
          value={value}
          onChange={onChange}
          unit="g/h"
          ariaLabel="Carbohydrates per hour"
        />
      </div>
      <div className="mt-3">
        <Slider
          min={CARBS_MIN}
          max={CARBS_MAX}
          step={5}
          value={value}
          onChange={onChange}
          ariaLabel="Carbohydrates per hour"
        />
      </div>
      <div className="mt-2 flex gap-2">
        {CARB_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`data flex-1 rounded-lg border px-2 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
              value === preset
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-line bg-raised text-muted hover:border-accent hover:text-ink'
            }`}
          >
            {preset}g
          </button>
        ))}
      </div>
    </div>
  )
}
