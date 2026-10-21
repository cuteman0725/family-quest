import { useState } from 'react'
import type { BinsQ } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'
import { SINGLE_CHAR, ZHUYIN_ONLY } from '../lib/zhuyin'

/** 分類：先點一個項目，再點它該去的籃子；放錯會抖一下，自己改到全部放好（自己訂正） */
export function Bins({ q, onAnswer, locked }: GameProps<BinsQ>) {
  const [placed, setPlaced] = useState<number[]>([])
  const [sel, setSel] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<number | null>(null)

  const drop = (bin: number) => {
    if (locked || sel === null) return
    if (q.items[sel].bin !== bin) {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShake(bin)
      setTimeout(() => setShake(null), 400)
      return
    }
    sfx.tap()
    const next = [...placed, sel]
    setPlaced(next)
    setSel(null)
    if (next.length === q.items.length) setTimeout(() => onAnswer(mistakes === 0, { selfCorrected: true }), 400)
  }

  return (
    <div className="picture-game">
      <div className="row-buttons wrap">
        {q.items.map((it, i) =>
          placed.includes(i) ? null : (
            <button
              key={i}
              className={`big-btn bins-item ${ZHUYIN_ONLY.test(it.label) ? 'zhuyin-opt' : ''} ${SINGLE_CHAR.test(it.label) ? 'char-opt' : ''} ${sel === i ? 'selected' : ''}`}
              disabled={locked}
              onClick={() => {
                sfx.tap()
                setSel(i)
              }}
            >
              {it.label}
            </button>
          ),
        )}
      </div>
      <p className="counter">{sel === null ? '先點一個，再點它要放的籃子' : `「${q.items[sel].label}」要放進哪一個籃子？`}</p>
      <div className="bins">
        {q.bins.map((b, bi) => (
          <button key={b} className={`bin ${shake === bi ? 'shake' : ''}`} disabled={locked} onClick={() => drop(bi)}>
            <span className="bin-name">{b}</span>
            <span className="bin-items">
              {placed
                .filter((i) => q.items[i].bin === bi)
                .map((i) => (
                  <span key={i} className={`bin-chip ${ZHUYIN_ONLY.test(q.items[i].label) ? 'zhuyin' : ''}`}>
                    {q.items[i].label}
                  </span>
                ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
