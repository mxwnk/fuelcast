import { describe, expect, it } from 'vitest'
import { DICT } from './i18n'

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g

const placeholders = (text: string): string[] =>
  [...text.matchAll(PLACEHOLDER_PATTERN)].map((m) => m[1]).sort()

describe('translation dictionary', () => {
  it('has the same keys in English and German', () => {
    expect(Object.keys(DICT.de).sort()).toEqual(Object.keys(DICT.en).sort())
  })

  it('uses the same placeholders in both languages', () => {
    const de = DICT.de as Record<string, string>
    for (const [key, enText] of Object.entries<string>(DICT.en)) {
      expect(placeholders(de[key] ?? ''), key).toEqual(placeholders(enText))
    }
  })
})
