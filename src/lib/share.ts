import type { PlanInput, Sport } from './fueling'
import {
  CARBS_MAX,
  CARBS_MIN,
  DURATION_MAX,
  DURATION_MIN,
} from './fueling'

const SPORT_IDS: Sport[] = ['triathlon', 'cycling', 'running']

export function buildShareUrl(input: PlanInput): string {
  const params = new URLSearchParams({
    s: input.sport,
    d: String(input.durationMin),
    c: String(input.carbsPerHour),
    r: `${input.ratio.glucose}:${input.ratio.fructose}`,
  })
  return `${location.origin}${location.pathname}?${params.toString()}`
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export function parseShareUrl(search: string): Partial<PlanInput> | null {
  const params = new URLSearchParams(search)
  if (![...params.keys()].length) return null

  const result: Partial<PlanInput> = {}

  const sport = params.get('s') as Sport | null
  if (sport && SPORT_IDS.includes(sport)) result.sport = sport

  const d = Number(params.get('d'))
  if (Number.isFinite(d) && d > 0) {
    result.durationMin = clamp(Math.round(d), DURATION_MIN, DURATION_MAX)
  }

  const c = Number(params.get('c'))
  if (Number.isFinite(c) && c > 0) {
    result.carbsPerHour = clamp(Math.round(c), CARBS_MIN, CARBS_MAX)
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
