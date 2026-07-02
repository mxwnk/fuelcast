import {
  BadgeCheck,
  BotOff,
  ChevronDown,
  SlidersHorizontal,
  Timer,
  WifiOff,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AssumptionsControl } from './components/AssumptionsControl'
import { CarbControl } from './components/CarbControl'
import { DurationControl } from './components/DurationControl'
import { ExportBar } from './components/ExportBar'
import { FuelSourceControl } from './components/FuelSourceControl'
import { Header } from './components/Header'
import { HydrationControl } from './components/HydrationControl'
import { RacePresets } from './components/RacePresets'
import { RatioControl } from './components/RatioControl'
import { ResultsPanel } from './components/ResultsPanel'
import { SportSelector } from './components/SportSelector'
import { Timeline } from './components/Timeline'
import { TriLegsControl } from './components/TriLegsControl'
import type {
  LegInput,
  LegKey,
  PlanConfig,
  PlanInput,
  RacePreset,
} from './lib/fueling'
import { computePlan, DEFAULT_CONFIG, DEFAULT_TRI_LEGS } from './lib/fueling'
import { hasAdvancedParams, parseShareUrl } from './lib/share'

const DEFAULT_INPUT: PlanInput = {
  sport: 'triathlon',
  durationMin: 300,
  carbsPerHour: 90,
  triLegs: DEFAULT_TRI_LEGS,
  ratio: { glucose: 1, fructose: 0.8 },
  useGels: true,
  config: DEFAULT_CONFIG,
}

const PROMISES = [
  { icon: Timer, text: 'Race plan in 30 seconds' },
  { icon: BadgeCheck, text: 'No account · no subscription' },
  { icon: BotOff, text: 'No AI coach — just sport science' },
  { icon: WifiOff, text: 'Works offline · nothing stored' },
]

function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('fuelcast-theme', dark ? 'dark' : 'light')
  }, [dark])
  return { dark, toggle: () => setDark((d) => !d) }
}

interface SectionProps {
  step: number
  title: string
  delay?: number
  children: React.ReactNode
}

function Section({ step, title, delay = 0, children }: SectionProps) {
  return (
    <section className={delay ? 'rise' : ''} style={{ animationDelay: `${delay}ms` }}>
      <h2 className="tick-label head text-xs text-muted">
        <span className="data text-accent">0{step}</span> {title}
      </h2>
      <div className="mt-2.5 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        {children}
      </div>
    </section>
  )
}

export default function App() {
  const { dark, toggle } = useTheme()
  const [input, setInput] = useState<PlanInput>(() => ({
    ...DEFAULT_INPUT,
    ...parseShareUrl(location.search),
  }))
  const [advanced, setAdvanced] = useState(
    () =>
      hasAdvancedParams(location.search) ||
      localStorage.getItem('fuelcast-advanced') === '1',
  )
  const plan = useMemo(() => computePlan(input), [input])
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('fuelcast-advanced', advanced ? '1' : '0')
  }, [advanced])

  const patch = (partial: Partial<PlanInput>) =>
    setInput((prev) => ({ ...prev, ...partial }))

  const patchLeg = (key: LegKey, legPatch: Partial<LegInput>) =>
    setInput((prev) => ({
      ...prev,
      triLegs: {
        ...prev.triLegs,
        [key]: { ...prev.triLegs[key], ...legPatch },
      },
    }))

  const patchConfig = (configPatch: Partial<PlanConfig>) =>
    setInput((prev) => ({ ...prev, config: { ...prev.config, ...configPatch } }))

  const applyPreset = (preset: RacePreset) =>
    setInput((prev) => {
      if (preset.legs) {
        return {
          ...prev,
          triLegs: {
            swim: { ...prev.triLegs.swim, durationMin: preset.legs.swim },
            bike: { ...prev.triLegs.bike, durationMin: preset.legs.bike },
            run: { ...prev.triLegs.run, durationMin: preset.legs.run },
          },
        }
      }
      return { ...prev, durationMin: preset.durationMin ?? prev.durationMin }
    })

  const isTri = input.sport === 'triathlon'
  const advancedStart = isTri ? 3 : 4

  return (
    <div className="min-h-screen">
      <Header dark={dark} onToggleTheme={toggle} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
        <div className="rise mb-8">
          <h1 className="head text-3xl leading-none tracking-tight sm:text-4xl">
            Never bonk<span className="text-accent"> again.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Pick your race, set a carb target, done — hourly fueling targets, a
            product plan, a DIY bottle recipe and a race timeline.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="data flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted"
              >
                <Icon className="size-3.5 text-accent" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          {/* Controls */}
          <div className="space-y-6">
            <div className="rise" style={{ animationDelay: '80ms' }}>
              <Section step={1} title="Sport">
                <SportSelector
                  value={input.sport}
                  onChange={(sport) => patch({ sport })}
                />
              </Section>
            </div>

            {isTri ? (
              <div className="rise" style={{ animationDelay: '160ms' }}>
                <Section step={2} title="Race legs">
                  <RacePresets input={input} onApply={applyPreset} />
                  <TriLegsControl legs={input.triLegs} onChange={patchLeg} />
                </Section>
              </div>
            ) : (
              <>
                <div className="rise" style={{ animationDelay: '160ms' }}>
                  <Section step={2} title="Race duration">
                    <RacePresets input={input} onApply={applyPreset} />
                    <DurationControl
                      value={input.durationMin}
                      onChange={(durationMin) => patch({ durationMin })}
                    />
                  </Section>
                </div>
                <div className="rise" style={{ animationDelay: '240ms' }}>
                  <Section step={3} title="Carb target">
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
                onClick={() => setAdvanced((a) => !a)}
                className="head flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-4 py-3 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <SlidersHorizontal className="size-4" />
                {advanced ? 'Hide advanced options' : 'Advanced options'}
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
                  <Section step={advancedStart} title="Glucose : Fructose">
                    <RatioControl
                      value={input.ratio}
                      onChange={(ratio) => patch({ ratio })}
                    />
                  </Section>
                  <Section step={advancedStart + 1} title="Fuel source">
                    <FuelSourceControl
                      useGels={input.useGels}
                      onChange={(useGels) => patch({ useGels })}
                    />
                  </Section>
                  <Section step={advancedStart + 2} title="Hydration & sodium">
                    <HydrationControl
                      value={input.config.temperature}
                      onChange={(temperature) => patchConfig({ temperature })}
                    />
                  </Section>
                  <Section step={advancedStart + 3} title="Your gear">
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
            Assumptions: 1 gel ≈ {input.config.gelCarbs} g carbs · 1 bottle ={' '}
            {input.config.bottleMl} ml · maltodextrin counts as glucose. FuelCast
            is a planning aid, not medical or nutritional advice — always test
            your fueling strategy in training.
          </p>
          <p className="mt-2">
            Free, open and stateless: no account, no tracking, no data leaves
            your device — your plan lives entirely in the URL.
          </p>
        </footer>
      </main>
    </div>
  )
}
