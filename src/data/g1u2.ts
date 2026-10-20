import type { LengthQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷02_比長短(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用長條加 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀，prompt 不放符號；圖片放在 picture 或長條圖裡。

type Item = LengthQ['items'][number]
const item = (emoji: string, label: string, size: number, offset = 0): Item => ({ emoji, label, size, offset })

const longest = (id: string, prompt: string, items: Item[], word = '長'): LengthQ => {
  const top = items.reduce((a, b) => (b.size > a.size ? b : a))
  return {
    id, type: 'length', direction: 'horizontal', ask: 'max', items, prompt,
    hint: '先看左邊有沒有對齊，再看哪一條伸得最遠。',
    explain: `${top.label}比較${word}。`,
  }
}

const shortest = (id: string, prompt: string, items: Item[]): LengthQ => {
  const low = items.reduce((a, b) => (b.size < a.size ? b : a))
  return {
    id, type: 'length', direction: 'horizontal', ask: 'min', items, prompt,
    hint: '左邊對齊了，看哪一條最早停下來。',
    explain: `${low.label}最短。`,
  }
}

const tallest = (id: string, prompt: string, items: Item[], word: '高' | '厚'): LengthQ => {
  const top = items.reduce((a, b) => (b.size > a.size ? b : a))
  return {
    id, type: 'length', direction: 'vertical', ask: 'max', items, prompt,
    hint: word === '高' ? '下面都站在同一條線上，看誰的頭頂最高。' : '疊起來看，哪一個疊得最高，就是最厚的。',
    explain: `${top.label}比較${word}。`,
  }
}

const fair = (id: string, prompt: string, items: Item[], aligned: boolean): LengthQ => ({
  id, type: 'length', direction: 'horizontal', ask: 'fair', items, prompt,
  hint: '看左邊：兩樣東西的頭有沒有在同一條線上？比長短的時候，一頭要先對齊。',
  explain: aligned ? '一頭對齊了，這樣比是對的。' : '一頭沒有對齊，這樣比不準，要先對齊。',
})

const LINES = ['直線', '曲線']
const line = (id: string, picture: string, name: string, answer: 0 | 1): Question => ({
  id, type: 'choice', picture, prompt: `${name}的樣子像直線，還是曲線？`, options: LINES, answer,
  hint: '直線是直直的，拉緊的繩子那樣；曲線是彎彎的。',
  explain: `${name}${answer === 0 ? '直直的，像直線' : '彎彎的，像曲線'}。`,
})

const Q = {
  // 比較長短
  umbrella: longest('g1u2-paper-l1', '哪一把雨傘比較長？', [item('☂️', '上面的雨傘', 8), item('☂️', '下面的雨傘', 5)]),
  pencils: longest('g1u2-v-l1', '哪一枝鉛筆最長？', [item('✏️', '第一枝鉛筆', 5), item('✏️', '第二枝鉛筆', 9), item('✏️', '第三枝鉛筆', 7)]),
  carrots: shortest('g1u2-v-l2', '哪一根紅蘿蔔最短？', [item('🥕', '第一根紅蘿蔔', 6), item('🥕', '第二根紅蘿蔔', 8), item('🥕', '第三根紅蘿蔔', 3)]),
  trains: longest('g1u2-v-l3', '哪一列火車比較長？', [item('🚂', '上面的火車', 6), item('🚂', '下面的火車', 9)]),
  ribbons: shortest('g1u2-v-l4', '哪一條緞帶最短？', [item('🎀', '第一條緞帶', 7), item('🎀', '第二條緞帶', 4), item('🎀', '第三條緞帶', 6)]),

  // 比較高矮和厚薄
  towers: tallest('g1u2-paper-h1', '哪一座積木塔比較高？', [item('🧱', '左邊的積木塔', 5), item('🧱', '右邊的積木塔', 7)], '高'),
  girls: tallest('g1u2-paper-h2', '哪一個小女孩比較高？', [item('👧', '左邊的小女孩', 8), item('👧', '右邊的小女孩', 6)], '高'),
  cakes: tallest('g1u2-paper-h3', '哪一個蛋糕比較高？', [item('🎂', '左邊的蛋糕', 8), item('🎂', '右邊的蛋糕', 3)], '高'),
  blankets: tallest('g1u2-paper-h4', '哪一條被子比較厚？', [item('🛏️', '左邊的被子', 2), item('🛏️', '右邊的被子', 4)], '厚'),
  flowers: tallest('g1u2-v-h1', '哪一朵向日葵最高？', [item('🌻', '左邊的向日葵', 6), item('🌻', '中間的向日葵', 9), item('🌻', '右邊的向日葵', 7)], '高'),
  books: tallest('g1u2-v-h2', '哪一疊書比較厚？', [item('📚', '左邊的書', 6), item('📚', '右邊的書', 3)], '厚'),

  // 比較時要對齊
  cupPencils: fair('g1u2-paper-f1', '看看這兩枝筆，這樣比長短，對嗎？', [item('✏️', '一枝筆', 5, 0), item('✏️', '另一枝筆', 5, 2)], false),
  layPencils: fair('g1u2-paper-f2', '看看這兩枝筆，這樣比長短，對嗎？', [item('✏️', '一枝筆', 8, 0), item('✏️', '另一枝筆', 6, 0)], true),
  combsAligned: fair('g1u2-paper-f3', '看看這兩把梳子，這樣比長短，對嗎？', [item('🪮', '一把梳子', 4, 0), item('🪮', '另一把梳子', 7, 0)], true),
  combsCrossed: fair('g1u2-paper-f4', '看看這兩把梳子，這樣比長短，對嗎？', [item('🪮', '一把梳子', 5, 0), item('🪮', '另一把梳子', 6, 3)], false),
  ropes: fair('g1u2-v-f1', '看看這兩條繩子，這樣比長短，對嗎？', [item('🪢', '一條繩子', 7, 0), item('🪢', '另一條繩子', 5, 0)], true),
  sticks: fair('g1u2-v-f2', '看看這兩根樹枝，這樣比長短，對嗎？', [item('🪵', '一根樹枝', 6, 1), item('🪵', '另一根樹枝', 6, 0)], false),

  // 直線和曲線
  ruler: line('g1u2-paper-s1', '📏', '直尺', 0),
  ribbon: line('g1u2-paper-s2', '🎀', '扭來扭去的緞帶', 1),
  chopsticks: line('g1u2-paper-s3', '🥢', '筷子', 0),
  snake: line('g1u2-paper-s4', '🐍', '蛇', 1),
  wave: line('g1u2-paper-s5', '〰️', '彎彎的線', 1),
  route: {
    id: 'g1u2-paper-r1', type: 'choice',
    prompt: '從家到公園有三條路：一條直直的、兩條彎彎的。哪一條路最短？',
    options: ['直直的路', '彎彎的路'], answer: 0,
    hint: '兩個點之間，直直走過去最近；彎彎的路要繞遠路。',
    explain: '直直的路最短，彎彎的路比較長。',
  },
} satisfies Record<string, Question>

export const g1u2: Unit = {
  id: 'g1u2',
  number: 2,
  grade: 1,
  subject: '數學',
  title: '比長短',
  source: '數學1上單元卷02（康軒）',
  tasks: [
    {
      id: 'g1u2-t1', skill: '比較長短', title: '誰比較長', icon: '📏', blurb: '哪一個比較長？',
      questions: [Q.umbrella, Q.pencils, Q.carrots, Q.trains, Q.ribbons],
    },
    {
      id: 'g1u2-t2', skill: '比較高矮和厚薄', title: '高高矮矮', icon: '🦒', blurb: '誰比較高？哪個比較厚？',
      questions: [Q.towers, Q.girls, Q.cakes, Q.blankets, Q.flowers, Q.books],
    },
    {
      id: 'g1u2-t3', skill: '比較時要對齊', title: '對齊再比', icon: '🎯', blurb: '這樣比，公平嗎？',
      questions: [Q.cupPencils, Q.layPencils, Q.combsAligned, Q.combsCrossed, Q.ropes, Q.sticks],
    },
    {
      id: 'g1u2-t4', skill: '直線和曲線', title: '直直彎彎', icon: '〰️', blurb: '直線還是曲線？',
      questions: [Q.ruler, Q.ribbon, Q.chopsticks, Q.snake, Q.wave, Q.route],
    },
  ],
  boss: {
    id: 'g1u2-boss', skill: '整份單元', title: '單元二魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.umbrella, Q.towers, Q.girls, Q.cakes, Q.blankets,
      Q.ruler, Q.ribbon, Q.chopsticks, Q.snake, Q.wave,
      Q.cupPencils, Q.layPencils, Q.combsAligned, Q.combsCrossed,
      Q.route,
    ],
  },
}
