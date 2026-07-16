import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { PlanConfig, PlanInput, Ratio } from '../lib/fueling'
import type { CalculatorMode } from '../hooks/useBuildMode'
import { useI18n } from '../lib/i18n'
import { AssumptionsControl } from './AssumptionsControl'
import { FuelSourceControl } from './FuelSourceControl'
import { HydrationControl } from './HydrationControl'
import { RatioControl } from './RatioControl'
import { Section } from './Section'

interface AdvancedOptionsProps {
  input: PlanInput
  mode: CalculatorMode
  advanced: boolean
  onToggle: () => void
  onPatch: (partial: Partial<PlanInput>) => void
  onPatchConfig: (patch: Partial<PlanConfig>) => void
  /** First step number — advanced sections continue the numbering */
  startStep: number
}

export function AdvancedOptions({
  input,
  mode,
  advanced,
  onToggle,
  onPatch,
  onPatchConfig,
  startStep,
}: AdvancedOptionsProps) {
  const { t } = useI18n()
  // In Build mode the gear presets and fuel-source split are chosen per item,
  // so those sections are hidden and the remaining numbering stays gapless.
  const showGearSections = mode === 'auto'
  let step = startStep
  const nextStep = () => step++
  return (
    <div className="rise" style={{ animationDelay: '320ms' }}>
      <button
        type="button"
        aria-expanded={advanced}
        onClick={onToggle}
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
          advanced ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="space-y-6 overflow-hidden">
          <Section step={nextStep()} title={t('section.ratio')}>
            <RatioControl
              value={input.ratio}
              onChange={(ratio: Ratio) => onPatch({ ratio })}
            />
          </Section>
          {showGearSections && (
            <Section step={nextStep()} title={t('section.fuelSource')}>
              <FuelSourceControl
                value={input.fuelSource}
                onChange={(fuelSource) => onPatch({ fuelSource })}
              />
            </Section>
          )}
          <Section step={nextStep()} title={t('section.hydration')}>
            <HydrationControl
              value={input.config.temperature}
              onChange={(temperature) => onPatchConfig({ temperature })}
            />
          </Section>
          {showGearSections && (
            <Section step={nextStep()} title={t('section.gear')}>
              <AssumptionsControl config={input.config} onChange={onPatchConfig} />
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
