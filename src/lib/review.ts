import type { Grade, Question, Task } from '../data/types'
import { units } from '../data/units'
import { blocked, interleave, makeVariant, type Rng } from './variants'

export const REVIEW_ID = 'review'
/** 一次記憶卡複習最多幾題，維持短任務的長度 */
export const REVIEW_MAX = 8

const allTasks = units.flatMap((u) => u.tasks)
const questionById = new Map<string, Question>(
  units.flatMap((u) => [...u.tasks, u.boss]).flatMap((t) => t.questions).map((q) => [q.id, q]),
)
/** 題目屬於哪個技能（短任務）；只出現在魔王關的題目歸到 boss */
const skillOf = new Map<string, string>()
for (const t of allTasks) for (const q of t.questions) if (!skillOf.has(q.id)) skillOf.set(q.id, t.id)

export const findQuestion = (id: string) => questionById.get(id)
const groupOf = (q: Question) => skillOf.get(q.id) ?? 'boss'

/**
 * 用到期的記憶卡組成一次複習任務；題庫改版後找不到的題目會略過。
 * 四年級交錯混題（不同技能輪流出），一年級同一技能放在一起；數學題換數字重出。
 */
export function buildReviewTask(ids: string[], grade: Grade, rng: Rng = Math.random): Task {
  const found = ids.map(findQuestion).filter((q): q is Question => !!q)
  const ordered = grade === 4 ? interleave(found, groupOf) : blocked(found, groupOf)
  return {
    id: REVIEW_ID,
    skill: '記憶卡複習',
    title: '記憶卡複習',
    icon: '🃏',
    blurb: '之前答錯的題目回來了，看看還記不記得！',
    questions: ordered.map((q) => makeVariant(q, rng)),
  }
}
