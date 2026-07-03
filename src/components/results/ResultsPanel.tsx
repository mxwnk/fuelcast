import { Zap } from 'lucide-react'
import type { PlanInput, RacePlan } from '../../lib/fueling'
import { formatDuration } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'
import { DiyRecipe } from './DiyRecipe'
import { makeFormatters } from './format'
import { PerHourSplit } from './PerHourSplit'
import { PlanMessages } from './PlanMessages'
import { ProductsPerHour } from './ProductsPerHour'
import { ShoppingList } from './ShoppingList'

interface ResultsPanelProps {
  input: PlanInput
  plan: RacePlan
  advanced: boolean
}

export function ResultsPanel({ input, plan, advanced }: ResultsPanelProps) {
  const { t, locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const multi = plan.legs.length > 1
  const single = plan.legs[0]

  const headerDetail = multi
    ? plan.legs
        .map((leg) => `${t(`leg.${leg.key}`)} ${leg.carbsPerHour} g/h`)
        .join(' · ')
    : `${single.carbsPerHour} g/h`

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* Race card header */}
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-bg dark:bg-raised dark:text-ink">
        <div>
          <p className="head text-sm">{t('results.title')}</p>
          <p className="data mt-0.5 text-xs uppercase tracking-wider opacity-60">
            {t(`sport.${input.sport}`)} · {formatDuration(plan.totalDurationMin)} ·{' '}
            {headerDetail} · {input.ratio.glucose}:{input.ratio.fructose}
          </p>
        </div>
        <Zap className="size-5 shrink-0 fill-accent text-accent" />
      </div>

      <div className="space-y-5 p-5">
        <PerHourSplit plan={plan} />

        <ShoppingList plan={plan} advanced={advanced} />

        {input.fuelSource !== 'diy' && <ProductsPerHour plan={plan} />}

        <div className={multi ? 'grid gap-3 sm:grid-cols-2' : ''}>
          {plan.legs.map((leg) => (
            <DiyRecipe key={leg.key} leg={leg} showLegName={multi} advanced={advanced} />
          ))}
        </div>

        {/* Intake totals */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('results.totalCarbs'), value: `${fmt(plan.totalCarbs)} g` },
            {
              label: t('results.totalGlucose'),
              value: `${fmt(plan.totalGlucose)} g`,
            },
            {
              label: t('results.totalFructose'),
              value: `${fmt(plan.totalFructose)} g`,
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-line bg-raised px-3 py-2.5"
            >
              <p className="data text-lg font-bold">{value}</p>
              <p className="head mt-0.5 text-[11px] text-muted">{label}</p>
            </div>
          ))}
        </div>

        <PlanMessages plan={plan} advanced={advanced} />
      </div>
    </div>
  )
}
