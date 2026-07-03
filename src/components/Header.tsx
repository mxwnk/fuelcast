import { Moon, Sun, Zap } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { LANGS, useI18n } from '../lib/i18n'

interface HeaderProps {
  dark: boolean
  onToggleTheme: () => void
}

const NAV_ITEMS = [
  { key: 'nav.calculator', path: '' },
  { key: 'nav.science', path: 'science' },
] as const

export function Header({ dark, onToggleTheme }: HeaderProps) {
  const { lang, setLang, t } = useI18n()

  return (
    <header className="rise sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={`/${lang}`} className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-accent dark:bg-raised">
            <Zap className="size-4.5 fill-accent" strokeWidth={1.5} />
          </span>
          <div className="text-left leading-none">
            <span className="head text-lg tracking-tight">
              Fuel<span className="text-accent">Cast</span>
            </span>
            <p className="data mt-0.5 text-[11px] uppercase tracking-widest text-muted">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Page navigation */}
          <nav
            aria-label="Navigation"
            className="flex h-9 items-center rounded-full border border-line bg-surface p-1"
          >
            {NAV_ITEMS.map(({ key, path }) => (
              <NavLink
                key={key}
                to={path ? `/${lang}/${path}` : `/${lang}`}
                end={path === ''}
                className={({ isActive }) =>
                  `grid h-7 place-items-center rounded-full px-3 text-xs font-semibold transition-all duration-150 ${
                    isActive ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {t(key)}
              </NavLink>
            ))}
          </nav>

          {/* Language toggle */}
          <div
            role="radiogroup"
            aria-label={t('lang.switch')}
            className="flex h-9 items-center rounded-full border border-line bg-surface p-1"
          >
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={lang === code}
                onClick={() => setLang(code)}
                className={`data grid h-7 place-items-center rounded-full px-2 text-xs font-bold uppercase transition-all duration-150 ${
                  lang === code ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
            className="group grid size-9 place-items-center rounded-full border border-line bg-surface transition-colors hover:border-accent"
          >
            <span className="transition-transform duration-300 group-hover:rotate-45 group-active:scale-90">
              {dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </span>
          </button>
        </div>
      </div>
      <div className="hazard h-1" />
    </header>
  )
}
