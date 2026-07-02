import type { LegInput, LegKey, PlanInput, Sport } from './fueling'
import {
  CARBS_MAX,
  CARBS_MIN,
  DEFAULT_TRI_LEGS,
  DURATION_MAX,
  DURATION_MIN,
  TRI_LEG_BOUNDS,
} from './fueling'

const SPORT_IDS: Sport[] = ['triathlon', 'cycling', 'running']

export function buildShareUrl(input: PlanInput): string {
  const params = new URLSearchParams({ s: input.sport })
  if (input.sport === 'triathlon') {
    const { swim, bike, run } = input.triLegs
    params.set('ds', String(swim.durationMin))
    params.set('db', String(bike.durationMin))
    params.set('dr', String(run.durationMin))
    params.set('cb', String(bike.carbsPerHour))
    params.set('cr', String(run.carbsPerHour))
  } else {
    params.set('d', String(input.durationMin))
    params.set('c', String(input.carbsPerHour))
  }
  params.set('r', `${input.ratio.glucose}:${input.ratio.fructose}`)
  return `${location.origin}${location.pathname}?${params.toString()}`
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

const numParam = (params: URLSearchParams, key: string): number | null => {
  const v = Number(params.get(key))
  return params.has(key) && Number.isFinite(v) && v > 0 ? Math.round(v) : null
}

function parseTriLegs(
  params: URLSearchParams,
  legacyDuration: number | null,
  legacyCarbs: number | null,
): Record<LegKey, LegInput> {
  const legs: Record<LegKey, LegInput> = {
    swim: { ...DEFAULT_TRI_LEGS.swim },
    bike: { ...DEFAULT_TRI_LEGS.bike },
    run: { ...DEFAULT_TRI_LEGS.run },
  }

  const durations: [LegKey, string][] = [
    ['swim', 'ds'],
    ['bike', 'db'],
    ['run', 'dr'],
  ]
  for (const [key, param] of durations) {
    const v = numParam(params, param)
    const { min, max } = TRI_LEG_BOUNDS[key]
    if (v !== null) legs[key].durationMin = clamp(v, min, max)
  }

  const carbs: [Exclude<LegKey, 'swim'>, string][] = [
    ['bike', 'cb'],
    ['run', 'cr'],
  ]
  for (const [key, param] of carbs) {
    const v = numParam(params, param)
    if (v !== null) legs[key].carbsPerHour = clamp(v, CARBS_MIN, CARBS_MAX)
  }

  // Legacy links carried one total duration and one carb target — split the
  // duration into typical race proportions and apply the target to both legs.
  const hasPerLeg = ['ds', 'db', 'dr', 'cb', 'cr'].some((p) => params.has(p))
  if (!hasPerLeg && legacyDuration !== null) {
    const swim = Math.round((legacyDuration * 0.12) / 5) * 5
    const run = Math.round((legacyDuration * 0.35) / 5) * 5
    legs.swim.durationMin = clamp(swim, TRI_LEG_BOUNDS.swim.min, TRI_LEG_BOUNDS.swim.max)
    legs.run.durationMin = clamp(run, TRI_LEG_BOUNDS.run.min, TRI_LEG_BOUNDS.run.max)
    legs.bike.durationMin = clamp(
      legacyDuration - swim - run,
      TRI_LEG_BOUNDS.bike.min,
      TRI_LEG_BOUNDS.bike.max,
    )
  }
  if (!hasPerLeg && legacyCarbs !== null) {
    legs.bike.carbsPerHour = clamp(legacyCarbs, CARBS_MIN, CARBS_MAX)
    legs.run.carbsPerHour = clamp(legacyCarbs, CARBS_MIN, CARBS_MAX)
  }

  return legs
}

export function parseShareUrl(search: string): Partial<PlanInput> | null {
  const params = new URLSearchParams(search)
  if (![...params.keys()].length) return null

  const result: Partial<PlanInput> = {}

  const sport = params.get('s') as Sport | null
  if (sport && SPORT_IDS.includes(sport)) result.sport = sport

  const d = numParam(params, 'd')
  if (d !== null) result.durationMin = clamp(d, DURATION_MIN, DURATION_MAX)

  const c = numParam(params, 'c')
  if (c !== null) result.carbsPerHour = clamp(c, CARBS_MIN, CARBS_MAX)

  if (result.sport === 'triathlon') {
    result.triLegs = parseTriLegs(params, d, c)
  }

  const r = params.get('r')
  if (r) {
    const [g, f] = r.split(':').map(Number)
    if (Number.isFinite(g) && Number.isFinite(f) && g > 0 && f >= 0) {
      result.ratio = {
        glucose: clamp(g, 0.1, 10),
        fructose: clamp(f, 0, 10),
      }
    }
  }

  return Object.keys(result).length ? result : null
}
