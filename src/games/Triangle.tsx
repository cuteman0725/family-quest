import type { TriangleQ } from '../data/types'
import { TRIANGLE_KINDS, TRIANGLE_SIDES, triangleAnswer } from '../lib/answer'
import { sfx } from '../lib/sfx'
import { NumberInput } from './Keypad'
import type { GameProps } from './types'

const W = 400
const H = 240
const PAD = 36

/** 依三個角算出頂點（左下、右下、頂點），縮放到畫面裡；底邊保持水平 */
function vertices([a0, a1]: [number, number, number]) {
  const rad = (d: number) => (d * Math.PI) / 180
  const L = Math.sin(rad(a1)) / Math.sin(rad(a0 + a1))
  const pts = [
    [0, 0],
    [1, 0],
    [L * Math.cos(rad(a0)), L * Math.sin(rad(a0))],
  ]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const [minX, maxX, maxY] = [Math.min(...xs), Math.max(...xs), Math.max(...ys)]
  const scale = Math.min((W - 2 * PAD) / (maxX - minX), (H - 2 * PAD) / maxY)
  const offsetX = (W - (maxX - minX) * scale) / 2 - minX * scale
  return pts.map(([x, y]) => [offsetX + x * scale, H - PAD - y * scale])
}

export function Triangle({ q, onAnswer, locked }: GameProps<TriangleQ>) {
  const pts = vertices(q.angles)
  const [cx, cy] = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3]
  const answer = triangleAnswer(q)

  const figure = (
    <svg className="angle-svg" viewBox={`0 0 ${W} ${H}`}>
      <polygon className="tri-shape" points={pts.map((p) => p.join(',')).join(' ')} />
      {pts.map(([x, y], i) => {
        // 標籤往三角形中心移一點，才會在角的裡面
        const dx = cx - x
        const dy = cy - y
        const d = Math.hypot(dx, dy) || 1
        const label = q.ask === 'missing' && i === q.unknown ? '?' : `${q.angles[i]}°`
        return (
          <text
            key={i}
            className={`arc-label ${label === '?' ? 'target' : ''}`}
            x={x + (dx / d) * 34}
            y={y + (dy / d) * 34}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )

  if (q.ask === 'missing') {
    return (
      <div className="angle-game">
        {figure}
        <NumberInput
          q={{ id: q.id, type: 'number', prompt: q.prompt, hint: q.hint, answers: [String(answer)], unit: '度' }}
          onAnswer={onAnswer}
          locked={locked}
        />
      </div>
    )
  }

  const options = q.ask === 'kind' ? TRIANGLE_KINDS : TRIANGLE_SIDES
  return (
    <div className="angle-game">
      {figure}
      <div className="row-buttons wrap">
        {options.map((o) => (
          <button
            key={o}
            className="big-btn"
            disabled={locked}
            onClick={() => {
              sfx.tap()
              onAnswer(o === answer)
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
