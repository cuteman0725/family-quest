import type { ClockQ, ClockTime } from '../data/types'
import { clockText } from '../lib/answer'
import { sfx } from '../lib/sfx'
import { speak } from '../lib/speech'
import type { GameProps } from './types'

/** 有 12 個數字的時鐘；長針指 12 或 6，短針在「幾點」或「幾點和下一點的中間」 */
export function ClockFace({ time, size = 240 }: { time: ClockTime; size?: number }) {
  const hourAngle = ((time.h % 12) + time.m / 60) * 30
  const minuteAngle = time.m * 6
  const hand = (angle: number, length: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x2: 100 + length * Math.cos(rad), y2: 100 + length * Math.sin(rad) }
  }
  return (
    <svg className="clock" width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <circle cx={100} cy={100} r={94} className="clock-rim" />
      {Array.from({ length: 60 }, (_, i) => {
        const big = i % 5 === 0
        const rad = ((i * 6 - 90) * Math.PI) / 180
        const r1 = big ? 80 : 85
        return (
          <line
            key={i}
            x1={100 + r1 * Math.cos(rad)}
            y1={100 + r1 * Math.sin(rad)}
            x2={100 + 90 * Math.cos(rad)}
            y2={100 + 90 * Math.sin(rad)}
            className={big ? 'clock-tick big' : 'clock-tick'}
          />
        )
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1
        const rad = ((n * 30 - 90) * Math.PI) / 180
        return (
          <text key={n} x={100 + 64 * Math.cos(rad)} y={100 + 64 * Math.sin(rad)} className="clock-num">
            {n}
          </text>
        )
      })}
      <line x1={100} y1={100} {...hand(minuteAngle, 72)} className="clock-hand minute" />
      <line x1={100} y1={100} {...hand(hourAngle, 46)} className="clock-hand hour" />
      <circle cx={100} cy={100} r={6} className="clock-pin" />
    </svg>
  )
}

/** read：看時鐘按幾點；pick：點出題目說的那個時鐘 */
export function Clock({ q, onAnswer, locked }: GameProps<ClockQ>) {
  if (q.ask === 'pick') {
    return (
      <div className="clock-options">
        {q.options.map((t, i) => (
          <button key={i} className="clock-option" disabled={locked} onClick={() => onAnswer(i === q.answer)} aria-label={`第 ${i + 1} 個時鐘`}>
            <ClockFace time={t} size={150} />
          </button>
        ))}
      </div>
    )
  }
  const suffix = q.time.m === 0 ? '點鐘' : '點半'
  return (
    <div className="picture-game">
      <ClockFace time={q.time} size={280} />
      <p className="clock-blank">（　）{suffix}</p>
      <div className="number-row">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <button
            key={h}
            className="key round"
            disabled={locked}
            onClick={() => {
              sfx.tap()
              speak(clockText({ h, m: q.time.m }))
              onAnswer(h === q.time.h)
            }}
          >
            {h}
          </button>
        ))}
      </div>
    </div>
  )
}
