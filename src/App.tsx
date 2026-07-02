import { useEffect, useMemo, useRef, useState } from 'react'
import { CarbControl } from './components/CarbControl'
import { DurationControl } from './components/DurationControl'
import { ExportBar } from './components/ExportBar'
import { Header } from './components/Header'
import { RatioControl } from './components/RatioControl'
import { ResultsPanel } from './components/ResultsPanel'
import { SportSelector } from './components/SportSelector'
import { Timeline } from './components/Timeline'
import { TriLegsControl } from './components/TriLegsControl'
import type { LegInput, LegKey, PlanInput } from './lib/fueling'
import { computePlan, DEFAULT_TRI_LEGS } from './lib/fueling'
import { parseShareUrl } from './lib/share'

const DEFAULT_INPUT: PlanInput = {
  sport: 'triathlon',
  durationMin: 300,
  carbsPerHour: 90,
  triLegs: DEFAULT_TRI_LEGS,
  ratio: { glucose: 1, fructose: 0.8 },
}

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
  delay: number
  children: React.ReactNode
}

function Section({ step, title, delay, children }: SectionProps) {
  return (
    <section className="rise" style={{ animationDelay: `${delay}ms` }}>
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
  const plan = useMemo(() => computePlan(input), [input])
  const exportRef = useRef<HTMLDivElement>(null)

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

  const isTri = input.sport === 'triathlon'

  return (
    <div className="min-h-screen">
      <Header dark={dark} onToggleTheme={toggle} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
        <div className="rise mb-8">
          <h1 className="head text-3xl leading-none tracking-tight sm:text-4xl">
            Never bonk<span className="text-accent"> again.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Dial in your race, get your hourly glucose–fructose targets, a
            product plan, a DIY bottle recipe and a minute-by-minute fueling
            timeline.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          {/* Controls */}
          <div className="space-y-6">
            <Section step={1} title="Sport" delay={80}>
              <SportSelector
                value={input.sport}
                onChange={(sport) => patch({ sport })}
              />
            </Section>

            {isTri ? (
              <Section step={2} title="Race legs" delay={160}>
                <TriLegsControl legs={input.triLegs} onChange={patchLeg} />
              </Section>
            ) : (
              <>
                <Section step={2} title="Race duration" delay={160}>
                  <DurationControl
                    value={input.durationMin}
                    onChange={(durationMin) => patch({ durationMin })}
                  />
                </Section>
                <Section step={3} title="Carb target" delay={240}>
                  <CarbControl
                    value={input.carbsPerHour}
                    onChange={(carbsPerHour) => patch({ carbsPerHour })}
                  />
                </Section>
              </>
            )}

            <Section
              step={isTri ? 3 : 4}
              title="Glucose : Fructose"
              delay={isTri ? 240 : 320}
            >
              <RatioControl
                value={input.ratio}
                onChange={(ratio) => patch({ ratio })}
              />
            </Section>
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div
              ref={exportRef}
              className="rise space-y-4 bg-bg"
              style={{ animationDelay: '400ms' }}
            >
              <ResultsPanel input={input} plan={plan} />
              <Timeline plan={plan} />
            </div>
            <div className="rise" style={{ animationDelay: '480ms' }}>
              <ExportBar input={input} exportTarget={exportRef} />
            </div>
          </div>
        </div>

        <footer
          className="rise mt-14 border-t border-line pt-5 text-[11px] leading-relaxed text-muted"
          style={{ animationDelay: '560ms' }}
        >
          <p>
            Assumptions: 1 gel ≈ 25 g carbs · 1 bottle = 750 ml · maltodextrin
            counts as glucose. FuelCast is a planning aid, not medical or
            nutritional advice — always test your fueling strategy in training.
          </p>
        </footer>
      </main>
    </div>
  )
}
