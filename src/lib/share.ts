import type {
  BuildItem,
  BuildItemKind,
  FuelSource,
  LegInput,
  LegKey,
  PlanInput,
  Sport,
  Temperature,
} from './fueling'
import {
  CARBS_MAX,
  CARBS_MIN,
  DEFAULT_CONFIG,
  DEFAULT_TRI_LEGS,
  DURATION_MAX,
  DURATION_MIN,
  TRI_LEG_BOUNDS,
} from './fueling'

const SPORT_IDS: Sport[] = ['triathlon', 'cycling', 'running']
const TEMPERATURES: Temperature[] = ['cool', 'mild', 'hot']
const FUEL_SOURCES: FuelSource[] = ['combo', 'gels', 'diy']

/**
 * Build items are packed into a single `b` param as `-`-separated entries.
 * Each entry: `<kind><carbs>[m<ml>]x<count>.<leg>` — e.g. `g25x6.race`,
 * `b60m750x2.bike`. Compact and URL-safe without percent-encoding.
 */
const BUILD_ITEM_PATTERN =
  /^([gb])(\d+)(?:m(\d+))?x(\d+)\.(swim|bike|run|race)$/

function encodeBuildItem(item: BuildItem): string {
  const kind = item.kind === 'gel' ? 'g' : 'b'
  const ml = item.kind === 'bottle' && item.ml ? `m${item.ml}` : ''
  return `${kind}${item.carbs}${ml}x${item.count}.${item.leg}`
}

function decodeBuildItem(token: string, index: number): BuildItem | null {
  const match = BUILD_ITEM_PATTERN.exec(token)
  if (!match) return null
  const [, kindChar, carbs, ml, count, leg] = match
  const kind: BuildItemKind = kindChar === 'g' ? 'gel' : 'bottle'
  return {
    id: `shared-${index}`,
    kind,
    carbs: clamp(Number(carbs), 1, 300),
    ml: kind === 'bottle' && ml ? clamp(Number(ml), 100, 2000) : undefined,
    count: clamp(Number(count), 1, 99),
    leg: leg as LegKey | 'race',
  }
}

export function encodeBuildItems(items: BuildItem[]): string {
  return items.map(encodeBuildItem).join('-')
}

export function decodeBuildItems(raw: string): BuildItem[] {
  return raw
    .split('-')
    .map((token, index) => decodeBuildItem(token, index))
    .filter((item): item is BuildItem => item !== null)
}

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
  // Advanced settings travel only when they differ from the defaults
  if (input.fuelSource !== 'combo') params.set('fs', input.fuelSource)
  const { config } = input
  if (config.temperature !== DEFAULT_CONFIG.temperature) {
    params.set('t', config.temperature)
  }
  if (config.gelCarbs !== DEFAULT_CONFIG.gelCarbs) {
    params.set('gel', String(config.gelCarbs))
  }
  if (config.bottleMl !== DEFAULT_CONFIG.bottleMl) {
    params.set('btl', String(config.bottleMl))
  }
  if (input.buildItems.length > 0) {
    params.set('b', encodeBuildItems(input.buildItems))
  }
  return `${location.origin}${location.pathname}?${params.toString()}`
}

/** True when a shared link carries Build-mode items */
export function hasBuildParams(search: string): boolean {
  return new URLSearchParams(search).has('b')
}

/** True when a shared link carries settings only visible in advanced mode */
export function hasAdvancedParams(search: string): boolean {
  const params = new URLSearchParams(search)
  // Legacy g=0 meant DIY-only
  if (params.get('g') === '0' || (params.has('fs') && params.get('fs') !== 'combo')) {
    return true
  }
  if (params.has('t') || params.has('gel') || params.has('btl')) return true
  const r = params.get('r')
  return r !== null && r !== '1:0.8'
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

  const fs = params.get('fs') as FuelSource | null
  if (fs && FUEL_SOURCES.includes(fs)) {
    result.fuelSource = fs
  } else {
    // Legacy: g=0 meant DIY-only, g=1 meant gels + mix
    const g = params.get('g')
    if (g === '0') result.fuelSource = 'diy'
    else if (g === '1') result.fuelSource = 'combo'
  }

  const r = params.get('r')
  if (r) {
    const [rg, rf] = r.split(':').map(Number)
    if (Number.isFinite(rg) && Number.isFinite(rf) && rg > 0 && rf >= 0) {
      result.ratio = {
        glucose: clamp(rg, 0.1, 10),
        fructose: clamp(rf, 0, 10),
      }
    }
  }

  const config = { ...DEFAULT_CONFIG }
  let hasConfig = false
  const t = params.get('t') as Temperature | null
  if (t && TEMPERATURES.includes(t)) {
    config.temperature = t
    hasConfig = true
  }
  const gel = numParam(params, 'gel')
  if (gel !== null) {
    config.gelCarbs = clamp(gel, 15, 60)
    hasConfig = true
  }
  const btl = numParam(params, 'btl')
  if (btl !== null) {
    config.bottleMl = clamp(btl, 300, 1500)
    hasConfig = true
  }
  if (hasConfig) result.config = config

  const rawBuild = params.get('b')
  if (rawBuild) {
    const items = decodeBuildItems(rawBuild)
    if (items.length > 0) result.buildItems = items
  }

  return Object.keys(result).length ? result : null
}
