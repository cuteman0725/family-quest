import { describe, expect, it } from 'vitest'
import { g1u1 } from '../data/g1u1'
import { buildFeedback } from './feedback'
import { questionStates, skillMap } from './mastery'
import type { Attempt, Card } from './store'

const t1 = g1u1.tasks.find((t) => t.id === 'g1u1-t1')! // 數數，6 題
const ids = t1.questions.map((q) => q.id)
const attempt = (wrongIds: string[], extra: Partial<Attempt> = {}): Attempt => ({
  unitId: 'g1u1', taskId: t1.id, mode: 'task', at: 0, total: ids.length, firstTry: ids.length - wrongIds.length, wrongIds, ...extra,
})
const node = (attempts: Attempt[], cards: Record<string, Card> = {}) =>
  skillMap(g1u1, questionStates([g1u1], attempts, cards)).find((n) => n.task.id === t1.id)!

describe('技能地圖', () => {
  it('沒做過：全部未開始', () => {
    expect(node([])).toMatchObject({ strong: 0, learning: 0, lit: false })
  })

  it('全部第一次就答對：點亮', () => {
    expect(node([attempt([])])).toMatchObject({ strong: 6, lit: true })
  })

  it('有一題還有複習中的記憶卡：那題算練習中，不點亮', () => {
    const n = node([attempt([ids[0]])], { [ids[0]]: { box: 0, due: 1 } })
    expect(n).toMatchObject({ strong: 5, learning: 1, lit: false })
  })

  it('記憶卡已記住：那題算學會，點亮', () => {
    const n = node([attempt([ids[0]])], { [ids[0]]: { box: 4, due: 0 } })
    expect(n.lit).toBe(true)
  })

  it('記憶卡複習的紀錄用 questionIds 算題目', () => {
    const review = attempt([], { taskId: 'review', mode: 'review', questionIds: [ids[0]] })
    const n = node([review])
    expect(n).toMatchObject({ strong: 1, learning: 0, lit: false })
  })
})

describe('結果畫面的資訊性回饋', () => {
  const base = { task: t1, mode: 'task' as const, total: 6, recallTotal: 0, recallCorrect: 0, newlyLit: [] }

  it('先講進步：跟上次比多對幾題', () => {
    const fb = buildFeedback({ ...base, firstTry: 5, previous: attempt([ids[0], ids[1], ids[2]]) })
    expect(fb.progress).toBe('這次 6 題，有 5 題第一次就答對，比上次多 2 題！')
    expect(fb.skill).toBe('你在練「數數」。')
  })

  it('沒有進步時不提比較', () => {
    const fb = buildFeedback({ ...base, firstTry: 3, previous: attempt([]) })
    expect(fb.progress).toBe('這次 6 題，有 3 題第一次就答對。')
  })

  it('回想時間全部想起來：讚美提取，不讚美聰明', () => {
    const fb = buildFeedback({ ...base, firstTry: 4, recallTotal: 2, recallCorrect: 2 })
    expect(fb.praise).toContain('自己想起來')
  })

  it('所有讚美句都不說聰明、天才', () => {
    const cases = [
      { firstTry: 6 },
      { firstTry: 4, recallTotal: 2, recallCorrect: 2 },
      { firstTry: 4, recallTotal: 2, recallCorrect: 1 },
      { firstTry: 4, recallTotal: 2, recallCorrect: 0 },
    ]
    for (const c of cases) expect(buildFeedback({ ...base, ...c }).praise).not.toMatch(/聰明|天才/)
  })

  it('新點亮的技能列出來', () => {
    const lit = skillMap(g1u1, questionStates([g1u1], [attempt([])], {})).filter((n) => n.lit)
    expect(buildFeedback({ ...base, firstTry: 6, newlyLit: lit }).lit).toEqual(['數數'])
  })
})
