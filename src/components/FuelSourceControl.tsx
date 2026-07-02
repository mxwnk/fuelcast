import { FlaskConical, Zap } from 'lucide-react'
import { useI18n } from '../lib/i18n'

interface FuelSourceControlProps {
  useGels: boolean
  onChange: (useGels: boolean) => void
}

export function FuelSourceControl({ useGels, onChange }: FuelSourceControlProps) {
  const { t } = useI18n()
  const options = [
    {
      useGels: true,
      label: t('fuel.gels.label'),
      description: t('fuel.gels.desc'),
      icon: <Zap className="size-5" />,
    },
    {
      useGels: false,
      label: t('fuel.diy.label'),
      description: t('fuel.diy.desc'),
      icon: <FlaskConical className="size-5" />,
    },
  ]

  return (
    <div
      role="radiogroup"
      aria-label={t('section.fuelSource')}
      className="grid grid-cols-2 gap-2"
    >
      {options.map((option) => {
        const active = option.useGels === useGels
        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.useGels)}
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
              {option.label}
            </span>
            <span className="text-xs leading-snug text-muted">
              {option.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
