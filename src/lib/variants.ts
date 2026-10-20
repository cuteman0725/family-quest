import type { CompareQ, Question } from '../data/types'

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

/** 四年級天秤：產生同樣位數、從某一位開始不同的兩個數；一半的題目在後面藏一個 ? */
function compareVariant(q: CompareQ, rng: Rng): CompareQ {
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
      const n = intExcept(rng, 1, 10, q.scene[0].n)
      return { ...q, scene: [{ ...q.scene[0], n }], explain: `數一數，一共是 ${n}。` }
    }
    case 'pickN': {
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
      const target = intExcept(rng, 3, 10, q.target)
      const have = int(rng, 1, target - 1)
      return {
        ...q,
        have,
        target,
        prompt: q.prompt.replace(/要有 \d+ 個/, `要有 ${target} 個`),
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
