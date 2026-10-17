import { useState } from 'react'
import { findTask } from './data/units'
import { BOSS_REWARD, TASK_REWARD, type Cost } from './data/village'
import { getSave, recordAttempt } from './lib/store'
import { KidHome } from './screens/KidHome'
import { Parent } from './screens/Parent'
import { Play } from './screens/Play'
import { Profiles } from './screens/Profiles'
import { Result } from './screens/Result'
import { Village } from './screens/Village'

type Screen =
  | { name: 'profiles' }
  | { name: 'parent' }
  | { name: 'kid'; pid: string }
  | { name: 'village'; pid: string }
  | { name: 'play'; pid: string; unitId: string; taskId: string; mode: 'task' | 'boss' }
  | { name: 'result'; pid: string; title: string; mode: 'task' | 'boss'; reward: Cost }

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
        />
      )

    case 'village':
      return <Village profileId={screen.pid} onBack={() => setScreen({ name: 'kid', pid: screen.pid })} />

    case 'play': {
      const found = findTask(screen.unitId, screen.taskId)
      const profile = getSave().profiles.find((p) => p.id === screen.pid)
      if (!found || !profile) return null
      const { pid, mode, unitId } = screen
      return (
        <Play
          task={found.task}
          mode={mode}
          grade={profile.grade}
          onExit={() => setScreen({ name: 'kid', pid })}
          onFinish={(r) => {
            const reward = mode === 'boss' ? BOSS_REWARD : TASK_REWARD
            recordAttempt(pid, { unitId, taskId: found.task.id, mode, at: Date.now(), ...r }, reward)
            setScreen({ name: 'result', pid, title: found.task.title, mode, reward })
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
