import { Bike, Footprints, Waves } from 'lucide-react'
import type { Sport } from '../lib/fueling'
import { SPORTS } from '../lib/fueling'

const ICONS: Record<Sport, React.ReactNode> = {
  triathlon: (
    <span className="flex items-center gap-0.5">
      <Waves className="size-4" />
      <Bike className="size-5" />
      <Footprints className="size-4" />
    </span>
  ),
  cycling: <Bike className="size-6" />,
  running: <Footprints className="size-6" />,
}

interface SportSelectorProps {
  value: Sport
  onChange: (sport: Sport) => void
}

export function SportSelector({ value, onChange }: SportSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Sport" className="grid grid-cols-3 gap-2">
      {SPORTS.map(({ id, label }) => {
        const active = id === value
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={`group flex flex-col items-center gap-2 rounded-xl border px-2 py-4 transition-all duration-200 ${
              active
                ? 'border-accent bg-accent/10 text-accent shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'border-line bg-raised text-muted hover:border-line-strong hover:text-ink'
            }`}
          >
            <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-active:scale-90">
              {ICONS[id]}
            </span>
            <span className="head text-[11px]">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
