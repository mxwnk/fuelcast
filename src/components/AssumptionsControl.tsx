import type { PlanConfig } from '../lib/fueling'
import { BOTTLE_SIZES, GEL_SIZES } from '../lib/fueling'
import { useI18n } from '../lib/i18n'
import { NumberField } from './Slider'

interface ChipRowProps {
  label: string
  unit: string
  options: number[]
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function ChipRow({ label, unit, options, value, min, max, step, onChange }: ChipRowProps) {
  return (
    <div>
      <span className="head text-[11px] text-muted">{label}</span>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`data rounded-lg border px-2.5 py-1.5 text-sm font-semibold transition-all duration-150 active:scale-95 ${
              value === option
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-line bg-raised text-muted hover:border-accent hover:text-ink'
            }`}
          >
            {option}
          </button>
        ))}
        <NumberField
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          unit={unit}
          ariaLabel={label}
        />
      </div>
    </div>
  )
}

interface AssumptionsControlProps {
  config: PlanConfig
  onChange: (patch: Partial<PlanConfig>) => void
}

export function AssumptionsControl({ config, onChange }: AssumptionsControlProps) {
  const { t } = useI18n()
  return (
    <div className="space-y-3">
      <ChipRow
        label={t('gear.gel')}
        unit="g"
        options={GEL_SIZES}
        value={config.gelCarbs}
        min={15}
        max={60}
        step={1}
        onChange={(gelCarbs) => onChange({ gelCarbs })}
      />
      <ChipRow
        label={t('gear.bottle')}
        unit="ml"
        options={BOTTLE_SIZES}
        value={config.bottleMl}
        min={300}
        max={1500}
        step={50}
        onChange={(bottleMl) => onChange({ bottleMl })}
      />
      <p className="text-xs leading-relaxed text-muted">{t('gear.explainer')}</p>
    </div>
  )
}
