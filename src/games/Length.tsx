import type { LengthQ } from '../data/types'
import { lengthAnswer } from '../lib/answer'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

const STEP = 9 // 每 1 單位的長度占幾 %

/**
 * 長度圖：horizontal 是橫的長條（比長短），vertical 是直的長條（比高矮、厚薄）。
 * max／min 點選答案；fair 判斷起點有沒有對齊。
 */
export function Length({ q, onAnswer, locked }: GameProps<LengthQ>) {
  const answer = lengthAnswer(q)
  const pick = (i: number) => {
    sfx.tap()
    onAnswer(i === answer)
  }
  const clickable = q.ask !== 'fair'

  const bars =
    q.direction === 'horizontal' ? (
      <div className="len-rows">
        {q.items.map((it, i) => (
          <button key={i} className="len-row" disabled={locked || !clickable} onClick={() => pick(i)}>
            <span className="len-track">
              <span className="len-bar" style={{ left: `${(it.offset ?? 0) * STEP}%`, width: `${it.size * STEP}%` }}>
                <span className="len-emoji">{it.emoji}</span>
              </span>
            </span>
          </button>
        ))}
      </div>
    ) : (
      <div className="len-cols">
        {q.items.map((it, i) => (
          <button key={i} className="len-col" disabled={locked || !clickable} onClick={() => pick(i)}>
            <span className="len-col-track">
              <span className="len-tower" style={{ bottom: `${(it.offset ?? 0) * 8}%`, height: `${it.size * 8}%` }} />
            </span>
            <span className="len-emoji">{it.emoji}</span>
          </button>
        ))}
      </div>
    )

  return (
    <div className="picture-game">
      {bars}
      {q.ask === 'fair' && (
        <div className="row-buttons">
          <button className="big-btn stamp ok" disabled={locked} onClick={() => onAnswer(answer === true)}>
            ⭕<span>這樣比對</span>
          </button>
          <button className="big-btn stamp no" disabled={locked} onClick={() => onAnswer(answer === false)}>
            ❌<span>這樣比不對</span>
          </button>
        </div>
      )}
    </div>
  )
}
