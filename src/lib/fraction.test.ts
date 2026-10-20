import { describe, expect, it } from 'vitest'
import { chineseNumber, mixedText, parseFraction, speakFractions } from './fraction'

describe('分數文字', () => {
  it('讀得懂真分數、假分數、帶分數和整數', () => {
    expect(parseFraction('3/5')).toBeCloseTo(0.6)
    expect(parseFraction('16/5')).toBeCloseTo(3.2)
    expect(parseFraction('2 3/5')).toBeCloseTo(2.6)
    expect(parseFraction('6')).toBe(6)
    expect(parseFraction('3 公尺')).toBeNull()
  })

  it('讀得懂國字分數', () => {
    expect(chineseNumber('十')).toBe(10)
    expect(chineseNumber('十七')).toBe(17)
    expect(chineseNumber('四十二')).toBe(42)
    expect(chineseNumber('十十')).toBeNull()
    expect(parseFraction('十七分之十二')).toBeCloseTo(12 / 17)
    expect(parseFraction('五又九分之四')).toBeCloseTo(5 + 4 / 9)
    expect(parseFraction('七分之四十二')).toBe(6)
  })

  it('假分數換帶分數', () => {
    expect(mixedText(17, 5)).toBe('3 2/5')
    expect(mixedText(16, 8)).toBe('2')
    expect(mixedText(3, 5)).toBe('3/5')
  })

  it('朗讀時唸成「幾又幾分之幾」', () => {
    expect(speakFractions('2 3/5 和 16/5')).toBe('2又5分之3 和 5分之16')
  })
})
