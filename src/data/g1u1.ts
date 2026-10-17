import type { Question, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷01_10以內的數(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級題目會自動朗讀，prompt 盡量短、口語。

const count = (id: string, emoji: string, n: number, label: string, unit: string): Question => ({
  id, type: 'count', prompt: `有幾${unit}${label}？`, scene: [{ emoji, n, label }], ask: label,
  hint: '用手指一個一個點著數，數過的不要再數。',
  explain: `一共有 ${n} ${unit}${label}。`,
})

const pick = (id: string, emoji: string, n: number, label: string): Question => ({
  id, type: 'pickN', prompt: `點一點，圈出 ${n} 個${label}。`, emoji, total: 10, n,
  hint: `一邊點一邊數：1、2、3…數到 ${n} 就停。`,
  explain: `要剛好 ${n} 個。`,
})

const fill = (id: string, emoji: string, have: number, target: number): Question => ({
  id, type: 'fillTo', prompt: `要有 ${target} 個，還不夠的畫圈圈補上。`, emoji, have, target,
  hint: `先數已經有幾個，再接著數到 ${target}。`,
  explain: `已經有 ${have} 個，再補 ${target - have} 個就是 ${target} 個。`,
})

const same = (id: string, l: [string, number], r: [string, number]): Question => ({
  id, type: 'same', prompt: '兩邊一樣多嗎？',
  left: { emoji: l[0], n: l[1] }, right: { emoji: r[0], n: r[1] }, answer: l[1] === r[1],
  hint: '兩邊各數一數，看數字一不一樣。',
  explain: `左邊 ${l[1]} 個，右邊 ${r[1]} 個，${l[1] === r[1] ? '一樣多' : '不一樣多'}。`,
})

const picnic = [
  { emoji: '🧺', n: 1, label: '籃子' },
  { emoji: '☕', n: 4, label: '杯子' },
  { emoji: '🧃', n: 0, label: '果汁' },
]
const shelf = [
  { emoji: '🏐', n: 3, label: '球' },
  { emoji: '🧸', n: 1, label: '小熊' },
  { emoji: '📕', n: 4, label: '書' },
  { emoji: '🚗', n: 5, label: '玩具車' },
]
const scene = (id: string, items: typeof picnic, label: string, unit: string, where: string): Question => {
  const n = items.find((i) => i.label === label)?.n ?? 0
  return {
    id, type: 'count', prompt: `${where}有幾${unit}${label}？`, scene: items, ask: label,
    hint: n === 0 ? `仔細找找看，${where}有沒有${label}？` : `只數${label}就好，其他的不要數。`,
    explain: n === 0 ? `${where}沒有${label}，是 0。` : `${where}有 ${n} ${unit}${label}。`,
  }
}

const Q = {
  boat: count('g1u1-paper-c1', '⛵', 4, '帆船', '艘'),
  candy: count('g1u1-paper-c2', '🍬', 10, '糖果', '顆'),
  fish: count('g1u1-v-c1', '🐟', 7, '魚', '條'),
  flower: count('g1u1-v-c2', '🌸', 3, '花', '朵'),
  chick: count('g1u1-v-c3', '🐤', 8, '小雞', '隻'),
  berry: count('g1u1-v-c4', '🍓', 6, '草莓', '顆'),

  carrot: pick('g1u1-paper-p1', '🥕', 2, '紅蘿蔔'),
  apple7: pick('g1u1-paper-p2', '🍎', 7, '蘋果'),
  hat: pick('g1u1-paper-p3', '👒', 6, '帽子'),
  ball: pick('g1u1-paper-p4', '⚽', 9, '足球'),
  banana: pick('g1u1-v-p1', '🍌', 4, '香蕉'),
  car: pick('g1u1-v-p2', '🚙', 8, '車子'),

  umbrella: fill('g1u1-paper-f1', '☂️', 2, 5),
  candle: fill('g1u1-paper-f2', '🕯️', 3, 8),
  apple4: fill('g1u1-paper-f3', '🍎', 4, 7),
  bun: fill('g1u1-paper-f4', '🥟', 5, 10),
  donut: fill('g1u1-v-f1', '🍩', 1, 6),
  frog: fill('g1u1-v-f2', '🐸', 6, 9),

  sameApple: same('g1u1-paper-s1', ['🍎', 6], ['🍎', 6]),
  samePencil: same('g1u1-paper-s2', ['✏️', 3], ['✏️', 4]),
  samePet: same('g1u1-v-s1', ['🐶', 4], ['🐱', 4]),
  sameSnack: same('g1u1-v-s2', ['🍪', 5], ['🥛', 6]),
  sameSky: same('g1u1-v-s3', ['⭐', 3], ['🌙', 2]),
  zeroApple: {
    id: 'g1u1-v-c5', type: 'count', prompt: '盤子上有幾顆蘋果？',
    scene: [{ emoji: '🍌', n: 3, label: '香蕉' }, { emoji: '🍎', n: 0, label: '蘋果' }], ask: '蘋果',
    hint: '仔細找找看，盤子上有沒有蘋果？',
    explain: '盤子上只有香蕉，沒有蘋果，是 0。',
  },

  basket: scene('g1u1-paper-k1', picnic, '籃子', '個', '野餐墊上'),
  cup: scene('g1u1-paper-k2', picnic, '杯子', '個', '野餐墊上'),
  juice: scene('g1u1-paper-k3', picnic, '果汁', '瓶', '野餐墊上'),
  shelfBall: scene('g1u1-paper-k4', shelf, '球', '顆', '櫃子裡'),
  shelfBook: scene('g1u1-paper-k5', shelf, '書', '本', '櫃子裡'),
  shelfCar: scene('g1u1-paper-k6', shelf, '玩具車', '輛', '櫃子裡'),
} satisfies Record<string, Question>

export const g1u1: Unit = {
  id: 'g1u1',
  grade: 1,
  subject: '數學',
  title: '10 以內的數',
  source: '數學1上單元卷01（康軒）',
  tasks: [
    {
      id: 'g1u1-t1', title: '數一數', icon: '🔢', blurb: '數數看有幾個。',
      questions: [Q.boat, Q.candy, Q.fish, Q.flower, Q.chick, Q.berry],
    },
    {
      id: 'g1u1-t2', title: '圈圈看', icon: '👆', blurb: '點出剛好的數量。',
      questions: [Q.carrot, Q.apple7, Q.hat, Q.ball, Q.banana, Q.car],
    },
    {
      id: 'g1u1-t3', title: '補補看', icon: '➕', blurb: '不夠的補上圈圈。',
      questions: [Q.umbrella, Q.candle, Q.apple4, Q.bun, Q.donut, Q.frog],
    },
    {
      id: 'g1u1-t4', title: '一樣多嗎', icon: '⚖️', blurb: '比比看兩邊一樣多嗎。',
      questions: [Q.sameApple, Q.samePencil, Q.samePet, Q.sameSnack, Q.sameSky, Q.zeroApple],
    },
    {
      id: 'g1u1-t5', title: '整理櫃子', icon: '🧸', blurb: '找找看，數數看。',
      questions: [Q.basket, Q.cup, Q.juice, Q.shelfBall, Q.shelfBook, Q.shelfCar],
    },
  ],
  boss: {
    id: 'g1u1-boss', title: '單元一魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.carrot, Q.apple7, Q.hat, Q.ball,
      Q.umbrella, Q.candle, Q.apple4, Q.bun,
      Q.sameApple, Q.samePencil,
      Q.boat, Q.candy,
      Q.basket, Q.cup, Q.juice,
      Q.shelfBall, Q.shelfBook, Q.shelfCar,
    ],
  },
}
