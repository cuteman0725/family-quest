import type { EquationQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷07_10以內的加法(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀，prompt 不放符號。

const PICTURE_HINT = '先數左邊有幾個，再數右邊有幾個，合起來再數一次。'
const STORY_HINT = '先找出兩個數，合起來用加法：「本來有幾個，再來幾個」。'
const ADD_HINT = '先記住大的數，再用手指往下數小的數。例如 6 加 3：6，7、8、9。'

/** 看圖列式：三格都要填 */
const picture = (id: string, emoji: string, a: number, b: number, unit: string, label: string): EquationQ => ({
  id, type: 'equation', op: '+', a, b, blanks: ['a', 'b', 'c'], emoji,
  prompt: `看圖，把算式填好。一共有幾${unit}${label}？`,
  hint: PICTURE_HINT, explain: `${a} 加 ${b} 等於 ${a + b}。`,
})

/** 故事題：三格都要填 */
const story = (id: string, prompt: string, a: number, b: number, explain: string): EquationQ => ({
  id, type: 'equation', op: '+', a, b, blanks: ['a', 'b', 'c'], prompt, hint: STORY_HINT, explain,
})

/** 計算：只填答案 */
const calc = (id: string, a: number, b: number): EquationQ => ({
  id, type: 'equation', op: '+', a, b, blanks: ['c'],
  prompt: `${a} 加 ${b} 等於多少？`,
  hint: b === 0 || a === 0 ? '加 0 就是什麼都沒有加進來。' : ADD_HINT,
  explain: `${a} 加 ${b} 等於 ${a + b}。`,
})

const Q = {
  // 看圖列式
  balls: picture('g1u7-paper-p1', '⚽', 8, 2, '顆', '球'),
  ducks: picture('g1u7-paper-p2', '🦆', 4, 4, '隻', '鴨子'),
  cars: picture('g1u7-paper-p3', '🚗', 2, 5, '輛', '車子'),
  bowls: picture('g1u7-paper-p4', '🍚', 6, 0, '碗', '飯'),
  apples: picture('g1u7-v-p1', '🍎', 3, 4, '顆', '蘋果'),
  chicks: picture('g1u7-v-p2', '🐤', 5, 2, '隻', '小雞'),

  // 說故事、列算式
  birds: story('g1u7-paper-s1', '樹上有 7 隻小鳥，又飛來 3 隻，現在樹上有幾隻小鳥？', 7, 3, '7 加 3 等於 10，有 10 隻小鳥。'),
  chocolate: story('g1u7-paper-s2', '哥哥有 3 塊巧克力，妹妹也有 3 塊，兩個人一共有幾塊巧克力？', 3, 3, '3 加 3 等於 6，一共 6 塊。'),
  shirts: story('g1u7-paper-s3', '衣櫃裡有 3 件長袖上衣和 4 件短袖上衣，一共有幾件上衣？', 3, 4, '3 加 4 等於 7，一共 7 件。'),
  pants: story('g1u7-paper-s4', '衣櫃裡有 6 件長褲，媽媽又買了 2 件，現在有幾件長褲？', 6, 2, '6 加 2 等於 8，現在有 8 件。'),
  balloons: story('g1u7-v-s1', '姊姊有 2 個氣球，阿姨又給她 6 個，姊姊現在有幾個氣球？', 2, 6, '2 加 6 等於 8，有 8 個氣球。'),

  // 加法計算
  c53: calc('g1u7-paper-c1', 5, 3),
  c15: calc('g1u7-paper-c2', 1, 5),
  c64: calc('g1u7-paper-c3', 6, 4),
  c09: calc('g1u7-paper-c4', 0, 9),
  c27: calc('g1u7-paper-c5', 2, 7),
  c55: calc('g1u7-paper-c6', 5, 5),
  c43: calc('g1u7-v-c1', 4, 3),
  c28: calc('g1u7-v-c2', 2, 8),

  // 加法的規律
  zero: {
    id: 'g1u7-paper-r1', type: 'trueFalse', prompt: '任何數加 0，答案還是原來的數。', answer: true,
    hint: '加 0 就是什麼都沒有加進來。', explain: '對。例如 6 加 0 還是 6。',
  },
  swap: {
    id: 'g1u7-paper-r2', type: 'trueFalse', prompt: '3 加 4 和 4 加 3 的答案一樣。', answer: true,
    hint: '左手 3 顆、右手 4 顆，兩手交換，糖果有變多嗎？', explain: '對。兩個數換位置相加，答案一樣，都是 7。',
  },
  missingA: {
    id: 'g1u7-paper-r3', type: 'equation', op: '+', a: 6, b: 4, blanks: ['a'],
    prompt: '幾加 4 等於 10？',
    hint: '從 4 開始往上數到 10，數了幾下？', explain: '6 加 4 等於 10，空格填 6。',
  },
  missingB: {
    id: 'g1u7-paper-r4', type: 'equation', op: '+', a: 7, b: 2, blanks: ['b'],
    prompt: '7 加幾等於 9？',
    hint: '從 7 開始往上數到 9：8、9，數了幾下？', explain: '7 加 2 等於 9，空格填 2。',
  },
} satisfies Record<string, Question>

export const g1u7: Unit = {
  id: 'g1u7',
  number: 7,
  grade: 1,
  subject: '數學',
  title: '10 以內的加法',
  source: '數學1上單元卷07（康軒）',
  tasks: [
    {
      id: 'g1u7-t1', skill: '看圖列加法算式', title: '看圖說加法', icon: '🖼️', blurb: '左邊幾個、右邊幾個，合起來幾個？',
      questions: [Q.balls, Q.ducks, Q.cars, Q.bowls, Q.apples, Q.chicks],
    },
    {
      id: 'g1u7-t2', skill: '加法故事', title: '加法故事', icon: '🐦', blurb: '聽故事，寫出算式。',
      questions: [Q.birds, Q.chocolate, Q.shirts, Q.pants, Q.balloons],
    },
    {
      id: 'g1u7-t3', skill: '10 以內的加法', title: '加法快手', icon: '➕', blurb: '算得又快又對。',
      questions: [Q.c53, Q.c15, Q.c64, Q.c09, Q.c27, Q.c55, Q.c43, Q.c28],
    },
    {
      id: 'g1u7-t4', skill: '加法的規律', title: '加法小祕密', icon: '🔍', blurb: '加 0 會怎樣？換位置會怎樣？',
      questions: [Q.zero, Q.swap, Q.missingA, Q.missingB],
    },
  ],
  boss: {
    id: 'g1u7-boss', skill: '整份單元', title: '單元七魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.balls, Q.ducks, Q.cars, Q.bowls,
      Q.birds, Q.chocolate, Q.shirts, Q.pants,
      Q.c53, Q.c15, Q.c64, Q.c09, Q.c27, Q.c55,
      Q.zero, Q.swap, Q.missingA, Q.missingB,
    ],
  },
}
