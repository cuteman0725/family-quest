import { useState } from 'react'
import { findTask } from './data/units'
import { BOSS_REWARD, TASK_REWARD, type Cost } from './data/village'
import { buildReviewTask, REVIEW_ID } from './lib/review'
import { getSave, recordAttempt, updateCards } from './lib/store'
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
  | { name: 'play'; pid: string; unitId: string; taskId: string; mode: PlayMode; reviewIds?: string[] }
  | { name: 'result'; pid: string; title: string; mode: PlayMode; reward: Cost }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'profiles' })

  switch (screen.name) {
    case 'profiles':
      return <Profiles onPick={(pid) => setScreen({ name: 'kid', pid })} onParent={() => setScreen({ name: 'parent' })} />

    case 'parent':
      return <Parent onBack={() => setScreen({ name: 'profiles' })} />

    case 'kid':
      return (
        <KidHome
          profileId={screen.pid}
          onBack={() => setScreen({ name: 'profiles' })}
          onVillage={() => setScreen({ name: 'village', pid: screen.pid })}
          onPlay={(unitId, taskId, mode) => setScreen({ name: 'play', pid: screen.pid, unitId, taskId, mode })}
          onReview={(ids) =>
            setScreen({ name: 'play', pid: screen.pid, unitId: REVIEW_ID, taskId: REVIEW_ID, mode: 'review', reviewIds: ids })
          }
        />
      )

    case 'village':
      return <Village profileId={screen.pid} onBack={() => setScreen({ name: 'kid', pid: screen.pid })} />

    case 'play': {
      const task = screen.reviewIds ? buildReviewTask(screen.reviewIds) : findTask(screen.unitId, screen.taskId)?.task
      const profile = getSave().profiles.find((p) => p.id === screen.pid)
      if (!task || !profile || task.questions.length === 0) return null
      const { pid, mode, unitId } = screen
      return (
        <Play
          task={task}
          mode={mode}
          grade={profile.grade}
          onExit={() => setScreen({ name: 'kid', pid })}
          onFinish={(r) => {
            const reward = mode === 'boss' ? BOSS_REWARD : TASK_REWARD
            recordAttempt(pid, { unitId, taskId: task.id, mode, at: Date.now(), ...r }, reward)
            updateCards(pid, task.questions.map((q) => ({ id: q.id, correct: !r.wrongIds.includes(q.id) })))
            setScreen({ name: 'result', pid, title: task.title, mode, reward })
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
          autoRead={grade === 1}
          onVillage={() => setScreen({ name: 'village', pid: screen.pid })}
          onHome={() => setScreen({ name: 'kid', pid: screen.pid })}
        />
      )
    }
  }
}
