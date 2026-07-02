export type Sport = 'triathlon' | 'cycling' | 'running'
export type LegKey = 'swim' | 'bike' | 'run'
export type Temperature = 'cool' | 'mild' | 'hot'

export interface Ratio {
  glucose: number
  fructose: number
}

export interface LegInput {
  durationMin: number
  carbsPerHour: number
}

/** Advanced assumptions — sensible defaults keep the simple mode simple */
export interface PlanConfig {
  gelCarbs: number
  bottleMl: number
  temperature: Temperature
}

export interface PlanInput {
  sport: Sport
  /** Used for cycling and running */
  durationMin: number
  /** Used for cycling and running */
  carbsPerHour: number
  /** Per-discipline splits, only used when sport is triathlon */
  triLegs: Record<LegKey, LegInput>
  ratio: Ratio
  /** false = everything goes into the bottle, no gels */
  useGels: boolean
  config: PlanConfig
}

export interface TimelineEvent {
  minute: number
  kind: 'gel' | 'sip'
}

export interface LegPlan {
  key: LegKey | 'race'
  durationMin: number
  hours: number
  carbsPerHour: number
  glucosePerHour: number
  fructosePerHour: number
  totalCarbs: number
  totalGlucose: number
  totalFructose: number
  /** Recommended product combo per hour */
  gelsPerHour: number
  gelCarbs: number
  drinkCarbsPerHour: number
  drinkGlucosePerHour: number
  drinkFructosePerHour: number
  /** Hydration */
  fluidMlPerHour: number
  sodiumMgPerHour: number
  /** Per-bottle mix (the drink portion split across bottles) */
  bottleMl: number
  bottlesPerHour: number
  bottleCarbs: number
  bottleGlucose: number
  bottleFructose: number
  bottleSaltG: number
  /** Cadence */
  gelIntervalMin: number | null
  sipIntervalMin: number
  sipMl: number
  /** One-hour repeating pattern */
  hourlyEvents: TimelineEvent[]
  /** Leg totals */
  totalGels: number
  totalFluidL: number
  totalBottles: number
}

/** Translatable message — resolved to text via the i18n dictionary */
export interface PlanMessage {
  key: string
  /** Prefix the message with this leg's name (triathlon only) */
  leg?: LegKey
  params?: Record<string, string | number>
}

export interface RacePlan {
  /** Fueled legs: bike + run for triathlon, a single leg otherwise */
  legs: LegPlan[]
  /** Swim duration counts toward race time but carries no intake */
  swimDurationMin: number
  totalDurationMin: number
  temperature: Temperature
  totalCarbs: number
  totalGlucose: number
  totalFructose: number
  totalGels: number
  totalFluidL: number
  totalBottles: number
  totalMaltodextrin: number
  totalFructosePowder: number
  warnings: PlanMessage[]
  hints: PlanMessage[]
}

export const DEFAULT_CONFIG: PlanConfig = {
  gelCarbs: 25,
  bottleMl: 750,
  temperature: 'mild',
}

export const GEL_SIZES = [25, 30, 40]
export const BOTTLE_SIZES = [500, 750, 950]

export const HYDRATION: Record<
  Temperature,
  { range: string; fluidMlPerHour: number; sodiumMgPerHour: number }
> = {
  cool: { range: '< 15°C', fluidMlPerHour: 500, sodiumMgPerHour: 400 },
  mild: { range: '15–25°C', fluidMlPerHour: 750, sodiumMgPerHour: 600 },
  hot: { range: '> 25°C', fluidMlPerHour: 1000, sodiumMgPerHour: 900 },
}

export const DURATION_MIN = 30
export const DURATION_MAX = 720
export const DURATION_STEP = 15

export const CARBS_MIN = 30
export const CARBS_MAX = 120
export const CARB_PRESETS = [60, 90, 120]

export const TRI_LEG_BOUNDS: Record<
  LegKey,
  { min: number; max: number; step: number }
> = {
  swim: { min: 10, max: 150, step: 5 },
  bike: { min: 30, max: 480, step: 15 },
  run: { min: 20, max: 420, step: 15 },
}

export const LEG_KEYS: LegKey[] = ['swim', 'bike', 'run']

export const DEFAULT_TRI_LEGS: Record<LegKey, LegInput> = {
  swim: { durationMin: 40, carbsPerHour: 0 },
  bike: { durationMin: 165, carbsPerHour: 90 },
  run: { durationMin: 110, carbsPerHour: 65 },
}

export interface RacePreset {
  id: string
  durationMin?: number
  legs?: Record<LegKey, number>
}

export const RACE_PRESETS: Record<Sport, RacePreset[]> = {
  triathlon: [
    { id: 'sprint', legs: { swim: 20, bike: 45, run: 30 } },
    { id: 'olympic', legs: { swim: 30, bike: 75, run: 45 } },
    { id: 'im703', legs: { swim: 40, bike: 165, run: 105 } },
    { id: 'ironman', legs: { swim: 75, bike: 345, run: 240 } },
  ],
  cycling: [
    { id: 'club', durationMin: 120 },
    { id: 'fondo', durationMin: 240 },
    { id: 'epic', durationMin: 360 },
  ],
  running: [
    { id: 'half', durationMin: 105 },
    { id: 'marathon', durationMin: 225 },
    { id: 'ultra', durationMin: 360 },
  ],
}

export const RATIO_PRESETS: { label: string; ratio: Ratio }[] = [
  { label: '2:1', ratio: { glucose: 2, fructose: 1 } },
  { label: '1:0.8', ratio: { glucose: 1, fructose: 0.8 } },
  { label: '1:1', ratio: { glucose: 1, fructose: 1 } },
]

export const SPORTS: Sport[] = ['triathlon', 'cycling', 'running']

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${String(m).padStart(2, '0')}`
}

export function formatClock(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${h}:${String(m).padStart(2, '0')}`
}

function computeLeg(
  key: LegKey | 'race',
  durationMin: number,
  carbsPerHour: number,
  ratio: Ratio,
  useGels: boolean,
  config: PlanConfig,
): LegPlan {
  const { gelCarbs, bottleMl } = config
  const { fluidMlPerHour, sodiumMgPerHour } = HYDRATION[config.temperature]

  const hours = durationMin / 60
  const parts = ratio.glucose + ratio.fructose
  const glucosePerHour = (carbsPerHour * ratio.glucose) / parts
  const fructosePerHour = (carbsPerHour * ratio.fructose) / parts

  // Recommended combo: bottles carry the drink mix, gels cover whatever a
  // moderate mix concentration doesn't.
  const gelsPerHour = useGels
    ? Math.max(0, Math.round((carbsPerHour - 40) / gelCarbs))
    : 0
  const drinkCarbsPerHour = carbsPerHour - gelsPerHour * gelCarbs
  const drinkGlucosePerHour = (drinkCarbsPerHour * ratio.glucose) / parts
  const drinkFructosePerHour = (drinkCarbsPerHour * ratio.fructose) / parts

  const bottlesPerHour = fluidMlPerHour / bottleMl
  const bottleCarbs = drinkCarbsPerHour / bottlesPerHour
  const bottleGlucose = drinkGlucosePerHour / bottlesPerHour
  const bottleFructose = drinkFructosePerHour / bottlesPerHour
  // Table salt is ~40% sodium by weight
  const bottleSaltG = (sodiumMgPerHour / bottlesPerHour) * 2.5 / 1000

  const gelIntervalMin = gelsPerHour > 0 ? Math.round(60 / gelsPerHour) : null
  const sipIntervalMin = 15
  const sipMl = Math.round(fluidMlPerHour / (60 / sipIntervalMin) / 10) * 10

  const hourlyEvents: TimelineEvent[] = []
  for (let m = sipIntervalMin; m <= 60; m += sipIntervalMin) {
    hourlyEvents.push({ minute: m, kind: 'sip' })
  }
  if (gelsPerHour > 0 && gelIntervalMin) {
    // Center gels within the hour: 1 gel → :30, 2 → :15/:45, 3 → :10/:30/:50
    for (let i = 0; i < gelsPerHour; i++) {
      const m = Math.round(gelIntervalMin / 2 + i * gelIntervalMin)
      hourlyEvents.push({ minute: m, kind: 'gel' })
    }
  }
  hourlyEvents.sort((a, b) => a.minute - b.minute)

  return {
    key,
    durationMin,
    hours,
    carbsPerHour,
    glucosePerHour,
    fructosePerHour,
    totalCarbs: carbsPerHour * hours,
    totalGlucose: glucosePerHour * hours,
    totalFructose: fructosePerHour * hours,
    gelsPerHour,
    gelCarbs,
    drinkCarbsPerHour,
    drinkGlucosePerHour,
    drinkFructosePerHour,
    fluidMlPerHour,
    sodiumMgPerHour,
    bottleMl,
    bottlesPerHour,
    bottleCarbs,
    bottleGlucose,
    bottleFructose,
    bottleSaltG,
    gelIntervalMin,
    sipIntervalMin,
    sipMl,
    hourlyEvents,
    totalGels: Math.ceil(gelsPerHour * hours),
    totalFluidL: (fluidMlPerHour * hours) / 1000,
    totalBottles: Math.ceil((fluidMlPerHour * hours) / bottleMl),
  }
}

export function computePlan(input: PlanInput): RacePlan {
  const isTri = input.sport === 'triathlon'

  const legs: LegPlan[] = isTri
    ? (['bike', 'run'] as const).map((key) =>
        computeLeg(
          key,
          input.triLegs[key].durationMin,
          input.triLegs[key].carbsPerHour,
          input.ratio,
          input.useGels,
          input.config,
        ),
      )
    : [
        computeLeg(
          'race',
          input.durationMin,
          input.carbsPerHour,
          input.ratio,
          input.useGels,
          input.config,
        ),
      ]

  const swimDurationMin = isTri ? input.triLegs.swim.durationMin : 0
  const sum = (pick: (leg: LegPlan) => number) =>
    legs.reduce((acc, leg) => acc + pick(leg), 0)

  const warnings: PlanMessage[] = []
  for (const leg of legs) {
    const legRef = isTri && leg.key !== 'race' ? leg.key : undefined
    if (leg.glucosePerHour > 65) {
      warnings.push({
        key: 'warn.glucoseCap',
        leg: legRef,
        params: { g: Math.round(leg.glucosePerHour) },
      })
    }
    if (leg.bottleCarbs / leg.bottleMl > 0.12) {
      warnings.push({
        key: 'warn.concentration',
        leg: legRef,
        params: {
          g: Math.round(leg.bottleCarbs),
          ml: leg.bottleMl,
          pct: Math.round((leg.bottleCarbs / leg.bottleMl) * 100),
        },
      })
    }
  }
  if (legs.some((leg) => leg.carbsPerHour >= 90)) {
    warnings.push({ key: 'warn.gutTraining' })
  }
  if (isTri) {
    const [bike, run] = legs
    if (run.carbsPerHour > bike.carbsPerHour) {
      warnings.push({ key: 'warn.runOverBike' })
    }
  }

  const hints: PlanMessage[] = []
  const fueledMin = sum((l) => l.durationMin)
  if (fueledMin < 90) {
    hints.push({ key: 'hint.short' })
  } else if (legs.some((l) => l.carbsPerHour >= 70)) {
    hints.push({ key: 'hint.firstHour' })
  }

  return {
    legs,
    swimDurationMin,
    totalDurationMin: swimDurationMin + fueledMin,
    temperature: input.config.temperature,
    totalCarbs: sum((l) => l.totalCarbs),
    totalGlucose: sum((l) => l.totalGlucose),
    totalFructose: sum((l) => l.totalFructose),
    totalGels: sum((l) => l.totalGels),
    totalFluidL: sum((l) => l.totalFluidL),
    totalBottles: sum((l) => l.totalBottles),
    totalMaltodextrin: sum((l) => l.drinkGlucosePerHour * l.hours),
    totalFructosePowder: sum((l) => l.drinkFructosePerHour * l.hours),
    warnings,
    hints,
  }
}
