import { Bike, Footprints } from 'lucide-react'
import type { LegPlan, RacePlan } from '../../lib/fueling'
import { formatDuration } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'
import { makeFormatters } from './format'

const LEG_ICONS: Record<string, React.ReactNode> = {
  bike: <Bike className="size-3.5" />,
  run: <Footprints className="size-3.5" />,
}

function SplitBar({ leg }: { leg: LegPlan }) {
  const glucPct =
    leg.carbsPerHour > 0 ? (leg.glucosePerHour / leg.carbsPerHour) * 100 : 50
  return (
    <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-raised">
      <div
        className="bg-gluc transition-all duration-500 ease-out"
        style={{ width: `${glucPct}%` }}
      />
      <div className="flex-1 bg-fruc transition-all duration-500 ease-out" />
    </div>
  )
}

export function PerHourSplit({ plan }: { plan: RacePlan }) {
  const { t, locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const multi = plan.legs.length > 1
  const single = plan.legs[0]

  if (!multi) {
    return (
      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="data text-3xl font-bold text-gluc">
              {fmt(single.glucosePerHour)}
              <span className="text-sm font-medium"> g</span>
            </p>
            <p className="head mt-0.5 text-[11px] text-muted">
              {t('results.glucoseH')}
            </p>
          </div>
          <div className="text-right">
            <p className="data text-3xl font-bold text-fruc">
              {fmt(single.fructosePerHour)}
              <span className="text-sm font-medium"> g</span>
            </p>
            <p className="head mt-0.5 text-[11px] text-muted">
              {t('results.fructoseH')}
            </p>
          </div>
        </div>
        <SplitBar leg={single} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {plan.legs.map((leg) => (
        <div key={leg.key}>
          <div className="flex items-end justify-between gap-3">
            <span className="head flex items-center gap-1.5 text-xs text-muted">
              <span className="text-accent">{LEG_ICONS[leg.key]}</span>
              {t(`leg.${leg.key}`)} · {formatDuration(leg.durationMin)} ·{' '}
              {leg.carbsPerHour} g/h
            </span>
            <span className="data text-sm font-bold">
              <span className="text-gluc">{fmt(leg.glucosePerHour)} g</span>
              <span className="mx-1 font-normal text-muted">/</span>
              <span className="text-fruc">{fmt(leg.fructosePerHour)} g</span>
            </span>
          </div>
          <SplitBar leg={leg} />
        </div>
      ))}
      <p className="head text-right text-[11px] text-muted">
        <span className="text-gluc">{t('ratio.glucose')}</span> /{' '}
        <span className="text-fruc">{t('ratio.fructose')}</span>{' '}
        {t('results.perHour')}
      </p>
    </div>
  )
}
