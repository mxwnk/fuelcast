import {
  AlertTriangle,
  Bike,
  Droplets,
  FlaskConical,
  Footprints,
  Zap,
} from 'lucide-react'
import type { LegPlan, PlanInput, RacePlan } from '../lib/fueling'
import { BOTTLE_ML, formatDuration, GEL_CARBS, SPORTS } from '../lib/fueling'

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

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

function ProductChips({ leg }: { leg: LegPlan }) {
  return (
    <>
      {leg.gelsPerHour > 0 && (
        <span className="data inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-sm font-semibold">
          <Zap className="size-3.5 text-accent" />
          {leg.gelsPerHour} gel{leg.gelsPerHour > 1 ? 's' : ''}
          <span className="font-normal text-muted">({GEL_CARBS} g each)</span>
        </span>
      )}
      <span className="data inline-flex items-center gap-1.5 rounded-full border border-line bg-raised px-3 py-1.5 text-sm font-semibold">
        <Droplets className="size-3.5 text-accent" />
        {BOTTLE_ML} ml drink
        <span className="font-normal text-muted">
          ({fmt(leg.drinkCarbsPerHour)} g mix)
        </span>
      </span>
    </>
  )
}

function DiyRecipe({ leg, showLabel }: { leg: LegPlan; showLabel: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-raised p-4">
      <p className="tick-label head text-xs text-muted">
        <FlaskConical className="-ml-1 size-3.5 text-accent" />
        {showLabel ? `${leg.label} bottle` : 'DIY bottle mix'} ·{' '}
        {leg.gelsPerHour > 0 ? 'tops up the gels each hour' : 'fuels 1 hour'}
      </p>
      <ul className="data mt-2.5 space-y-1.5 text-sm">
        <li className="flex justify-between gap-4">
          <span>Maltodextrin (glucose)</span>
          <span className="font-bold text-gluc">
            {fmt(leg.drinkGlucosePerHour)} g
          </span>
        </li>
        <li className="flex justify-between gap-4">
          <span>Fructose</span>
          <span className="font-bold text-fruc">
            {fmt(leg.drinkFructosePerHour)} g
          </span>
        </li>
        <li className="flex justify-between gap-4">
          <span>Water</span>
          <span className="font-bold">{BOTTLE_ML} ml</span>
        </li>
        <li className="flex justify-between gap-4 text-muted">
          <span>Pinch of salt + squeeze of citrus</span>
          <span>to taste</span>
        </li>
      </ul>
    </div>
  )
}

interface ResultsPanelProps {
  input: PlanInput
  plan: RacePlan
}

export function ResultsPanel({ input, plan }: ResultsPanelProps) {
  const sportLabel = SPORTS.find((s) => s.id === input.sport)?.label
  const multi = plan.legs.length > 1
  const single = plan.legs[0]

  const headerDetail = multi
    ? plan.legs.map((leg) => `${leg.label} ${leg.carbsPerHour} g/h`).join(' · ')
    : `${single.carbsPerHour} g/h`

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* Race card header */}
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-bg dark:bg-raised dark:text-ink">
        <div>
          <p className="head text-sm">Your fuel plan</p>
          <p className="data mt-0.5 text-xs uppercase tracking-wider opacity-60">
            {sportLabel} · {formatDuration(plan.totalDurationMin)} · {headerDetail} ·{' '}
            {input.ratio.glucose}:{input.ratio.fructose}
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
                    {leg.label} · {formatDuration(leg.durationMin)} ·{' '}
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
              <span className="text-gluc">Glucose</span> /{' '}
              <span className="text-fruc">Fructose</span> per hour
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
                <p className="head mt-0.5 text-[11px] text-muted">Glucose / h</p>
              </div>
              <div className="text-right">
                <p className="data text-3xl font-bold text-fruc">
                  {fmt(single.fructosePerHour)}
                  <span className="text-sm font-medium"> g</span>
                </p>
                <p className="head mt-0.5 text-[11px] text-muted">Fructose / h</p>
              </div>
            </div>
            <SplitBar leg={single} />
          </div>
        )}

        {/* Race totals */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Total carbs', value: `${fmt(plan.totalCarbs)} g` },
            { label: 'Total glucose', value: `${fmt(plan.totalGlucose)} g` },
            { label: 'Total fructose', value: `${fmt(plan.totalFructose)} g` },
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
          <p className="tick-label head text-xs text-muted">
            Shop-bought · per hour
          </p>
          {multi ? (
            <div className="mt-2 space-y-2">
              {plan.legs.map((leg) => (
                <div key={leg.key} className="flex flex-wrap items-center gap-2">
                  <span className="head w-9 text-[11px] text-muted">
                    {leg.label}
                  </span>
                  <ProductChips leg={leg} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ProductChips leg={single} />
            </div>
          )}
          <p className="mt-2 text-xs text-muted">
            ≈ {plan.totalGels > 0 ? `${plan.totalGels} gels + ` : ''}
            {plan.totalBottles} bottle{plan.totalBottles > 1 ? 's' : ''} (
            {plan.totalFluidL.toFixed(2).replace(/\.?0+$/, '')} L) for the whole race.
          </p>
        </div>
        )}

        {/* DIY recipe */}
        <div className={multi ? 'grid gap-3 sm:grid-cols-2' : ''}>
          {plan.legs.map((leg) => (
            <DiyRecipe key={leg.key} leg={leg} showLabel={multi} />
          ))}
        </div>
        <p className="-mt-2 text-xs text-muted">
          Whole race: {fmt(plan.totalMaltodextrin)} g maltodextrin +{' '}
          {fmt(plan.totalFructosePowder)} g fructose across {plan.totalBottles}{' '}
          bottle{plan.totalBottles > 1 ? 's' : ''} (
          {plan.totalFluidL.toFixed(2).replace(/\.?0+$/, '')} L).
        </p>

        {/* Warnings */}
        {plan.warnings.map((warning) => (
          <p
            key={warning}
            className="flex items-start gap-2 rounded-lg border border-accent/30 bg-accent/8 px-3 py-2.5 text-xs leading-relaxed text-ink"
          >
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-accent" />
            {warning}
          </p>
        ))}
      </div>
    </div>
  )
}
