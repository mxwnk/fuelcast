import { Plus, Trash2, Zap } from 'lucide-react'
import type {
  BuildItem,
  LegBuildProgress,
  LegKey,
  PlanConfig,
  PlanInput,
  RacePlan,
  Ratio,
} from '../lib/fueling'
import {
  applyBuildItemsToPlan,
  buildItemCarbs,
  computeBuildProgress,
  formatDuration,
  GEL_SIZES,
} from '../lib/fueling'
import { useI18n } from '../lib/i18n'
import { makeFormatters } from './results/format'
import { NumberField } from './Slider'
import { Timeline } from './Timeline'

interface BuildPanelProps {
  input: PlanInput
  plan: RacePlan
  items: BuildItem[]
  config: PlanConfig
  onAddItem: (item: BuildItem) => void
  onUpdateItem: (id: string, patch: Partial<BuildItem>) => void
  onRemoveItem: (id: string) => void
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(36).slice(2)}`

export function BuildPanel({
  input,
  plan,
  items,
  config,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: BuildPanelProps) {
  const { locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const progress = computeBuildProgress(plan, items)
  const timelinePlan = applyBuildItemsToPlan(plan, items)

  const addGel = (leg: LegKey | 'race') =>
    onAddItem({
      id: createId(),
      kind: 'gel',
      carbs: GEL_SIZES[0],
      count: 1,
      leg,
    })

  const addBottle = (leg: LegKey | 'race') =>
    onAddItem({
      id: createId(),
      kind: 'bottle',
      carbs: 60,
      ml: config.bottleMl,
      count: 1,
      leg,
    })

  return (
    <div className="space-y-6">
      <RaceOverview
        input={input}
        plan={plan}
        items={items}
        assigned={progress.assignedCarbs}
        goal={progress.goalCarbs}
        format={fmt}
      />
      {progress.legs.map((legProgress, index) => (
        <BuildLegCard
          key={legProgress.key}
          step={index + 1}
          legProgress={legProgress}
          items={items.filter((item) => item.leg === legProgress.key)}
          ratio={input.ratio}
          onAddGel={() => addGel(legProgress.key)}
          onAddBottle={() => addBottle(legProgress.key)}
          onUpdateItem={onUpdateItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
      <Timeline plan={timelinePlan} />
    </div>
  )
}

interface RaceOverviewProps {
  input: PlanInput
  plan: RacePlan
  items: BuildItem[]
  assigned: number
  goal: number
  format: (n: number) => string
}

function sumItemCounts(items: BuildItem[], kind: BuildItem['kind']): number {
  return items
    .filter((item) => item.kind === kind)
    .reduce((total, item) => total + item.count, 0)
}

function RaceOverview({ input, plan, items, assigned, goal, format }: RaceOverviewProps) {
  const { t } = useI18n()
  const multi = plan.legs.length > 1
  const headerDetail = multi
    ? plan.legs.map((leg) => `${t(`leg.${leg.key}`)} ${leg.carbsPerHour} g/h`).join(' · ')
    : `${plan.legs[0].carbsPerHour} g/h`

  const totalGels = sumItemCounts(items, 'gel')
  const totalBottles = sumItemCounts(items, 'bottle')

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center justify-between bg-ink px-5 py-3 text-bg dark:bg-raised dark:text-ink">
        <div>
          <p className="head text-sm">{t('build.overviewTitle')}</p>
          <p className="data mt-0.5 text-xs uppercase tracking-wider opacity-60">
            {t(`sport.${input.sport}`)} · {formatDuration(plan.totalDurationMin)} ·{' '}
            {headerDetail} · {input.ratio.glucose}:{input.ratio.fructose}
          </p>
        </div>
        <Zap className="size-5 shrink-0 fill-accent text-accent" />
      </div>

      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="head text-xs text-muted">{t('build.total')}</span>
            <span className="data text-lg font-bold">
              {format(assigned)} / {format(goal)} g
            </span>
          </div>
          <ProgressBar assigned={assigned} goal={goal} />
          <RemainingLabel remaining={goal - assigned} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t('build.total'), value: `${format(assigned)} g` },
            { label: t('build.gels'), value: format(totalGels) },
            { label: t('build.bottles'), value: format(totalBottles) },
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
      </div>
    </div>
  )
}

interface BuildLegCardProps {
  step: number
  legProgress: LegBuildProgress
  items: BuildItem[]
  ratio: Ratio
  onAddGel: () => void
  onAddBottle: () => void
  onUpdateItem: (id: string, patch: Partial<BuildItem>) => void
  onRemoveItem: (id: string) => void
}

function BuildLegCard({
  step,
  legProgress,
  items,
  ratio,
  onAddGel,
  onAddBottle,
  onUpdateItem,
  onRemoveItem,
}: BuildLegCardProps) {
  const { t, locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const title = t(`leg.${legProgress.key}`)

  return (
    <section>
      <h2 className="tick-label head text-xs text-muted">
        <span className="data text-accent">0{step}</span> {title} ·{' '}
        {t('build.goal', { g: fmt(legProgress.goalCarbs) })}
      </h2>
      <div className="mt-2.5 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="data text-sm font-bold">
            {fmt(legProgress.assignedCarbs)} / {fmt(legProgress.goalCarbs)} g
          </span>
          <RemainingLabel remaining={legProgress.remainingCarbs} inline />
        </div>
        <ProgressBar
          assigned={legProgress.assignedCarbs}
          goal={legProgress.goalCarbs}
        />

        {items.length > 0 && (
          <ul className="mt-4 space-y-2">
            {items.map((item) => (
              <BuildItemRow
                key={item.id}
                item={item}
                ratio={ratio}
                onUpdate={(patch) => onUpdateItem(item.id, patch)}
                onRemove={() => onRemoveItem(item.id)}
              />
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <AddButton label={t('build.addGel')} onClick={onAddGel} />
          <AddButton label={t('build.addBottle')} onClick={onAddBottle} />
        </div>
      </div>
    </section>
  )
}

interface BuildItemRowProps {
  item: BuildItem
  ratio: Ratio
  onUpdate: (patch: Partial<BuildItem>) => void
  onRemove: () => void
}

function BuildItemRow({ item, ratio, onUpdate, onRemove }: BuildItemRowProps) {
  const { t, locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const isBottle = item.kind === 'bottle'
  const label = isBottle ? t('build.bottle') : t('build.gel')
  const carbsPerBottle = item.count > 0 ? buildItemCarbs(item) / item.count : 0

  return (
    <li className="rounded-xl border border-line bg-raised p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="head text-xs text-muted">{label}</span>
        <span className="flex items-center gap-3">
          <span className="data text-sm font-bold text-accent">
            {fmt(buildItemCarbs(item))} g
          </span>
          <button
            type="button"
            onClick={onRemove}
            aria-label={t('build.remove')}
            className="text-muted transition-colors hover:text-ink"
          >
            <Trash2 className="size-4" />
          </button>
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <NumberField
          min={1}
          max={99}
          step={1}
          value={item.count}
          onChange={(count) => onUpdate({ count })}
          unit="×"
          ariaLabel={t('build.count')}
        />
        <NumberField
          min={1}
          max={300}
          step={1}
          value={item.carbs}
          onChange={(carbs) => onUpdate({ carbs })}
          unit="g"
          ariaLabel={t('build.carbs')}
        />
        {isBottle && (
          <NumberField
            min={100}
            max={2000}
            step={50}
            value={item.ml ?? 0}
            onChange={(ml) => onUpdate({ ml })}
            unit="ml"
            ariaLabel={t('build.volume')}
          />
        )}
      </div>
      {isBottle && carbsPerBottle > 0 && (
        <BottleMix carbsPerBottle={carbsPerBottle} ratio={ratio} format={fmt} />
      )}
    </li>
  )
}

interface BottleMixProps {
  carbsPerBottle: number
  ratio: Ratio
  format: (n: number) => string
}

/** Splits a single bottle's carbs into glucose/fructose by the plan ratio */
function BottleMix({ carbsPerBottle, ratio, format }: BottleMixProps) {
  const { t } = useI18n()
  const parts = ratio.glucose + ratio.fructose
  const glucose = parts > 0 ? (carbsPerBottle * ratio.glucose) / parts : 0
  const fructose = parts > 0 ? (carbsPerBottle * ratio.fructose) / parts : 0

  return (
    <div className="mt-2 flex items-center gap-4 border-t border-line pt-2">
      <span className="head text-[11px] text-muted">
        {ratio.glucose}:{ratio.fructose}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-gluc" />
        <span className="data text-xs text-muted">
          {t('diy.malto')} {format(glucose)} g
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-fruc" />
        <span className="data text-xs text-muted">
          {t('diy.fructose')} {format(fructose)} g
        </span>
      </span>
    </div>
  )
}

interface ProgressBarProps {
  assigned: number
  goal: number
}

function ProgressBar({ assigned, goal }: ProgressBarProps) {
  const fraction = goal > 0 ? assigned / goal : 0
  const percent = Math.min(1, fraction) * 100
  const isOver = fraction > 1.05
  const color = isOver ? 'bg-fruc' : 'bg-accent'

  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
      <div
        className={`h-full rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

interface RemainingLabelProps {
  remaining: number
  inline?: boolean
}

function RemainingLabel({ remaining, inline }: RemainingLabelProps) {
  const { t, locale } = useI18n()
  const { fmt } = makeFormatters(locale)
  const rounded = Math.round(remaining)

  let text: string
  let tone: string
  if (rounded > 0) {
    text = t('build.stillNeeded', { g: fmt(remaining) })
    tone = 'text-muted'
  } else if (rounded < 0) {
    text = t('build.over', { g: fmt(-remaining) })
    tone = 'text-fruc'
  } else {
    text = t('build.met')
    tone = 'text-accent'
  }

  return (
    <p className={`data text-xs font-semibold ${tone} ${inline ? '' : 'mt-2'}`}>
      {text}
    </p>
  )
}

interface AddButtonProps {
  label: string
  onClick: () => void
}

function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="data flex items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 text-sm font-semibold text-muted transition-all duration-150 hover:border-accent hover:text-ink active:scale-95"
    >
      <Plus className="size-4" />
      {label}
    </button>
  )
}
