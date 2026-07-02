import {
  AlertTriangle,
  Bike,
  Droplets,
  FlaskConical,
  Footprints,
  Info,
  Zap,
} from 'lucide-react'
import type { LegPlan, PlanInput, PlanMessage, RacePlan } from '../lib/fueling'
import { formatDuration, HYDRATION } from '../lib/fueling'
import type { MessageKey, TranslateFn } from '../lib/i18n'
import { useI18n } from '../lib/i18n'

const LEG_ICONS: Record<string, React.ReactNode> = {
  bike: <Bike className="size-3.5" />,
  run: <Footprints className="size-3.5" />,
}

const messageText = (t: TranslateFn, message: PlanMessage) => {
  const prefix = message.leg ? `${t(`leg.${message.leg}`)}: ` : ''
  return prefix + t(message.key as MessageKey, message.params)
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

export function ResultsPanel({
  input,
  plan,
  advanced,
}: {
  input: PlanInput
  plan: RacePlan
  advanced: boolean
}) {
  const { t, locale } = useI18n()
  const fmt = (n: number) => Math.round(n).toLocaleString(locale)
  const fmt1 = (n: number) => (Math.round(n * 10) / 10).toLocaleString(locale)
  const liters = (l: number) =>
    l.toLocaleString(locale, { maximumFractionDigits: 2 })

  const multi = plan.legs.length > 1
  const single = plan.legs[0]
  const hydration = HYDRATION[plan.temperature]

  const legName = (leg: LegPlan) => t(`leg.${leg.key}`)

  const headerDetail = multi
    ? plan.legs.map((leg) => `${legName(leg)} ${leg.carbsPerHour} g/h`).join(' · ')
    : `${single.carbsPerHour} g/h`

  const gelUnit = (n: number) => t(n === 1 ? 'unit.gel' : 'unit.gels')
  const bottleUnit = (n: number) => t(n === 1 ? 'unit.bottle' : 'unit.bottles')

  const wholeRaceItems = [
    ...(plan.totalGels > 0 ? [`${plan.totalGels} ${gelUnit(plan.totalGels)}`] : []),
    `${plan.totalBottles} ${bottleUnit(plan.totalBottles)} (${liters(plan.totalFluidL)} L)`,
  ].join(' + ')

  const productChips = (leg: LegPlan) => (
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
        {t('results.drink', { ml: leg.fluidMlPerHour })}
        <span className="font-normal text-muted">
          {t('results.mix', { g: fmt(leg.drinkCarbsPerHour) })}
        </span>
      </span>
    </>
  )

  const diyRecipe = (leg: LegPlan) => (
    <div
      key={leg.key}
      className="rounded-xl border border-dashed border-line-strong bg-raised p-4"
    >
      <p className="tick-label head text-xs text-muted">
        <FlaskConical className="-ml-1 size-3.5 text-accent" />
        {multi ? t('diy.legBottle', { leg: legName(leg) }) : t('diy.title')} ·{' '}
        {leg.gelsPerHour > 0 ? t('diy.topsUp') : `${leg.bottleMl} ml`}
      </p>
      <ul className="data mt-2.5 space-y-1.5 text-sm">
        <li className="flex justify-between gap-4">
          <span>{t('diy.malto')}</span>
          <span className="font-bold text-gluc">{fmt(leg.bottleGlucose)} g</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>{t('diy.fructose')}</span>
          <span className="font-bold text-fruc">{fmt(leg.bottleFructose)} g</span>
        </li>
        <li className="flex justify-between gap-4">
          <span>{t('diy.water')}</span>
          <span className="font-bold">{leg.bottleMl} ml</span>
        </li>
        {advanced ? (
          <li className="flex justify-between gap-4">
            <span>{t('diy.salt')}</span>
            <span className="font-bold">{fmt1(leg.bottleSaltG)} g</span>
          </li>
        ) : (
          <li className="flex justify-between gap-4 text-muted">
            <span>{t('diy.pinch')}</span>
            <span>{t('diy.toTaste')}</span>
          </li>
        )}
      </ul>
    </div>
  )

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
        {/* Per-hour split */}
        {multi ? (
          <div className="space-y-4">
            {plan.legs.map((leg) => (
              <div key={leg.key}>
                <div className="flex items-end justify-between gap-3">
                  <span className="head flex items-center gap-1.5 text-xs text-muted">
                    <span className="text-accent">{LEG_ICONS[leg.key]}</span>
                    {legName(leg)} · {formatDuration(leg.durationMin)} ·{' '}
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
        ) : (
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
        )}

        {/* Race totals */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('results.totalCarbs'), value: `${fmt(plan.totalCarbs)} g` },
            { label: t('results.totalGlucose'), value: `${fmt(plan.totalGlucose)} g` },
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

        {/* Product suggestion */}
        {input.useGels && (
          <div>
            <p className="tick-label head text-xs text-muted">{t('results.shop')}</p>
            {multi ? (
              <div className="mt-2 space-y-2">
                {plan.legs.map((leg) => (
                  <div key={leg.key} className="flex flex-wrap items-center gap-2">
                    <span className="head w-16 text-[11px] text-muted">
                      {legName(leg)}
                    </span>
                    {productChips(leg)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {productChips(single)}
              </div>
            )}
            <p className="mt-2 text-xs text-muted">
              {t('results.wholeRace', { items: wholeRaceItems })}
            </p>
          </div>
        )}

        {/* DIY recipe */}
        <div className={multi ? 'grid gap-3 sm:grid-cols-2' : ''}>
          {plan.legs.map(diyRecipe)}
        </div>
        <p className="-mt-2 text-xs text-muted">
          {t('diy.wholeRace', {
            malto: fmt(plan.totalMaltodextrin),
            fruc: fmt(plan.totalFructosePowder),
            bottles: `${plan.totalBottles} ${bottleUnit(plan.totalBottles)}`,
            liters: liters(plan.totalFluidL),
          })}
        </p>

        {/* Warnings */}
        {plan.warnings.map((warning) => (
          <p
            key={warning.key + (warning.leg ?? '')}
            className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/8 px-3 py-2.5 text-xs leading-relaxed text-ink"
          >
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {messageText(t, warning)}
          </p>
        ))}

        {/* Hints */}
        {hints.map((hint) => (
          <p
            key={hint}
            className="flex items-start gap-2 rounded-lg border border-line bg-raised px-3 py-2.5 text-xs leading-relaxed text-muted"
          >
            <Info className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {hint}
          </p>
        ))}
      </div>
    </div>
  )
}
