import { useState } from 'react'
import type { CountQ, FillToQ, PickNQ } from '../data/types'
import { sfx } from '../lib/sfx'
import { NumberInput } from './Keypad'
import type { GameProps } from './types'

/** 一排最多 5 個，跟考卷上的排法一樣；超過 10 個時每 10 個圈成一組（10 個一數） */
export function Pile({ emoji, n }: { emoji: string; n: number }) {
  if (n === 0) return <div className="pile empty">（空空的）</div>
  if (n > 10) {
    const groups = Array.from({ length: Math.ceil(n / 10) }, (_, g) => Math.min(10, n - g * 10))
    return (
      <div className="pile-tens">
        {groups.map((size, g) => (
          <div key={g} className={`pile ${size === 10 ? 'ten' : ''}`}>
            {Array.from({ length: size }, (_, i) => (
              <span key={i} className="pile-item">
                {emoji}
              </span>
            ))}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="pile">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="pile-item">
          {emoji}
        </span>
      ))}
    </div>
  )
}

export function Count({ q, onAnswer, locked }: GameProps<CountQ>) {
  const answer = q.scene.find((s) => s.label === q.ask)?.n ?? 0
  const visible = q.scene.filter((s) => s.n > 0)
  // 超過 10 個改用數字鍵盤（一排 31 個按鈕太多）
  const big = q.scene.some((s) => s.n > 10)
  return (
    <div className="picture-game">
      <div className="scene">
        {visible.map((s) => (
          <Pile key={s.label} emoji={s.emoji} n={s.n} />
        ))}
      </div>
      {big ? (
        <NumberInput
          q={{ id: q.id, type: 'number', prompt: q.prompt, hint: q.hint, answers: [String(answer)] }}
          onAnswer={onAnswer}
          locked={locked}
        />
      ) : (
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

export function PickN({ q, onAnswer, locked }: GameProps<PickNQ>) {
  const [picked, setPicked] = useState<number[]>([])
  const toggle = (i: number) => {
    sfx.tap()
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  }
  // cross：要留下 total − n 個，把多出來的 n 個點掉
  const keep = q.total - q.n
  return (
    <div className="picture-game">
      <div className="target-card">{q.cross ? keep : q.n}</div>
      <div className="pick-grid">
        {Array.from({ length: q.total }, (_, i) => (
          <button
            key={i}
            className={`pick-item ${picked.includes(i) ? (q.cross ? 'crossed' : 'picked') : ''}`}
            disabled={locked}
            onClick={() => toggle(i)}
          >
            {q.emoji}
          </button>
        ))}
      </div>
      <div className="counter">
        {q.cross ? `畫掉了 ${picked.length} 個，還剩 ${q.total - picked.length} 個` : `已經圈了 ${picked.length} 個`}
      </div>
      <button className="big-btn primary" disabled={locked || picked.length === 0} onClick={() => onAnswer(picked.length === q.n)}>
        {q.cross ? '畫好了' : '圈好了'}
      </button>
    </div>
  )
}

export function FillTo({ q, onAnswer, locked }: GameProps<FillToQ>) {
  const [circles, setCircles] = useState(0)
  return (
    <div className="picture-game">
      <div className="target-card">{q.target}</div>
      {/* 原有的物品和補上的圈圈排在同一組，方便孩子接著數 */}
      <div className="fill-grid">
        {Array.from({ length: q.have }, (_, i) => (
          <span key={`h${i}`} className="pile-item">
            {q.emoji}
          </span>
        ))}
        {Array.from({ length: circles }, (_, i) => (
          <button
            key={i}
            className="circle"
            disabled={locked}
            aria-label="擦掉一個圈"
            onClick={() => {
              sfx.tap()
              setCircles((c) => c - 1)
            }}
          >
            ⭕
          </button>
        ))}
      </div>
      <div className="row-buttons">
        <button
          className="big-btn"
          disabled={locked || q.have + circles >= Math.max(10, q.target + 3)}
          onClick={() => {
            sfx.tap()
            setCircles((c) => c + 1)
          }}
        >
          ⭕ 畫一個圈
        </button>
        <button className="big-btn primary" disabled={locked} onClick={() => onAnswer(q.have + circles === q.target)}>
          補好了
        </button>
      </div>
    </div>
  )
}
