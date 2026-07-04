import { Component, type ErrorInfo, type ReactNode } from 'react'

const TEXT = {
  en: {
    title: 'Something went wrong',
    body: 'FuelCast hit an unexpected error. Reloading usually fixes it — your inputs live in the URL, so nothing is lost.',
    reload: 'Reload',
    home: 'Back to calculator',
  },
  de: {
    title: 'Etwas ist schiefgelaufen',
    body: 'FuelCast ist auf einen unerwarteten Fehler gestoßen. Ein Neuladen behebt das meist — deine Eingaben stecken in der URL, es geht nichts verloren.',
    reload: 'Neu laden',
    home: 'Zurück zum Rechner',
  },
}

/** Best-effort language pick without depending on the i18n provider (which may be what crashed) */
function pickLang(): 'en' | 'de' {
  try {
    const stored = localStorage.getItem('fuelcast-lang')
    if (stored === 'de' || stored === 'en') return stored
  } catch {
    /* localStorage can throw in some privacy modes */
  }
  return document.documentElement.lang === 'de' ? 'de' : 'en'
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('FuelCast crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const t = TEXT[pickLang()]
    const home = `${import.meta.env.BASE_URL}${pickLang()}/`

    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-14 place-items-center rounded-xl bg-ink text-accent dark:bg-raised">
            <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
              <path d="M17.5 4 8 18h6l-1.5 10L22 14h-6l1.5-10z" fill="currentColor" />
            </svg>
          </span>
          <h1 className="head mt-5 text-xl text-ink">{t.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t.body}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="head rounded-xl bg-accent px-5 py-3 text-xs text-accent-ink transition-all hover:brightness-110 active:scale-[0.98]"
            >
              {t.reload}
            </button>
            <a
              href={home}
              className="head rounded-xl border border-line-strong bg-surface px-5 py-3 text-xs text-ink transition-colors hover:border-accent"
            >
              {t.home}
            </a>
          </div>
        </div>
      </div>
    )
  }
}
