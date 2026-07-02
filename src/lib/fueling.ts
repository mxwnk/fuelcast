export type Sport = 'triathlon' | 'cycling' | 'running'

export interface Ratio {
  glucose: number
  fructose: number
}

export interface PlanInput {
  sport: Sport
  durationMin: number
  carbsPerHour: number
  ratio: Ratio
}

export interface TimelineEvent {
  minute: number
  kind: 'gel' | 'sip'
  label: string
}

export interface FuelPlan {
  hours: number
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
  /** Race totals */
  totalGels: number
  totalFluidL: number
  totalMaltodextrin: number
  totalFructosePowder: number
  totalBottles: number
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

export function computePlan(input: PlanInput): FuelPlan {
  const { durationMin, carbsPerHour, ratio } = input
  const hours = durationMin / 60
  const parts = ratio.glucose + ratio.fructose
  const glucosePerHour = (carbsPerHour * ratio.glucose) / parts
  const fructosePerHour = (carbsPerHour * ratio.fructose) / parts

  const totalCarbs = carbsPerHour * hours
  const totalGlucose = glucosePerHour * hours
  const totalFructose = fructosePerHour * hours

  // Recommended combo: one 750 ml bottle per hour carries the drink mix,
  // gels cover whatever a moderate mix concentration doesn't.
  const gelsPerHour = Math.max(0, Math.round((carbsPerHour - 40) / GEL_CARBS))
  const drinkCarbsPerHour = carbsPerHour - gelsPerHour * GEL_CARBS
  const fluidMlPerHour = BOTTLE_ML

  const gelIntervalMin =
    gelsPerHour > 0 ? Math.round(60 / gelsPerHour) : null
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

  const totalGels = Math.ceil(gelsPerHour * hours)
  const totalFluidL = (fluidMlPerHour * hours) / 1000
  const totalBottles = Math.ceil((fluidMlPerHour * hours) / BOTTLE_ML)

  const warnings: string[] = []
  if (glucosePerHour > 65) {
    warnings.push(
      `Glucose absorption tops out around 60 g/h — your plan delivers ${Math.round(
        glucosePerHour,
      )} g/h. Consider shifting to a 1:0.8 ratio.`,
    )
  }
  if (carbsPerHour >= 90) {
    warnings.push(
      'Intakes of 90 g/h and above need gut training — practice this in workouts before race day.',
    )
  }

  return {
    hours,
    glucosePerHour,
    fructosePerHour,
    totalCarbs,
    totalGlucose,
    totalFructose,
    gelsPerHour,
    drinkCarbsPerHour,
    fluidMlPerHour,
    gelIntervalMin,
    sipIntervalMin,
    sipMl,
    hourlyEvents,
    totalGels,
    totalFluidL,
    totalMaltodextrin: totalGlucose,
    totalFructosePowder: totalFructose,
    totalBottles,
    warnings,
  }
}
