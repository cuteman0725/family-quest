import { useMemo, useState } from 'react'
import { longDivisionSteps } from '../lib/longDivision'
import { sfx } from '../lib/sfx'

/** 直式除法一步一步算：按「下一步」才多寫一點，新寫上的數字標顏色，下面有這一步在做什麼 */
export function LongDivision({ dividend, divisor, title }: { dividend: number; divisor: number; title?: string }) {
  const steps = useMemo(() => longDivisionSteps(dividend, divisor), [dividend, divisor])
  const [k, setK] = useState(0)
  const { board, mark, say } = steps[k]
  const digits = String(dividend).split('')
  const col = (c: number) => c + 2
  const inDividendMark = (c: number) => !!mark.dividend && c >= mark.dividend[0] && c <= mark.dividend[1]

  const go = (to: number) => {
    sfx.tap()
    setK(to)
  }

  return (
    <div className="ld">
      {title && <p className="ld-title">{title}</p>}
      <div className="ld-board" style={{ gridTemplateColumns: `auto repeat(${digits.length}, 1.1em)` }} aria-label="直式除法">
        {board.quotient.map((c, i) => (
          <span key={`q${i}`} className={`ld-cell ld-q ${mark.q === i ? 'new' : ''}`} style={{ gridRow: 1, gridColumn: col(i) }}>
            {c}
          </span>
        ))}
        <span className="ld-divisor" style={{ gridRow: 2, gridColumn: 1 }}>
          {divisor}
        </span>
        <span className="ld-bracket" style={{ gridRow: 2, gridColumn: `2 / ${col(digits.length)}` }} aria-hidden />
        {digits.map((c, i) => (
          <span key={`d${i}`} className={`ld-cell ${inDividendMark(i) ? 'look' : ''}`} style={{ gridRow: 2, gridColumn: col(i) }}>
            {c}
          </span>
        ))}
        {board.rows.map((r, ri) => {
          const start = r.endCol - r.text.length + 1
          return [
            ...[...r.text].map((c, j) => (
              <span
                key={`r${ri}-${j}`}
                className={`ld-cell ${mark.row === ri ? 'new' : ''}`}
                style={{ gridRow: ri + 3, gridColumn: col(start + j) }}
              >
                {c}
              </span>
            )),
            r.kind === 'product' && (
              <span
                key={`l${ri}`}
                className="ld-line"
                style={{ gridRow: ri + 3, gridColumn: `${col(r.lineFrom ?? start)} / ${col(r.endCol + 1)}` }}
                aria-hidden
              />
            ),
          ]
        })}
      </div>
      <div className="ld-side">
        <p className="ld-say">{say}</p>
        <div className="ld-controls">
          <button className="big-btn" disabled={k === 0} onClick={() => go(k - 1)}>
            ◀ 上一步
          </button>
          <span className="ld-count">
            {k + 1} / {steps.length}
          </span>
          <button className="big-btn primary" disabled={k === steps.length - 1} onClick={() => go(k + 1)}>
            下一步 ▶
          </button>
        </div>
      </div>
    </div>
  )
}
