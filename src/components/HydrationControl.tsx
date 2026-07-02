import { CloudSun, Snowflake, Sun } from 'lucide-react'
import type { Temperature } from '../lib/fueling'
import { HYDRATION } from '../lib/fueling'

const TEMP_ICONS: Record<Temperature, React.ReactNode> = {
  cool: <Snowflake className="size-5" />,
  mild: <CloudSun className="size-5" />,
  hot: <Sun className="size-5" />,
}

interface HydrationControlProps {
  value: Temperature
  onChange: (temperature: Temperature) => void
}

export function HydrationControl({ value, onChange }: HydrationControlProps) {
  const active = HYDRATION[value]
  return (
    <div>
      <div role="radiogroup" aria-label="Race conditions" className="grid grid-cols-3 gap-2">
        {(Object.keys(HYDRATION) as Temperature[]).map((temp) => {
          const isActive = temp === value
          return (
            <button
              key={temp}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(temp)}
              className={`group flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 transition-all duration-200 ${
                isActive
                  ? 'border-accent bg-accent/10 text-accent shadow-[inset_0_0_0_1px_var(--accent)]'
                  : 'border-line bg-raised text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              <span className="transition-transform duration-200 group-active:scale-90">
                {TEMP_ICONS[temp]}
              </span>
              <span className="head text-xs">{HYDRATION[temp].label}</span>
              <span className="data text-[11px] opacity-70">{HYDRATION[temp].hint}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        Targets ~<strong className="data text-ink">{active.fluidMlPerHour} ml</strong>{' '}
        fluid and ~
        <strong className="data text-ink">{active.sodiumMgPerHour} mg</strong> sodium
        per hour — the DIY recipe includes the matching salt amount.
      </p>
    </div>
  )
}
