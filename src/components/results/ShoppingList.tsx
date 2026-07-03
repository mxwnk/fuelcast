import { Droplets, FlaskConical, ShoppingCart, Zap } from 'lucide-react'
import type { RacePlan } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'
import { makeFormatters } from './format'

interface ShoppingListProps {
  plan: RacePlan
  advanced: boolean
}

interface Item {
  key: string
  icon: React.ReactNode
  value: string
  label: string
  sub?: string
}

export function ShoppingList({ plan, advanced }: ShoppingListProps) {
  const { t, locale } = useI18n()
  const { fmt, fmt1, liters } = makeFormatters(locale)
  const multi = plan.legs.length > 1

  const gelBreakdown = multi
    ? plan.legs
        .filter((leg) => leg.totalGels > 0)
        .map((leg) => `${t(`leg.${leg.key}`)} ${leg.totalGels}`)
        .join(' · ')
    : undefined

  const gelTotalCarbs = plan.totalGels * plan.legs[0].gelCarbs
  const gelSub = gelBreakdown ?? `${fmt(gelTotalCarbs)} g carbs`

  const items: Item[] = [
    ...(plan.totalGels > 0
      ? [
          {
            key: 'gels',
            icon: <Zap className="size-4" />,
            value: `${plan.totalGels}×`,
            label: t('shopping.gels', { g: plan.legs[0].gelCarbs }),
            sub: gelSub,
          },
        ]
      : []),
    {
      key: 'bottles',
      icon: <Droplets className="size-4" />,
      value: `${plan.totalBottles}×`,
      label: t('shopping.bottles'),
      sub: `${liters(plan.totalFluidL)} L`,
    },
    ...(plan.totalMaltodextrin >= 1
      ? [
          {
            key: 'malto',
            icon: <FlaskConical className="size-4" />,
            value: `${fmt(plan.totalMaltodextrin)} g`,
            label: t('shopping.malto'),
          },
          {
            key: 'fructose',
            icon: <FlaskConical className="size-4" />,
            value: `${fmt(plan.totalFructosePowder)} g`,
            label: t('shopping.fructose'),
          },
        ]
      : []),
    ...(advanced
      ? [
          {
            key: 'salt',
            icon: <FlaskConical className="size-4" />,
            value: `${fmt1(plan.totalSaltG)} g`,
            label: t('shopping.salt'),
          },
        ]
      : []),
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-accent/40">
      <p className="tick-label head bg-accent/10 px-4 py-2.5 text-xs text-ink">
        <ShoppingCart className="-ml-1 size-3.5 text-accent" />
        {t('shopping.title')}
      </p>
      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg bg-raised px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-accent">
              {item.icon}
              <span className="data text-2xl font-bold text-ink">{item.value}</span>
            </span>
            <p className="head mt-1 text-[11px] text-muted">{item.label}</p>
            {item.sub && (
              <p className="data mt-0.5 text-[11px] text-muted">{item.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
