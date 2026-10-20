import type { ChoiceQ, EquationQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷08_10以內的減法(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀，prompt 不放符號。減法的圖是同一堆畫掉幾個。

const PICTURE_HINT = '先數全部有幾個，再數被畫掉的有幾個，剩下的就是答案。'
const STORY_HINT = '本來有幾個？拿走（吃掉、飛走）幾個？用減法：本來的減掉拿走的。'
const SUB_HINT = '從大的數往回數。例如 8 減 3：8，7、6、5。'

/** 看圖列式（emoji 會換數字，prompt 不寫數字） */
const picture = (id: string, emoji: string, a: number, b: number, prompt: string, blanks: EquationQ['blanks'] = ['a', 'b', 'c']): EquationQ => ({
  id, type: 'equation', op: '-', a, b, blanks, emoji, prompt,
  hint: PICTURE_HINT, explain: `${a} 減 ${b} 等於 ${a - b}。`,
})

const story = (id: string, prompt: string, op: EquationQ['op'], a: number, b: number, explain: string, context?: string): EquationQ => ({
  id, type: 'equation', op, a, b, blanks: ['a', 'b', 'c'], prompt, context,
  hint: op === '+' ? '本來有的，再加上又來的，合起來用加法。' : STORY_HINT, explain,
})

const calc = (id: string, a: number, b: number): EquationQ => ({
  id, type: 'equation', op: '-', a, b, blanks: ['c'],
  prompt: `${a} 減 ${b} 等於多少？`,
  hint: b === 0 ? '減 0 就是什麼都沒有拿走。' : a === b ? '全部都拿走，還剩幾個？' : SUB_HINT,
  explain: `${a} 減 ${b} 等於 ${a - b}。`,
})

const addOrSub = (id: string, prompt: string, answer: 0 | 1, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options: ['加法', '減法'], answer,
  hint: '又來、再買、合起來，東西變多用加法；吃掉、拿走、飛走，東西變少用減法。', explain,
})

const mango = '芒果有很多營養，例如維生素 A 可以保護眼睛，維生素 C 可以幫助身體調節。'

const Q = {
  // 看圖說減法
  bananas: picture('g1u8-paper-p1', '🍌', 10, 3, '吃掉了一些香蕉，還剩下幾根香蕉？看圖把算式填好。'),
  birds: picture('g1u8-paper-p2', '🐦', 10, 8, '樹上的小鳥飛走了一些，樹上還有幾隻小鳥？看圖把算式填好。', ['b', 'c']),
  cookies: picture('g1u8-v-p1', '🍪', 8, 3, '吃掉了一些餅乾，還剩下幾片餅乾？看圖把算式填好。'),
  balloons: picture('g1u8-v-p2', '🎈', 6, 2, '飛走了一些氣球，還剩下幾個氣球？看圖把算式填好。'),

  // 減法故事
  darts: story('g1u8-paper-s1', '爸爸射飛鏢，第一次射中 7 枝，第二次射中 0 枝，第一次比第二次多射中幾枝？', '-', 7, 0, '7 減 0 等於 7，多射中 7 枝。'),
  buns: story('g1u8-paper-s2', '弟弟想吃 8 個小籠包，已經吃了 5 個，有幾個還沒吃？', '-', 8, 5, '8 減 5 等於 3，還有 3 個沒吃。'),
  lolly: story('g1u8-paper-s3', '有 9 枝棒棒糖和 4 枝冰棒，棒棒糖比冰棒多幾枝？', '-', 9, 4, '9 減 4 等於 5，棒棒糖多 5 枝。'),
  marbles: story('g1u8-v-s1', '盒子裡有 9 顆彈珠，弟弟拿走 6 顆，盒子裡還剩幾顆？', '-', 9, 6, '9 減 6 等於 3，還剩 3 顆。'),

  // 減法計算
  c90: calc('g1u8-paper-c1', 9, 0),
  c54: calc('g1u8-paper-c2', 5, 4),
  c88: calc('g1u8-paper-c3', 8, 8),
  c107: calc('g1u8-paper-c4', 10, 7),
  c64: calc('g1u8-paper-c5', 6, 4),
  c71: calc('g1u8-paper-c6', 7, 1),
  c95: calc('g1u8-v-c1', 9, 5),
  c104: calc('g1u8-v-c2', 10, 4),

  // 加還是減
  mangoBuy: story('g1u8-paper-m1', '爸爸買了 5 個愛文芒果和 2 個金煌芒果，爸爸一共買了幾個芒果？', '+', 5, 2, '5 加 2 等於 7，買了 7 個芒果。', mango),
  mangoEat: story('g1u8-paper-m2', '爸爸買了 7 個芒果，晚上全家人一起吃了 3 個，還有幾個芒果？', '-', 7, 3, '7 減 3 等於 4，還有 4 個芒果。', mango),
  oranges: addOrSub('g1u8-v-k1', '桌上有 6 顆橘子，吃掉 2 顆，還剩幾顆？要用加法還是減法？', 1, '吃掉了，橘子變少，用減法：6 減 2 等於 4。'),
  puppies: addOrSub('g1u8-v-k2', '有 3 隻小狗，又跑來 4 隻，一共有幾隻？要用加法還是減法？', 0, '又跑來，小狗變多，用加法：3 加 4 等於 7。'),

  // 減法的規律
  minusZero: {
    id: 'g1u8-v-r1', type: 'trueFalse', prompt: '任何數減 0，答案還是原來的數。', answer: true,
    hint: '減 0 就是什麼都沒有拿走。', explain: '對。例如 9 減 0 還是 9。',
  },
  minusSelf: {
    id: 'g1u8-v-r2', type: 'trueFalse', prompt: '一個數減掉自己，答案是 0。', answer: true,
    hint: '有 8 個，全部拿走，還剩幾個？', explain: '對。例如 8 減 8 等於 0，全部拿走就沒有了。',
  },
  missingB: {
    id: 'g1u8-v-r3', type: 'equation', op: '-', a: 10, b: 4, blanks: ['b'],
    prompt: '10 減幾等於 6？',
    hint: '從 10 往回數到 6：9、8、7、6，數了幾下？', explain: '10 減 4 等於 6，空格填 4。',
  },
  missingA: {
    id: 'g1u8-v-r4', type: 'equation', op: '-', a: 8, b: 3, blanks: ['a'],
    prompt: '幾減 3 等於 5？',
    hint: '拿走 3 個還剩 5 個，本來有幾個？5 和 3 合起來。', explain: '8 減 3 等於 5，空格填 8。',
  },
} satisfies Record<string, Question>

export const g1u8: Unit = {
  id: 'g1u8',
  number: 8,
  grade: 1,
  subject: '數學',
  title: '10 以內的減法',
  source: '數學1上單元卷08（康軒）',
  tasks: [
    {
      id: 'g1u8-t1', skill: '看圖列減法算式', title: '看圖說減法', icon: '🍌', blurb: '畫掉幾個，還剩幾個？',
      questions: [Q.bananas, Q.birds, Q.cookies, Q.balloons],
    },
    {
      id: 'g1u8-t2', skill: '減法故事', title: '減法故事', icon: '🥟', blurb: '吃掉、拿走、比多少。',
      questions: [Q.darts, Q.buns, Q.lolly, Q.marbles],
    },
    {
      id: 'g1u8-t3', skill: '10 以內的減法', title: '減法快手', icon: '➖', blurb: '往回數，算得又快又對。',
      questions: [Q.c90, Q.c54, Q.c88, Q.c107, Q.c64, Q.c71, Q.c95, Q.c104],
    },
    {
      id: 'g1u8-t4', skill: '加法還是減法', title: '芒果時間', icon: '🥭', blurb: '變多用加，變少用減。',
      questions: [Q.mangoBuy, Q.mangoEat, Q.oranges, Q.puppies],
    },
    {
      id: 'g1u8-t5', skill: '減法的規律', title: '減法小祕密', icon: '🔍', blurb: '減 0 會怎樣？減掉自己呢？',
      questions: [Q.minusZero, Q.minusSelf, Q.missingB, Q.missingA],
    },
  ],
  boss: {
    id: 'g1u8-boss', skill: '整份單元', title: '單元八魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.bananas, Q.birds, Q.lolly,
      Q.darts, Q.buns,
      Q.c90, Q.c54, Q.c88, Q.c107, Q.c64, Q.c71,
      Q.mangoBuy, Q.mangoEat,
    ],
  },
}
