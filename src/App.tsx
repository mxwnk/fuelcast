import { ControlPanel } from './components/ControlPanel'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ResultsColumn } from './components/ResultsColumn'
import { useAdvancedMode } from './hooks/useAdvancedMode'
import { usePlanInput } from './hooks/usePlanInput'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { dark, toggle } = useTheme()
  const { advanced, toggleAdvanced } = useAdvancedMode()
  const { input, plan, patch, patchLeg, patchConfig, applyPreset } = usePlanInput()

  return (
    <div className="min-h-screen">
      <Header dark={dark} onToggleTheme={toggle} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
        <Hero />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
          <ControlPanel
            input={input}
            advanced={advanced}
            onToggleAdvanced={toggleAdvanced}
            onPatch={patch}
            onPatchLeg={patchLeg}
            onPatchConfig={patchConfig}
            onApplyPreset={applyPreset}
          />
          <ResultsColumn input={input} plan={plan} advanced={advanced} />
        </div>

        <Footer config={input.config} />
      </main>
    </div>
  )
}
