import {
  BadgeCheck,
  BotOff,
  ChevronDown,
  SlidersHorizontal,
  Timer,
  WifiOff,
} from 'lucide-react'
import { useRef } from 'react'
import { AssumptionsControl } from './components/AssumptionsControl'
import { CarbControl } from './components/CarbControl'
import { DurationControl } from './components/DurationControl'
import { ExportBar } from './components/ExportBar'
import { FuelSourceControl } from './components/FuelSourceControl'
import { Header } from './components/Header'
import { HydrationControl } from './components/HydrationControl'
import { RacePresets } from './components/RacePresets'
import { RatioControl } from './components/RatioControl'
import { ResultsPanel } from './components/results/ResultsPanel'
import { Section } from './components/Section'
import { SportSelector } from './components/SportSelector'
import { Timeline } from './components/Timeline'
import { TriLegsControl } from './components/TriLegsControl'
import { useAdvancedMode } from './hooks/useAdvancedMode'
import { usePlanInput } from './hooks/usePlanInput'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './lib/i18n'

const PROMISES = [
  { icon: Timer, key: 'promise.fast' },
  { icon: BadgeCheck, key: 'promise.free' },
  { icon: BotOff, key: 'promise.noai' },
  { icon: WifiOff, key: 'promise.offline' },
] as const

export default function App() {
  const { t } = useI18n()
  const { dark, toggle } = useTheme()
  const { advanced, toggleAdvanced } = useAdvancedMode()
  const { input, plan, patch, patchLeg, patchConfig, applyPreset } = usePlanInput()
  const exportRef = useRef<HTMLDivElement>(null)

  const isTri = input.sport === 'triathlon'
  const advancedStart = isTri ? 3 : 4

  return (
    <div className="min-h-screen">
      <Header dark={dark} onToggleTheme={toggle} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
        <div className="rise mb-8">
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

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          {/* Controls */}
          <div className="space-y-6">
            <div className="rise" style={{ animationDelay: '80ms' }}>
              <Section step={1} title={t('section.sport')}>
                <SportSelector
                  value={input.sport}
                  onChange={(sport) => patch({ sport })}
                />
              </Section>
            </div>

            {isTri ? (
              <div className="rise" style={{ animationDelay: '160ms' }}>
                <Section step={2} title={t('section.legs')}>
                  <RacePresets input={input} onApply={applyPreset} />
                  <TriLegsControl legs={input.triLegs} onChange={patchLeg} />
                </Section>
              </div>
            ) : (
              <>
                <div className="rise" style={{ animationDelay: '160ms' }}>
                  <Section step={2} title={t('section.duration')}>
                    <RacePresets input={input} onApply={applyPreset} />
                    <DurationControl
                      value={input.durationMin}
                      onChange={(durationMin) => patch({ durationMin })}
                    />
                  </Section>
                </div>
                <div className="rise" style={{ animationDelay: '240ms' }}>
                  <Section step={3} title={t('section.carbs')}>
                    <CarbControl
                      value={input.carbsPerHour}
                      onChange={(carbsPerHour) => patch({ carbsPerHour })}
                    />
                  </Section>
                </div>
              </>
            )}

            {/* Advanced options */}
            <div className="rise" style={{ animationDelay: '320ms' }}>
              <button
                type="button"
                aria-expanded={advanced}
                onClick={toggleAdvanced}
                className="head flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-4 py-3 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <SlidersHorizontal className="size-4" />
                {advanced ? t('advanced.hide') : t('advanced.show')}
                <ChevronDown
                  className={`size-4 transition-transform duration-300 ${
                    advanced ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  advanced
                    ? 'mt-6 grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="space-y-6 overflow-hidden">
                  <Section step={advancedStart} title={t('section.ratio')}>
                    <RatioControl
                      value={input.ratio}
                      onChange={(ratio) => patch({ ratio })}
                    />
                  </Section>
                  <Section step={advancedStart + 1} title={t('section.fuelSource')}>
                    <FuelSourceControl
                      useGels={input.useGels}
                      onChange={(useGels) => patch({ useGels })}
                    />
                  </Section>
                  <Section step={advancedStart + 2} title={t('section.hydration')}>
                    <HydrationControl
                      value={input.config.temperature}
                      onChange={(temperature) => patchConfig({ temperature })}
                    />
                  </Section>
                  <Section step={advancedStart + 3} title={t('section.gear')}>
                    <AssumptionsControl config={input.config} onChange={patchConfig} />
                  </Section>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div
              ref={exportRef}
              className="rise space-y-4 bg-bg"
              style={{ animationDelay: '400ms' }}
            >
              <ResultsPanel input={input} plan={plan} advanced={advanced} />
              <Timeline plan={plan} />
            </div>
            <div className="rise" style={{ animationDelay: '480ms' }}>
              <ExportBar input={input} exportTarget={exportRef} />
            </div>
          </div>
        </div>

        <footer
          className="rise mt-14 border-t border-line pt-5 text-xs leading-relaxed text-muted"
          style={{ animationDelay: '560ms' }}
        >
          <p>
            {t('footer.assumptions', {
              gel: input.config.gelCarbs,
              bottle: input.config.bottleMl,
            })}
          </p>
          <p className="mt-2">{t('footer.privacy')}</p>
        </footer>
      </main>
    </div>
  )
}
