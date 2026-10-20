// 分數的文字格式：真分數、假分數寫成「3/5」，帶分數寫成「2 3/5」（整數和分數中間一個空格）。
// 題目、選項、說明裡的這種寫法會被 Rich 畫成上下排的分數，朗讀時唸成「2 又 5 分之 3」。

/** 文字裡的分數：第 1 組是帶分數的整數（可能沒有），第 2、3 組是分子、分母 */
export const FRACTION_PATTERN = /(?:(\d+) )?(\d+)\/(\d+)/g

/** 「2 3/5」「16/5」「6」→ 分數的值；看不懂回傳 null */
export function parseFraction(s: string): number | null {
  const t = s.trim()
  if (/^\d+$/.test(t)) return Number(t)
  const m = t.match(/^(?:(\d+) )?(\d+)\/(\d+)$/)
  if (m) return (m[1] ? Number(m[1]) : 0) + Number(m[2]) / Number(m[3])
  return parseChineseFraction(t)
}

const DIGITS = '零一二三四五六七八九'

/** 國字 0～99：「七」「十」「十七」「四十二」 */
export function chineseNumber(s: string): number | null {
  if (!s || !/^[零一二三四五六七八九十]+$/.test(s)) return null
  const ten = s.indexOf('十')
  if (ten === -1) return s.length === 1 ? DIGITS.indexOf(s) : null
  const tens = ten === 0 ? 1 : DIGITS.indexOf(s.slice(0, ten))
  const ones = ten === s.length - 1 ? 0 : DIGITS.indexOf(s.slice(ten + 1))
  if (tens < 1 || ones < 0 || s.slice(ten + 1).length > 1 || ten > 1) return null
  return tens * 10 + ones
}

/** 「十七分之十二」「五又九分之四」→ 值 */
function parseChineseFraction(s: string): number | null {
  const m = s.match(/^(?:(.+)又)?(.+)分之(.+)$/)
  if (!m) return null
  const whole = m[1] ? chineseNumber(m[1]) : 0
  const den = chineseNumber(m[2])
  const num = chineseNumber(m[3])
  if (whole === null || den === null || num === null || den === 0) return null
  return whole + num / den
}

/** 整數、分子、分母 → 文字（分子是 0 就只寫整數；整數是 0 就只寫分數） */
export function fractionText(whole: number, num: number, den: number) {
  if (num === 0) return String(whole)
  return whole > 0 ? `${whole} ${num}/${den}` : `${num}/${den}`
}

/** 假分數 n/d → 帶分數文字（整除就是整數） */
export const mixedText = (n: number, d: number) => fractionText(Math.floor(n / d), n % d, d)

/** 朗讀：「2 3/5」唸成「2又5分之3」，「3/5」唸成「5分之3」 */
export const speakFractions = (text: string) =>
  text.replace(FRACTION_PATTERN, (_, w, n, d) => (w ? `${w}又${d}分之${n}` : `${d}分之${n}`))
