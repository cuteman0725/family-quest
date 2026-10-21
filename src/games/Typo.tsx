import { useState } from 'react'
import type { TypoQ } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

/** 標點和空白不能點 */
const PUNCT = /^[\s，。、！？；：「」『』（）]$/

/**
 * 找錯字：先在句子裡點出寫錯的字，再選出正確的字。
 * 點錯、選錯都會抖一下，自己改到對為止（自己訂正）。
 */
export function Typo({ q, onAnswer, locked }: GameProps<TypoQ>) {
  // 可以點的單位：一個字，或一個語詞
  const chars = q.words ?? [...q.sentence]
  const unit = q.words ? '語詞' : '字'
  const [found, setFound] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [shake, setShake] = useState<string | null>(null)

  const miss = (key: string) => {
    sfx.wrong()
    setMistakes((m) => m + 1)
    setShake(key)
    setTimeout(() => setShake(null), 400)
  }

  // 多一個重複的字（「的的」）時，點哪一個都算對
  const isWrong = (i: number) => i === q.wrong || (!!q.extra && chars[i] === chars[q.wrong] && Math.abs(i - q.wrong) === 1)

  const tapChar = (i: number) => {
    if (locked || found) return
    if (!isWrong(i)) return miss(`c${i}`)
    sfx.tap()
    setFound(true)
    if (q.extra) {
      setFixed(true)
      setTimeout(() => onAnswer(mistakes === 0, { selfCorrected: true }), 600)
    }
  }

  const pick = (i: number) => {
    if (locked || fixed) return
    if (i !== q.answer) return miss(`o${i}`)
    sfx.tap()
    setFixed(true)
    setTimeout(() => onAnswer(mistakes === 0, { selfCorrected: true }), 500)
  }

  return (
    <div className="picture-game">
      <p className="typo-sentence">
        {chars.map((c, i) =>
          // 刪掉的多餘字整個拿掉
          fixed && q.extra && i === q.wrong ? null : PUNCT.test(c) ? (
            <span key={i} className="typo-punct">
              {c}
            </span>
          ) : (
            <button
              key={i}
              className={`typo-char ${found && i === q.wrong ? 'found' : ''} ${shake === `c${i}` ? 'shake' : ''}`}
              disabled={locked}
              onClick={() => tapChar(i)}
            >
              {fixed && i === q.wrong ? q.options[q.answer] : c}
            </button>
          ),
        )}
      </p>
      {!found || q.extra ? (
        <p className="counter">
          {q.extra ? '句子裡多了一個字，把它點掉' : q.words ? '句子裡有一個語詞用得不對，把它點出來' : '句子裡有一個錯字，把它點出來'}
        </p>
      ) : (
        <>
          <p className="counter">
            「{chars[q.wrong]}」要改成哪一個{unit}？
          </p>
          <div className="row-buttons wrap">
            {q.options.map((o, i) => (
              <button
                key={o}
                className={`big-btn ${shake === `o${i}` ? 'shake' : ''}`}
                disabled={locked || fixed}
                onClick={() => pick(i)}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
