import type {
  LegInput,
  LegKey,
  PlanConfig,
  PlanInput,
  RacePreset,
} from '../lib/fueling'
import type { CalculatorMode } from '../hooks/useBuildMode'
import { useI18n } from '../lib/i18n'
import { AdvancedOptions } from './AdvancedOptions'
import { CarbControl } from './CarbControl'
import { DurationControl } from './DurationControl'
import { RacePresets } from './RacePresets'
import { Section } from './Section'
import { SportSelector } from './SportSelector'
import { TriLegsControl } from './TriLegsControl'

interface ControlPanelProps {
  input: PlanInput
  mode: CalculatorMode
  advanced: boolean
  onToggleAdvanced: () => void
  onPatch: (partial: Partial<PlanInput>) => void
  onPatchLeg: (key: LegKey, patch: Partial<LegInput>) => void
  onPatchConfig: (patch: Partial<PlanConfig>) => void
  onApplyPreset: (preset: RacePreset) => void
}

export function ControlPanel({
  input,
  mode,
  advanced,
  onToggleAdvanced,
  onPatch,
  onPatchLeg,
  onPatchConfig,
  onApplyPreset,
}: ControlPanelProps) {
  const { t } = useI18n()
  const isTri = input.sport === 'triathlon'

  return (
    <div className="min-w-0 space-y-6" data-print="hide">
      <div className="rise" style={{ animationDelay: '80ms' }}>
        <Section step={1} title={t('section.sport')}>
          <SportSelector value={input.sport} onChange={(sport) => onPatch({ sport })} />
        </Section>
      </div>

      {isTri ? (
        <div className="rise" style={{ animationDelay: '160ms' }}>
          <Section step={2} title={t('section.legs')}>
            <RacePresets input={input} onApply={onApplyPreset} />
            <TriLegsControl legs={input.triLegs} onChange={onPatchLeg} />
          </Section>
        </div>
      ) : (
        <>
          <div className="rise" style={{ animationDelay: '160ms' }}>
            <Section step={2} title={t('section.duration')}>
              <RacePresets input={input} onApply={onApplyPreset} />
              <DurationControl
                value={input.durationMin}
                onChange={(durationMin) => onPatch({ durationMin })}
              />
            </Section>
          </div>
          <div className="rise" style={{ animationDelay: '240ms' }}>
            <Section step={3} title={t('section.carbs')}>
              <CarbControl
                value={input.carbsPerHour}
                onChange={(carbsPerHour) => onPatch({ carbsPerHour })}
              />
            </Section>
          </div>
        </>
      )}

      <AdvancedOptions
        input={input}
        mode={mode}
        advanced={advanced}
        onToggle={onToggleAdvanced}
        onPatch={onPatch}
        onPatchConfig={onPatchConfig}
        startStep={isTri ? 3 : 4}
      />
    </div>
  )
}
