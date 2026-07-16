import type { CalculatorMode } from '../hooks/useBuildMode'
import { useI18n } from '../lib/i18n'

interface ModeToggleProps {
  mode: CalculatorMode
  onChange: (mode: CalculatorMode) => void
}

const MODES: CalculatorMode[] = ['auto', 'build']

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const { t } = useI18n()
  return (
    <div
      role="radiogroup"
      aria-label={t('mode.label')}
      className="inline-flex rounded-xl border border-line bg-raised p-1"
    >
      {MODES.map((option) => {
        const isActive = option === mode
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option)}
            className={`head rounded-lg px-4 py-1.5 text-sm transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-accent text-accent-ink shadow-[inset_0_0_0_1px_var(--accent)]'
                : 'text-muted hover:text-ink'
            }`}
          >
            {t(`mode.${option}`)}
          </button>
        )
      })}
    </div>
  )
}
