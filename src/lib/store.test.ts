import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CARD_INTERVALS, cardsOf, dueCardIds, getSave, resetAll, updateCards } from './store'

// 記憶卡排程：答錯隔天，到期答對依序 3、7、14 天，最後一盒答對就記住
const DAY = 24 * 60 * 60 * 1000
const START = new Date(2026, 9, 18, 15, 30) // 本地時間 2026/10/18 下午
const midnight = (daysLater: number) => {
  const d = new Date(START)
  d.setHours(0, 0, 0, 0)
  return d.getTime() + daysLater * DAY
}
const at = (t: number) => vi.setSystemTime(t)
const card = (id: string) => cardsOf('p4')[id]

beforeEach(() => {
  vi.useFakeTimers()
  at(START.getTime())
  resetAll()
})
afterEach(() => vi.useRealTimers())

describe('記憶卡排程', () => {
  it('答錯建卡：第一盒，隔天 0 點到期', () => {
    updateCards('p4', [{ id: 'q1', correct: false }])
    expect(card('q1')).toEqual({ box: 0, due: midnight(1) })
    expect(dueCardIds('p4')).toEqual([])
  })

  it('隔天到期；到期答對依 3、7、14 天升盒，最後一盒答對就記住', () => {
    updateCards('p4', [{ id: 'q1', correct: false }])
    let day = 1
    for (let box = 1; box < CARD_INTERVALS.length; box++) {
      at(midnight(day) + 9 * 60 * 60 * 1000)
      expect(dueCardIds('p4')).toEqual(['q1'])
      updateCards('p4', [{ id: 'q1', correct: true }])
      day += CARD_INTERVALS[box]
      expect(card('q1')).toEqual({ box, due: midnight(day) })
    }
    at(midnight(day))
    updateCards('p4', [{ id: 'q1', correct: true }])
    expect(card('q1').box).toBe(CARD_INTERVALS.length)
    at(midnight(day + 365))
    expect(dueCardIds('p4')).toEqual([])
  })

  it('還沒到期時答對不升盒（同一天重玩任務不會一直往上跳）', () => {
    updateCards('p4', [{ id: 'q1', correct: false }])
    updateCards('p4', [{ id: 'q1', correct: true }])
    expect(card('q1')).toEqual({ box: 0, due: midnight(1) })
  })

  it('到期時答錯回到第一盒、隔天到期', () => {
    updateCards('p4', [{ id: 'q1', correct: false }])
    at(midnight(1))
    updateCards('p4', [{ id: 'q1', correct: true }])
    at(midnight(4))
    updateCards('p4', [{ id: 'q1', correct: false }])
    expect(card('q1')).toEqual({ box: 0, due: midnight(5) })
  })

  it('沒有卡的題目答對不會建卡', () => {
    updateCards('p4', [{ id: 'q1', correct: true }])
    expect(card('q1')).toBeUndefined()
  })

  it('到期的卡依到期先後排序，每個孩子分開', () => {
    updateCards('p4', [{ id: 'old', correct: false }])
    at(START.getTime() + DAY)
    updateCards('p4', [{ id: 'new', correct: false }])
    updateCards('p1', [{ id: 'other', correct: false }])
    at(midnight(10))
    expect(dueCardIds('p4')).toEqual(['old', 'new'])
    expect(dueCardIds('p1')).toEqual(['other'])
  })

  it('存成 JSON 再讀回來，數值不會變（例如 Infinity 會變成 null）', () => {
    updateCards('p4', [{ id: 'q1', correct: false }])
    at(midnight(1))
    for (let i = 0; i < CARD_INTERVALS.length; i++) {
      updateCards('p4', [{ id: 'q1', correct: true }])
      at(card('q1').due || midnight(100))
    }
    expect(JSON.parse(JSON.stringify(getSave()))).toEqual(getSave())
  })
})
