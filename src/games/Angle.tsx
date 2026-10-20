import { useRef, useState } from 'react'
import type { AngleFigure, AngleQ } from '../data/types'
import { ANGLE_KINDS, angleKind } from '../lib/answer'
import { sfx } from '../lib/sfx'
import { NumberInput } from './Keypad'
import type { GameProps } from './types'

const CX = 200
const CY = 190
const R = 160

/** 角度 → SVG 座標（0° 朝右、逆時針為正；SVG 的 y 軸朝下所以要反過來） */
const at = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)]
}

function arcPath(from: number, to: number, r: number) {
  const [x1, y1] = at(from, r)
  const [x2, y2] = at(to, r)
  const large = to - from > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`
}

function Ray({ deg, len = R }: { deg: number; len?: number }) {
  const [x, y] = at(deg, len)
  return <line className="angle-ray" x1={CX} y1={CY} x2={x} y2={y} />
}

/** 量角器：外圈刻度從右邊 0° 到左邊 180° */
function Protractor() {
  const ticks = Array.from({ length: 37 }, (_, i) => i * 5)
  return (
    <g className="protractor">
      <path d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY} Z`} />
      {ticks.map((d) => {
        const long = d % 10 === 0
        const [x1, y1] = at(d, R)
        const [x2, y2] = at(d, R - (long ? 16 : 9))
        return <line key={d} className="tick" x1={x1} y1={y1} x2={x2} y2={y2} />
      })}
      {ticks
        .filter((d) => d % 10 === 0)
        .map((d) => {
          const [x, y] = at(d, R - 30)
          return (
            <text key={d} className="tick-label" x={x} y={y} textAnchor="middle" dominantBaseline="middle">
              {d}
            </text>
          )
        })}
      <circle className="pivot" cx={CX} cy={CY} r={4} />
    </g>
  )
}

function Figure({ figure }: { figure: AngleFigure }) {
  return (
    <g>
      {figure.arcs.map((a, i) => {
        const r = 34 + (a.level ?? 0) * 26
        const mid = (a.from + a.to) / 2
        const [lx, ly] = at(mid, r + 16)
        const right = a.label === '∟'
        if (right) {
          const s = 16
          const [ax, ay] = at(a.from, s)
          const [bx, by] = at(a.to, s)
          const [cx, cy] = [ax + bx - CX, ay + by - CY]
          return <path key={i} className="angle-arc" d={`M ${ax} ${ay} L ${cx} ${cy} L ${bx} ${by}`} />
        }
        return (
          <g key={i}>
            <path className="angle-arc" d={arcPath(a.from, a.to, r)} />
            <text className={`arc-label ${a.label === 'A' ? 'target' : ''}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">
              {a.label}
            </text>
          </g>
        )
      })}
      {figure.rays.map((d) => (
        <Ray key={d} deg={d} />
      ))}
      <circle className="pivot" cx={CX} cy={CY} r={4} />
    </g>
  )
}

/** 拖曳或點一下量角器上方，把第二條邊轉到想要的角度（每 5 度一格） */
function DrawAngle({ q, onAnswer, locked }: GameProps<AngleQ>) {
  const [deg, setDeg] = useState(30)
  const svg = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const update = (e: React.PointerEvent) => {
    const box = svg.current?.getBoundingClientRect()
    if (!box) return
    const x = ((e.clientX - box.left) / box.width) * 400 - CX
    const y = CY - ((e.clientY - box.top) / box.height) * 220
    let d = (Math.atan2(y, x) * 180) / Math.PI
    if (d < 0) d = x < 0 ? 180 : 0
    setDeg(Math.max(0, Math.min(180, Math.round(d / 5) * 5)))
  }

  return (
    <div className="angle-game">
      <svg
        ref={svg}
        className="angle-svg draw"
        viewBox="0 0 400 220"
        onPointerDown={(e) => {
          if (locked) return
          dragging.current = true
          ;(e.target as Element).setPointerCapture?.(e.pointerId)
          update(e)
        }}
        onPointerMove={(e) => dragging.current && !locked && update(e)}
        onPointerUp={() => (dragging.current = false)}
      >
        <Protractor />
        <Ray deg={0} />
        <Ray deg={deg} len={R + 10} />
        <path className="angle-arc" d={arcPath(0, Math.max(deg, 0.01), 30)} />
      </svg>
      <p className="counter">用手指拖動藍色的邊，對準量角器上的刻度</p>
      <button
        className="big-btn primary"
        disabled={locked}
        onClick={() => {
          sfx.tap()
          onAnswer(deg === q.degrees)
        }}
      >
        畫好了
      </button>
    </div>
  )
}

export function Angle(props: GameProps<AngleQ>) {
  const { q, onAnswer, locked } = props
  if (q.ask === 'draw') return <DrawAngle {...props} />

  const tilt = q.tilt ?? 0
  const picture = (
    <svg className="angle-svg" viewBox="0 0 400 220">
      {q.ask === 'measure' && <Protractor />}
      {q.ask === 'compute' && q.figure ? (
        <Figure figure={q.figure} />
      ) : (
        <g transform={`rotate(${-tilt} ${CX} ${CY})`}>
          <Ray deg={0} />
          <Ray deg={q.degrees} />
          {q.ask === 'kind' &&
            (q.degrees === 90 ? (
              <Figure figure={{ rays: [], arcs: [{ from: 0, to: 90, label: '∟' }] }} />
            ) : (
              <path className="angle-arc" d={arcPath(0, q.degrees, 30)} />
            ))}
        </g>
      )}
    </svg>
  )

  if (q.ask === 'kind') {
    return (
      <div className="angle-game">
        {picture}
        <div className="row-buttons wrap">
          {ANGLE_KINDS.map((k) => (
            <button
              key={k}
              className="big-btn"
              disabled={locked}
              onClick={() => {
                sfx.tap()
                onAnswer(k === angleKind(q.degrees))
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // measure、compute：看圖，用數字鍵盤填度數
  return (
    <div className="angle-game">
      {picture}
      <NumberInput
        q={{ id: q.id, type: 'number', prompt: q.prompt, hint: q.hint, answers: [String(q.degrees)], unit: '度' }}
        onAnswer={onAnswer}
        locked={locked}
      />
    </div>
  )
}
