import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PlanInput } from './fueling'
import { DEFAULT_CONFIG, DEFAULT_TRI_LEGS } from './fueling'
import { buildShareUrl, hasAdvancedParams, parseShareUrl } from './share'

const baseInput = (overrides: Partial<PlanInput> = {}): PlanInput => ({
  sport: 'cycling',
  durationMin: 240,
  carbsPerHour: 90,
  triLegs: structuredClone(DEFAULT_TRI_LEGS),
  ratio: { glucose: 1, fructose: 0.8 },
  fuelSource: 'combo',
  config: { ...DEFAULT_CONFIG },
  ...overrides,
})

beforeEach(() => {
  vi.stubGlobal('location', {
    origin: 'https://example.test',
    pathname: '/fuelcast/',
  })
})

const search = (url: string) => new URL(url).search

describe('buildShareUrl', () => {
  it('encodes single-sport plans compactly', () => {
    const url = buildShareUrl(baseInput())
    expect(url).toBe(
      'https://example.test/fuelcast/?s=cycling&d=240&c=90&r=1%3A0.8',
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
