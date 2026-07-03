import { useI18n } from '../../lib/i18n'

export function ImprintPage() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-2xl pb-20">
      <h1 className="head text-2xl sm:text-3xl">{t('footer.imprint')}</h1>

      <div className="mt-6 space-y-2 text-sm leading-relaxed text-ink">
        <p>{t('footer.imprint.name')}</p>
        <p>{t('footer.imprint.address')}</p>
        <p className="mt-4">{t('footer.imprint.contact')}</p>
      </div>

      <div className="mt-8 space-y-2 text-sm leading-relaxed text-muted">
        <p className="head text-xs text-ink">{t('footer.imprint.liability')}</p>
        <p>{t('footer.imprint.liabilityText')}</p>
      </div>
    </div>
  )
}
