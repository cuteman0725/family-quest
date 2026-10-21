import { g1c1 } from './g1c1'
import { g1c2 } from './g1c2'
import { g1c3 } from './g1c3'
import { g1c4 } from './g1c4'
import { g1c5 } from './g1c5'
import { g1c6 } from './g1c6'
import { g1u1 } from './g1u1'
import { g1u2 } from './g1u2'
import { g1u3 } from './g1u3'
import { g1u4 } from './g1u4'
import { g1u5 } from './g1u5'
import { g1u6 } from './g1u6'
import { g1u7 } from './g1u7'
import { g1u8 } from './g1u8'
import { g1u9 } from './g1u9'
import { g4c1 } from './g4c1'
import { g4c2 } from './g4c2'
import { g4c3 } from './g4c3'
import { g4c4 } from './g4c4'
import { g4c5 } from './g4c5'
import { g4c6 } from './g4c6'
import { g4u1 } from './g4u1'
import { g4u2 } from './g4u2'
import { g4u3 } from './g4u3'
import { g4u4 } from './g4u4'
import { g4u5 } from './g4u5'
import { g4u6 } from './g4u6'
import { g4u7 } from './g4u7'
import { g4u8 } from './g4u8'
import { g4u9 } from './g4u9'
import { g4u10 } from './g4u10'
import type { Grade, Subject, Task, Unit } from './types'

export const units: Unit[] = [g4u1, g4u2, g4u3, g4u4, g4u5, g4u6, g4u7, g4u8, g4u9, g4u10, g1u1, g1u2, g1u3, g1u4, g1u5, g1u6, g1u7, g1u8, g1u9, g4c1, g4c2, g4c3, g4c4, g4c5, g4c6, g1c1, g1c2, g1c3, g1c4, g1c5, g1c6]

/**
 * 家長頁還沒設定「學校目前上到」時用的單元（2026/10/20 的學校進度）。
 * 不用「最新的單元」當預設：題庫會超前做，最新的單元常常還沒教。
 */
export const DEFAULT_CURRENT_UNIT: Record<Grade, string> = { 4: 'g4u4', 1: 'g1u4' }

export const SUBJECTS: { id: Subject; icon: string }[] = [
  { id: '數學', icon: '🔢' },
  { id: '國語', icon: '📖' },
]

/** 某個年級、某一科的單元，依順序排 */
export const unitsFor = (grade: Grade, subject: Subject) => unitsForGrade(grade).filter((u) => u.subject === subject)

/** 還沒設定「學校目前上到」時用的單元：數學用學校進度，國語從第一課開始 */
export const defaultCurrentUnit = (grade: Grade, subject: Subject) =>
  subject === '數學' ? DEFAULT_CURRENT_UNIT[grade] : unitsFor(grade, subject)[0]?.id

/** 畫面上的單元名稱：「單元 4」「第 1 課」「首冊 1～2 課」 */
export const unitLabel = (u: Unit) => u.label ?? `單元${u.number}`

/** 某個年級的單元，依課本單元順序排 */
export const unitsForGrade = (grade: Grade) => units.filter((u) => u.grade === grade).sort((a, b) => a.number - b.number)

export function findTask(unitId: string, taskId: string): { unit: Unit; task: Task } | undefined {
  const unit = units.find((u) => u.id === unitId)
  if (!unit) return undefined
  const task = unit.boss.id === taskId ? unit.boss : unit.tasks.find((t) => t.id === taskId)
  return task && { unit, task }
}
