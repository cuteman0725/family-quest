import type { BondQ, ClockTime, DivideQ, EquationQ, FractionQ, LengthQ, OrderQ, Question, SortQ, TriangleQ } from '../data/types'
import { fractionText, mixedText, parseFraction } from './fraction'

export const ANGLE_KINDS = ['銳角', '直角', '鈍角', '平角'] as const
export function angleKind(degrees: number) {
  if (degrees < 90) return '銳角'
  if (degrees === 90) return '直角'
  if (degrees < 180) return '鈍角'
  if (degrees === 180) return '平角'
  return '周角'
}

export const TRIANGLE_KINDS = ['銳角三角形', '直角三角形', '鈍角三角形'] as const
export const TRIANGLE_SIDES = ['正三角形', '等腰三角形', '都不是'] as const

/** 三角形題的答案：missing 回傳度數；kind、sides 回傳選項文字 */
export function triangleAnswer(q: TriangleQ): number | string {
  const [a, b, c] = q.angles
  if (q.ask === 'missing') return 180 - q.angles.filter((_, i) => i !== q.unknown).reduce((s, x) => s + x, 0)
  if (q.ask === 'kind') {
    const big = Math.max(a, b, c)
    return big < 90 ? '銳角三角形' : big === 90 ? '直角三角形' : '鈍角三角形'
  }
  if (a === b && b === c) return '正三角形'
  return a === b || b === c || a === c ? '等腰三角形' : '都不是'
}

/** 排排看：正確的點選順序（items 的位置） */
export const sortAnswer = (q: SortQ) =>
  q.order === 'steps'
    ? (q.steps ?? [])
    : q.items
        .map((s, i) => ({ v: parseFraction(s) ?? Number(s), i }))
        .sort((x, y) => (q.order === 'desc' ? y.v - x.v : x.v - y.v))
        .map((x) => x.i)

/** 分數填答對不對：值要一樣；帶分數的分子要比分母小（假分數要換成帶分數或整數） */
export function fractionAnswerOk(q: FractionQ, whole: number, num: number) {
  const target = q.answer.whole * q.den + q.answer.num
  if (whole * q.den + num !== target) return false
  return q.improper || num < q.den
}

export const fractionAnswerText = (q: FractionQ) =>
  q.improper ? `${q.answer.whole * q.den + q.answer.num}/${q.den}` : fractionText(q.answer.whole, q.answer.num, q.den)

export const clockText = (t: ClockTime) => `${t.h} ${t.m === 0 ? '點鐘' : '點半'}`

/** 時鐘題的說明：短針、長針各指在哪裡 */
export const clockExplain = (t: ClockTime) =>
  t.m === 0
    ? `短針指在 ${t.h}，長針指在 12，是 ${clockText(t)}。`
    : `短針在 ${t.h} 和 ${(t.h % 12) + 1} 的中間，長針指在 6，是 ${clockText(t)}。`

export const equationResult = (q: EquationQ) => (q.op === '+' ? q.a + q.b : q.a - q.b)

/** 長度圖：最長／最短那一個的位置；fair 回傳起點是不是都對齊 */
export function lengthAnswer(q: LengthQ): number | boolean {
  if (q.ask === 'fair') return q.items.every((i) => (i.offset ?? 0) === (q.items[0].offset ?? 0))
  const sizes = q.items.map((i) => i.size)
  return sizes.indexOf(q.ask === 'max' ? Math.max(...sizes) : Math.min(...sizes))
}

/** 排排隊：which 回傳被點的位置（items 的 index）；其他回傳數字 */
export function orderAnswer(q: OrderQ): number {
  const n = q.items.length
  const forward = q.from === 'left' || q.from === 'top'
  if (q.ask === 'which') return forward ? q.target - 1 : n - q.target
  const position = forward ? q.target + 1 : n - q.target
  if (q.ask === 'position') return position
  if (q.ask === 'before') return position - 1
  return n - position
}

export const divideAnswer = (q: DivideQ) => ({
  quotient: Math.floor(q.dividend / q.divisor),
  remainder: q.dividend % q.divisor,
})

export const bondAnswer = (q: BondQ) => (q.blank === 'whole' ? q.whole : q.parts[q.blank])

/** 第二次答錯時，顯示給孩子看的正確答案 */
export function answerText(q: Question): string {
  switch (q.type) {
    case 'trueFalse':
      return q.answer ? '⭕ 對' : '❌ 錯'
    case 'choice':
      return q.options[q.answer]
    case 'compare':
      return `${q.left} ${q.answer} ${q.right}`
    case 'number':
      return q.answers[0] + (q.unit ?? '')
    case 'digits':
      return q.answer.join('、')
    case 'match':
      return q.pairs.map(([a, b]) => `${a} → ${b}`).join('\n')
    case 'count':
      return String(q.scene.find((s) => s.label === q.ask)?.n ?? 0)
    case 'pickN':
      return `${q.n} 個`
    case 'fillTo':
      return `補 ${q.target - q.have} 個`
    case 'same':
      return q.answer ? '⭕ 一樣多' : '❌ 不一樣多'
    case 'board':
      return Array.from({ length: q.size }, (_, i) => i + 1).join('、')
    case 'divide': {
      const { quotient, remainder } = divideAnswer(q)
      return q.units
        ? `${quotient} ${q.units[0]}，剩下 ${remainder} ${q.units[1]}`
        : `${q.dividend} ÷ ${q.divisor} ＝ ${quotient} … ${remainder}`
    }
    case 'bond':
      return String(bondAnswer(q))
    case 'pair':
      return `${q.answers[0]} ${q.labels[0]}${q.joiner ? ` ${q.joiner} ` : ' '}${q.answers[1]} ${q.labels[1]}`
    case 'multiply':
      return `${q.a} × ${q.b} ＝ ${q.a * q.b}`
    case 'angle':
      return q.ask === 'kind' ? angleKind(q.degrees) : `${q.degrees} 度`
    case 'length': {
      const a = lengthAnswer(q)
      return typeof a === 'boolean' ? (a ? '⭕ 對，起點對齊了' : '❌ 不對，起點沒有對齊') : `${q.items[a].emoji} ${q.items[a].label}`
    }
    case 'order': {
      const a = orderAnswer(q)
      return q.ask === 'which' ? `${q.items[a].emoji} ${q.items[a].name}` : String(a)
    }
    case 'sequence':
      return q.values.join('、')
    case 'triangle': {
      const a = triangleAnswer(q)
      return typeof a === 'number' ? `${a} 度` : a
    }
    case 'sort':
      return sortAnswer(q)
        .map((i) => q.items[i])
        .join(q.order === 'desc' ? ' ＞ ' : q.order === 'asc' ? ' ＜ ' : ' → ')
    case 'equation':
      return `${q.a} ${q.op === '+' ? '＋' : '－'} ${q.b} ＝ ${equationResult(q)}`
    case 'fraction':
      return fractionAnswerText(q) + (q.unit ? ` ${q.unit}` : '')
    case 'fracLine':
      return q.show === 'mixed' ? mixedText(q.target, q.den) : `${q.target}/${q.den}`
    case 'clock':
      return clockText(q.ask === 'read' ? q.time : q.options[q.answer])
    case 'barBuild':
      return q.categories.map((c, i) => `${c} ${q.values[i]}`).join('、')
    case 'typo':
      return q.extra
        ? `把多的「${[...q.sentence][q.wrong]}」刪掉`
        : `「${(q.words ?? [...q.sentence])[q.wrong]}」改成「${q.options[q.answer]}」`
    case 'bins':
      return q.bins.map((b, bi) => `${b}：${q.items.filter((it) => it.bin === bi).map((it) => it.label).join('、')}`).join('\n')
  }
}

export const normalizeNumber = (s: string) => s.replace(/[,\s，]/g, '').replace(/^0+(?=\d)/, '')
