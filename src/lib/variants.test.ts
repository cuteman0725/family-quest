import { describe, expect, it } from 'vitest'
import { g1c1 } from '../data/g1c1'
import { g1c2 } from '../data/g1c2'
import { g1u1 } from '../data/g1u1'
import { g1u2 } from '../data/g1u2'
import { g1u3 } from '../data/g1u3'
import { g1u4 } from '../data/g1u4'
import { g1u5 } from '../data/g1u5'
import { g1u6 } from '../data/g1u6'
import { g1u7 } from '../data/g1u7'
import { g1u8 } from '../data/g1u8'
import { g1u9 } from '../data/g1u9'
import { g4c1 } from '../data/g4c1'
import { g4c2 } from '../data/g4c2'
import { g4u1 } from '../data/g4u1'
import { g4u2 } from '../data/g4u2'
import { g4u3 } from '../data/g4u3'
import { g4u4 } from '../data/g4u4'
import { g4u5 } from '../data/g4u5'
import { g4u6 } from '../data/g4u6'
import { g4u7 } from '../data/g4u7'
import { g4u8 } from '../data/g4u8'
import { g4u9 } from '../data/g4u9'
import { g4u10 } from '../data/g4u10'
import type { CompareQ, Question } from '../data/types'
import { buildReviewTask } from './review'
import { clockExplain } from './answer'
import { mixedText, parseFraction } from './fraction'
import { lengthInMm } from './length'
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
const allQuestions = [g4u1, g4u2, g4u3, g4u4, g4u5, g4u6, g4u7, g4u8, g4u9, g4u10, g1u1, g1u2, g1u3, g1u4, g1u5, g1u6, g1u7, g1u8, g1u9, g4c1, g4c2, g1c1, g1c2].flatMap((u) => [...u.tasks, u.boss]).flatMap((t) => t.questions)
const uniq = [...new Map(allQuestions.map((q) => [q.id, q])).values()]

/** 天秤：? 換成 0～9 的每一種可能，答案都要成立；長度先換成毫米 */
function compareHolds(q: CompareQ) {
  const values = (s: string) =>
    lengthInMm(s) !== null
      ? [lengthInMm(s)!]
      : /\//.test(s)
        ? [parseFraction(s)!]
      : s.includes('?')
        ? Array.from({ length: 10 }, (_, d) => Number(s.replace('?', String(d))))
        : [Number(s)]
  return values(q.left).every((a) =>
    values(q.right).every((b) => (q.answer === '>' ? a > b : q.answer === '<' ? a < b : a === b)),
  )
}

function checkVariant(original: Question, v: Question) {
  expect(v.id).toBe(original.id)
  expect(v.type).toBe(original.type)
  switch (v.type) {
    case 'count':
      for (const s of v.scene) expect(s.n >= 0 && s.n <= 30).toBe(true)
      expect(v.scene.map((s) => s.label)).toContain(v.ask)
      break
    case 'pickN':
      expect(v.n >= 1 && v.n <= v.total).toBe(true)
      // 「畫掉多的」題保留原題；一般圈圈看的題目文字要跟著新數字改
      if (v.cross) expect(v).toBe(original)
      else expect(v.prompt).toContain(`圈出 ${v.n} 個`)
      break
    case 'fillTo':
      expect(v.have >= 1 && v.have < v.target && v.target <= 30 && v.target - v.have <= 10).toBe(true)
      expect(v.prompt).toContain(`要有 ${v.target} `)
      break
    case 'same':
      expect(v.answer).toBe(v.left.n === v.right.n)
      break
    case 'divide':
      expect(v.divisor >= 2 && v.dividend >= v.divisor).toBe(true)
      if (original.type === 'divide' && !original.units) {
        expect(String(v.dividend).length).toBe(String(original.dividend).length)
        expect(String(v.divisor).length).toBe(String(original.divisor).length)
        expect(v.explain).toContain(`${Math.floor(v.dividend / v.divisor)} … ${v.dividend % v.divisor}`)
      } else expect(v).toBe(original)
      break
    case 'multiply':
      if (original.type === 'multiply') {
        expect(String(v.a).length).toBe(String(original.a).length)
        expect(String(v.b).length).toBe(String(original.b).length)
      }
      expect(v.explain).toContain(String(v.a * v.b))
      break
    case 'angle':
      if (v.ask === 'kind') expect((v.tilt ?? 0) + v.degrees <= 180).toBe(true)
      if (v.ask === 'measure') expect(v.degrees % 10 === 0 && v.degrees >= 10 && v.degrees <= 170).toBe(true)
      if (v.ask === 'draw') expect(v.degrees % 5 === 0 && v.prompt).toContain(String(v.degrees))
      if (v.ask === 'compute') expect(v).toBe(original)
      break
    case 'length':
      if (v.ask !== 'fair') {
        const sizes = v.items.map((i) => i.size)
        const extreme = v.ask === 'max' ? Math.max(...sizes) : Math.min(...sizes)
        expect(sizes.filter((s) => s === extreme)).toHaveLength(1)
        expect(sizes.every((s) => s >= 1 && s <= 10)).toBe(true)
      } else expect(v.items.every((i) => (i.offset ?? 0) + i.size <= 11)).toBe(true)
      break
    case 'sequence':
      expect(v.values.every((x) => x >= 1 && x <= 30)).toBe(true)
      expect(v.values.length).toBe(original.type === 'sequence' ? original.values.length : 0)
      break
    case 'triangle':
      expect(v.angles.every((a) => a > 0)).toBe(true)
      expect(v.angles[0] + v.angles[1] + v.angles[2]).toBe(180)
      if (v.ask === 'missing') expect(v.explain).toContain(`＝ ${v.angles[v.unknown!]} 度`)
      break
    case 'bond':
      expect(v.parts[0] + v.parts[1]).toBe(v.whole)
      expect(v.whole <= 10 && v.parts.every((n) => n >= 1)).toBe(true)
      expect(v.prompt).not.toMatch(/[□?<>]/)
      break
    case 'equation': {
      const c = v.op === '+' ? v.a + v.b : v.a - v.b
      expect(c >= 0 && c <= 10 && v.a >= 0 && v.b >= 0).toBe(true)
      expect(v.explain).toContain(`等於 ${c}`)
      expect(v.prompt).not.toMatch(/[□?<>＋－＝]/)
      // 故事題保留原題（故事裡的數字換了會對不上）
      if (!v.emoji && v.blanks.length > 1) expect(v).toBe(original)
      break
    }
    case 'barBuild':
      expect(v.values.every((x) => x >= 1 && x <= v.yMax)).toBe(true)
      expect(new Set(v.values).size).toBeGreaterThan(1)
      v.categories.forEach((c, i) => expect(v.explain).toContain(`${c} ${v.values[i]}`))
      break
    case 'fracLine':
      expect(v.den * v.max <= 24 && v.target > 0 && v.target < v.den * v.max && v.target % v.den !== 0).toBe(true)
      expect(v.prompt).toContain(v.show === 'mixed' ? mixedText(v.target, v.den) : `${v.target}/${v.den}`)
      if (v.show === 'mixed') expect(v.target).toBeGreaterThan(v.den)
      break
    case 'clock':
      if (v.ask === 'read') {
        expect(v.time.h >= 1 && v.time.h <= 12).toBe(true)
        expect(v.explain).toBe(clockExplain(v.time))
      } else expect(v).toBe(original)
      break
    case 'compare':
      if (lengthInMm(v.left) !== null) {
        // 長度天秤：兩邊都是長度，換成同單位比
        expect(lengthInMm(v.right)).not.toBeNull()
      } else if (/\/|分之/.test(v.left + v.right)) {
        // 分數天秤：一邊帶分數、一邊假分數，同分母
        expect(`${v.left} ${v.right}`).toMatch(/^(\d+ )?\d+\/(\d+) (\d+ )?\d+\/\2$/)
      } else if (v.left.includes('.')) {
        // 小數天秤：兩邊都是阿拉伯數字的小數（國字題換成數字）
        expect(v.left).toMatch(/^\d+\.\d+$/)
        expect(v.right).toMatch(/^\d+(\.\d+)?$/)
      } else {
        expect(v.left).toMatch(/^[1-9][\d?]+$/)
        expect(v.right).toMatch(/^[1-9]\d+$/)
        expect(v.left.replace('?', '0').length).toBe(v.right.length)
      }
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
