import type { OrderQ } from '../data/types'
import { orderAnswer } from '../lib/answer'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

const FROM_TEXT = { left: '← 從左邊數起', right: '從右邊數起 →', top: '↑ 從上往下數', bottom: '↓ 從下往上數' }

/** 排排隊：一排（或一棟樓）的人或動物，問第幾個、第 n 個是誰、前面後面有幾個 */
export function Order({ q, onAnswer, locked }: GameProps<OrderQ>) {
  const answer = orderAnswer(q)
  const vertical = q.from === 'top' || q.from === 'bottom'

  return (
    <div className="picture-game">
      <p className="order-from">{FROM_TEXT[q.from]}</p>
      <div className={`order-line ${vertical ? 'vertical' : ''}`}>
        {q.items.map((it, i) => (
          <button
            key={i}
            className={`order-item ${q.ask !== 'which' && i === q.target ? 'target' : ''}`}
            disabled={locked || q.ask !== 'which'}
            onClick={() => {
              sfx.tap()
              onAnswer(i === answer)
            }}
          >
            <span className="order-emoji">{it.emoji}</span>
            <span className="order-name">{it.name}</span>
          </button>
        ))}
      </div>
      {q.ask !== 'which' && (
        <div className="number-row">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              className="key round"
              disabled={locked}
              onClick={() => {
                sfx.tap()
                onAnswer(n === answer)
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
