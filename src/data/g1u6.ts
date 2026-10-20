import type { CountQ, NumberQ, Question, SequenceQ, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷06_30以內的數(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀，prompt 不放符號。超過 10 個的圖會自動每 10 個圈成一組。

const TENS_HINT = '先 10 個 10 個圈起來，數有幾個 10，再數剩下的：10、20，再接著 21、22……'

const count = (id: string, emoji: string, n: number, label: string, unit: string): CountQ => ({
  id, type: 'count', prompt: `有幾${unit}${label}？`, scene: [{ emoji, n, label }], ask: label,
  hint: TENS_HINT, explain: `${Math.floor(n / 10)} 個十和 ${n % 10} 個一，是 ${n}。`,
})

const seq = (id: string, values: number[], blanks: number[]): SequenceQ => ({
  id, type: 'sequence', values, blanks,
  prompt: values[1] > values[0] ? '數字排排隊，一個比一個多 1，填上空格。' : '數字倒著排，一個比一個少 1，填上空格。',
  hint: values[1] > values[0] ? '看前面的數，再往下數一個；看後面的數，往回數一個。' : '倒著數：看前面的數，少 1 就是下一個。',
  explain: `${values.join('、')}。`,
})

const n = (id: string, prompt: string, answer: number, hint: string, explain: string): NumberQ => ({
  id, type: 'number', prompt, answers: [String(answer)], hint, explain,
})

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): Question => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const COMPARE_HINT = '先比十位：幾個十比較多，那個數就比較大；十位一樣，再比個位。'
const QUEUE_HINT = '前面有幾個人，自己就排在下一個；後面那個人比自己多 1。'

const Q = {
  // 10 個一數
  apples: count('g1u6-paper-c1', '🍎', 14, '蘋果', '顆'),
  candies: count('g1u6-paper-c2', '🍬', 27, '糖果', '顆'),
  stars: count('g1u6-v-c1', '⭐', 23, '星星', '顆'),
  fish: count('g1u6-v-c2', '🐟', 18, '魚', '條'),
  tens23: n('g1u6-v-n1', '2 個十和 3 個一，合起來是多少？', 23, '2 個十是 20，再加 3 個一。', '20 和 3 合起來是 23。'),
  split28: {
    id: 'g1u6-v-p1', type: 'pair', prompt: '28 是幾個十和幾個一？', answers: [2, 8], labels: ['個十', '個一'],
    hint: '十位的數字是幾個十，個位的數字是幾個一。', explain: '28 是 2 個十和 8 個一。',
  },

  // 30 以內的順序
  up: seq('g1u6-paper-q1', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], [1, 2, 4, 6, 8, 9]),
  down: seq('g1u6-paper-q2', [30, 29, 28, 27, 26, 25, 24, 23], [0, 2, 3, 5]),
  up2: seq('g1u6-v-q1', [18, 19, 20, 21, 22, 23, 24, 25], [1, 3, 4, 6]),
  down2: seq('g1u6-v-q2', [29, 28, 27, 26, 25, 24, 23, 22, 21], [1, 2, 5, 7]),

  // 比大小
  books: choice('g1u6-paper-b1', '老師有 24 本故事書，分給 22 個小朋友，每個人 1 本，故事書夠不夠？', ['夠', '不夠'], 0,
    '比比看 24 和 22，書比人多就夠。', '24 比 22 多，書夠分，還剩 2 本。'),
  flowers: choice('g1u6-paper-b2', '花園裡有 19 朵紅花和 20 朵黃花，哪一種花比較多？', ['紅花', '黃花', '一樣多'], 1,
    COMPARE_HINT, '19 是 1 個十，20 是 2 個十，20 比較大，黃花比較多。'),
  pencils: choice('g1u6-paper-b3', '姊姊有 30 枝色鉛筆和 24 枝蠟筆，哪一種比較少？', ['色鉛筆', '蠟筆', '一樣多'], 1,
    COMPARE_HINT, '24 比 30 小，蠟筆比較少。'),
  tfBigger: {
    id: 'g1u6-paper-t1', type: 'trueFalse', prompt: '有 19 顆櫻桃和 21 顆草莓。19 比 21 大。', answer: false,
    hint: COMPARE_HINT, explain: '不對。19 是 1 個十，21 是 2 個十，21 比較大。',
  },
  tfMore: {
    id: 'g1u6-paper-t2', type: 'trueFalse', prompt: '有 19 顆櫻桃和 21 顆草莓。21 顆比較多。', answer: true,
    hint: COMPARE_HINT, explain: '對。21 比 19 大，草莓比較多。',
  },
  big16: choice('g1u6-v-b1', '16 和 26，哪一個比較大？', ['16', '26'], 1, COMPARE_HINT, '個位都是 6，26 有 2 個十，比較大。'),

  // 畫掉多的、補上不夠的
  cakes: {
    id: 'g1u6-paper-x1', type: 'pickN', cross: true, emoji: '🍰', total: 20, n: 3,
    prompt: '要 17 個蛋糕，把多出來的點掉。',
    hint: '先數一數有幾個。從後面開始，一個一個點掉，點到剩下 17 個就停。',
    explain: '有 20 個，要 17 個，多了 3 個，點掉 3 個。',
  },
  carrots: {
    id: 'g1u6-paper-x2', type: 'fillTo', emoji: '🥕', have: 15, target: 22,
    prompt: '要有 22 根胡蘿蔔，不夠的畫圈圈補上。',
    hint: '先數已經有 15 根，再一邊畫一邊接著數：16、17……數到 22。',
    explain: '已經有 15 根，再補 7 個就是 22 根。',
  },
  cookies: {
    id: 'g1u6-v-x1', type: 'pickN', cross: true, emoji: '🍪', total: 14, n: 3,
    prompt: '要 11 片餅乾，把多出來的點掉。',
    hint: '先數有幾片，再一片一片點掉，點到剩下 11 片就停。',
    explain: '有 14 片，要 11 片，點掉 3 片。',
  },
  starsFill: {
    id: 'g1u6-v-x2', type: 'fillTo', emoji: '🌟', have: 9, target: 13,
    prompt: '要有 13 顆星星，不夠的畫圈圈補上。',
    hint: '先數已經有 9 顆，再一邊畫一邊接著數：10、11……數到 13。',
    explain: '已經有 9 顆，再補 4 個就是 13 顆。',
  },

  // 排第幾個
  dayi: n('g1u6-paper-l1', '一年五班有 30 位同學排隊噴酒精。大易的前面有 18 個人，他排在第幾個？', 19, QUEUE_HINT, '前面有 18 個人，大易是下一個，第 19 個。'),
  pingFront: n('g1u6-paper-l2', '苹萍排在第 14 個，排在她前面的那一個人，是排在第幾個？', 13, QUEUE_HINT, '前面那個人少 1，是第 13 個。'),
  pingBack: n('g1u6-paper-l3', '苹萍排在第 14 個，排在她後面的那一個人，是排在第幾個？', 15, QUEUE_HINT, '後面那個人多 1，是第 15 個。'),
  guanFront: n('g1u6-paper-l4', '30 位同學排隊，冠平排在第 25 個，排在他前面的有幾個人？', 24, QUEUE_HINT, '第 25 個的前面有 24 個人。'),
  guanBack: n('g1u6-paper-l5', '30 位同學排隊，冠平排在第 25 個，排在他後面的有幾個人？', 5, '一共 30 個人，扣掉冠平和他前面的 25 個人，剩下的就在後面。', '30 和 25 差 5，後面有 5 個人。'),
} satisfies Record<string, Question>

export const g1u6: Unit = {
  id: 'g1u6',
  number: 6,
  grade: 1,
  subject: '數學',
  title: '30 以內的數',
  source: '數學1上單元卷06（康軒）',
  tasks: [
    {
      id: 'g1u6-t1', skill: '10 個一數', title: '十個一數', icon: '🔟', blurb: '10 個圈一圈，數得又快又對。',
      questions: [Q.apples, Q.candies, Q.stars, Q.fish, Q.tens23, Q.split28],
    },
    {
      id: 'g1u6-t2', skill: '30 以內的順序', title: '數字接龍', icon: '🔢', blurb: '數到 30，也倒著數。',
      questions: [Q.up, Q.down, Q.up2, Q.down2],
    },
    {
      id: 'g1u6-t3', skill: '比大小', title: '比大小', icon: '⚖️', blurb: '先比十位，再比個位。',
      questions: [Q.books, Q.flowers, Q.pencils, Q.tfBigger, Q.tfMore, Q.big16],
    },
    {
      id: 'g1u6-t4', skill: '畫掉多的、補上不夠的', title: '剛剛好', icon: '🎂', blurb: '多的點掉，不夠的補上。',
      questions: [Q.cakes, Q.carrots, Q.cookies, Q.starsFill],
    },
    {
      id: 'g1u6-t5', skill: '排第幾個', title: '排隊消毒', icon: '🧴', blurb: '前面有幾個？我排第幾個？',
      questions: [Q.dayi, Q.pingFront, Q.pingBack, Q.guanFront, Q.guanBack],
    },
  ],
  boss: {
    id: 'g1u6-boss', skill: '整份單元', title: '單元六魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.apples, Q.candies, Q.up, Q.down,
      Q.books, Q.flowers, Q.pencils, Q.tfBigger, Q.tfMore,
      Q.cakes, Q.carrots,
      Q.dayi, Q.pingFront, Q.pingBack, Q.guanFront, Q.guanBack,
    ],
  },
}
