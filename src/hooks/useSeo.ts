import { useEffect } from 'react'
import type { Lang } from '../lib/i18n'

const ORIGIN = 'https://fuelcast.run'

/** Per-page <title> so tabs, bookmarks and JS-rendering crawlers get the right label */
const TITLES: Record<Lang, Record<string, string>> = {
  en: {
    '': 'FuelCast — Endurance Fueling Calculator',
    'know-how': 'Know-how — FuelCast',
    imprint: 'Imprint — FuelCast',
    privacy: 'Privacy Policy — FuelCast',
  },
  de: {
    '': 'FuelCast — Ausdauer-Fueling-Rechner',
    'know-how': 'Know-how — FuelCast',
    imprint: 'Impressum — FuelCast',
    privacy: 'Datenschutz — FuelCast',
  },
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    if (hreflang) el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertMeta(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.content = content
}

/**
 * Keeps title, canonical, og:url and hreflang alternates in sync with the
 * current route. The static index.html only carries defaults; this fills in
 * the correct per-page values once React renders (Google executes JS).
 */
export function useSeo(lang: Lang, pathname: string) {
  useEffect(() => {
    const segment = pathname
      .replace(new RegExp(`^/${lang}/?`), '')
      .replace(/\/$/, '')
    const path = segment ? `/${segment}` : '/'

    document.title = TITLES[lang][segment] ?? TITLES[lang]['']

    const canonical = `${ORIGIN}/${lang}${path}`
    upsertLink('canonical', canonical)
    upsertMeta('og:url', canonical)

    upsertLink('alternate', `${ORIGIN}/en${path}`, 'en')
    upsertLink('alternate', `${ORIGIN}/de${path}`, 'de')
    upsertLink('alternate', `${ORIGIN}/en${path}`, 'x-default')
  }, [lang, pathname])
}
