export type Sport = 'triathlon' | 'cycling' | 'running'
export type LegKey = 'swim' | 'bike' | 'run'
export type Temperature = 'cool' | 'mild' | 'hot'
/** combo = gels + drink mix · gels = gels only (water bottle) · diy = bottle mix only */
export type FuelSource = 'combo' | 'gels' | 'diy'

export interface Ratio {
  glucose: number
  fructose: number
}

export interface LegInput {
  durationMin: number
  carbsPerHour: number
}

/** A concrete fuelling item the athlete plans to carry in Build mode */
export type BuildItemKind = 'gel' | 'bottle'

export interface BuildItem {
  /** Stable identifier for React keys and list updates */
  id: string
  kind: BuildItemKind
  /** Carbohydrates per single item, in grams */
  carbs: number
  /** Bottle volume in ml — only meaningful for bottles */
  ml?: number
  /** How many of this item are carried */
  count: number
  /** Which leg this item is assigned to */
  leg: LegKey | 'race'
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
  fuelSource: FuelSource
  config: PlanConfig
  /** Items placed by the athlete in the interactive Build mode */
  buildItems: BuildItem[]
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
  totalSaltG: number
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

/** Table salt (NaCl) is ~40% sodium by weight → factor 2.5 to convert sodium mg to salt mg */
const SODIUM_TO_SALT_FACTOR = 2.5

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

/**
 * Places gel markers within a representative hour by interval. Reproduces the
 * centred layout (1 gel → :30, 2 → :15/:45, 3 → :10/:30/:50) and handles
 * intervals that don't divide evenly into 60. Returns an empty list when no
 * gels are taken.
 */
function placeGelEvents(gelIntervalMin: number | null): TimelineEvent[] {
  if (!gelIntervalMin) return []
  const events: TimelineEvent[] = []
  for (let m = Math.round(gelIntervalMin / 2); m < 60; m += gelIntervalMin) {
    events.push({ minute: m, kind: 'gel' })
  }
  // Interval longer than an hour: still show one gel so the rail isn't empty
  if (events.length === 0) events.push({ minute: 30, kind: 'gel' })
  return events
}

function computeLeg(
  key: LegKey | 'race',
  durationMin: number,
  carbsPerHour: number,
  ratio: Ratio,
  fuelSource: FuelSource,
  config: PlanConfig,
): LegPlan {
  const { gelCarbs, bottleMl } = config
  const { fluidMlPerHour, sodiumMgPerHour } = HYDRATION[config.temperature]

  const hours = durationMin / 60
  const parts = ratio.glucose + ratio.fructose
  const glucosePerHour = (carbsPerHour * ratio.glucose) / parts
  const fructosePerHour = (carbsPerHour * ratio.fructose) / parts

  // How the hourly carbs are split between gels and the bottle:
  // - combo: bottle carries ~40 g/h of mix, gels cover the rest (per-hour is
  //   exact because the bottle absorbs the remainder)
  // - gels:  all carbs from gels — size the TOTAL to the target and round once.
  //   Rounding gels per hour and multiplying overshoots badly: 60 g/h with
  //   40 g gels is 1.5 gels/h, which would round to 2/h = 480 g over 6 h vs a
  //   360 g target. Deriving the total (round(360/40)=9) keeps it on target.
  // - diy:   everything dissolved in the bottle, no gels
  let gelsPerHour: number
  let gelIntervalMin: number | null
  let totalGels: number
  if (fuelSource === 'diy') {
    gelsPerHour = 0
    gelIntervalMin = null
    totalGels = 0
  } else if (fuelSource === 'gels') {
    totalGels = Math.max(1, Math.round((carbsPerHour * hours) / gelCarbs))
    gelIntervalMin = Math.max(5, Math.round(durationMin / totalGels))
    gelsPerHour = 60 / gelIntervalMin
  } else {
    gelsPerHour = Math.max(0, Math.round((carbsPerHour - 40) / gelCarbs))
    gelIntervalMin = gelsPerHour > 0 ? Math.round(60 / gelsPerHour) : null
    totalGels = Math.ceil(gelsPerHour * hours)
  }
  const drinkCarbsPerHour =
    fuelSource === 'gels' ? 0 : carbsPerHour - gelsPerHour * gelCarbs
  const drinkGlucosePerHour = (drinkCarbsPerHour * ratio.glucose) / parts
  const drinkFructosePerHour = (drinkCarbsPerHour * ratio.fructose) / parts

  const bottlesPerHour = fluidMlPerHour / bottleMl
  const bottleCarbs = drinkCarbsPerHour / bottlesPerHour
  const bottleGlucose = drinkGlucosePerHour / bottlesPerHour
  const bottleFructose = drinkFructosePerHour / bottlesPerHour
  // Table salt is ~40% sodium by weight
  const bottleSaltG = (sodiumMgPerHour / bottlesPerHour) * SODIUM_TO_SALT_FACTOR / 1000

  const sipIntervalMin = 15
  const sipMl = Math.round(fluidMlPerHour / (60 / sipIntervalMin) / 10) * 10

  const hourlyEvents: TimelineEvent[] = []
  for (let m = sipIntervalMin; m <= 60; m += sipIntervalMin) {
    hourlyEvents.push({ minute: m, kind: 'sip' })
  }
  hourlyEvents.push(...placeGelEvents(gelIntervalMin))
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
    totalGels,
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
          input.fuelSource,
          input.config,
        ),
      )
    : [
        computeLeg(
          'race',
          input.durationMin,
          input.carbsPerHour,
          input.ratio,
          input.fuelSource,
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
    if (leg.bottleCarbs / leg.bottleMl > 0.08) {
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
  if (legs.some((l) => l.carbsPerHour >= 80)) {
    hints.push({ key: 'hint.bodyWeight' })
  }
  if (input.config.temperature === 'hot') {
    hints.push({ key: 'hint.saltPalatability' })
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
    totalSaltG: sum((l) => (l.sodiumMgPerHour * SODIUM_TO_SALT_FACTOR * l.hours) / 1000),
    warnings,
    hints,
  }
}

/** Carbs contributed by a single build item (per-item carbs × count) */
export function buildItemCarbs(item: BuildItem): number {
  return item.carbs * item.count
}

/** Progress of assigned build items against the carb goal for one leg */
export interface LegBuildProgress {
  key: LegKey | 'race'
  durationMin: number
  goalCarbs: number
  assignedCarbs: number
  /** Positive when carbs are still missing, negative when over the goal */
  remainingCarbs: number
  /** Fraction of the goal covered, clamped to [0, 1] for progress bars */
  percent: number
}

export interface BuildProgress {
  legs: LegBuildProgress[]
  goalCarbs: number
  assignedCarbs: number
  remainingCarbs: number
}

function sumAssignedCarbs(items: BuildItem[], legKey: LegKey | 'race'): number {
  return items
    .filter((item) => item.leg === legKey)
    .reduce((total, item) => total + buildItemCarbs(item), 0)
}

function toLegProgress(leg: LegPlan, items: BuildItem[]): LegBuildProgress {
  const goalCarbs = leg.totalCarbs
  const assignedCarbs = sumAssignedCarbs(items, leg.key)
  const percent = goalCarbs > 0 ? Math.min(1, assignedCarbs / goalCarbs) : 0
  return {
    key: leg.key,
    durationMin: leg.durationMin,
    goalCarbs,
    assignedCarbs,
    remainingCarbs: goalCarbs - assignedCarbs,
    percent,
  }
}

/**
 * Overlays the interactive build items onto the computed carb goals. The plan
 * defines the target per leg (Auto mode); this reports how much of each target
 * the assigned items cover, without touching the underlying calculation.
 */
export function computeBuildProgress(
  plan: RacePlan,
  items: BuildItem[],
): BuildProgress {
  const legs = plan.legs.map((leg) => toLegProgress(leg, items))
  const goalCarbs = legs.reduce((total, leg) => total + leg.goalCarbs, 0)
  const assignedCarbs = legs.reduce((total, leg) => total + leg.assignedCarbs, 0)
  return {
    legs,
    goalCarbs,
    assignedCarbs,
    remainingCarbs: goalCarbs - assignedCarbs,
  }
}

/** Recomputes a leg's gel cadence from the gels actually placed in Build mode */
function applyBuildGelsToLeg(leg: LegPlan, items: BuildItem[]): LegPlan {
  const gelItems = items.filter(
    (item) => item.leg === leg.key && item.kind === 'gel',
  )
  const totalGels = gelItems.reduce((count, item) => count + item.count, 0)
  const sips = leg.hourlyEvents.filter((event) => event.kind !== 'gel')

  if (totalGels === 0) {
    return {
      ...leg,
      totalGels: 0,
      gelsPerHour: 0,
      gelIntervalMin: null,
      hourlyEvents: sips,
    }
  }

  const totalGelCarbs = gelItems.reduce(
    (carbs, item) => carbs + buildItemCarbs(item),
    0,
  )
  const gelIntervalMin = Math.max(5, Math.round(leg.durationMin / totalGels))
  const hourlyEvents = [...sips, ...placeGelEvents(gelIntervalMin)].sort(
    (a, b) => a.minute - b.minute,
  )

  return {
    ...leg,
    totalGels,
    gelCarbs: Math.round(totalGelCarbs / totalGels),
    gelsPerHour: leg.hours > 0 ? totalGels / leg.hours : 0,
    gelIntervalMin,
    hourlyEvents,
  }
}

/**
 * Produces a plan whose per-leg gel cadence reflects the gels placed in Build
 * mode instead of the gear assumptions, so the timeline matches the build.
 * Sip/fluid cadence is left untouched.
 */
export function applyBuildItemsToPlan(
  plan: RacePlan,
  items: BuildItem[],
): RacePlan {
  return {
    ...plan,
    legs: plan.legs.map((leg) => applyBuildGelsToLeg(leg, items)),
  }
}
