import { describe, expect, it } from 'vitest'
import { units } from '../data/units'
import { longDivisionSteps, quotientShape, similarDivision } from './longDivision'

const last = <T,>(xs: T[]) => xs[xs.length - 1]
const rowsText = (dividend: number, divisor: number) =>
  last(longDivisionSteps(dividend, divisor)).board.rows.map((r) => `${r.kind}:${r.text}@${r.endCol}`)

/** 把每一列的文字照位數排開，方便檢查有沒有對齊（像課本上的直式） */
function layout(dividend: number, divisor: number) {
  const board = last(longDivisionSteps(dividend, divisor)).board
  const n = String(dividend).length
  const line = (text: string, endCol: number) => {
    const cells = Array(n).fill(' ')
    ;[...text].forEach((c, j) => (cells[endCol - text.length + 1 + j] = c))
    return cells.join('').trimEnd()
  }
  return [board.quotient.map((c) => c || ' ').join('').trimEnd(), String(dividend), ...board.rows.map((r) => line(r.text, r.endCol))]
}

describe('直式除法步驟', () => {
  it('816 ÷ 23：第一位不夠分，商從十位開始', () => {
    expect(layout(816, 23)).toEqual([' 35', '816', '69', '126', '115', ' 11'].map((s) => s.trimEnd()))
    expect(longDivisionSteps(816, 23)[0].say).toContain('8 比 23 小')
  })

  it('1507 ÷ 5：中間不夠分要寫 0', () => {
    expect(layout(1507, 5)).toEqual([' 301', '1507', '15', '   7', '   5', '   2'].map((s) => s.trimEnd()))
    expect(longDivisionSteps(1507, 5).some((s) => s.say.includes('商寫 0'))).toBe(true)
  })

  it('剛好整除時餘數是 0', () => {
    expect(last(rowsText(2160, 6))).toBe('rest:0@3')
    expect(last(longDivisionSteps(2160, 6)).say).toContain('剛好分完')
  })

  it('隨機題目：商、每一列乘積、最後的餘數都正確', () => {
    for (let t = 0; t < 2000; t++) {
      const divisor = 2 + Math.floor(Math.random() * 98)
      const dividend = divisor + Math.floor(Math.random() * 99999)
      const steps = longDivisionSteps(dividend, divisor)
      const board = last(steps).board
      const q = Math.floor(dividend / divisor)
      expect(Number(board.quotient.join(''))).toBe(q)
      // 商最左邊那一位不是 0（不寫前導 0），之後每一位都要寫
      const firstQ = board.quotient.findIndex((c) => c !== '')
      expect(board.quotient[firstQ]).not.toBe('0')
      expect(board.quotient.slice(firstQ).every((c) => c !== '')).toBe(true)
      expect(Number(last(board.rows).text)).toBe(dividend % divisor)
      for (const r of board.rows) {
        expect(r.endCol - r.text.length + 1).toBeGreaterThanOrEqual(0)
        if (r.kind === 'product') expect(Number(r.text) % divisor).toBe(0)
      }
      // 每一步都只多寫一點點：列數不會變少
      for (let k = 1; k < steps.length; k++) {
        expect(steps[k].board.rows.length).toBeGreaterThanOrEqual(steps[k - 1].board.rows.length)
      }
    }
  })

  it('範例題：位數一樣、商裡的 0 在同樣的位置、不是原題', () => {
    for (const [a, b] of [[816, 23], [1507, 5], [2160, 6], [3294, 15], [97, 12], [5501, 46]]) {
      for (let t = 0; t < 30; t++) {
        const s = similarDivision(a, b)
        expect(String(s.dividend).length).toBe(String(a).length)
        expect(String(s.divisor).length).toBe(String(b).length)
        expect(s.divisor).toBeGreaterThanOrEqual(2)
        expect(quotientShape(s.dividend, s.divisor)).toBe(quotientShape(a, b))
        expect(s.dividend === a && s.divisor === b).toBe(false)
      }
    }
  })

  it('題庫裡的每一題直式除法都能一步一步算', () => {
    const divides = units.flatMap((u) => [...u.tasks, u.boss]).flatMap((t) => t.questions).filter((q) => q.type === 'divide')
    expect(divides.length).toBeGreaterThan(5)
    for (const q of divides) {
      const steps = longDivisionSteps(q.dividend, q.divisor)
      expect(Number(last(steps).board.quotient.join(''))).toBe(Math.floor(q.dividend / q.divisor))
    }
  })
})
