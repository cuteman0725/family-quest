import type { Question, Task } from '../data/types'
import { units } from '../data/units'

export const REVIEW_ID = 'review'
/** 一次記憶卡複習最多幾題，維持短任務的長度 */
export const REVIEW_MAX = 8

const questionById = new Map<string, Question>(
  units.flatMap((u) => [...u.tasks, u.boss]).flatMap((t) => t.questions).map((q) => [q.id, q]),
)

export const findQuestion = (id: string) => questionById.get(id)

/** 用到期的記憶卡組成一次複習任務；題庫改版後找不到的題目會略過 */
export function buildReviewTask(ids: string[]): Task {
  return {
    id: REVIEW_ID,
    title: '記憶卡複習',
    icon: '🃏',
    blurb: '之前答錯的題目回來了，看看還記不記得！',
    questions: ids.map(findQuestion).filter((q): q is Question => !!q),
  }
}
