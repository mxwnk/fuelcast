import type { PlanConfig } from '../lib/fueling'
import { useI18n } from '../lib/i18n'

export function Footer({ config }: { config: PlanConfig }) {
  const { t } = useI18n()
  return (
    <footer
      className="rise mt-14 border-t border-line pt-5 text-xs leading-relaxed text-muted"
      style={{ animationDelay: '560ms' }}
    >
      <p>
        {t('footer.assumptions', {
          gel: config.gelCarbs,
          bottle: config.bottleMl,
        })}
      </p>
      <p className="mt-2">{t('footer.privacy')}</p>
    </footer>
  )
}
