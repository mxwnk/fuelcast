import { Zap } from 'lucide-react'
import type { LegPlan, RacePlan } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'

export function ProductsPerHour({ plan }: { plan: RacePlan }) {
  const { t } = useI18n()
  const multi = plan.legs.length > 1
  const gelUnit = (n: number) => t(n === 1 ? 'unit.gel' : 'unit.gels')

  // Show a per-hour gel count only when the rate is a whole number. A
  // fractional rate (e.g. gels-only at 1.5/h) can't be stated cleanly per hour
  // — those gels are covered by the timeline cadence ("every 40 min") and the
  // whole-race shopping list instead.
  const hasGelChip = (leg: LegPlan) =>
    Number.isInteger(leg.gelsPerHour) && leg.gelsPerHour > 0
  if (!plan.legs.some(hasGelChip)) return null

  const gelChip = (leg: LegPlan) => (
    <span className="data inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-sm font-semibold">
      <Zap className="size-3.5 text-accent" />
      {leg.gelsPerHour} {gelUnit(leg.gelsPerHour)}
      <span className="font-normal text-muted">
        {t('results.each', { g: leg.gelCarbs })}
      </span>
    </span>
  )

  if (multi) {
    return (
      <div className="space-y-2">
        {plan.legs
          .filter(hasGelChip)
          .map((leg) => (
            <div key={leg.key} className="flex flex-wrap items-center gap-2">
              <span className="head w-16 text-[11px] text-muted">
                {t(`leg.${leg.key}`)}
              </span>
              {gelChip(leg)}
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">{gelChip(plan.legs[0])}</div>
  )
}
