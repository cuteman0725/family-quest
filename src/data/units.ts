import { g1u1 } from './g1u1'
import { g1u4 } from './g1u4'
import { g4u1 } from './g4u1'
import { g4u4 } from './g4u4'
import type { Grade, Task, Unit } from './types'

export const units: Unit[] = [g4u1, g4u4, g1u1, g1u4]

/** 某個年級的單元，依課本單元順序排 */
export const unitsForGrade = (grade: Grade) => units.filter((u) => u.grade === grade).sort((a, b) => a.number - b.number)

export function findTask(unitId: string, taskId: string): { unit: Unit; task: Task } | undefined {
  const unit = units.find((u) => u.id === unitId)
  if (!unit) return undefined
  const task = unit.boss.id === taskId ? unit.boss : unit.tasks.find((t) => t.id === taskId)
  return task && { unit, task }
}
