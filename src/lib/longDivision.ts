// 直式除法一步一步算：照課本的寫法（商寫在被除數上面、乘完寫下面、相減、再把下一位移下來）
// 產生每一步的畫面和說明。孩子會心算除法，卡在不會「寫」直式，所以每一步都只多寫一點點。

import type { Rng } from './variants'

export interface LDRow {
  /** product：除數 × 這一位商（下面畫線）；rest：相減剩下的（之後會把下一位移下來接在後面） */
  kind: 'product' | 'rest'
  text: string
  /** 最右邊的數字對齊被除數的第幾位（從 0 開始） */
  endCol: number
  /** product 下面那條線從第幾位畫起（跟上面被減的數一樣寬） */
  lineFrom?: number
}

export interface LDBoard {
  /** 每一位被除數上面的商，還沒寫的是空字串 */
  quotient: string[]
  rows: LDRow[]
}

export interface LDStep {
  say: string
  board: LDBoard
  /** 這一步要特別標出來的：商的第幾位、第幾列、被除數的第幾位到第幾位 */
  mark: { q?: number; row?: number; dividend?: [number, number] }
}

export function longDivisionSteps(dividend: number, divisor: number): LDStep[] {
  const d = String(dividend).split('').map(Number)
  const n = d.length
  const quotient: string[] = Array(n).fill('')
  const rows: LDRow[] = []
  const steps: LDStep[] = []
  const snap = (say: string, mark: LDStep['mark']) =>
    steps.push({ say, board: { quotient: [...quotient], rows: rows.map((r) => ({ ...r })) }, mark })

  // 從最左邊開始，找到第一段夠分的
  let i = 0
  let cur = d[0]
  while (cur < divisor && i < n - 1) {
    i++
    cur = cur * 10 + d[i]
  }
  snap(
    i === 0
      ? `${dividend} ÷ ${divisor}：從最左邊開始看。${cur} 夠 ${divisor} 分，商從 ${d[0]} 的上面開始寫。`
      : `${dividend} ÷ ${divisor}：從最左邊開始看。${String(dividend).slice(0, i)} 比 ${divisor} 小，不夠分；多看一位變成 ${cur}，就夠分了，商從 ${d[i]} 的上面開始寫。`,
    { dividend: [0, i] },
  )

  let restRow = -1
  for (;;) {
    const qd = Math.floor(cur / divisor)
    quotient[i] = String(qd)
    if (qd === 0) {
      snap(`${cur} 比 ${divisor} 小，不夠分，商寫 0（這個 0 不能省略）。`, { q: i, row: restRow })
    } else {
      const p = divisor * qd
      const look = restRow === -1 ? { dividend: [i - String(cur).length + 1, i] as [number, number] } : { row: restRow }
      snap(
        qd < 9
          ? `${cur} 裡面有幾個 ${divisor}？試試看：${divisor} × ${qd} ＝ ${p}，${divisor} × ${qd + 1} ＝ ${p + divisor} 太大了，所以商是 ${qd}，寫在 ${d[i]} 的上面。`
          : `${cur} 裡面有幾個 ${divisor}？${divisor} × 9 ＝ ${p}，商最大就是 9，寫在 ${d[i]} 的上面。`,
        { q: i, ...look },
      )
      rows.push({ kind: 'product', text: String(p), endCol: i, lineFrom: i - String(cur).length + 1 })
      snap(`${divisor} × ${qd} ＝ ${p}，寫在 ${cur} 的下面，最右邊對齊，再畫一條線。`, { row: rows.length - 1 })
      const rem = cur - p
      rows.push({ kind: 'rest', text: String(rem), endCol: i })
      restRow = rows.length - 1
      snap(`${cur} − ${p} ＝ ${rem}。${rem} 比 ${divisor} 小，表示商 ${qd} 是對的。`, { row: restRow })
      cur = rem
    }
    if (i === n - 1) break
    i++
    cur = cur * 10 + d[i]
    rows[restRow] = { kind: 'rest', text: String(cur), endCol: i }
    snap(`把下一位 ${d[i]} 移下來，變成 ${cur}。`, { row: restRow, dividend: [i, i] })
  }

  const q = Math.floor(dividend / divisor)
  snap(
    cur === 0
      ? `剛好分完，餘數是 0。${dividend} ÷ ${divisor} ＝ ${q}。驗算：${divisor} × ${q} ＝ ${dividend}。`
      : `最後剩下 ${cur}，比 ${divisor} 小，就是餘數。${dividend} ÷ ${divisor} ＝ ${q} … ${cur}。驗算：${divisor} × ${q} ＋ ${cur} ＝ ${dividend}。`,
    { row: restRow },
  )
  return steps
}

/** 商每一位是不是 0 的樣子，例如 301 → 「x0x」；用來找算法一樣的題目 */
export const quotientShape = (dividend: number, divisor: number) =>
  String(Math.floor(dividend / divisor)).replace(/[1-9]/g, 'x')

/**
 * 找一題「算法一樣」的直式除法當範例：被除數、除數、商的位數都一樣，商裡的 0 也在同樣的位置。
 * 提示時先看範例怎麼寫，再自己算原來那一題（不直接把原題算給他看）。
 */
export function similarDivision(dividend: number, divisor: number, rng: Rng = Math.random) {
  const len = (x: number) => String(x).length
  const pick = (digits: number, min = 0) => {
    const lo = Math.max(min, 10 ** (digits - 1))
    return lo + Math.floor(rng() * (10 ** digits - lo))
  }
  const shape = quotientShape(dividend, divisor)
  let fallback: { dividend: number; divisor: number } | null = null
  for (let t = 0; t < 400; t++) {
    const b = pick(len(divisor), 2)
    const a = pick(len(dividend), b)
    if (a === dividend && b === divisor) continue
    if (quotientShape(a, b) === shape) return { dividend: a, divisor: b }
    if (!fallback && String(Math.floor(a / b)).length === shape.length) fallback = { dividend: a, divisor: b }
  }
  return fallback ?? { dividend, divisor }
}
