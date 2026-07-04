import { useState } from 'react'
import { AlertTriangle, ChevronDown, Info, ShieldAlert } from 'lucide-react'
import type { RacePlan } from '../../lib/fueling'
import { HYDRATION } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'
import { messageText } from './format'

interface PlanMessagesProps {
  plan: RacePlan
  advanced: boolean
}

export function PlanMessages({ plan, advanced }: PlanMessagesProps) {
  const { t } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const hydration = HYDRATION[plan.temperature]

  const hints = plan.hints.map((hint) => messageText(t, hint))
  if (!advanced) {
    hints.push(
      t('hint.hydration', {
        temp: t(`temp.adj.${plan.temperature}`),
        fluid: hydration.fluidMlPerHour,
        sodium: hydration.sodiumMgPerHour,
        advanced: t('advanced.show'),
      }),
    )
  }

  const safetyHints = [
    t('hint.drinkToThirst'),
    t('hint.individualVariation'),
    t('hint.medicalDisclaimer'),
  ]

  const collapsibleCount = hints.length + safetyHints.length

  return (
    <>
      {/* Critical warnings always visible */}
      {plan.warnings.map((warning) => (
        <p
          key={warning.key + (warning.leg ?? '')}
          className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/8 px-3 py-2.5 text-xs leading-relaxed text-ink"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-accent" />
          {messageText(t, warning)}
        </p>
      ))}

      {/* Collapsible hints & safety notes */}
      {collapsibleCount > 0 && (
        <div className="rounded-lg border border-line bg-raised">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold text-muted transition-colors hover:text-ink"
          >
            <Info className="size-3.5 shrink-0 text-accent" />
            <span>{t('hints.toggle', { count: collapsibleCount })}</span>
            <ChevronDown
              className={`ml-auto size-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>

          {expanded && (
            <div className="space-y-2 border-t border-line px-3 pb-3 pt-2">
              {hints.map((hint) => (
                <p
                  key={hint}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted"
                >
                  <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  {hint}
                </p>
              ))}
              {safetyHints.map((hint) => (
                <p
                  key={hint}
                  className="flex items-start gap-2 text-xs leading-relaxed text-muted"
                >
                  <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-muted" />
                  {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
