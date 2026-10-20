import { Fragment, type ReactNode } from 'react'
import { FRACTION_PATTERN } from '../lib/fraction'

/** 一個上下排的分數（帶分數的整數寫在左邊） */
export function Frac({ whole, num, den }: { whole?: number | string; num: number | string; den: number | string }) {
  return (
    <span className="frac-wrap">
      {whole !== undefined && whole !== '' && <span className="frac-whole">{whole}</span>}
      <span className="frac" aria-label={`${den}分之${num}`}>
        <span className="frac-num">{num}</span>
        <span className="frac-den">{den}</span>
      </span>
    </span>
  )
}

/** 一般文字，裡面的「3/5」「2 3/5」畫成上下排的分數 */
export function Rich({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(FRACTION_PATTERN)) {
    parts.push(text.slice(last, m.index))
    parts.push(<Frac key={m.index} whole={m[1]} num={m[2]} den={m[3]} />)
    last = m.index + m[0].length
  }
  if (parts.length === 0) return <>{text}</>
  parts.push(text.slice(last))
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  )
}
