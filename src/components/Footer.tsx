import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { PlanConfig } from '../lib/fueling'
import { useI18n } from '../lib/i18n'

const REPO_URL = 'https://github.com/mxwnk/fuelcast'

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.22.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5Z" />
    </svg>
  )
}

interface FooterProps {
  config: PlanConfig
}

export function Footer({ config }: FooterProps) {
  const { lang, t } = useI18n()
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
      <p className="mt-2">{t('footer.disclaimer')}</p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-medium transition-colors hover:border-accent hover:text-ink"
          >
            <GithubMark className="size-4" />
            {t('footer.source')}
          </a>
          <Link
            to={`/${lang}/imprint`}
            className="font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
          >
            {t('footer.imprint')}
          </Link>
        </div>
        <p className="flex items-center gap-1.5">
          <span>© {new Date().getFullYear()} FuelCast · Made with</span>
          <Heart className="size-3.5 fill-accent text-accent" />
          <span>
            by{' '}
            <a
              href="https://github.com/mxwnk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline-offset-2 hover:text-accent hover:underline"
            >
              mxwnk
            </a>
          </span>
        </p>
      </div>
    </footer>
  )
}
