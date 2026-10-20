import { describe, expect, it } from 'vitest'
import { g1u1 } from '../data/g1u1'
import { g4u1 } from '../data/g4u1'
import type { CompareQ, Question } from '../data/types'
import { buildReviewTask } from './review'
import { blocked, interleave, makeVariant } from './variants'

/** 可重現的亂數，讓失敗的案例能重跑 */
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

const g1Task = (id: string) => g1u1.tasks.find((t) => t.id === id)!
const allQuestions = [g4u1, g1u1].flatMap((u) => [...u.tasks, u.boss]).flatMap((t) => t.questions)
const uniq = [...new Map(allQuestions.map((q) => [q.id, q])).values()]

/** 天秤：? 換成 0～9 的每一種可能，答案都要成立 */
function compareHolds(q: CompareQ) {
  const values = (s: string) =>
    s.includes('?') ? Array.from({ length: 10 }, (_, d) => Number(s.replace('?', String(d)))) : [Number(s)]
  return values(q.left).every((a) =>
    values(q.right).every((b) => (q.answer === '>' ? a > b : q.answer === '<' ? a < b : a === b)),
  )
}

function checkVariant(original: Question, v: Question) {
  expect(v.id).toBe(original.id)
  expect(v.type).toBe(original.type)
  switch (v.type) {
    case 'count':
      for (const s of v.scene) expect(s.n >= 0 && s.n <= 10).toBe(true)
      expect(v.scene.map((s) => s.label)).toContain(v.ask)
      break
    case 'pickN':
      expect(v.n >= 1 && v.n <= v.total).toBe(true)
      expect(v.prompt).toContain(`圈出 ${v.n} 個`)
      break
    case 'fillTo':
      expect(v.have >= 1 && v.have < v.target && v.target <= 10).toBe(true)
      expect(v.prompt).toContain(`要有 ${v.target} 個`)
      break
    case 'same':
      expect(v.answer).toBe(v.left.n === v.right.n)
      break
    case 'compare':
      expect(v.left).toMatch(/^[1-9][\d?]+$/)
      expect(v.right).toMatch(/^[1-9]\d+$/)
      expect(v.left.replace('?', '0').length).toBe(v.right.length)
      expect(compareHolds(v), `${v.left} ${v.answer} ${v.right}`).toBe(true)
      break
  }
}

describe('記憶卡換數字變體', () => {
  it('每一題換 200 次數字，變體都合理、答案都正確', () => {
    for (const q of uniq) {
      const rng = seeded(q.id.length * 7919)
      for (let i = 0; i < 200; i++) checkVariant(q, makeVariant(q, rng))
    }
  })

  it('一年級圖片題真的會換數字', () => {
    const q = g1Task('g1u1-t2').questions[0] // 圈出 2 個紅蘿蔔
    const rng = seeded(42)
    const ns = new Set(Array.from({ length: 30 }, () => makeVariant(q, rng)).map((v) => (v.type === 'pickN' ? v.n : -1)))
    expect(ns.size).toBeGreaterThan(3)
    expect(ns.has(2)).toBe(false)
  })

  it('看不懂的題型原樣回傳', () => {
    const tf = g4u1.tasks[0].questions[0]
    expect(makeVariant(tf, seeded(1))).toBe(tf)
  })
})

describe('交錯與分組', () => {
  const items = ['a1', 'a2', 'a3', 'b1', 'b2', 'c1']
  const group = (s: string) => s[0]

  it('交錯：各組輪流出，組內維持先後', () => {
    expect(interleave(items, group)).toEqual(['a1', 'b1', 'c1', 'a2', 'b2', 'a3'])
  })

  it('分組：同一組放在一起', () => {
    expect(blocked(['a1', 'b1', 'a2', 'c1', 'b2'], group)).toEqual(['a1', 'a2', 'b1', 'b2', 'c1'])
  })

  it('四年級複習交錯不同技能；一年級同技能放一起', () => {
    const [tf, , ch] = [g4u1.tasks[0].questions[0], g4u1.tasks[0].questions[1], g4u1.tasks[2].questions[0]]
    const g4 = buildReviewTask([tf.id, g4u1.tasks[0].questions[1].id, ch.id], 4, seeded(3)).questions.map((q) => q.id)
    expect(g4).toEqual([tf.id, ch.id, g4u1.tasks[0].questions[1].id])

    const [c1, c2] = g1Task('g1u1-t1').questions
    const p1 = g1Task('g1u1-t2').questions[0]
    const g1 = buildReviewTask([c1.id, p1.id, c2.id], 1, seeded(3)).questions.map((q) => q.id)
    expect(g1).toEqual([c1.id, c2.id, p1.id])
  })
})
