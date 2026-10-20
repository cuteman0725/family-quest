import type { BondQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷04_分與合(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級題目會自動朗讀，prompt 不放符號；提示寫成小教學，方便在家先學。

/** 看兩堆圖，合起來有幾個 */
const join = (id: string, emoji: string, a: number, b: number, label: string, unit: string): BondQ => ({
  id, type: 'bond', emoji, whole: a + b, parts: [a, b], blank: 'whole',
  prompt: `合起來有幾${unit}${label}？`,
  hint: '先數左邊，再接著數右邊，不要從 1 重新數。',
  explain: `${a} 和 ${b} 合起來是 ${a + b}。`,
})

/** 一堆已經知道，另一堆有幾個 */
const split = (id: string, emoji: string, whole: number, known: number, label: string, unit: string): BondQ => ({
  id, type: 'bond', emoji, whole, parts: [known, whole - known], blank: 1,
  prompt: `${whole} ${unit}${label}分成兩堆，一堆 ${known} ${unit}，另一堆有幾${unit}？`,
  hint: `看右邊那一堆，一個一個數；也可以想：${known} 再加幾個會變成 ${whole}？`,
  explain: `${whole} 可以分成 ${known} 和 ${whole - known}。`,
})

/** 只看數字的分合圖 */
const numbers = (id: string, whole: number, parts: [number, number], blank: BondQ['blank']): BondQ => ({
  id, type: 'bond', whole, parts, blank,
  prompt:
    blank === 'whole'
      ? `${parts[0]} 和 ${parts[1]} 合起來是多少？`
      : `${whole} 可以分成 ${parts[blank === 0 ? 1 : 0]} 和多少？`,
  hint: blank === 'whole' ? '可以伸出手指，一隻手比一個數，再全部數一數。' : `伸出 ${whole} 根手指，彎下已經知道的那幾根，數一數還剩幾根。`,
  explain: `${parts[0]} 和 ${parts[1]} 合起來是 ${whole}。`,
})

/** 撿紅點：手裡有 have，從 options 這幾張牌裡找出合起來是 10 的那張 */
const cards = (id: string, have: number, options: number[]): Question => ({
  id, type: 'choice', prompt: `撿紅點遊戲：手裡的牌是 ${have}，要撿哪一張，合起來才是 10？`,
  options: options.map(String),
  answer: options.indexOf(10 - have),
  hint: `${have} 再加幾個會變成 10？可以伸出 10 根手指，彎下 ${have} 根，數剩下的。`,
  explain: `${have} 和 ${10 - have} 合起來是 10。`,
})

const Q = {
  // 合起來
  blocks: join('g1u4-paper-j1', '🧱', 6, 4, '積木', '塊'),
  bugs: join('g1u4-paper-j2', '🐞', 3, 3, '瓢蟲', '隻'),
  yoyo: join('g1u4-paper-j3', '🪀', 3, 0, '溜溜球', '個'),
  pudding: join('g1u4-paper-j4', '🍮', 5, 4, '布丁', '個'),
  fish: join('g1u4-v-j1', '🐟', 1, 3, '魚', '條'),
  apple: join('g1u4-v-j2', '🍎', 5, 3, '蘋果', '顆'),

  // 分一分
  trees: split('g1u4-paper-s1', '🌳', 9, 1, '樹', '棵'),
  chicks: split('g1u4-v-s1', '🐤', 7, 2, '小雞', '隻'),
  candy: split('g1u4-v-s2', '🍬', 6, 4, '糖果', '顆'),
  flower: split('g1u4-v-s3', '🌸', 5, 3, '花', '朵'),
  balloon: split('g1u4-v-s4', '🎈', 10, 6, '氣球', '顆'),
  star: split('g1u4-v-s5', '⭐', 8, 7, '星星', '顆'),

  // 數字分合
  n5: numbers('g1u4-paper-n1', 5, [3, 2], 'whole'),
  n8: numbers('g1u4-paper-n2', 8, [1, 7], 'whole'),
  n7: numbers('g1u4-paper-n3', 7, [4, 3], 0),
  n6: numbers('g1u4-paper-n4', 6, [4, 2], 1),
  n9: numbers('g1u4-v-n1', 9, [4, 5], 1),
  n10: numbers('g1u4-v-n2', 10, [2, 8], 0),

  // 湊十
  match10: {
    id: 'g1u4-paper-m1', type: 'match', prompt: '連連看：哪兩堆合起來是 10？',
    pairs: [
      ['🍓🍓🍓🍓🍓🍓🍓', '🍓🍓🍓'],
      ['🍓🍓', '🍓🍓🍓🍓🍓🍓🍓🍓'],
      ['🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓', '（空空的）'],
      ['🍓', '🍓🍓🍓🍓🍓🍓🍓🍓🍓'],
    ],
    hint: '先數左邊有幾顆，再想：還要幾顆才會是 10？',
  },
  card4: cards('g1u4-paper-k1', 4, [5, 3, 6, 7]),
  card9: cards('g1u4-paper-k2', 9, [1, 5, 6, 9]),
  card3: cards('g1u4-v-k1', 3, [6, 7, 8, 9]),
  card6: cards('g1u4-v-k2', 6, [2, 3, 4, 5]),
} satisfies Record<string, Question>

export const g1u4: Unit = {
  id: 'g1u4',
  number: 4,
  grade: 1,
  subject: '數學',
  title: '分與合',
  source: '數學1上單元卷04（康軒）',
  tasks: [
    {
      id: 'g1u4-t1', skill: '合起來是多少', title: '合起來', icon: '🤝', blurb: '兩堆合在一起有幾個？',
      questions: [Q.blocks, Q.bugs, Q.yoyo, Q.pudding, Q.fish, Q.apple],
    },
    {
      id: 'g1u4-t2', skill: '分成兩堆', title: '分一分', icon: '✂️', blurb: '分成兩堆，另一堆有幾個？',
      questions: [Q.trees, Q.chicks, Q.candy, Q.flower, Q.balloon, Q.star],
    },
    {
      id: 'g1u4-t3', skill: '數字分合', title: '數字分合', icon: '🔢', blurb: '看數字，填空格。',
      questions: [Q.n5, Q.n8, Q.n7, Q.n6, Q.n9, Q.n10],
    },
    {
      id: 'g1u4-t4', skill: '合起來是 10', title: '撿紅點', icon: '🃏', blurb: '找出合起來是 10 的兩個數。',
      questions: [Q.match10, Q.card4, Q.card9, Q.card3, Q.card6],
    },
  ],
  boss: {
    id: 'g1u4-boss', skill: '整份單元', title: '單元四魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [Q.match10, Q.blocks, Q.bugs, Q.yoyo, Q.pudding, Q.trees, Q.n5, Q.n8, Q.n7, Q.n6, Q.card4, Q.card9],
  },
}
