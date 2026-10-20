import type { Task } from '../data/types'
import type { SkillNode } from './mastery'
import type { Attempt } from './store'

// 結果畫面的資訊性回饋：先講學會了什麼、進步多少，再講獎勵。
// 預期的「完成就給」獎勵會削弱內在動機，配上資訊性回饋才會被讀成「你變厲害了」（Deci 等 1999）。

export interface FeedbackInput {
  task: Task
  mode: 'task' | 'boss' | 'review'
  total: number
  firstTry: number
  /** 回想時間出了幾題、自己想起幾題 */
  recallTotal: number
  recallCorrect: number
  /** 同一個任務上一次的紀錄（沒做過是 undefined） */
  previous?: Attempt
  /** 這次結束後新點亮的技能 */
  newlyLit: SkillNode[]
}

export interface Feedback {
  /** 「這次 8 題有 6 題第一次就答對，比上次多 2 題」 */
  progress: string
  /** 「你在練「比大小」」 */
  skill: string
  /** 新點亮的技能 */
  lit: string[]
  /** 一句讚美方法或努力的話 */
  praise: string
}

export function buildFeedback(i: FeedbackInput): Feedback {
  const better = i.previous && i.previous.total === i.total ? i.firstTry - i.previous.firstTry : 0
  const progress =
    `這次 ${i.total} 題，有 ${i.firstTry} 題第一次就答對` + (better > 0 ? `，比上次多 ${better} 題！` : '。')

  const skill =
    i.mode === 'review'
      ? `你把 ${i.total} 題之前答錯的題目又想了一遍。`
      : i.mode === 'boss'
        ? '整份單元卷都完成了，錯的也都訂正好了。'
        : `你在練「${i.task.skill}」。`

  const praise =
    i.recallTotal > 0 && i.recallCorrect === i.recallTotal
      ? '剛剛答錯的題目，你在回想時間全部自己想起來了，這就是真的學會！'
      : i.recallCorrect > 0
        ? `回想時間你自己想起了 ${i.recallCorrect} 題，沒想起來的會變成記憶卡，過幾天再練。`
        : i.firstTry === i.total
          ? '每一題都先想清楚再回答，這個方法很穩！'
          : '答錯以後看提示再想一次，這是學習最有效的方法。'

  return { progress, skill, lit: i.newlyLit.map((n) => n.task.skill), praise }
}
