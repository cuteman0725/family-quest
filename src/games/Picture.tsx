import { useState } from 'react'
import type { CountQ, FillToQ, PickNQ } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

/** 一排最多 5 個，跟考卷上的排法一樣 */
export function Pile({ emoji, n }: { emoji: string; n: number }) {
  if (n === 0) return <div className="pile empty">（空空的）</div>
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
  return (
    <div className="picture-game">
      <div className="scene">
        {visible.map((s) => (
          <Pile key={s.label} emoji={s.emoji} n={s.n} />
        ))}
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

export function PickN({ q, onAnswer, locked }: GameProps<PickNQ>) {
  const [picked, setPicked] = useState<number[]>([])
  const toggle = (i: number) => {
    sfx.tap()
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  }
  return (
    <div className="picture-game">
      <div className="target-card">{q.n}</div>
      <div className="pick-grid">
        {Array.from({ length: q.total }, (_, i) => (
          <button
            key={i}
            className={`pick-item ${picked.includes(i) ? 'picked' : ''}`}
            disabled={locked}
            onClick={() => toggle(i)}
          >
            {q.emoji}
          </button>
        ))}
      </div>
      <div className="counter">已經圈了 {picked.length} 個</div>
      <button className="big-btn primary" disabled={locked || picked.length === 0} onClick={() => onAnswer(picked.length === q.n)}>
        圈好了
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
          disabled={locked || circles >= 10}
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
