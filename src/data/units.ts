import { g1u1 } from './g1u1'
import { g1u2 } from './g1u2'
import { g1u3 } from './g1u3'
import { g1u4 } from './g1u4'
import { g1u5 } from './g1u5'
import { g4u1 } from './g4u1'
import { g4u2 } from './g4u2'
import { g4u3 } from './g4u3'
import { g4u4 } from './g4u4'
import { g4u5 } from './g4u5'
import type { Grade, Task, Unit } from './types'

export const units: Unit[] = [g4u1, g4u2, g4u3, g4u4, g4u5, g1u1, g1u2, g1u3, g1u4, g1u5]

/**
 * 家長頁還沒設定「學校目前上到」時用的單元（2026/10/20 的學校進度）。
 * 不用「最新的單元」當預設：題庫會超前做，最新的單元常常還沒教。
 */
export const DEFAULT_CURRENT_UNIT: Record<Grade, string> = { 4: 'g4u4', 1: 'g1u4' }

/** 某個年級的單元，依課本單元順序排 */
export const unitsForGrade = (grade: Grade) => units.filter((u) => u.grade === grade).sort((a, b) => a.number - b.number)

export function findTask(unitId: string, taskId: string): { unit: Unit; task: Task } | undefined {
  const unit = units.find((u) => u.id === unitId)
  if (!unit) return undefined
  const task = unit.boss.id === taskId ? unit.boss : unit.tasks.find((t) => t.id === taskId)
  return task && { unit, task }
}
