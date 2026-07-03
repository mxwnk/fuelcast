import { useOutletContext } from 'react-router-dom'
import type { CalculatorContext } from '../../App'
import { ControlPanel } from '../ControlPanel'
import { Hero } from '../Hero'
import { ResultsColumn } from '../ResultsColumn'

export function CalculatorPage() {
  const {
    input,
    plan,
    patch,
    patchLeg,
    patchConfig,
    applyPreset,
    advanced,
    toggleAdvanced,
  } = useOutletContext<CalculatorContext>()

  return (
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
  )
}
