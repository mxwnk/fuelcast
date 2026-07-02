import { FlaskConical, Zap } from 'lucide-react'

const OPTIONS = [
  {
    useGels: true,
    label: 'Gels + drink mix',
    description: 'Shop-bought gels carry part of the carbs, the bottle does the rest',
    icon: <Zap className="size-5" />,
  },
  {
    useGels: false,
    label: 'DIY mix only',
    description: 'Everything goes into the bottle — pure maltodextrin + fructose',
    icon: <FlaskConical className="size-5" />,
  },
]

interface FuelSourceControlProps {
  useGels: boolean
  onChange: (useGels: boolean) => void
}

export function FuelSourceControl({ useGels, onChange }: FuelSourceControlProps) {
  return (
    <div role="radiogroup" aria-label="Fuel source" className="grid grid-cols-2 gap-2">
      {OPTIONS.map((option) => {
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
            <span className={`head text-[11px] ${active ? 'text-accent' : 'text-ink'}`}>
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
