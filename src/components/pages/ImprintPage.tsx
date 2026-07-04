import { useMemo } from 'react'
import { useI18n } from '../../lib/i18n'

/** Base64-encoded to avoid plain-text scraping from the public repo */
const IMPRINT_DATA = 'eyJuYW1lIjoiTWF4aW1pbGlhbiBXaW5rZWxtYW5uIiwiYWRkcmVzcyI6IkZyYW5rZW5hbGJzdHIuIDgsIDkxMDU2IEVybGFuZ2VuIiwiZW1haWwiOiJoZWxsb0BmdWVsY2FzdC5ydW4ifQ=='

interface ImprintInfo {
  name: string
  address: string
  email: string
}

function decodeImprint(): ImprintInfo {
  return JSON.parse(atob(IMPRINT_DATA)) as ImprintInfo
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-xl border border-line bg-surface overflow-hidden">
      <div className="head border-b border-line bg-accent/10 px-4 py-2.5 text-[11px] text-ink">
        {title}
      </div>
      <div className="space-y-3 px-4 py-4 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </div>
  )
}

export function ImprintPage() {
  const { t } = useI18n()
  const info = useMemo(decodeImprint, [])

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-20">
      <div>
        <h1 className="head text-2xl sm:text-3xl">{t('footer.imprint')}</h1>
        <p className="data mt-1 text-[11px] uppercase tracking-widest text-muted">
          {t('imprint.updated')}
        </p>
      </div>

      <Section title={t('imprint.legal.title')}>
        <address className="not-italic text-ink">
          <p className="font-semibold">{info.name}</p>
          <p>{info.address}</p>
          <p>Deutschland</p>
        </address>
        <div>
          <p className="head text-[11px] text-ink">{t('imprint.contact')}</p>
          <p>
            E-Mail:{' '}
            <a
              href={`mailto:${info.email}`}
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              {info.email}
            </a>
          </p>
        </div>
        <div>
          <p className="head text-[11px] text-ink">{t('imprint.responsible')}</p>
          <address className="not-italic">
            <p>{info.name}</p>
            <p>{info.address}</p>
          </address>
        </div>
      </Section>

      <Section title={t('imprint.liability.title')}>
        <p>{t('imprint.liability.p1')}</p>
        <p>{t('imprint.liability.p2')}</p>
      </Section>

      <Section title={t('imprint.links.title')}>
        <p>{t('imprint.links.p1')}</p>
        <p>{t('imprint.links.p2')}</p>
      </Section>

      <Section title={t('imprint.copyright.title')}>
        <p>{t('imprint.copyright.p1')}</p>
        <p>{t('imprint.copyright.p2')}</p>
      </Section>

      <p className="text-center text-xs text-muted">
        {t('imprint.contact')}:{' '}
        <a
          href={`mailto:${info.email}`}
          className="font-semibold text-accent hover:underline"
        >
          {info.email}
        </a>
      </p>
    </div>
  )
}
