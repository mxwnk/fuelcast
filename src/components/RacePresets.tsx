import type { PlanInput, RacePreset } from '../lib/fueling'
import { RACE_PRESETS } from '../lib/fueling'

const isActive = (preset: RacePreset, input: PlanInput) => {
  if (preset.legs) {
    return (['swim', 'bike', 'run'] as const).every(
      (key) => input.triLegs[key].durationMin === preset.legs![key],
    )
  }
  return input.durationMin === preset.durationMin
}

interface RacePresetsProps {
  input: PlanInput
  onApply: (preset: RacePreset) => void
}

export function RacePresets({ input, onApply }: RacePresetsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {RACE_PRESETS[input.sport].map((preset) => {
        const active = isActive(preset, input)
        return (
          <button
            key={preset.label}
            type="button"
            onClick={() => onApply(preset)}
            className={`data rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${
              active
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-line bg-raised text-muted hover:border-accent hover:text-ink'
            }`}
          >
            {preset.label}
          </button>
        )
      })}
    </div>
  )
}
