import { describe, expect, it } from 'vitest'
import type { PlanInput } from './fueling'
import {
  computePlan,
  DEFAULT_CONFIG,
  DEFAULT_TRI_LEGS,
  formatClock,
  formatDuration,
} from './fueling'

const baseInput = (overrides: Partial<PlanInput> = {}): PlanInput => ({
  sport: 'cycling',
  durationMin: 180,
  carbsPerHour: 90,
  triLegs: structuredClone(DEFAULT_TRI_LEGS),
  ratio: { glucose: 1, fructose: 0.8 },
  useGels: true,
  config: { ...DEFAULT_CONFIG },
  ...overrides,
})

describe('glucose:fructose split', () => {
  it('splits 90 g/h at 1:0.8 into 50/40', () => {
    const plan = computePlan(baseInput())
    expect(plan.legs[0].glucosePerHour).toBeCloseTo(50)
    expect(plan.legs[0].fructosePerHour).toBeCloseTo(40)
  })

  it('splits 90 g/h at 2:1 into 60/30', () => {
    const plan = computePlan(baseInput({ ratio: { glucose: 2, fructose: 1 } }))
    expect(plan.legs[0].glucosePerHour).toBeCloseTo(60)
    expect(plan.legs[0].fructosePerHour).toBeCloseTo(30)
  })
})

describe('product combo', () => {
  it('covers 90 g/h with 2 gels and 40 g drink mix', () => {
    const leg = computePlan(baseInput()).legs[0]
    expect(leg.gelsPerHour).toBe(2)
    expect(leg.drinkCarbsPerHour).toBe(40)
  })

  it('respects a 40 g gel size', () => {
    const leg = computePlan(
      baseInput({
        carbsPerHour: 120,
        config: { ...DEFAULT_CONFIG, gelCarbs: 40 },
      }),
    ).legs[0]
    expect(leg.gelsPerHour).toBe(2)
    expect(leg.drinkCarbsPerHour).toBe(40)
  })

  it('puts everything into the bottle in DIY-only mode', () => {
    const leg = computePlan(baseInput({ useGels: false })).legs[0]
    expect(leg.gelsPerHour).toBe(0)
    expect(leg.drinkCarbsPerHour).toBe(90)
  })

  it('splits the drink portion by the ratio', () => {
    const leg = computePlan(baseInput()).legs[0]
    // 40 g drink at 1:0.8
    expect(leg.drinkGlucosePerHour).toBeCloseTo(40 / 1.8)
    expect(leg.drinkFructosePerHour).toBeCloseTo((40 * 0.8) / 1.8)
  })
})

describe('hydration and bottle math', () => {
  it('uses 750 ml/h and 600 mg sodium in mild conditions', () => {
    const leg = computePlan(baseInput()).legs[0]
    expect(leg.fluidMlPerHour).toBe(750)
    expect(leg.sodiumMgPerHour).toBe(600)
    expect(leg.bottlesPerHour).toBeCloseTo(1)
    expect(leg.bottleSaltG).toBeCloseTo(1.5)
  })

  it('scales fluid to 1000 ml/h in hot conditions', () => {
    const leg = computePlan(
      baseInput({ config: { ...DEFAULT_CONFIG, temperature: 'hot' } }),
    ).legs[0]
    expect(leg.fluidMlPerHour).toBe(1000)
    expect(leg.bottlesPerHour).toBeCloseTo(1000 / 750)
    // 900 mg/h across 1.33 bottles/h → 675 mg per bottle → ~1.69 g salt
    expect(leg.bottleSaltG).toBeCloseTo(1.6875, 3)
    expect(leg.sipMl).toBe(250)
  })

  it('distributes drink carbs across bottles', () => {
    const leg = computePlan(
      baseInput({ config: { ...DEFAULT_CONFIG, temperature: 'hot' } }),
    ).legs[0]
    // 40 g/h drink over 1.33 bottles/h → 30 g per bottle
    expect(leg.bottleCarbs).toBeCloseTo(30)
  })
})

describe('race totals', () => {
  it('multiplies per-hour values by duration', () => {
    const plan = computePlan(baseInput({ durationMin: 180 }))
    expect(plan.totalCarbs).toBeCloseTo(270)
    expect(plan.totalGlucose).toBeCloseTo(150)
    expect(plan.totalFructose).toBeCloseTo(120)
    expect(plan.totalGels).toBe(6)
    expect(plan.totalBottles).toBe(3)
    expect(plan.totalFluidL).toBeCloseTo(2.25)
  })

  it('sums DIY powder from the drink portion only', () => {
    const plan = computePlan(baseInput({ durationMin: 180 }))
    // 40 g/h drink × 3 h = 120 g split 1:0.8
    expect(plan.totalMaltodextrin).toBeCloseTo(120 / 1.8)
    expect(plan.totalFructosePowder).toBeCloseTo((120 * 0.8) / 1.8)
  })
})

describe('triathlon plans', () => {
  it('plans bike and run separately, swim counts only toward duration', () => {
    const plan = computePlan(baseInput({ sport: 'triathlon' }))
    expect(plan.legs.map((l) => l.key)).toEqual(['bike', 'run'])
    expect(plan.swimDurationMin).toBe(40)
    expect(plan.totalDurationMin).toBe(40 + 165 + 110)
  })

  it('warns when the run target exceeds the bike target', () => {
    const input = baseInput({ sport: 'triathlon' })
    input.triLegs.bike.carbsPerHour = 60
    input.triLegs.run.carbsPerHour = 80
    const plan = computePlan(input)
    expect(plan.warnings.map((w) => w.key)).toContain('warn.runOverBike')
  })
})

describe('warnings and hints', () => {
  it('warns when glucose exceeds the absorption ceiling', () => {
    const plan = computePlan(
      baseInput({ carbsPerHour: 120, ratio: { glucose: 2, fructose: 1 } }),
    )
    const warning = plan.warnings.find((w) => w.key === 'warn.glucoseCap')
    expect(warning?.params?.g).toBe(80)
  })

  it('warns about gut training at 90 g/h and above', () => {
    expect(
      computePlan(baseInput({ carbsPerHour: 90 })).warnings.map((w) => w.key),
    ).toContain('warn.gutTraining')
    expect(
      computePlan(baseInput({ carbsPerHour: 60 })).warnings.map((w) => w.key),
    ).not.toContain('warn.gutTraining')
  })

  it('warns about over-concentrated DIY bottles', () => {
    const plan = computePlan(baseInput({ carbsPerHour: 120, useGels: false }))
    const warning = plan.warnings.find((w) => w.key === 'warn.concentration')
    expect(warning).toBeDefined()
    expect(warning?.params?.pct).toBe(16)
  })

  it('hints that short races barely need fueling', () => {
    const plan = computePlan(baseInput({ durationMin: 60 }))
    expect(plan.hints.map((h) => h.key)).toContain('hint.short')
  })

  it('hints at easing into the first hour on big targets', () => {
    const plan = computePlan(baseInput({ durationMin: 240, carbsPerHour: 90 }))
    expect(plan.hints.map((h) => h.key)).toContain('hint.firstHour')
  })
})

describe('hourly timeline', () => {
  it('centers 2 gels at :15 and :45 with sips every 15 min', () => {
    const leg = computePlan(baseInput()).legs[0]
    const gels = leg.hourlyEvents.filter((e) => e.kind === 'gel')
    const sips = leg.hourlyEvents.filter((e) => e.kind === 'sip')
    expect(gels.map((g) => g.minute)).toEqual([15, 45])
    expect(sips.map((s) => s.minute)).toEqual([15, 30, 45, 60])
  })
})

describe('formatting', () => {
  it('formats durations', () => {
    expect(formatDuration(45)).toBe('45min')
    expect(formatDuration(60)).toBe('1h')
    expect(formatDuration(90)).toBe('1h 30')
  })

  it('formats clock times', () => {
    expect(formatClock(315)).toBe('5:15')
  })
})
