import { useMemo } from 'react'
import { useI18n } from '../../lib/i18n'

/** Base64-encoded to avoid plain-text scraping from the public repo */
const IMPRINT_DATA = 'eyJuYW1lIjoiTWF4aW1pbGlhbiBXaW5rZWxtYW5uIiwiYWRkcmVzcyI6IkZyYW5rZW5hbGJzdHIuIDgsIDkxMDU2IEVybGFuZ2VuIiwiZW1haWwiOiJpbmZvQGZ1ZWxjYXN0LnJ1biJ9'

interface ImprintInfo {
  name: string
  address: string
  email: string
}

function decodeImprint(): ImprintInfo {
  return JSON.parse(atob(IMPRINT_DATA)) as ImprintInfo
}

export function ImprintPage() {
  const { t } = useI18n()
  const info = useMemo(decodeImprint, [])

  return (
    <div className="mx-auto max-w-2xl pb-20">
      <h1 className="head text-2xl sm:text-3xl">{t('footer.imprint')}</h1>

      <div className="mt-6 space-y-1 text-sm leading-relaxed text-ink">
        <p className="font-semibold">{info.name}</p>
        <p>{info.address}</p>
        <p className="mt-3">
          <a
            href={`mailto:${info.email}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            {info.email}
          </a>
        </p>
      </div>

      <div className="mt-8 space-y-2 text-sm leading-relaxed text-muted">
        <p className="head text-xs text-ink">{t('footer.imprint.liability')}</p>
        <p>{t('footer.imprint.liabilityText')}</p>
      </div>
    </div>
  )
}
