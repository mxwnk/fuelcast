import { useOutletContext } from 'react-router-dom'
import type { CalculatorContext } from '../../App'
import { BuildPanel } from '../BuildPanel'
import { ControlPanel } from '../ControlPanel'
import { Hero } from '../Hero'
import { ModeToggle } from '../ModeToggle'
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
    mode,
    setMode,
    addBuildItem,
    updateBuildItem,
    removeBuildItem,
  } = useOutletContext<CalculatorContext>()

  return (
    <>
      <Hero />
      <div className="mb-6 flex justify-center lg:justify-start">
        <ModeToggle mode={mode} onChange={setMode} />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <ControlPanel
          input={input}
          mode={mode}
          advanced={advanced}
          onToggleAdvanced={toggleAdvanced}
          onPatch={patch}
          onPatchLeg={patchLeg}
          onPatchConfig={patchConfig}
          onApplyPreset={applyPreset}
        />
        {mode === 'auto' ? (
          <ResultsColumn input={input} plan={plan} advanced={advanced} />
        ) : (
          <BuildPanel
            input={input}
            plan={plan}
            items={input.buildItems}
            config={input.config}
            onAddItem={addBuildItem}
            onUpdateItem={updateBuildItem}
            onRemoveItem={removeBuildItem}
          />
        )}
      </div>
    </>
  )
}
