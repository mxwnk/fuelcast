import { Bike, Footprints, Waves } from 'lucide-react'
import type { LegInput, LegKey } from '../lib/fueling'
import {
  CARBS_MAX,
  CARBS_MIN,
  formatDuration,
  LEG_LABELS,
  TRI_LEG_BOUNDS,
} from '../lib/fueling'
import { NumberField, Slider } from './Slider'

const LEG_ICONS: Record<LegKey, React.ReactNode> = {
  swim: <Waves className="size-4" />,
  bike: <Bike className="size-4" />,
  run: <Footprints className="size-4" />,
}

interface TriLegsControlProps {
  legs: Record<LegKey, LegInput>
  onChange: (key: LegKey, patch: Partial<LegInput>) => void
}

export function TriLegsControl({ legs, onChange }: TriLegsControlProps) {
  return (
    <div className="space-y-3">
      {(Object.keys(LEG_LABELS) as LegKey[]).map((key) => {
        const leg = legs[key]
        const bounds = TRI_LEG_BOUNDS[key]
        const h = Math.floor(leg.durationMin / 60)
        const m = leg.durationMin % 60
        const setDuration = (min: number) =>
          onChange(key, {
            durationMin: Math.min(bounds.max, Math.max(bounds.min, min)),
          })

        return (
          <div key={key} className="rounded-xl border border-line bg-raised p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="head flex items-center gap-2 text-xs">
                <span className="text-accent">{LEG_ICONS[key]}</span>
                {LEG_LABELS[key]}
                <span className="data font-normal text-muted">
                  {formatDuration(leg.durationMin)}
                </span>
              </span>
              <div className="flex items-center gap-1.5">
                <label className="flex items-baseline gap-1 rounded-lg border border-line bg-surface px-2 py-1 focus-within:border-accent transition-colors">
                  <input
                    type="number"
                    className="fc-num data w-7 bg-transparent text-right text-sm font-semibold outline-none"
                    min={0}
                    max={8}
                    value={h}
                    aria-label={`${LEG_LABELS[key]} hours`}
                    onChange={(e) => setDuration(Number(e.target.value) * 60 + m)}
                  />
                  <span className="data text-[11px] text-muted">h</span>
                </label>
                <label className="flex items-baseline gap-1 rounded-lg border border-line bg-surface px-2 py-1 focus-within:border-accent transition-colors">
                  <input
                    type="number"
                    className="fc-num data w-7 bg-transparent text-right text-sm font-semibold outline-none"
                    min={0}
                    max={59}
                    step={bounds.step}
                    value={m}
                    aria-label={`${LEG_LABELS[key]} minutes`}
                    onChange={(e) => setDuration(h * 60 + Number(e.target.value))}
                  />
                  <span className="data text-[11px] text-muted">m</span>
                </label>
              </div>
            </div>

            <div className="mt-1.5">
              <Slider
                min={bounds.min}
                max={bounds.max}
                step={bounds.step}
                value={leg.durationMin}
                onChange={setDuration}
                ariaLabel={`${LEG_LABELS[key]} duration in minutes`}
              />
            </div>

            {key === 'swim' ? (
              <p className="mt-1 text-xs text-muted">
                No carbs in the water — down a gel a few minutes before the start.
              </p>
            ) : (
              <div className="mt-2 border-t border-dashed border-line pt-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="head text-[11px] text-muted">Carb target</span>
                  <NumberField
                    min={CARBS_MIN}
                    max={CARBS_MAX}
                    step={5}
                    value={leg.carbsPerHour}
                    onChange={(carbsPerHour) => onChange(key, { carbsPerHour })}
                    unit="g/h"
                    ariaLabel={`${LEG_LABELS[key]} carbohydrates per hour`}
                  />
                </div>
                <div className="mt-1.5">
                  <Slider
                    min={CARBS_MIN}
                    max={CARBS_MAX}
                    step={5}
                    value={leg.carbsPerHour}
                    onChange={(carbsPerHour) => onChange(key, { carbsPerHour })}
                    ariaLabel={`${LEG_LABELS[key]} carbohydrates per hour`}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
