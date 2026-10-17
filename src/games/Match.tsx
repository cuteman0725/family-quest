import { useMemo, useState } from 'react'
import type { MatchQ } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 連連看：先點左邊，再點右邊。配錯會抖一下，孩子自己改到全部配對完成。 */
export function Match({ q, onAnswer, locked }: GameProps<MatchQ>) {
  const right = useMemo(() => shuffle(q.pairs.map((p) => p[1])), [q])
  const [sel, setSel] = useState<number | null>(null)
  const [done, setDone] = useState<number[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const [mistakes, setMistakes] = useState(0)

  const pickRight = (label: string) => {
    if (sel === null || locked) return
    if (q.pairs[sel][1] === label) {
      sfx.correct()
      const next = [...done, sel]
      setDone(next)
      setSel(null)
      if (next.length === q.pairs.length) onAnswer(mistakes === 0, { selfCorrected: true })
    } else {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShake(label)
      setTimeout(() => setShake(null), 400)
    }
  }

  return (
    <div className="match">
      <div className="match-col">
        {q.pairs.map(([l], i) => (
          <button
            key={l}
            className={`match-item ${sel === i ? 'selected' : ''} ${done.includes(i) ? 'matched' : ''}`}
            disabled={locked || done.includes(i)}
            onClick={() => {
              sfx.tap()
              setSel(i)
            }}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="match-col">
        {right.map((r) => {
          const matched = done.some((i) => q.pairs[i][1] === r)
          return (
            <button
              key={r}
              className={`match-item text ${matched ? 'matched' : ''} ${shake === r ? 'shake' : ''}`}
              disabled={locked || matched}
              onClick={() => pickRight(r)}
            >
              {r}
            </button>
          )
        })}
      </div>
      {mistakes > 0 && done.length < q.pairs.length && <p className="inline-hint">💡 {q.hint}</p>}
    </div>
  )
}
