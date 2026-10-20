import { useEffect } from 'react'
import { costText, type Cost } from '../data/village'
import type { Feedback } from '../lib/feedback'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'

interface Props {
  title: string
  mode: 'task' | 'boss' | 'review'
  reward: Cost
  feedback: Feedback
  autoRead: boolean
  onVillage: () => void
  onHome: () => void
}

/** 先講學會了什麼、進步多少，最後才是建材 */
export function Result({ title, mode, reward, feedback, autoRead, onVillage, onHome }: Props) {
  const headline = mode === 'boss' ? '打倒魔王了！' : mode === 'review' ? '複習完成！' : '任務完成！'

  useEffect(() => {
    sfx.done()
    if (autoRead) {
      const lit = feedback.lit.map((s) => `「${s}」點亮了！`).join('')
      speak(`${headline}${feedback.progress}${lit}${feedback.praise}`)
    }
  }, [autoRead, feedback, headline])

  return (
    <div className="screen result">
      <div className="confetti" aria-hidden>
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 8) * 0.15}s` }}>
            {['🎉', '⭐', '✨', '🎊'][i % 4]}
          </span>
        ))}
      </div>
      <h1>{headline}</h1>
      <p className="result-title">{title}</p>

      <div className="feedback-card">
        <p className="fb-progress">{feedback.progress}</p>
        <p className="fb-skill">{feedback.skill}</p>
        {feedback.lit.map((s) => (
          <p key={s} className="fb-lit">
            🌟「{s}」點亮了！
          </p>
        ))}
        <p className="fb-praise">💬 {feedback.praise}</p>
      </div>

      <div className="reward small">
        <span>也拿到了建材</span>
        <strong>{costText(reward)}</strong>
      </div>
      <div className="row-buttons">
        <button className="big-btn primary" onClick={onVillage}>
          去村莊蓋房子 🏡
        </button>
        <button className="big-btn" onClick={onHome}>
          回任務列表
        </button>
      </div>
    </div>
  )
}
