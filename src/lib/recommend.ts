import type { Task, Unit } from '../data/types'
import type { Attempt } from './store'

export interface TaskStatus {
  unit: Unit
  task: Task
  doneCount: number
  /** 最近一次的首次正確率（0～1），沒做過是 undefined */
  lastRate?: number
}

export function taskStatuses(units: Unit[], attempts: Attempt[]): TaskStatus[] {
  return units.flatMap((unit) =>
    unit.tasks.map((task) => {
      const mine = attempts.filter((a) => a.taskId === task.id)
      const last = mine.at(-1)
      return { unit, task, doneCount: mine.length, lastRate: last && last.firstTry / last.total }
    }),
  )
}

/**
 * 任務推薦：沒做過的優先，再來是上次錯比較多的，最後才是已經全對的。
 * 只給孩子少量（3 個）選擇。
 */
export function recommend(statuses: TaskStatus[], count = 3): TaskStatus[] {
  const rank = (s: TaskStatus) => (s.doneCount === 0 ? 0 : s.lastRate! < 1 ? 1 + s.lastRate! : 3 + s.doneCount)
  return [...statuses].sort((a, b) => rank(a) - rank(b)).slice(0, count)
}

/** 單元裡每個短任務都完成過一次，就能挑戰魔王關 */
export const bossUnlocked = (unit: Unit, attempts: Attempt[]) =>
  unit.tasks.every((t) => attempts.some((a) => a.taskId === t.id))
