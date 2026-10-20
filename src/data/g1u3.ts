import type { OrderQ, Question, SequenceQ, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷03_排順序、比大小(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀，prompt 不放符號；用名字稱呼圖上的人或動物。

const animals = [
  { emoji: '🐔', name: '小雞' },
  { emoji: '🐸', name: '青蛙' },
  { emoji: '🐶', name: '小狗' },
  { emoji: '🐱', name: '小貓' },
  { emoji: '🐙', name: '章魚' },
  { emoji: '🐰', name: '兔子' },
  { emoji: '🐷', name: '小豬' },
  { emoji: '🐐', name: '山羊' },
]
// 五層樓，由上到下
const building = [
  { emoji: '🐻', name: '熊熊' },
  { emoji: '🐼', name: '貓熊' },
  { emoji: '🐨', name: '無尾熊' },
  { emoji: '🐯', name: '老虎' },
  { emoji: '🦁', name: '獅子' },
]
const fruits = [
  { emoji: '🍎', name: '蘋果' },
  { emoji: '🍌', name: '香蕉' },
  { emoji: '🍇', name: '葡萄' },
  { emoji: '🍓', name: '草莓' },
  { emoji: '🍉', name: '西瓜' },
  { emoji: '🍑', name: '桃子' },
]
// 1 號櫃檯排隊的人，語蓁是第 4 個
const line1 = [
  { emoji: '👨', name: '叔叔' },
  { emoji: '👩', name: '阿姨' },
  { emoji: '🧔', name: '伯伯' },
  { emoji: '👧', name: '語蓁' },
  { emoji: '👦', name: '哥哥' },
  { emoji: '👵', name: '奶奶' },
]

const COUNT_HINT = '先找到起點，一個一個點著數：1、2、3……'

const order = (id: string, prompt: string, items: OrderQ['items'], from: OrderQ['from'], ask: OrderQ['ask'], target: number, explain: string): OrderQ => ({
  id, type: 'order', prompt, items, from, ask, target, hint: COUNT_HINT, explain,
})

const seq = (id: string, values: number[], blanks: number[]): SequenceQ => ({
  id, type: 'sequence', values, blanks,
  prompt: values[1] > values[0] ? '數字排排隊，一個比一個多 1，填上空格。' : '數字倒著排，一個比一個少 1，填上空格。',
  hint: values[1] > values[0] ? '看前面的數，再往下數一個。' : '看前面的數，往回倒數一個。',
  explain: `${values.join('、')}。`,
})

const more = (id: string, picture: string, prompt: string, options: string[], answer: number, explain: string): Question => ({
  id, type: 'choice', picture, prompt, options, answer,
  hint: '一個對一個配配看，配完還有剩下的那一種比較多。',
  explain,
})

const Q = {
  // 第幾個
  cat: order('g1u3-paper-o1', '從左邊數起，小貓排在第幾個？', animals, 'left', 'position', 3, '從左邊數：小雞、青蛙、小狗、小貓，小貓是第 4 個。'),
  rabbit: order('g1u3-paper-o2', '從左邊數起，兔子排在第幾個？', animals, 'left', 'position', 5, '從左邊數到兔子，是第 6 個。'),
  third: order('g1u3-paper-o3', '從左邊數起，第 3 個是誰？點點看。', animals, 'left', 'which', 3, '從左邊數第 3 個是小狗。'),
  grape: order('g1u3-v-o1', '從右邊數起，葡萄排在第幾個？', fruits, 'right', 'position', 2, '從右邊數：桃子、西瓜、草莓、葡萄，葡萄是第 4 個。'),
  second: order('g1u3-v-o2', '從右邊數起，第 2 個是誰？點點看。', fruits, 'right', 'which', 2, '從右邊數第 2 個是西瓜。'),

  // 從上數、從下數
  koala: order('g1u3-paper-b1', '從上往下數，無尾熊住在第幾層？', building, 'top', 'position', 2, '從上往下數：熊熊、貓熊、無尾熊，是第 3 層。'),
  panda: order('g1u3-paper-b2', '從下往上數，貓熊住在第幾層？', building, 'bottom', 'position', 1, '從下往上數：獅子、老虎、無尾熊、貓熊，是第 4 層。'),
  floor2: order('g1u3-paper-b3', '從下往上數，誰住在第 2 層？點點看。', building, 'bottom', 'which', 2, '從下往上數第 2 層是老虎。'),
  lion: order('g1u3-v-b1', '從上往下數，獅子住在第幾層？', building, 'top', 'position', 4, '從上往下數，獅子在第 5 層，也就是最下面。'),

  // 數的順序
  up: seq('g1u3-paper-q1', [1, 2, 3, 4, 5, 6, 7, 8], [2, 4, 5]),
  down: seq('g1u3-paper-q2', [10, 9, 8, 7, 6, 5, 4], [1, 3, 4, 6]),
  up2: seq('g1u3-v-q1', [2, 3, 4, 5, 6, 7, 8, 9], [1, 3, 6]),
  down2: seq('g1u3-v-q2', [9, 8, 7, 6, 5, 4, 3, 2], [2, 4, 5, 7]),

  // 比多少
  cats: more('g1u3-paper-m1', '🐱🐱🐱🐱\n🥛🥛🥛🥛\n🐟🐟🐟🐟🐟\n🔔🔔\n🍽️🍽️🍽️🍽️',
    '每隻貓咪都要分到一個，哪一樣東西不夠分？', ['🥛 牛奶', '🐟 魚', '🔔 鈴鐺', '🍽️ 盤子'], 2,
    '貓咪有 4 隻，鈴鐺只有 2 個，不夠分。'),
  balloons: more('g1u3-paper-m2', '🎈🎈🎈🎈🎈🎈🎈🎈\n🧒🧒🧒🧒🧒🧒',
    '氣球和小朋友，哪一種比較多？', ['🎈 氣球', '🧒 小朋友'], 0, '氣球有 8 個，小朋友有 6 個，氣球比較多。'),
  plates: more('g1u3-paper-m3', '🍰🍰🍰🍰🍰\n🍽️🍽️🍽️🍽️🍽️🍽️🍽️',
    '蛋糕和盤子，哪一種比較多？', ['🍰 蛋糕', '🍽️ 盤子'], 1, '蛋糕有 5 塊，盤子有 7 個，盤子比較多。'),
  dogs: more('g1u3-v-m1', '🐶🐶🐶🐶🐶\n🦴🦴🦴',
    '每隻小狗要一根骨頭，骨頭夠不夠？', ['夠', '不夠'], 1, '小狗有 5 隻，骨頭只有 3 根，不夠。'),
  bees: more('g1u3-v-m2', '🐝🐝🐝\n🌸🌸🌸🌸🌸🌸',
    '小蜜蜂和花，哪一種比較多？', ['🐝 小蜜蜂', '🌸 花'], 1, '小蜜蜂有 3 隻，花有 6 朵，花比較多。'),

  // 前面和後面
  before: order('g1u3-paper-l1', '1 號櫃檯排隊，語蓁前面有幾個人？', line1, 'left', 'before', 3, '語蓁排第 4 個，前面有 3 個人。'),
  after: order('g1u3-paper-l2', '1 號櫃檯排隊，語蓁後面有幾個人？', line1, 'left', 'after', 3, '一共 6 個人，語蓁排第 4 個，後面有 2 個人。'),
  haocheng: order('g1u3-paper-l3', '2 號櫃檯排隊，昊承排在第幾個？',
    [{ emoji: '👨', name: '爸爸' }, { emoji: '👦', name: '昊承' }, { emoji: '👩', name: '媽媽' }, { emoji: '👴', name: '爺爺' }],
    'left', 'position', 1, '從左邊數：爸爸、昊承，昊承是第 2 個。'),
  busier: {
    id: 'g1u3-paper-l4', type: 'choice', picture: '1️⃣ 👨👩🧔👧👦👵\n2️⃣ 👨👦👩👴',
    prompt: '哪一個櫃檯排的人比較多？', options: ['1 號櫃檯', '2 號櫃檯'], answer: 0,
    hint: '數數看兩排各有幾個人。',
    explain: '1 號櫃檯有 6 個人，2 號櫃檯有 4 個人，1 號比較多。',
  },
} satisfies Record<string, Question>

export const g1u3: Unit = {
  id: 'g1u3',
  number: 3,
  grade: 1,
  subject: '數學',
  title: '排順序、比大小',
  source: '數學1上單元卷03（康軒）',
  tasks: [
    {
      id: 'g1u3-t1', skill: '第幾個', title: '第幾個', icon: '🚂', blurb: '從左邊數、從右邊數。',
      questions: [Q.cat, Q.rabbit, Q.third, Q.grape, Q.second],
    },
    {
      id: 'g1u3-t2', skill: '從上數、從下數', title: '動物大樓', icon: '🏢', blurb: '住在第幾層？',
      questions: [Q.koala, Q.panda, Q.floor2, Q.lion],
    },
    {
      id: 'g1u3-t3', skill: '數的順序', title: '數字接龍', icon: '🔢', blurb: '一個接一個，填上空格。',
      questions: [Q.up, Q.down, Q.up2, Q.down2],
    },
    {
      id: 'g1u3-t4', skill: '比多少', title: '誰比較多', icon: '🎈', blurb: '一個對一個，配配看。',
      questions: [Q.cats, Q.balloons, Q.plates, Q.dogs, Q.bees],
    },
    {
      id: 'g1u3-t5', skill: '前面和後面', title: '排隊結帳', icon: '🛒', blurb: '前面有幾個？後面有幾個？',
      questions: [Q.before, Q.after, Q.haocheng, Q.busier],
    },
  ],
  boss: {
    id: 'g1u3-boss', skill: '整份單元', title: '單元三魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.cats, Q.koala, Q.panda, Q.floor2, Q.cat, Q.rabbit, Q.third,
      Q.up, Q.down, Q.balloons, Q.plates,
      Q.before, Q.after, Q.haocheng, Q.busier,
    ],
  },
}
