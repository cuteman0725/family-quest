import { unitsForGrade } from '../data/units'
import { costText, TASK_REWARD } from '../data/village'
import { questionStates, skillMap } from '../lib/mastery'
import { bossUnlocked, currentUnitOf, recommend, taskStatuses } from '../lib/recommend'
import { REVIEW_MAX } from '../lib/review'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'
import { cardsOf, dueCardIds, useSave } from '../lib/store'
import { SkillMap } from './SkillMap'

interface Props {
  profileId: string
  onPlay: (unitId: string, taskId: string, mode: 'task' | 'boss') => void
  onReview: (questionIds: string[]) => void
  onVillage: () => void
  onBack: () => void
}

export function KidHome({ profileId, onPlay, onReview, onVillage, onBack }: Props) {
  const save = useSave()
  const profile = save.profiles.find((p) => p.id === profileId)!
  const attempts = save.attempts[profileId] ?? []
  const units = unitsForGrade(profile.grade)
  const current = currentUnitOf(units, profile.currentUnit)
  const picks = recommend(taskStatuses(units, attempts), 3, current?.id)
  // 魔王關：目前單元一定顯示；其他單元解鎖了才顯示
  const bossUnits = units.filter((u) => u.id === current?.id || bossUnlocked(u, attempts))
  const otherUnits = units.filter((u) => u.id !== current?.id)
  const isYoung = profile.grade === 1
  const due = dueCardIds(profileId, save)
  const reviewIds = due.slice(0, REVIEW_MAX)
  const states = questionStates(units, attempts, cardsOf(profileId, save))

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

      {due.length > 0 && (
        <div className="review-card">
          <button
            className="review-main"
            onClick={() => {
              sfx.tap()
              if (isYoung) speak(`記憶卡複習。有 ${due.length} 張卡回來了，看看還記不記得！`)
            }}
          >
            <span className="review-stack" aria-hidden>
              🃏
            </span>
            <span className="review-text">
              <strong>記憶卡複習</strong>
              <span>
                有 {due.length} 張卡回來了，看看還記不記得！
                {due.length > REVIEW_MAX && `（這次先複習 ${REVIEW_MAX} 張）`}
              </span>
              <span className="task-meta">完成得 {costText(TASK_REWARD)}</span>
            </span>
          </button>
          <button className="big-btn primary" onClick={() => onReview(reviewIds)}>
            開始複習
          </button>
        </div>
      )}

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
              {unit.id !== current?.id && <span className="task-review-tag">複習：單元{unit.number}</span>}
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

      {bossUnits.map((unit) => {
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

      {current && (
        <SkillMap
          title={`我的技能地圖：單元${current.number} ${current.title}`}
          nodes={skillMap(current, states)}
          autoRead={isYoung}
        />
      )}
      {otherUnits.length > 0 && (
        <details className="other-maps">
          <summary>其他單元的技能地圖</summary>
          {otherUnits.map((u) => (
            <SkillMap key={u.id} title={`單元${u.number} ${u.title}`} nodes={skillMap(u, states)} autoRead={isYoung} />
          ))}
        </details>
      )}
    </div>
  )
}
