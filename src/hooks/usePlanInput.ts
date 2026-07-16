import { useMemo, useState } from 'react'
import type {
  BuildItem,
  LegInput,
  LegKey,
  PlanConfig,
  PlanInput,
  RacePreset,
} from '../lib/fueling'
import { computePlan, DEFAULT_CONFIG, DEFAULT_TRI_LEGS } from '../lib/fueling'
import { parseShareUrl } from '../lib/share'

const DEFAULT_INPUT: PlanInput = {
  sport: 'triathlon',
  durationMin: 300,
  carbsPerHour: 90,
  triLegs: DEFAULT_TRI_LEGS,
  ratio: { glucose: 1, fructose: 0.8 },
  fuelSource: 'combo',
  config: DEFAULT_CONFIG,
  buildItems: [],
}

/** Plan input state, hydrated from the share URL, plus patch helpers */
export function usePlanInput() {
  const [input, setInput] = useState<PlanInput>(() => ({
    ...DEFAULT_INPUT,
    ...parseShareUrl(location.search),
  }))

  const plan = useMemo(() => computePlan(input), [input])

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

  const addBuildItem = (item: BuildItem) =>
    setInput((prev) => ({ ...prev, buildItems: [...prev.buildItems, item] }))

  const updateBuildItem = (id: string, itemPatch: Partial<BuildItem>) =>
    setInput((prev) => ({
      ...prev,
      buildItems: prev.buildItems.map((item) =>
        item.id === id ? { ...item, ...itemPatch } : item,
      ),
    }))

  const removeBuildItem = (id: string) =>
    setInput((prev) => ({
      ...prev,
      buildItems: prev.buildItems.filter((item) => item.id !== id),
    }))

  return {
    input,
    plan,
    patch,
    patchLeg,
    patchConfig,
    applyPreset,
    addBuildItem,
    updateBuildItem,
    removeBuildItem,
  }
}
