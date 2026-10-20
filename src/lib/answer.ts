import type { BondQ, DivideQ, Question } from '../data/types'

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
  }
}

export const normalizeNumber = (s: string) => s.replace(/[,\s，]/g, '').replace(/^0+(?=\d)/, '')
