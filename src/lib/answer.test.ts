import { describe, expect, it } from 'vitest'
import { normalizeNumber } from './answer'

describe('normalizeNumber', () => {
  it.each([
    ['1,430,000', '1430000'],
    ['1，430，000', '1430000'],
    [' 63963 ', '63963'],
    ['007', '7'],
    ['0', '0'],
    ['000', '0'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeNumber(input)).toBe(expected)
  })
})
