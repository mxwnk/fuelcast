import { FlaskConical } from 'lucide-react'
import type { LegPlan } from '../../lib/fueling'
import { useI18n } from '../../lib/i18n'
import { makeFormatters } from './format'

interface DiyRecipeProps {
  leg: LegPlan
  showLegName: boolean
  advanced: boolean
}

export function DiyRecipe({ leg, showLegName, advanced }: DiyRecipeProps) {
  const { t, locale } = useI18n()
  const { fmt, fmt1 } = makeFormatters(locale)
  // Gels-only mode leaves the bottle carrying just water + electrolytes
  const waterOnly = leg.drinkCarbsPerHour < 0.5

  const title = waterOnly
    ? t('diy.waterTitle')
    : showLegName
      ? t('diy.legBottle', { leg: t(`leg.${leg.key}`) })
      : t('diy.title')
  const subtitle = waterOnly
    ? t('diy.waterOnly')
    : leg.gelsPerHour > 0
      ? t('diy.topsUp')
      : `${leg.bottleMl} ml`

  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-raised p-4">
      <p className="tick-label head text-xs text-muted">
        <FlaskConical className="-ml-1 size-3.5 text-accent" />
        {title} · {subtitle}
      </p>
      <ul className="data mt-2.5 space-y-1.5 text-sm">
        {!waterOnly && (
          <>
            <li className="flex justify-between gap-4">
              <span>{t('diy.malto')}</span>
              <span className="font-bold text-gluc">{fmt(leg.bottleGlucose)} g</span>
            </li>
            <li className="flex justify-between gap-4">
              <span>{t('diy.fructose')}</span>
              <span className="font-bold text-fruc">{fmt(leg.bottleFructose)} g</span>
            </li>
          </>
        )}
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
}
