import { describe, expect, it } from 'vitest'
import type { Grade, Question } from './types'
import { units } from './units'

// 題庫是手寫的，每加一個單元就多一批可能打錯的資料。
// 這裡檢查每一題的結構；答案能從資料算出來的題型（天秤、選數字、一樣多嗎）直接重算比對。

interface Entry {
  where: string
  grade: Grade
  q: Question
}

const entries: Entry[] = units.flatMap((u) =>
  [...u.tasks, u.boss].flatMap((t) => t.questions.map((q) => ({ where: `${u.id}/${t.id}/${q.id}`, grade: u.grade, q }))),
)
const label = (e: Entry) => e.where

/** "6789萬" → 67890000；"84?6600" → ? 換成 0～9 的所有可能；看不懂的格式回傳 null */
function possibleValues(s: string): number[] | null {
  const wan = s.match(/^(\d+)萬$/)
  if (wan) return [Number(wan[1]) * 10000]
  if (!/^[\d?]+$/.test(s)) return null
  if (!s.includes('?')) return [Number(s)]
  return Array.from({ length: 10 }, (_, d) => Number(s.replace('?', String(d))))
}

const holds = (a: number, op: string, b: number) => (op === '>' ? a > b : op === '<' ? a < b : a === b)

describe('題庫結構', () => {
  it('單元與任務的 id 不重複', () => {
    const ids = units.flatMap((u) => [u.id, ...u.tasks.map((t) => t.id), u.boss.id])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('同一個題目 id 只對應同一題（任務和魔王關共用時是同一份資料）', () => {
    const seen = new Map<string, Question>()
    const conflicts = entries.filter(({ q }) => {
      const prev = seen.get(q.id)
      seen.set(q.id, q)
      return prev !== undefined && prev !== q
    })
    expect(conflicts.map(label)).toEqual([])
  })

  it('每個任務和魔王關都有題目', () => {
    const empty = units.flatMap((u) => [...u.tasks, u.boss]).filter((t) => t.questions.length === 0)
    expect(empty.map((t) => t.id)).toEqual([])
  })
})

describe.each(entries)('$where', ({ q, grade }) => {
  it('題目和提示都有內容；除了連連看，都有答錯後的說明', () => {
    expect(q.prompt.trim()).not.toBe('')
    expect(q.hint.trim()).not.toBe('')
    if (q.type !== 'match') expect(q.explain?.trim()).toBeTruthy()
  })

  if (grade === 1) {
    it('一年級題目會被朗讀，不放念不出來的符號', () => {
      expect(q.prompt).not.toMatch(/[□?<>＜＞]/)
    })
  }

  switch (q.type) {
    case 'choice':
      it('選項不重複，答案編號在選項範圍內', () => {
        expect(new Set(q.options).size).toBe(q.options.length)
        expect(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length).toBe(true)
      })
      break

    case 'compare':
      it('天秤的答案對 ? 的每一種可能都成立', () => {
        const left = possibleValues(q.left)
        const right = possibleValues(q.right)
        expect(left, `看不懂左邊：${q.left}`).not.toBeNull()
        expect(right, `看不懂右邊：${q.right}`).not.toBeNull()
        for (const a of left!) for (const b of right!) expect(holds(a, q.answer, b), `${a} ${q.answer} ${b}`).toBe(true)
      })
      break

    case 'number':
      it('答案只有數字', () => {
        expect(q.answers.length).toBeGreaterThan(0)
        for (const a of q.answers) expect(a).toMatch(/^\d+$/)
      })
      break

    case 'digits':
      it('選出的數字剛好是讓不等式成立的全部數字', () => {
        const m = q.prompt.match(/([\d□]+)\s*([<>])\s*([\d□]+)/)
        expect(m, '題目裡找不到「□ 的不等式」').not.toBeNull()
        const [, l, op, r] = m!
        const fits = Array.from({ length: 10 }, (_, d) => d).filter((d) =>
          holds(Number(l.replace('□', String(d))), op, Number(r.replace('□', String(d)))),
        )
        expect([...q.answer].sort((a, b) => a - b)).toEqual(fits)
      })
      break

    case 'match':
      it('至少兩組，左右兩邊各自不重複', () => {
        expect(q.pairs.length).toBeGreaterThanOrEqual(2)
        expect(new Set(q.pairs.map((p) => p[0])).size).toBe(q.pairs.length)
        expect(new Set(q.pairs.map((p) => p[1])).size).toBe(q.pairs.length)
      })
      break

    case 'count':
      it('要數的東西在畫面裡，數量在 0～10，名稱不重複', () => {
        expect(q.scene.map((s) => s.label)).toContain(q.ask)
        expect(new Set(q.scene.map((s) => s.label)).size).toBe(q.scene.length)
        for (const s of q.scene) expect(s.n >= 0 && s.n <= 10).toBe(true)
      })
      break

    case 'pickN':
      it('要圈的數量在 1 到總數之間，總數最多 10', () => {
        expect(q.n >= 1 && q.n <= q.total && q.total <= 10).toBe(true)
      })
      break

    case 'fillTo':
      it('原本的數量比目標少，目標最多 10', () => {
        expect(q.have >= 0 && q.have < q.target && q.target <= 10).toBe(true)
      })
      break

    case 'same':
      it('答案跟兩邊的數量一致', () => {
        expect(q.answer).toBe(q.left.n === q.right.n)
      })
      break
  }
})
