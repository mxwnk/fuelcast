import { describe, expect, it } from 'vitest'
import type { PlanInput } from './fueling'
import {
  applyBuildItemsToPlan,
  buildItemCarbs,
  computeBuildProgress,
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
  fuelSource: 'combo',
  config: { ...DEFAULT_CONFIG },
  buildItems: [],
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
    const leg = computePlan(baseInput({ fuelSource: 'diy' })).legs[0]
    expect(leg.gelsPerHour).toBe(0)
    expect(leg.drinkCarbsPerHour).toBe(90)
  })

  it('gets all carbs from gels with a water-only bottle in gels-only mode', () => {
    const plan = computePlan(baseInput({ fuelSource: 'gels' }))
    const leg = plan.legs[0]
    // 90 g/h × 3 h = 270 g ÷ 25 g gel → 11 gels, bottle carries no carbs
    expect(plan.totalGels).toBe(11)
    expect(leg.drinkCarbsPerHour).toBe(0)
    expect(leg.bottleGlucose).toBe(0)
    expect(leg.fluidMlPerHour).toBe(750)
  })

  it('sizes gels to the total target without per-hour rounding overshoot', () => {
    // Regression: 60 g/h × 6 h = 360 g with 40 g gels must be 9 gels (360 g),
    // not round(1.5)=2/h × 6 h = 12 gels (480 g).
    const plan = computePlan(
      baseInput({
        fuelSource: 'gels',
        carbsPerHour: 60,
        durationMin: 360,
        config: { ...DEFAULT_CONFIG, gelCarbs: 40 },
      }),
    )
    expect(plan.totalGels).toBe(9)
    expect(plan.totalGels * 40).toBe(360)
  })

  it('always suggests at least one gel in gels-only mode', () => {
    const plan = computePlan(
      baseInput({ fuelSource: 'gels', carbsPerHour: 30, durationMin: 30 }),
    )
    expect(plan.totalGels).toBeGreaterThanOrEqual(1)
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

  it('sums total salt from the hourly sodium target', () => {
    const plan = computePlan(baseInput({ durationMin: 180 }))
    // 600 mg/h sodium × 3 h × 2.5 (salt is ~40% sodium)
    expect(plan.totalSaltG).toBeCloseTo(4.5)
  })

  it('sums DIY powder from the drink portion only', () => {
    const plan = computePlan(baseInput({ durationMin: 180 }))
    // 40 g/h drink × 3 h = 120 g split 1:0.8
    expect(plan.totalMaltodextrin).toBeCloseTo(120 / 1.8)
    expect(plan.totalFructosePowder).toBeCloseTo((120 * 0.8) / 1.8)
  })

  it('rounds gels-only total to the target, not per-hour', () => {
    // 90 g/h × 5 h = 450 g with 60 g gels → round(7.5) = 8 gels (was 2/h × 5 = 10)
    const plan = computePlan(
      baseInput({
        fuelSource: 'gels',
        carbsPerHour: 90,
        durationMin: 300,
        config: { ...DEFAULT_CONFIG, gelCarbs: 60 },
      }),
    )
    expect(plan.totalGels).toBe(8)
  })

  it('should compute correct total gels in combo mode with large gels', () => {
    // 90 g/h combo with 60 g gels over 3 h: gelsPerHour=1, total = ceil(1*3) = 3
    const plan = computePlan(
      baseInput({
        fuelSource: 'combo',
        carbsPerHour: 90,
        durationMin: 180,
        config: { ...DEFAULT_CONFIG, gelCarbs: 60 },
      }),
    )
    expect(plan.legs[0].gelsPerHour).toBe(1)
    expect(plan.totalGels).toBe(3)
  })

  it('keeps gels-only total on the carb target', () => {
    // 60 g/h × 4 h = 240 g with 40 g gels → exactly 6 gels (was round(1.5)=2/h × 4 = 8)
    const plan = computePlan(
      baseInput({
        fuelSource: 'gels',
        carbsPerHour: 60,
        durationMin: 240,
        config: { ...DEFAULT_CONFIG, gelCarbs: 40 },
      }),
    )
    expect(plan.totalGels).toBe(6)
    expect(plan.totalGels * 40).toBe(240)
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
    const plan = computePlan(baseInput({ carbsPerHour: 120, fuelSource: 'diy' }))
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

describe('build progress', () => {
  it('reports the full goal as remaining when no items are assigned', () => {
    const plan = computePlan(baseInput({ durationMin: 180, carbsPerHour: 90 }))
    const progress = computeBuildProgress(plan, [])
    // 90 g/h × 3 h = 270 g goal, nothing assigned
    expect(progress.goalCarbs).toBeCloseTo(270)
    expect(progress.assignedCarbs).toBe(0)
    expect(progress.remainingCarbs).toBeCloseTo(270)
    expect(progress.legs[0].percent).toBe(0)
  })

  it('sums assigned item carbs against the leg goal', () => {
    const plan = computePlan(baseInput({ durationMin: 180, carbsPerHour: 90 }))
    const progress = computeBuildProgress(plan, [
      { id: 'a', kind: 'gel', carbs: 25, count: 6, leg: 'race' },
      { id: 'b', kind: 'bottle', carbs: 60, ml: 750, count: 2, leg: 'race' },
    ])
    // 6 × 25 + 2 × 60 = 150 + 120 = 270 g → goal exactly met
    expect(progress.assignedCarbs).toBeCloseTo(270)
    expect(progress.remainingCarbs).toBeCloseTo(0)
    expect(progress.legs[0].percent).toBe(1)
  })

  it('caps the progress fraction at 1 but reports negative remaining when over', () => {
    const plan = computePlan(baseInput({ durationMin: 180, carbsPerHour: 90 }))
    const progress = computeBuildProgress(plan, [
      { id: 'a', kind: 'gel', carbs: 100, count: 4, leg: 'race' },
    ])
    // 400 g assigned vs 270 g goal → 130 g over, percent clamped to 1
    expect(progress.assignedCarbs).toBeCloseTo(400)
    expect(progress.remainingCarbs).toBeCloseTo(-130)
    expect(progress.legs[0].percent).toBe(1)
  })

  it('assigns items to the matching leg only in a triathlon', () => {
    const input = baseInput({ sport: 'triathlon' })
    input.triLegs.bike = { durationMin: 120, carbsPerHour: 90 }
    input.triLegs.run = { durationMin: 60, carbsPerHour: 60 }
    const plan = computePlan(input)
    const progress = computeBuildProgress(plan, [
      { id: 'a', kind: 'gel', carbs: 30, count: 3, leg: 'bike' },
      { id: 'b', kind: 'gel', carbs: 20, count: 2, leg: 'run' },
    ])
    const bike = progress.legs.find((l) => l.key === 'bike')
    const run = progress.legs.find((l) => l.key === 'run')
    // bike goal 180 g, 90 g assigned; run goal 60 g, 40 g assigned
    expect(bike?.goalCarbs).toBeCloseTo(180)
    expect(bike?.assignedCarbs).toBeCloseTo(90)
    expect(run?.goalCarbs).toBeCloseTo(60)
    expect(run?.assignedCarbs).toBeCloseTo(40)
  })

  it('computes carbs for a single item as carbs × count', () => {
    expect(
      buildItemCarbs({ id: 'x', kind: 'gel', carbs: 25, count: 4, leg: 'race' }),
    ).toBe(100)
  })
})

describe('build timeline', () => {
  it('drives the gel cadence from placed items, not the gear config', () => {
    // Gear gel size is 25 g, but the build places 40 g gels
    const base = computePlan(baseInput({ durationMin: 180, carbsPerHour: 90 }))
    const withItems = applyBuildItemsToPlan(base, [
      { id: 'a', kind: 'gel', carbs: 40, count: 6, leg: 'race' },
    ])
    const leg = withItems.legs[0]
    // 6 gels over 180 min → every 30 min, representative size 40 g
    expect(leg.totalGels).toBe(6)
    expect(leg.gelCarbs).toBe(40)
    expect(leg.gelIntervalMin).toBe(30)
    expect(leg.hourlyEvents.some((event) => event.kind === 'gel')).toBe(true)
  })

  it('removes gel markers when no gels are placed for a leg', () => {
    const base = computePlan(baseInput({ durationMin: 180, carbsPerHour: 90 }))
    const withItems = applyBuildItemsToPlan(base, [
      { id: 'b', kind: 'bottle', carbs: 60, ml: 750, count: 3, leg: 'race' },
    ])
    const leg = withItems.legs[0]
    expect(leg.totalGels).toBe(0)
    expect(leg.gelIntervalMin).toBeNull()
    expect(leg.hourlyEvents.every((event) => event.kind === 'sip')).toBe(true)
  })

  it('averages mixed gel sizes into a representative size', () => {
    const base = computePlan(baseInput({ durationMin: 120, carbsPerHour: 90 }))
    const withItems = applyBuildItemsToPlan(base, [
      { id: 'a', kind: 'gel', carbs: 20, count: 2, leg: 'race' },
      { id: 'b', kind: 'gel', carbs: 40, count: 2, leg: 'race' },
    ])
    // (2×20 + 2×40) / 4 = 30 g average
    expect(withItems.legs[0].totalGels).toBe(4)
    expect(withItems.legs[0].gelCarbs).toBe(30)
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
