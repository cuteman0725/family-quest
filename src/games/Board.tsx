import { useState } from 'react'
import type { BoardQ } from '../data/types'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'
import type { GameProps } from './types'

/**
 * 直線數字棋盤：1～size 從左排到右。轉轉盤得到 1 或 2，再依序點出經過的每一格，
 * 點到哪格就唸哪格的數字。點錯會唸出正確的下一格，孩子自己改到走完（跟連連看一樣自己訂正）。
 */
export function Board({ q, onAnswer, locked }: GameProps<BoardQ>) {
  const [pos, setPos] = useState(0)
  const [steps, setSteps] = useState(0)
  const [spin, setSpin] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [showNext, setShowNext] = useState(false)
  const done = pos >= q.size

  const turn = () => {
    const r = Math.random() < 0.5 ? 1 : 2
    const n = Math.min(r, q.size - pos)
    sfx.tap()
    setSpin(r)
    setSteps(n)
    speak(`轉到 ${r}，走 ${n} 格`)
  }

  const tapSquare = (n: number) => {
    if (locked || done) return
    if (steps === 0) {
      speak('先轉一轉')
      return
    }
    const next = pos + 1
    if (n !== next) {
      sfx.wrong()
      setMistakes((m) => m + 1)
      setShowNext(true)
      speak(`下一格是 ${next}，點 ${next}`)
      return
    }
    sfx.tap()
    speak(String(n))
    setShowNext(false)
    setPos(n)
    setSteps(steps - 1)
    if (n >= q.size) {
      setTimeout(() => {
        speak(`走到 ${q.size} 了！`)
        onAnswer(mistakes === 0, { selfCorrected: true })
      }, 600)
    }
  }

  return (
    <div className="board-game">
      <div className="board" style={{ gridTemplateColumns: `repeat(${q.size + 1}, minmax(0, 1fr))` }}>
        <div className="board-cell start">{pos === 0 && <span className="token">🐻</span>}出發</div>
        {Array.from({ length: q.size }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`board-cell ${n <= pos ? 'passed' : ''} ${showNext && n === pos + 1 ? 'next' : ''}`}
            disabled={locked || done}
            onClick={() => tapSquare(n)}
          >
            {pos === n && <span className="token">🐻</span>}
            {n}
          </button>
        ))}
      </div>
      <div className="board-controls">
        <div className={`spinner ${spin ? 'spun' : ''}`} key={`${pos}-${spin}`}>
          {spin ?? '？'}
        </div>
        <button className="big-btn primary" disabled={locked || done || steps > 0} onClick={turn}>
          🎡 轉一轉
        </button>
      </div>
      <p className="counter">{done ? '到終點了！' : steps > 0 ? `還要走 ${steps} 格` : '按「轉一轉」'}</p>
    </div>
  )
}
