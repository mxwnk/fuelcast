import { useMemo } from 'react'
import { useI18n } from '../../lib/i18n'

const IMPRINT_DATA = 'eyJuYW1lIjoiTWF4aW1pbGlhbiBXaW5rZWxtYW5uIiwiYWRkcmVzcyI6IkZyYW5rZW5hbGJzdHIuIDgsIDkxMDU2IEVybGFuZ2VuIiwiZW1haWwiOiJpbmZvQGZ1ZWxjYXN0LnJ1biJ9'

function decodeEmail(): string {
  const info = JSON.parse(atob(IMPRINT_DATA)) as { email: string }
  return info.email
}

export function PrivacyPage() {
  const { t } = useI18n()
  const email = useMemo(decodeEmail, [])

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-20">
      <div>
        <h1 className="head text-2xl sm:text-3xl">{t('privacy.title')}</h1>
        <p className="data mt-1 text-[11px] uppercase tracking-widest text-muted">
          {t('privacy.updated')}
        </p>
      </div>

      <div className="rounded-xl border border-line bg-surface overflow-hidden">
        <div className="head border-b border-line bg-accent/10 px-4 py-2.5 text-[11px] text-ink">
          FuelCast
        </div>
        <div className="space-y-3 px-4 py-4 text-sm leading-relaxed text-muted">
          <p>{t('privacy.p1')}</p>
          <p>{t('privacy.p2')}</p>
          <p>{t('privacy.p3')}</p>
          <p>{t('privacy.p4')}</p>
          <p>{t('privacy.p5')}</p>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        {t('imprint.contact')}:{' '}
        <a
          href={`mailto:${email}`}
          className="font-semibold text-accent hover:underline"
        >
          {email}
        </a>
      </p>
    </div>
  )
}
