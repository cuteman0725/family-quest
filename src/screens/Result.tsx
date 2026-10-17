import { useEffect } from 'react'
import { costText, type Cost } from '../data/village'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'

interface Props {
  title: string
  mode: 'task' | 'boss'
  reward: Cost
  autoRead: boolean
  onVillage: () => void
  onHome: () => void
}

export function Result({ title, mode, reward, autoRead, onVillage, onHome }: Props) {
  useEffect(() => {
    sfx.done()
    if (autoRead) speak('任務完成！你拿到了建材，可以去村莊蓋房子囉！')
  }, [autoRead])

  return (
    <div className="screen result">
      <div className="confetti" aria-hidden>
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 8) * 0.15}s` }}>
            {['🎉', '⭐', '✨', '🎊'][i % 4]}
          </span>
        ))}
      </div>
      <h1>{mode === 'boss' ? '打倒魔王了！' : '任務完成！'}</h1>
      <p className="result-title">{title}</p>
      <div className="reward">
        <span>獲得</span>
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
