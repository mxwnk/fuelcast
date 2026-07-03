import { BadgeCheck, BotOff, Timer, WifiOff } from 'lucide-react'
import { useI18n } from '../lib/i18n'

const PROMISES = [
  { icon: Timer, key: 'promise.fast' },
  { icon: BadgeCheck, key: 'promise.free' },
  { icon: BotOff, key: 'promise.noai' },
  { icon: WifiOff, key: 'promise.offline' },
] as const

export function Hero() {
  const { t } = useI18n()
  return (
    <div className="rise mb-8" data-print="hide">
      <h1 className="head text-3xl leading-none tracking-tight sm:text-4xl">
        {t('hero.title.plain')}
        <span className="text-accent">{t('hero.title.accent')}</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        {t('hero.description')}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {PROMISES.map(({ icon: Icon, key }) => (
          <li
            key={key}
            className="data flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted"
          >
            <Icon className="size-3.5 text-accent" />
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  )
}
