import { describe, expect, it } from 'vitest'
import { g4u1 } from '../data/g4u1'
import { g4u4 } from '../data/g4u4'
import { bossUnlocked, currentUnitOf, recommend, taskStatuses } from './recommend'
import type { Attempt } from './store'

const done = (taskId: string, firstTry: number, total = 8): Attempt => ({
  unitId: g4u1.id, taskId, mode: 'task', at: 0, total, firstTry, wrongIds: [],
})
const [t1, t2, t3, t4, t5] = g4u1.tasks.map((t) => t.id)

describe('任務推薦', () => {
  it('沒做過的排最前面，再來是上次錯比較多的，全對的最後', () => {
    const attempts = [done(t1, 8), done(t2, 4), done(t3, 6)]
    const picks = recommend(taskStatuses([g4u1], attempts), 5).map((s) => s.task.id)
    expect(picks.slice(0, 2).sort()).toEqual([t4, t5].sort())
    expect(picks.slice(2)).toEqual([t2, t3, t1])
  })

  it('只給 3 個選擇', () => {
    expect(recommend(taskStatuses([g4u1], []))).toHaveLength(3)
  })

  it('記憶卡複習和魔王關的紀錄不影響短任務推薦', () => {
    const attempts: Attempt[] = [
      { ...done('review', 0), mode: 'review' },
      { ...done(g4u1.boss.id, 0), mode: 'boss' },
    ]
    expect(taskStatuses([g4u1], attempts).every((s) => s.doneCount === 0)).toBe(true)
  })
})

describe('目前單元優先', () => {
  it('學校上到第 4 單元：先推第 4 單元沒做過的任務，不從第 1 單元開始', () => {
    const picks = recommend(taskStatuses([g4u1, g4u4], []), 3, g4u4.id)
    expect(picks.every((s) => s.unit.id === g4u4.id)).toBe(true)
  })

  it('目前單元都練過幾次以後，前面單元沒做過的任務會回來當複習', () => {
    const attempts = g4u4.tasks.flatMap((t) => [done(t.id, 8), done(t.id, 8)])
    const picks = recommend(taskStatuses([g4u1, g4u4], attempts), 3, g4u4.id)
    expect(picks.some((s) => s.unit.id === g4u1.id)).toBe(true)
  })

  it('沒設定目前單元時用最新的單元', () => {
    expect(currentUnitOf([g4u1, g4u4])?.id).toBe(g4u4.id)
    expect(currentUnitOf([g4u1, g4u4], g4u1.id)?.id).toBe(g4u1.id)
  })
})

describe('魔王關解鎖', () => {
  it('每個短任務都完成過一次才解鎖', () => {
    expect(bossUnlocked(g4u1, [done(t1, 8), done(t2, 8), done(t3, 8), done(t4, 8)])).toBe(false)
    expect(bossUnlocked(g4u1, [done(t1, 8), done(t2, 1), done(t3, 8), done(t4, 8), done(t5, 0)])).toBe(true)
  })
})
