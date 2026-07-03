import { Zap } from 'lucide-react'
import type { LegPlan, RacePlan } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'

export function ProductsPerHour({ plan }: { plan: RacePlan }) {
  const { t } = useI18n()
  const multi = plan.legs.length > 1
  const gelUnit = (n: number) => t(n === 1 ? 'unit.gel' : 'unit.gels')

  // Only the gels are worth listing here — the bottle is covered by the recipe below
  if (!plan.legs.some((leg) => leg.gelsPerHour > 0)) return null

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
          .filter((leg) => leg.gelsPerHour > 0)
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
