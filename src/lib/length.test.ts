import { describe, expect, it } from 'vitest'
import { kmText, lengthInMm } from './length'

describe('長度換算', () => {
  it.each([
    ['40 公里', 40_000_000],
    ['45 公里 67 公尺', 45_067_000],
    ['100001 公分', 1_000_010],
    ['8km', 8_000_000],
    ['80000 cm', 800_000],
    ['12 km 30 m', 12_030_000],
    ['2 毫米', 2],
  ])('%s → %i 毫米', (s, mm) => {
    expect(lengthInMm(s)).toBe(mm)
  })

  it('不是長度格式就回傳 null', () => {
    expect(lengthInMm('84?6600')).toBeNull()
    expect(lengthInMm('6789萬')).toBeNull()
    expect(lengthInMm('5 公里 多一點')).toBeNull()
  })

  it('公尺數寫成公里公尺', () => {
    expect(kmText(5500)).toBe('5 公里 500 公尺')
    expect(kmText(3000)).toBe('3 公里')
    expect(kmText(850)).toBe('850 公尺')
  })
})
