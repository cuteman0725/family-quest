import type { ChoiceQ, CompareQ, SameQ, TrueFalseQ } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'
import { Pile } from './Picture'

export function TrueFalse({ q, onAnswer, locked }: GameProps<TrueFalseQ>) {
  return (
    <div className="row-buttons">
      <button className="big-btn stamp ok" disabled={locked} onClick={() => onAnswer(q.answer === true)}>
        ⭕<span>對</span>
      </button>
      <button className="big-btn stamp no" disabled={locked} onClick={() => onAnswer(q.answer === false)}>
        ❌<span>錯</span>
      </button>
    </div>
  )
}

export function Choice({ q, onAnswer, locked }: GameProps<ChoiceQ>) {
  return (
    <div className="row-buttons wrap">
      {q.options.map((opt, i) => (
        <button key={opt} className="big-btn" disabled={locked} onClick={() => onAnswer(i === q.answer)}>
          {opt}
        </button>
      ))}
    </div>
  )
}

export function Compare({ q, onAnswer, locked }: GameProps<CompareQ>) {
  return (
    <div className="compare">
      <div className="scale">
        <div className="pan">{q.left}</div>
        <div className="fulcrum">⚖️</div>
        <div className="pan">{q.right}</div>
      </div>
      <div className="row-buttons">
        {(['>', '=', '<'] as const).map((s) => (
          <button key={s} className="big-btn symbol" disabled={locked} onClick={() => onAnswer(s === q.answer)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Same({ q, onAnswer, locked }: GameProps<SameQ>) {
  return (
    <div className="compare">
      <div className="plates">
        <div className="plate">
          <Pile emoji={q.left.emoji} n={q.left.n} />
        </div>
        <div className="plate">
          <Pile emoji={q.right.emoji} n={q.right.n} />
        </div>
      </div>
      <div className="row-buttons">
        <button
          className="big-btn stamp ok"
          disabled={locked}
          onClick={() => {
            sfx.tap()
            onAnswer(q.answer === true)
          }}
        >
          ⭕<span>一樣多</span>
        </button>
        <button
          className="big-btn stamp no"
          disabled={locked}
          onClick={() => {
            sfx.tap()
            onAnswer(q.answer === false)
          }}
        >
          ❌<span>不一樣</span>
        </button>
      </div>
    </div>
  )
}
