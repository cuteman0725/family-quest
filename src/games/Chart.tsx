import { useState } from 'react'
import type { BarBuildQ, Chart as ChartSpec } from '../data/types'
import { sfx } from '../lib/sfx'
import type { GameProps } from './types'

const W = 640
const H = 380
const M = { left: 62, right: 24, top: 52, bottom: 62 }
const BAR_COLORS = ['#9cc7ec', '#2f6fb3']
const LINE_STYLES = [
  { stroke: '#3b3024', dash: '' },
  { stroke: '#a59684', dash: '' },
  { stroke: '#3b3024', dash: '8 6' },
]

/** 縱軸的刻度：yMin 到 yMax，每 step 一個 */
const ticks = (min: number, max: number, step: number) =>
  Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)

/** 長條圖、折線圖；縱軸不從 0 開始時，下面畫「≈」表示省略 */
export function Chart({ spec }: { spec: ChartSpec }) {
  const yMin = spec.yMin ?? 0
  const broken = yMin > 0
  const plotBottom = H - M.bottom - (broken ? 22 : 0)
  const plotH = plotBottom - M.top
  const plotW = W - M.left - M.right
  const y = (v: number) => M.top + ((spec.yMax - v) / (spec.yMax - yMin)) * plotH
  const groupW = plotW / spec.categories.length
  const cx = (i: number) => M.left + groupW * (i + 0.5)

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={spec.title}>
        {/* 格線和縱軸數字 */}
        {ticks(yMin, spec.yMax, spec.yGrid ?? spec.yStep).map((v) => (
          <line key={`g${v}`} x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} className="ch-grid" />
        ))}
        {ticks(yMin, spec.yMax, spec.yStep).map((v) => (
          <text key={`t${v}`} x={M.left - 8} y={y(v)} className="ch-ytick">
            {v}
          </text>
        ))}
        <line x1={M.left} x2={M.left} y1={M.top - 10} y2={H - M.bottom} className="ch-axis" />
        <line x1={M.left} x2={W - M.right} y1={H - M.bottom} y2={H - M.bottom} className="ch-axis" />
        {broken && (
          <>
            {/* 遮住一段縱軸，看起來是斷開的 */}
            <rect x={M.left - 12} y={plotBottom + 4} width={24} height={13} fill="#fff" />
            <path
              d={`M ${M.left - 10} ${plotBottom + 8} l 5 -5 l 5 5 l 5 -5 l 5 5 M ${M.left - 10} ${plotBottom + 15} l 5 -5 l 5 5 l 5 -5 l 5 5`}
              className="ch-break"
            />
            <text x={M.left - 8} y={H - M.bottom} className="ch-ytick">
              0
            </text>
          </>
        )}
        <text x={M.left - 50} y={M.top - 28} className="ch-axis-label">
          {spec.yLabel}
        </text>
        <text x={W - M.right} y={H - 14} className="ch-axis-label end">
          {spec.xLabel}
        </text>

        {/* 橫軸的類別 */}
        {spec.categories.map((c, i) => (
          <text key={c} x={cx(i)} y={H - M.bottom + 24} className="ch-xtick">
            {c}
          </text>
        ))}

        {spec.kind === 'bar' &&
          spec.series.map((s, si) => {
            const bw = (groupW * 0.64) / spec.series.length
            return s.values.map((v, i) => (
              <rect
                key={`${si}-${i}`}
                x={cx(i) - (bw * spec.series.length) / 2 + si * bw}
                y={y(v)}
                width={bw}
                height={plotBottom - y(v)}
                fill={BAR_COLORS[spec.series.length === 1 ? 1 : si]}
                className="ch-bar"
              />
            ))
          })}

        {spec.kind === 'line' &&
          spec.series.map((s, si) => {
            const style = LINE_STYLES[si % LINE_STYLES.length]
            const points = s.values.map((v, i) => `${cx(i)},${y(v)}`).join(' ')
            return (
              <g key={s.name}>
                <polyline points={points} fill="none" stroke={style.stroke} strokeDasharray={style.dash} className="ch-line" />
                {s.values.map((v, i) => (
                  <g key={i}>
                    <circle cx={cx(i)} cy={y(v)} r={5} fill={style.stroke} />
                    {s.labels && (
                      <text x={cx(i) + 9} y={y(v) - 8} className="ch-point" fill={style.stroke}>
                        {v}
                      </text>
                    )}
                  </g>
                ))}
                {spec.series.length > 1 && (
                  <text x={M.left + 6} y={y(s.values[0]) + (si === 2 ? 16 : -10)} className="ch-series" fill={style.stroke}>
                    {s.name}
                  </text>
                )}
              </g>
            )
          })}

        {/* 長條圖兩組時的圖例 */}
        {spec.kind === 'bar' && spec.series.length > 1 && (
          <g>
            {spec.series.map((s, si) => (
              <g key={s.name} transform={`translate(${W - M.right - 220 + si * 110}, ${M.top - 34})`}>
                <rect width={16} height={16} fill={BAR_COLORS[si]} className="ch-bar" />
                <text x={22} y={13} className="ch-legend">
                  {s.name}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
      <figcaption>{spec.title}</figcaption>
    </figure>
  )
}

/** 畫長條圖：點一個格子，那一條就畫到那個高度；全部畫好按 ✔ */
export function BarBuild({ q, onAnswer, locked }: GameProps<BarBuildQ>) {
  const [heights, setHeights] = useState<(number | null)[]>(q.categories.map(() => null))
  const ready = heights.every((h) => h !== null)
  const rows = Array.from({ length: q.yMax }, (_, i) => q.yMax - i)

  const set = (col: number, h: number) => {
    if (locked) return
    sfx.tap()
    setHeights((hs) => hs.map((x, i) => (i === col ? h : x)))
  }

  return (
    <div className="picture-game">
      <table className="ch-table">
        <tbody>
          <tr>
            <th>{q.xLabel}</th>
            {q.categories.map((c) => (
              <td key={c}>{c}</td>
            ))}
          </tr>
          <tr>
            <th>{q.yLabel}</th>
            {q.values.map((v, i) => (
              <td key={i}>{v}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className="bb-wrap">
        <div className="bb-axis">
          {rows.map((r) => (
            <span key={r}>{r}</span>
          ))}
          <span>0</span>
        </div>
        <div className="bb-grid" style={{ gridTemplateColumns: `repeat(${q.categories.length}, 1fr)` }}>
          {q.categories.map((c, col) => (
            <div key={c} className="bb-col">
              {rows.map((r) => (
                <button
                  key={r}
                  className={`bb-cell ${heights[col] !== null && r <= heights[col]! ? 'on' : ''}`}
                  disabled={locked}
                  aria-label={`${c} ${r}`}
                  onClick={() => set(col, r)}
                />
              ))}
              <span className="bb-label">{c}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="counter">點格子把長條畫到對的高度（點最上面那一格）</p>
      <button
        className="big-btn primary"
        disabled={locked || !ready}
        onClick={() => onAnswer(heights.every((h, i) => h === q.values[i]))}
      >
        畫好了 ✔
      </button>
    </div>
  )
}
