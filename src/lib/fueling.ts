export type Sport = 'triathlon' | 'cycling' | 'running'
export type LegKey = 'swim' | 'bike' | 'run'

export interface Ratio {
  glucose: number
  fructose: number
}

export interface LegInput {
  durationMin: number
  carbsPerHour: number
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
}

export interface TimelineEvent {
  minute: number
  kind: 'gel' | 'sip'
  label: string
}

export interface LegPlan {
  key: LegKey | 'race'
  label: string
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
  drinkCarbsPerHour: number
  fluidMlPerHour: number
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

export interface RacePlan {
  /** Fueled legs: bike + run for triathlon, a single leg otherwise */
  legs: LegPlan[]
  /** Swim duration counts toward race time but carries no intake */
  swimDurationMin: number
  totalDurationMin: number
  totalCarbs: number
  totalGlucose: number
  totalFructose: number
  totalGels: number
  totalFluidL: number
  totalBottles: number
  totalMaltodextrin: number
  totalFructosePowder: number
  warnings: string[]
}

export const GEL_CARBS = 25 // g carbs per typical gel
export const BOTTLE_ML = 750

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

export const LEG_LABELS: Record<LegKey, string> = {
  swim: 'Swim',
  bike: 'Bike',
  run: 'Run',
}

export const DEFAULT_TRI_LEGS: Record<LegKey, LegInput> = {
  swim: { durationMin: 40, carbsPerHour: 0 },
  bike: { durationMin: 165, carbsPerHour: 90 },
  run: { durationMin: 110, carbsPerHour: 65 },
}

export const RATIO_PRESETS: { label: string; ratio: Ratio }[] = [
  { label: '2:1', ratio: { glucose: 2, fructose: 1 } },
  { label: '1:0.8', ratio: { glucose: 1, fructose: 0.8 } },
  { label: '1:1', ratio: { glucose: 1, fructose: 1 } },
]

export const SPORTS: { id: Sport; label: string }[] = [
  { id: 'triathlon', label: 'Triathlon' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'running', label: 'Running' },
]

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
  label: string,
  durationMin: number,
  carbsPerHour: number,
  ratio: Ratio,
): LegPlan {
  const hours = durationMin / 60
  const parts = ratio.glucose + ratio.fructose
  const glucosePerHour = (carbsPerHour * ratio.glucose) / parts
  const fructosePerHour = (carbsPerHour * ratio.fructose) / parts

  // Recommended combo: one 750 ml bottle per hour carries the drink mix,
  // gels cover whatever a moderate mix concentration doesn't.
  const gelsPerHour = Math.max(0, Math.round((carbsPerHour - 40) / GEL_CARBS))
  const drinkCarbsPerHour = carbsPerHour - gelsPerHour * GEL_CARBS
  const fluidMlPerHour = BOTTLE_ML

  const gelIntervalMin = gelsPerHour > 0 ? Math.round(60 / gelsPerHour) : null
  const sipIntervalMin = 15
  const sipMl = Math.round(BOTTLE_ML / (60 / sipIntervalMin) / 10) * 10

  const hourlyEvents: TimelineEvent[] = []
  for (let m = sipIntervalMin; m <= 60; m += sipIntervalMin) {
    hourlyEvents.push({ minute: m, kind: 'sip', label: `Sip ~${sipMl} ml` })
  }
  if (gelsPerHour > 0 && gelIntervalMin) {
    // Center gels within the hour: 1 gel → :30, 2 → :15/:45, 3 → :10/:30/:50
    for (let i = 0; i < gelsPerHour; i++) {
      const m = Math.round(gelIntervalMin / 2 + i * gelIntervalMin)
      hourlyEvents.push({ minute: m, kind: 'gel', label: `1 gel (${GEL_CARBS} g)` })
    }
  }
  hourlyEvents.sort((a, b) => a.minute - b.minute)

  return {
    key,
    label,
    durationMin,
    hours,
    carbsPerHour,
    glucosePerHour,
    fructosePerHour,
    totalCarbs: carbsPerHour * hours,
    totalGlucose: glucosePerHour * hours,
    totalFructose: fructosePerHour * hours,
    gelsPerHour,
    drinkCarbsPerHour,
    fluidMlPerHour,
    gelIntervalMin,
    sipIntervalMin,
    sipMl,
    hourlyEvents,
    totalGels: Math.ceil(gelsPerHour * hours),
    totalFluidL: (fluidMlPerHour * hours) / 1000,
    totalBottles: Math.ceil((fluidMlPerHour * hours) / BOTTLE_ML),
  }
}

export function computePlan(input: PlanInput): RacePlan {
  const isTri = input.sport === 'triathlon'

  const legs: LegPlan[] = isTri
    ? (['bike', 'run'] as const).map((key) =>
        computeLeg(
          key,
          LEG_LABELS[key],
          input.triLegs[key].durationMin,
          input.triLegs[key].carbsPerHour,
          input.ratio,
        ),
      )
    : [computeLeg('race', 'Race', input.durationMin, input.carbsPerHour, input.ratio)]

  const swimDurationMin = isTri ? input.triLegs.swim.durationMin : 0
  const sum = (pick: (leg: LegPlan) => number) =>
    legs.reduce((acc, leg) => acc + pick(leg), 0)

  const warnings: string[] = []
  for (const leg of legs) {
    if (leg.glucosePerHour > 65) {
      const prefix = isTri ? `${leg.label}: ` : ''
      warnings.push(
        `${prefix}Glucose absorption tops out around 60 g/h — this plan delivers ${Math.round(
          leg.glucosePerHour,
        )} g/h. Consider shifting to a 1:0.8 ratio.`,
      )
    }
  }
  if (legs.some((leg) => leg.carbsPerHour >= 90)) {
    warnings.push(
      'Intakes of 90 g/h and above need gut training — practice this in workouts before race day.',
    )
  }
  if (isTri) {
    const [bike, run] = legs
    if (run.carbsPerHour > bike.carbsPerHour) {
      warnings.push(
        'Your run target is higher than your bike target — most athletes fuel hardest on the bike, where the gut tolerates more, and back off on the run.',
      )
    }
  }

  return {
    legs,
    swimDurationMin,
    totalDurationMin: swimDurationMin + sum((l) => l.durationMin),
    totalCarbs: sum((l) => l.totalCarbs),
    totalGlucose: sum((l) => l.totalGlucose),
    totalFructose: sum((l) => l.totalFructose),
    totalGels: sum((l) => l.totalGels),
    totalFluidL: sum((l) => l.totalFluidL),
    totalBottles: sum((l) => l.totalBottles),
    totalMaltodextrin: sum((l) => l.totalGlucose),
    totalFructosePowder: sum((l) => l.totalFructose),
    warnings,
  }
}
