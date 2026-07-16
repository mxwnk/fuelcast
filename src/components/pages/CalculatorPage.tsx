import { useOutletContext } from 'react-router-dom'
import type { CalculatorContext } from '../../App'
import { useI18n } from '../../lib/i18n'
import { BuildPanel } from '../BuildPanel'
import { ControlPanel } from '../ControlPanel'
import { Hero } from '../Hero'
import { ModeToggle } from '../ModeToggle'
import { ResultsColumn } from '../ResultsColumn'

export function CalculatorPage() {
  const { t } = useI18n()
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
        <div className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-4" data-print="hide">
            <span className="head text-sm uppercase tracking-wider text-muted">
              {t('mode.label')}
            </span>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
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
      </div>
    </>
  )
}
