import type { BondQ } from '../data/types'
import { bondAnswer } from '../lib/answer'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'
import { Pile } from './Picture'

/**
 * 數字分合圖：上面一格是合起來的數，下面兩格是分成的兩堆，空白的那格用數字按鈕回答。
 * 有 emoji 時把兩堆畫在左右兩邊（中間虛線隔開），讓一年級可以數。
 */
export function Bond({ q, onAnswer, locked }: GameProps<BondQ>) {
  const answer = bondAnswer(q)
  const cell = (value: number, isBlank: boolean, cls: string) => (
    <div className={`bond-cell ${cls} ${isBlank ? 'blank' : ''}`}>{isBlank ? '？' : value}</div>
  )

  return (
    <div className="picture-game">
      {q.emoji && (
        <div className="bond-piles">
          <Pile emoji={q.emoji} n={q.parts[0]} />
          <div className="bond-divider" aria-hidden />
          <Pile emoji={q.emoji} n={q.parts[1]} />
        </div>
      )}
      <div className="bond">
        {cell(q.whole, q.blank === 'whole', 'top')}
        <svg className="bond-lines" viewBox="0 0 200 40" aria-hidden>
          <line x1="100" y1="0" x2="45" y2="40" />
          <line x1="100" y1="0" x2="155" y2="40" />
        </svg>
        <div className="bond-parts">
          {cell(q.parts[0], q.blank === 0, '')}
          {cell(q.parts[1], q.blank === 1, '')}
        </div>
      </div>
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
    </div>
  )
}
