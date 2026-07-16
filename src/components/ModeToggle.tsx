import { Hammer, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CalculatorMode } from '../hooks/useBuildMode'
import { useI18n } from '../lib/i18n'

interface ModeToggleProps {
  mode: CalculatorMode
  onChange: (mode: CalculatorMode) => void
}

const MODES: { value: CalculatorMode; icon: LucideIcon }[] = [
  { value: 'auto', icon: Sparkles },
  { value: 'build', icon: Hammer },
]

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const { t } = useI18n()
  return (
    <div
      role="radiogroup"
      aria-label={t('mode.label')}
      className="inline-flex rounded-lg border border-line bg-raised p-1"
    >
      {MODES.map(({ value, icon: Icon }) => {
        const isActive = value === mode
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(value)}
            className={`head flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-accent text-accent-ink'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Icon className="size-4" />
            {t(`mode.${value}`)}
          </button>
        )
      })}
    </div>
  )
}
