import type { Task, Unit } from '../data/types'
import { CARD_INTERVALS, type Attempt, type Card } from './store'

// 技能地圖：每個短任務是一個技能節點。一題「學會」＝第一次就答對過，而且沒有還在複習中的記憶卡。
// 用「記得住」當進度，不用練習當下的正確率（交錯、間隔會刻意壓低當下正確率）。

export type QuestionState = 'strong' | 'learning'

export interface SkillNode {
  task: Task
  total: number
  strong: number
  learning: number
  /** 這個技能的題目全部學會了 */
  lit: boolean
}

const uniqueIds = (t: Task) => [...new Set(t.questions.map((q) => q.id))]

export function questionStates(units: Unit[], attempts: Attempt[], cards: Record<string, Card>) {
  const taskQuestions = new Map(units.flatMap((u) => [...u.tasks, u.boss]).map((t) => [t.id, uniqueIds(t)]))
  const seen = new Set<string>()
  const correctOnce = new Set<string>()
  for (const a of attempts) {
    for (const id of a.questionIds ?? taskQuestions.get(a.taskId) ?? []) {
      seen.add(id)
      if (!a.wrongIds.includes(id)) correctOnce.add(id)
    }
  }
  const states = new Map<string, QuestionState>()
  for (const id of seen) {
    const card = cards[id]
    if (card) states.set(id, card.box < CARD_INTERVALS.length ? 'learning' : 'strong')
    else states.set(id, correctOnce.has(id) ? 'strong' : 'learning')
  }
  return states
}

export function skillMap(unit: Unit, states: Map<string, QuestionState>): SkillNode[] {
  return unit.tasks.map((task) => {
    const ids = uniqueIds(task)
    const strong = ids.filter((id) => states.get(id) === 'strong').length
    const learning = ids.filter((id) => states.get(id) === 'learning').length
    return { task, total: ids.length, strong, learning, lit: ids.length > 0 && strong === ids.length }
  })
}
