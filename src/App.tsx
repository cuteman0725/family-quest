import { useState } from 'react'
import type { Task } from './data/types'
import { findTask, unitsForGrade } from './data/units'
import { BOSS_REWARD, TASK_REWARD, type Cost } from './data/village'
import { buildFeedback, type Feedback } from './lib/feedback'
import { questionStates, skillMap } from './lib/mastery'
import { buildReviewTask, REVIEW_ID } from './lib/review'
import { cardsOf, getSave, recordAttempt, updateCards } from './lib/store'
import { KidHome } from './screens/KidHome'
import { Parent } from './screens/Parent'
import { Play, type PlayMode } from './screens/Play'
import { Profiles } from './screens/Profiles'
import { Result } from './screens/Result'
import { Village } from './screens/Village'

type Screen =
  | { name: 'profiles' }
  | { name: 'parent' }
  | { name: 'kid'; pid: string }
  | { name: 'village'; pid: string }
  // 任務在進入時就決定好（記憶卡複習的換數字變體每次不同，不能每次重畫都重抽）
  | { name: 'play'; pid: string; unitId: string; task: Task; mode: PlayMode }
  | { name: 'result'; pid: string; title: string; mode: PlayMode; reward: Cost; feedback: Feedback }

/** 這個孩子目前每個技能節點的狀態（用來找出「這次新點亮」的技能） */
function nodesOf(pid: string) {
  const save = getSave()
  const grade = save.profiles.find((p) => p.id === pid)?.grade ?? 4
  const units = unitsForGrade(grade)
  const states = questionStates(units, save.attempts[pid] ?? [], cardsOf(pid, save))
  return units.flatMap((u) => skillMap(u, states))
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'profiles' })

  switch (screen.name) {
    case 'profiles':
      return <Profiles onPick={(pid) => setScreen({ name: 'kid', pid })} onParent={() => setScreen({ name: 'parent' })} />

    case 'parent':
      return <Parent onBack={() => setScreen({ name: 'profiles' })} />

    case 'kid': {
      const { pid } = screen
      return (
        <KidHome
          profileId={pid}
          onBack={() => setScreen({ name: 'profiles' })}
          onVillage={() => setScreen({ name: 'village', pid })}
          onPlay={(unitId, taskId, mode) => {
            const task = findTask(unitId, taskId)?.task
            if (task) setScreen({ name: 'play', pid, unitId, task, mode })
          }}
          onReview={(ids) => {
            const grade = getSave().profiles.find((p) => p.id === pid)?.grade ?? 4
            const task = buildReviewTask(ids, grade)
            if (task.questions.length > 0) setScreen({ name: 'play', pid, unitId: REVIEW_ID, task, mode: 'review' })
          }}
        />
      )
    }

    case 'village':
      return <Village profileId={screen.pid} onBack={() => setScreen({ name: 'kid', pid: screen.pid })} />

    case 'play': {
      const profile = getSave().profiles.find((p) => p.id === screen.pid)
      if (!profile) return null
      const { pid, mode, unitId, task } = screen
      return (
        <Play
          task={task}
          mode={mode}
          grade={profile.grade}
          onExit={() => setScreen({ name: 'kid', pid })}
          onFinish={({ recallTotal, recallCorrect, ...r }) => {
            const reward = mode === 'boss' ? BOSS_REWARD : TASK_REWARD
            const previous = (getSave().attempts[pid] ?? []).filter((a) => a.taskId === task.id).at(-1)
            const before = nodesOf(pid)
            const questionIds = [...new Set(task.questions.map((q) => q.id))]
            recordAttempt(pid, { unitId, taskId: task.id, mode, at: Date.now(), ...r, questionIds }, reward)
            updateCards(pid, questionIds.map((id) => ({ id, correct: !r.wrongIds.includes(id) })))
            const newlyLit = nodesOf(pid).filter((n) => n.lit && !before.find((b) => b.task.id === n.task.id)?.lit)
            const feedback = buildFeedback({ task, mode, ...r, recallTotal, recallCorrect, previous, newlyLit })
            setScreen({ name: 'result', pid, title: task.title, mode, reward, feedback })
          }}
        />
      )
    }

    case 'result': {
      const grade = getSave().profiles.find((p) => p.id === screen.pid)?.grade
      return (
        <Result
          title={screen.title}
          mode={screen.mode}
          reward={screen.reward}
          feedback={screen.feedback}
          autoRead={grade === 1}
          onVillage={() => setScreen({ name: 'village', pid: screen.pid })}
          onHome={() => setScreen({ name: 'kid', pid: screen.pid })}
        />
      )
    }
  }
}
