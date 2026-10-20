import type { CompareQ, Question } from '../data/types'
import { kmText, lengthInMm } from './length'

// 記憶卡到期時，數學題換數字再出一次，讓孩子提取「方法」而不是背「這題答案是 7」。
// 變體沿用原題 id（記憶卡用 id 追蹤），只換數字和跟著數字變的文字。

export type Rng = () => number

const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

/** 在 [min, max] 裡挑一個跟 avoid 不同的整數 */
function intExcept(rng: Rng, min: number, max: number, avoid: number) {
  const n = int(rng, min, max - 1)
  return n >= avoid ? n + 1 : n
}

const digits = (rng: Rng, length: number) =>
  Array.from({ length }, (_, i) => String(i === 0 ? int(rng, 1, 9) : int(rng, 0, 9)))

/** 長度天秤：左邊「a 公里 b 公尺」，右邊換成公尺，差一點點或剛好相等 */
function lengthCompareVariant(q: CompareQ, rng: Rng): CompareQ {
  const km = int(rng, 1, 60)
  const m = int(rng, 0, 999)
  const total = km * 1000 + m
  const shift = [-1, 0, 1][int(rng, 0, 2)] * [1, 10, 100, 1000][int(rng, 0, 3)]
  const right = Math.max(1, total + shift)
  const answer = total > right ? '>' : total < right ? '<' : '='
  return {
    ...q,
    prompt: '比比看',
    left: kmText(total),
    right: `${right} 公尺`,
    answer,
    hint: '先把公里換成公尺（1 公里 ＝ 1000 公尺），單位一樣才能比。',
    explain: `${kmText(total)} ＝ ${total} 公尺，${total} ${answer} ${right}。`,
  }
}

/** 小數天秤：常見陷阱是 6.08 和 6.8、3.14 和 3.41；產生同一個整數部分、小數位不同的兩個數 */
function decimalCompareVariant(q: CompareQ, rng: Rng): CompareQ {
  const whole = int(rng, 0, 30)
  const d1 = int(rng, 0, 9)
  const d2 = int(rng, 1, 9)
  const left = `${whole}.${d1}${d2}`
  const kinds = [`${whole}.${d2}${d1}`, `${whole}.${d1}`, `${whole}.${d2}`, `${whole + 1}.0${d2}`]
  const right = kinds[int(rng, 0, kinds.length - 1)]
  const [l, r] = [Number(left), Number(right)]
  const answer = l > r ? '>' : l < r ? '<' : '='
  return {
    ...q,
    prompt: '比比看',
    left,
    right,
    answer,
    hint: '先比整數部分；一樣的話，從十分位開始一位一位比。位數不夠可以在後面補 0 再比。',
    explain: `${left} ${answer} ${right}。`,
  }
}

/** 四年級天秤：產生同樣位數、從某一位開始不同的兩個數；一半的題目在後面藏一個 ? */
function compareVariant(q: CompareQ, rng: Rng): CompareQ {
  if (lengthInMm(q.left) !== null || lengthInMm(q.right) !== null) return lengthCompareVariant(q, rng)
  if (/[.點]/.test(q.left + q.right)) return decimalCompareVariant(q, rng)
  const length = Math.max(7, q.left.replace(/\D/g, '').length)
  const right = digits(rng, length)
  const left = [...right]
  const diffAt = int(rng, 0, length - 3)
  const options = Array.from({ length: 10 }, (_, d) => d).filter((d) => String(d) !== right[diffAt] && (diffAt > 0 || d > 0))
  left[diffAt] = String(options[int(rng, 0, options.length - 1)])
  const withMystery = rng() < 0.5
  if (withMystery) left[int(rng, diffAt + 1, length - 1)] = '?'
  const answer = Number(left[diffAt]) > Number(right[diffAt]) ? '>' : '<'
  const word = answer === '>' ? '大' : '小'
  return {
    ...q,
    prompt: withMystery ? '比比看（? 是 0～9 的任一個數字）' : '比比看',
    left: left.join(''),
    right: right.join(''),
    answer,
    hint: '位數一樣多，就從最左邊一位一位比，找到第一個不一樣的位。',
    explain: `從左邊數第 ${diffAt + 1} 位開始不一樣：${left[diffAt]} 比 ${right[diffAt]} ${word}，所以左邊比較${word}${withMystery ? '，後面的 ? 是多少都沒關係' : ''}。`,
  }
}

export function makeVariant(q: Question, rng: Rng = Math.random): Question {
  switch (q.type) {
    case 'count': {
      if (q.scene.length !== 1) return q
      // 10 以內的題目換 10 以內的數；30 以內的題目換 11～30
      const n = q.scene[0].n > 10 ? intExcept(rng, 11, 30, q.scene[0].n) : intExcept(rng, 1, 10, q.scene[0].n)
      return { ...q, scene: [{ ...q.scene[0], n }], explain: `數一數，一共是 ${n}。` }
    }
    case 'pickN': {
      if (q.cross) return q
      const n = intExcept(rng, 1, q.total - 1, q.n)
      return {
        ...q,
        n,
        prompt: q.prompt.replace(/圈出 \d+ 個/, `圈出 ${n} 個`),
        hint: q.hint.replace(/數到 \d+/, `數到 ${n}`),
        explain: `要剛好 ${n} 個。`,
      }
    }
    case 'fillTo': {
      const target = q.target > 10 ? intExcept(rng, 11, 30, q.target) : intExcept(rng, 3, 10, q.target)
      const have = q.target > 10 ? int(rng, Math.max(1, target - 9), target - 1) : int(rng, 1, target - 1)
      return {
        ...q,
        have,
        target,
        prompt: q.prompt.replace(/要有 \d+ /, `要有 ${target} `),
        hint: q.hint.replace(/數到 \d+/, `數到 ${target}`),
        explain: `已經有 ${have} 個，再補 ${target - have} 個就是 ${target} 個。`,
      }
    }
    case 'same': {
      const l = int(rng, 1, 8)
      const r = rng() < 0.5 ? l : Math.min(9, Math.max(1, l + (rng() < 0.5 ? -1 : 1) * int(rng, 1, 2)))
      return {
        ...q,
        left: { ...q.left, n: l },
        right: { ...q.right, n: r },
        answer: l === r,
        explain: `左邊 ${l} 個，右邊 ${r} 個，${l === r ? '一樣多' : '不一樣多'}。`,
      }
    }
    case 'compare':
      return compareVariant(q, rng)
    case 'divide': {
      // 應用題（有單位）保留原題情境；純計算題換成同樣位數的被除數和除數
      if (q.units) return q
      const digitsOf = (n: number) => String(n).length
      const dLen = digitsOf(q.divisor)
      const divisor = int(rng, Math.max(2, 10 ** (dLen - 1)), 10 ** dLen - 1)
      const nLen = digitsOf(q.dividend)
      const dividend = int(rng, Math.max(divisor, 10 ** (nLen - 1)), 10 ** nLen - 1)
      const quotient = Math.floor(dividend / divisor)
      const remainder = dividend % divisor
      return {
        ...q,
        dividend,
        divisor,
        prompt: `用直式算算看：${dividend} ÷ ${divisor}`,
        explain: `${dividend} ÷ ${divisor} ＝ ${quotient} … ${remainder}。驗算：${divisor} × ${quotient} ＋ ${remainder} ＝ ${dividend}。`,
      }
    }
    case 'bond': {
      const whole = int(rng, 3, 10)
      const a = int(rng, 1, whole - 1)
      const parts: [number, number] = [a, whole - a]
      const prompt =
        q.blank === 'whole'
          ? `${parts[0]} 和 ${parts[1]} 合起來是多少？`
          : `${whole} 可以分成 ${parts[q.blank === 0 ? 1 : 0]} 和多少？`
      return { ...q, whole, parts, prompt, explain: `${parts[0]} 和 ${parts[1]} 合起來是 ${whole}。` }
    }
    case 'multiply': {
      const len = (n: number) => String(n).length
      const a = int(rng, 10 ** (len(q.a) - 1), 10 ** len(q.a) - 1)
      const b = int(rng, Math.max(2, 10 ** (len(q.b) - 1)), 10 ** len(q.b) - 1)
      return { ...q, a, b, prompt: `用直式算算看：${a} × ${b}`, explain: `${a} × ${b} ＝ ${a * b}。` }
    }
    case 'angle': {
      if (q.ask === 'compute') return q
      if (q.ask === 'kind') {
        const pool = [int(rng, 2, 17) * 5, 90, int(rng, 19, 34) * 5, 180]
        const degrees = pool[int(rng, 0, 3)]
        // 旋轉後兩條邊都要在上半部（0～180 度），圖才不會被切掉
        return { ...q, degrees, tilt: int(rng, 0, Math.floor((180 - degrees) / 15)) * 15 }
      }
      const degrees = q.ask === 'measure' ? int(rng, 2, 17) * 10 : int(rng, 4, 34) * 5
      const prompt = q.ask === 'draw' ? `以黑點為中心，畫出一個 ${degrees} 度的角。` : q.prompt
      return { ...q, degrees, prompt, explain: q.ask === 'draw' ? `從 0 開始的那一圈，數到 ${degrees} 就是 ${degrees} 度。` : `這個角是 ${degrees} 度。` }
    }
    case 'length': {
      if (q.ask === 'fair') {
        const aligned = rng() < 0.5
        const items = q.items.map((it, i) => ({ ...it, size: int(rng, 3, 8), offset: aligned || i === 0 ? 0 : int(rng, 1, 3) }))
        return { ...q, items, explain: aligned ? '起點對齊了，這樣比是對的。' : '起點沒有對齊，要先把一頭對齊才能比。' }
      }
      // 換長度但保持只有一個最長（最短），差距至少 1
      const sizes = q.items.map(() => int(rng, 2, 9))
      const target = int(rng, 0, sizes.length - 1)
      sizes[target] = q.ask === 'max' ? Math.max(...sizes) + 1 : Math.max(1, Math.min(...sizes) - 1)
      for (let i = 0; i < sizes.length; i++) if (i !== target && sizes[i] === sizes[target]) sizes[i] += q.ask === 'max' ? -1 : 1
      const items = q.items.map((it, i) => ({ ...it, size: Math.min(10, sizes[i]) }))
      const word = q.ask === 'max' ? '最長' : '最短'
      return { ...q, items, explain: `${items[target].label}${q.direction === 'vertical' ? (q.ask === 'max' ? '最高' : '最矮') : word}。` }
    }
    case 'equation': {
      // 純計算或看圖題換數字；故事題（沒有圖、要寫整個算式）保留原題情境
      if (!q.emoji && q.blanks.length > 1) return q
      const a = q.op === '+' ? int(rng, 0, 9) : int(rng, 1, 10)
      const b = q.op === '+' ? int(rng, 0, 10 - a) : int(rng, 0, a)
      const c = q.op === '+' ? a + b : a - b
      // 一年級會朗讀題目，用「加、減、等於」不用符號
      const sign = q.op === '+' ? '加' : '減'
      const prompt = q.emoji
        ? q.prompt
        : q.blanks.includes('a')
          ? `幾${sign} ${b} 等於 ${c}？`
          : q.blanks.includes('b')
            ? `${a} ${sign}幾等於 ${c}？`
            : `${a} ${sign} ${b} 等於多少？`
      return { ...q, a, b, prompt, explain: `${a} ${sign} ${b} 等於 ${c}。` }
    }
    case 'triangle': {
      // 隨機兩個角（5 的倍數），第三個角補到 180；sides 題保留原本的邊的特性（正、等腰、都不是）
      if (q.ask === 'sides') return q
      let a = int(rng, 4, 20) * 5
      let b = int(rng, 4, 20) * 5
      while (a + b > 165) b -= 15
      const angles: [number, number, number] = [a, b, 180 - a - b]
      if (q.ask === 'kind' && rng() < 0.35) {
        a = int(rng, 6, 12) * 5
        angles[0] = a
        angles[1] = 90
        angles[2] = 90 - a
      }
      const unknown = q.unknown ?? 2
      return {
        ...q,
        angles,
        unknown,
        explain:
          q.ask === 'missing'
            ? `三角形三個角合起來是 180 度：180 － ${angles.filter((_, i) => i !== unknown).join(' － ')} ＝ ${angles[unknown]} 度。`
            : `最大的角是 ${Math.max(...angles)} 度。`,
      }
    }
    case 'sequence': {
      const step = q.values[1] - q.values[0]
      const n = q.values.length
      // 維持原題的數字範圍（10 以內或 30 以內）
      const top = Math.max(...q.values) > 10 ? 30 : 10
      const lo = step > 0 ? 1 : n
      const start = int(rng, lo, step > 0 ? top - n + 1 : top)
      const values = Array.from({ length: n }, (_, i) => start + step * i)
      return { ...q, values, explain: `${values.join('、')}，${step > 0 ? '一個比一個多 1' : '一個比一個少 1'}。` }
    }
    default:
      return q
  }
}

/** 交錯混題：輪流從各組各拿一題，同一組裡維持原本的先後（到期早的先） */
export function interleave<T>(items: T[], groupOf: (item: T) => string): T[] {
  const groups = new Map<string, T[]>()
  for (const item of items) groups.set(groupOf(item), [...(groups.get(groupOf(item)) ?? []), item])
  const queues = [...groups.values()]
  const out: T[] = []
  while (queues.some((q) => q.length > 0)) for (const q of queues) if (q.length > 0) out.push(q.shift()!)
  return out
}

/** 分組集中：同一組放在一起，組的順序依第一次出現 */
export function blocked<T>(items: T[], groupOf: (item: T) => string): T[] {
  const order = [...new Set(items.map(groupOf))]
  return order.flatMap((g) => items.filter((item) => groupOf(item) === g))
}
