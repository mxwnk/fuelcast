import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PlanInput } from './fueling'
import { DEFAULT_CONFIG, DEFAULT_TRI_LEGS } from './fueling'
import { buildShareUrl, hasAdvancedParams, hasBuildParams, parseShareUrl } from './share'

const baseInput = (overrides: Partial<PlanInput> = {}): PlanInput => ({
  sport: 'cycling',
  durationMin: 240,
  carbsPerHour: 90,
  triLegs: structuredClone(DEFAULT_TRI_LEGS),
  ratio: { glucose: 1, fructose: 0.8 },
  fuelSource: 'combo',
  config: { ...DEFAULT_CONFIG },
  buildItems: [],
  ...overrides,
})

beforeEach(() => {
  vi.stubGlobal('location', {
    origin: 'https://example.test',
    pathname: '/',
  })
})

const search = (url: string) => new URL(url).search

describe('buildShareUrl', () => {
  it('encodes single-sport plans compactly', () => {
    const url = buildShareUrl(baseInput())
    expect(url).toBe(
      'https://example.test/?s=cycling&d=240&c=90&r=1%3A0.8',
    )
  })

  it('encodes triathlon legs individually', () => {
    const url = buildShareUrl(baseInput({ sport: 'triathlon' }))
    const params = new URL(url).searchParams
    expect(params.get('ds')).toBe('40')
    expect(params.get('db')).toBe('165')
    expect(params.get('dr')).toBe('110')
    expect(params.get('cb')).toBe('90')
    expect(params.get('cr')).toBe('65')
  })

  it('only includes advanced params when they differ from defaults', () => {
    const plain = new URL(buildShareUrl(baseInput())).searchParams
    expect(plain.has('fs')).toBe(false)
    expect(plain.has('t')).toBe(false)
    expect(plain.has('gel')).toBe(false)
    expect(plain.has('btl')).toBe(false)

    const custom = new URL(
      buildShareUrl(
        baseInput({
          fuelSource: 'gels',
          config: { gelCarbs: 40, bottleMl: 500, temperature: 'hot' },
        }),
      ),
    ).searchParams
    expect(custom.get('fs')).toBe('gels')
    expect(custom.get('t')).toBe('hot')
    expect(custom.get('gel')).toBe('40')
    expect(custom.get('btl')).toBe('500')
  })
})

describe('parseShareUrl', () => {
  it('round-trips a full input', () => {
    const input = baseInput({
      sport: 'triathlon',
      fuelSource: 'gels',
      ratio: { glucose: 2, fructose: 1 },
      config: { gelCarbs: 30, bottleMl: 950, temperature: 'cool' },
    })
    input.triLegs.bike.carbsPerHour = 100
    const parsed = parseShareUrl(search(buildShareUrl(input)))
    expect(parsed?.sport).toBe('triathlon')
    expect(parsed?.fuelSource).toBe('gels')
    expect(parsed?.ratio).toEqual({ glucose: 2, fructose: 1 })
    expect(parsed?.config).toEqual({
      gelCarbs: 30,
      bottleMl: 950,
      temperature: 'cool',
    })
    expect(parsed?.triLegs?.bike.carbsPerHour).toBe(100)
  })

  it('returns null for an empty query', () => {
    expect(parseShareUrl('')).toBeNull()
  })

  it('clamps out-of-range values', () => {
    const parsed = parseShareUrl('?s=cycling&d=99999&c=999')
    expect(parsed?.durationMin).toBe(720)
    expect(parsed?.carbsPerHour).toBe(120)
  })

  it('ignores invalid values', () => {
    const parsed = parseShareUrl('?s=swimming&d=abc&r=banana')
    expect(parsed?.sport).toBeUndefined()
    expect(parsed?.durationMin).toBeUndefined()
    expect(parsed?.ratio).toBeUndefined()
  })

  it('splits legacy triathlon links into per-leg durations', () => {
    const parsed = parseShareUrl('?s=triathlon&d=300&c=80')
    const legs = parsed?.triLegs
    expect(legs).toBeDefined()
    const total =
      legs!.swim.durationMin + legs!.bike.durationMin + legs!.run.durationMin
    expect(total).toBe(300)
    expect(legs!.bike.carbsPerHour).toBe(80)
    expect(legs!.run.carbsPerHour).toBe(80)
  })

  it('maps the legacy g=0 param to DIY-only', () => {
    expect(parseShareUrl('?s=cycling&d=180&c=90&g=0')?.fuelSource).toBe('diy')
  })

  it('parses the fuel source param', () => {
    expect(parseShareUrl('?s=cycling&fs=gels')?.fuelSource).toBe('gels')
    expect(parseShareUrl('?s=cycling&fs=bogus')?.fuelSource).toBeUndefined()
  })
})

describe('build items', () => {
  it('round-trips gels and bottles per leg', () => {
    const input = baseInput({
      sport: 'triathlon',
      buildItems: [
        { id: 'a', kind: 'gel', carbs: 25, count: 6, leg: 'bike' },
        { id: 'b', kind: 'bottle', carbs: 60, ml: 750, count: 2, leg: 'bike' },
        { id: 'c', kind: 'gel', carbs: 30, count: 3, leg: 'run' },
      ],
    })
    const parsed = parseShareUrl(search(buildShareUrl(input)))
    const items = parsed?.buildItems
    expect(items).toHaveLength(3)
    expect(items?.[0]).toMatchObject({ kind: 'gel', carbs: 25, count: 6, leg: 'bike' })
    expect(items?.[1]).toMatchObject({
      kind: 'bottle',
      carbs: 60,
      ml: 750,
      count: 2,
      leg: 'bike',
    })
    expect(items?.[2]).toMatchObject({ kind: 'gel', carbs: 30, count: 3, leg: 'run' })
  })

  it('omits the build param when no items are present', () => {
    const url = buildShareUrl(baseInput())
    expect(url).not.toContain('b=')
  })

  it('ignores malformed item tokens', () => {
    const parsed = parseShareUrl('?s=cycling&b=g25x6.race-garbage-b60m750x2.run')
    expect(parsed?.buildItems).toHaveLength(2)
  })
})

describe('hasBuildParams', () => {
  it('is true only when a build param is present', () => {
    expect(hasBuildParams('?s=cycling&b=g25x6.race')).toBe(true)
    expect(hasBuildParams('?s=cycling&d=180&c=90')).toBe(false)
  })
})

describe('hasAdvancedParams', () => {
  it('is false for simple links', () => {
    expect(hasAdvancedParams('?s=cycling&d=240&c=90')).toBe(false)
    expect(hasAdvancedParams('?s=cycling&d=240&c=90&r=1:0.8')).toBe(false)
  })

  it('is true for non-default ratio, fuel source or config', () => {
    expect(hasAdvancedParams('?r=2:1')).toBe(true)
    expect(hasAdvancedParams('?fs=gels')).toBe(true)
    expect(hasAdvancedParams('?fs=diy')).toBe(true)
    expect(hasAdvancedParams('?g=0')).toBe(true)
    expect(hasAdvancedParams('?t=hot')).toBe(true)
    expect(hasAdvancedParams('?gel=40')).toBe(true)
    expect(hasAdvancedParams('?btl=500')).toBe(true)
  })
})
