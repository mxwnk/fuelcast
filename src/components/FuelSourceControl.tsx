import { Droplets, FlaskConical, Zap } from 'lucide-react'
import type { FuelSource } from '../lib/fueling'
import { useI18n } from '../lib/i18n'

interface FuelSourceControlProps {
  value: FuelSource
  onChange: (value: FuelSource) => void
}

const OPTIONS: { id: FuelSource; icon: React.ReactNode }[] = [
  { id: 'combo', icon: <Zap className="size-5" /> },
  { id: 'gels', icon: <Droplets className="size-5" /> },
  { id: 'diy', icon: <FlaskConical className="size-5" /> },
]

export function FuelSourceControl({ value, onChange }: FuelSourceControlProps) {
  const { t } = useI18n()

  return (
    <div
      role="radiogroup"
      aria-label={t('section.fuelSource')}
      className="grid gap-2 sm:grid-cols-3"
    >
      {OPTIONS.map((option) => {
        const active = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={`group flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
              active
                ? 'border-accent bg-accent/10 shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-raised hover:border-line-strong'
            }`}
          >
            <span
              className={`transition-transform duration-200 group-active:scale-90 ${
                active ? 'text-accent' : 'text-muted'
              }`}
            >
              {option.icon}
            </span>
            <span className={`head text-xs ${active ? 'text-accent' : 'text-ink'}`}>
              {t(`fuel.${option.id}.label`)}
            </span>
            <span className="text-xs leading-snug text-muted">
              {t(`fuel.${option.id}.desc`)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
