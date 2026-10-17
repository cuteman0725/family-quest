import { unitsForGrade } from '../data/units'
import { costText, TASK_REWARD } from '../data/village'
import { bossUnlocked, recommend, taskStatuses } from '../lib/recommend'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'
import { useSave } from '../lib/store'

interface Props {
  profileId: string
  onPlay: (unitId: string, taskId: string, mode: 'task' | 'boss') => void
  onVillage: () => void
  onBack: () => void
}

export function KidHome({ profileId, onPlay, onVillage, onBack }: Props) {
  const save = useSave()
  const profile = save.profiles.find((p) => p.id === profileId)!
  const attempts = save.attempts[profileId] ?? []
  const units = unitsForGrade(profile.grade)
  const picks = recommend(taskStatuses(units, attempts))
  const isYoung = profile.grade === 1

  return (
    <div className="screen kid-home">
      <header className="top-bar">
        <button className="icon-btn" aria-label="換人" onClick={onBack}>
          ←
        </button>
        <div className="who">
          {profile.avatar} {profile.name}
        </div>
        <button className="res-btn" onClick={onVillage}>
          🪵{save.wood} 🪨{save.stone} ⭐{save.star} ・ 去村莊 🏡
        </button>
      </header>

      <h2 className="section-title">
        今天想做哪一個任務？
        {isYoung && (
          <button className="icon-btn speak" aria-label="唸出來" onClick={() => speak('今天想做哪一個任務？點一下圖片聽聽看。')}>
            🔊
          </button>
        )}
      </h2>

      <div className="task-cards">
        {picks.map(({ unit, task, doneCount, lastRate }) => (
          <div key={task.id} className="task-card">
            <button
              className="task-main"
              onClick={() => {
                sfx.tap()
                if (isYoung) speak(task.title + '。' + task.blurb)
              }}
            >
              <span className="task-icon">{task.icon}</span>
              <span className="task-title">{task.title}</span>
              <span className="task-blurb">{task.blurb}</span>
              <span className="task-meta">
                {task.questions.length} 題 ・ 完成得 {costText(TASK_REWARD)}
                {doneCount > 0 && (lastRate === 1 ? ' ・ 🌟上次全對' : ' ・ 🔁再挑戰')}
              </span>
            </button>
            <button className="big-btn primary go" onClick={() => onPlay(unit.id, task.id, 'task')}>
              出發！
            </button>
          </div>
        ))}
      </div>

      {units.map((unit) => {
        const open = bossUnlocked(unit, attempts)
        const done = unit.tasks.filter((t) => attempts.some((a) => a.taskId === t.id)).length
        return (
          <div key={unit.id} className={`boss-card ${open ? 'open' : ''}`}>
            <span className="boss-icon">{unit.boss.icon}</span>
            <div className="boss-text">
              <strong>魔王關：{unit.title}</strong>
              <span>{open ? unit.boss.blurb : `再完成 ${unit.tasks.length - done} 個任務就能挑戰（${done}/${unit.tasks.length}）`}</span>
            </div>
            <button className="big-btn" disabled={!open} onClick={() => onPlay(unit.id, unit.boss.id, 'boss')}>
              {open ? '挑戰！' : '🔒'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
