import { useState } from 'react'
import { ControlPanel } from './components/ControlPanel'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ImprintPage } from './components/pages/ImprintPage'
import { ResultsColumn } from './components/ResultsColumn'
import { SciencePage } from './components/pages/SciencePage'
import { useAdvancedMode } from './hooks/useAdvancedMode'
import { usePlanInput } from './hooks/usePlanInput'
import { useTheme } from './hooks/useTheme'

export type View = 'calculator' | 'science' | 'imprint'

export default function App() {
  const { dark, toggle } = useTheme()
  const { advanced, toggleAdvanced } = useAdvancedMode()
  const { input, plan, patch, patchLeg, patchConfig, applyPreset } = usePlanInput()
  const [view, setView] = useState<View>('calculator')

  return (
    <div className="min-h-screen">
      <Header dark={dark} view={view} onToggleTheme={toggle} onChangeView={setView} />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:pt-10">
        {view === 'calculator' && (
          <>
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
          </>
        )}
        {view === 'science' && <SciencePage />}
        {view === 'imprint' && <ImprintPage />}

        <Footer config={input.config} onNavigate={setView} />
      </main>
    </div>
  )
}
