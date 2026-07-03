import { Droplets, Zap } from 'lucide-react'
import type { LegPlan, RacePlan } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'
import { makeFormatters } from './format'

export function ProductsPerHour({ plan }: { plan: RacePlan }) {
  const { t, locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const multi = plan.legs.length > 1
  const gelUnit = (n: number) => t(n === 1 ? 'unit.gel' : 'unit.gels')

  const chips = (leg: LegPlan) => (
    <>
      {leg.gelsPerHour > 0 && (
        <span className="data inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-sm font-semibold">
          <Zap className="size-3.5 text-accent" />
          {leg.gelsPerHour} {gelUnit(leg.gelsPerHour)}
          <span className="font-normal text-muted">
            {t('results.each', { g: leg.gelCarbs })}
          </span>
        </span>
      )}
      <span className="data inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-sm font-semibold">
        <Droplets className="size-3.5 text-accent" />
        {leg.drinkCarbsPerHour < 0.5
          ? t('results.water', { ml: leg.fluidMlPerHour })
          : t('results.drink', { ml: leg.fluidMlPerHour })}
        {leg.drinkCarbsPerHour >= 0.5 && (
          <span className="font-normal text-muted">
            {t('results.mix', { g: fmt(leg.drinkCarbsPerHour) })}
          </span>
        )}
      </span>
    </>
  )

  if (multi) {
    return (
      <div className="space-y-2">
        {plan.legs.map((leg) => (
          <div key={leg.key} className="flex flex-wrap items-center gap-2">
            <span className="head w-16 text-[11px] text-muted">
              {t(`leg.${leg.key}`)}
            </span>
            {chips(leg)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">{chips(plan.legs[0])}</div>
  )
}
