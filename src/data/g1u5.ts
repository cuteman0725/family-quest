import type { Question, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷05_方盒、圓罐、球(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 立體圖放在 picture，不寫進 prompt，朗讀時才不會把 emoji 念出來。

const KINDS = ['📦 方盒', '🥫 圓罐', '⚽ 球']
const kind = (id: string, picture: string, name: string, answer: 0 | 1 | 2, why: string): Question => ({
  id, type: 'choice', picture, prompt: `${name}是方盒、圓罐，還是球？`, options: KINDS, answer,
  hint: '看看它的面：方盒的面都是平平的；圓罐上下平平、旁邊彎彎的；球整個都是彎彎的。',
  explain: `${name}是${KINDS[answer].slice(3)}，${why}。`,
})

const FACES = ['只有平平的面', '只有彎彎的面', '平平和彎彎的面都有']
const faces = (id: string, picture: string, name: string, answer: 0 | 1 | 2): Question => ({
  id, type: 'choice', picture, prompt: `${name}的面是哪一種？`, options: FACES, answer,
  hint: '用手摸摸看：平平的面放在桌上不會滾，彎彎的面會滾。',
  explain: `${name}${FACES[answer]}。`,
})

const SHAPES = ['■ 正方形', '▬ 長方形', '● 圓形', '▲ 三角形']
const trace = (id: string, picture: string, prompt: string, answer: 0 | 1 | 2 | 3): Question => ({
  id, type: 'choice', picture, prompt, options: SHAPES, answer,
  hint: '把那一面貼在紙上，沿著邊描一圈，看看描出來的是什麼形狀。',
  explain: `描出來是${SHAPES[answer].slice(2)}。`,
})

const tf = (id: string, picture: string, prompt: string, answer: boolean, hint: string, explain: string): Question => ({
  id, type: 'trueFalse', picture, prompt, answer, hint, explain,
})

const Q = {
  // 認識方盒、圓罐、球
  match: {
    id: 'g1u5-paper-m1', type: 'match', prompt: '連連看：把樣子很像的連起來。',
    pairs: [
      ['🎁 禮物盒', '📦 方盒'],
      ['🧻 衛生紙捲', '🥫 圓罐'],
      ['🏀 籃球', '⚽ 球'],
    ],
    hint: '看看它是平平的、彎彎的，還是兩種都有。',
  },
  roll: kind('g1u5-v-k1', '🧻', '衛生紙捲', 1, '上下平平、旁邊彎彎的'),
  dice: kind('g1u5-v-k2', '🎲', '骰子', 0, '每個面都是平平的'),
  orange: kind('g1u5-v-k3', '🍊', '橘子', 2, '整個都是彎彎的'),
  juice: kind('g1u5-v-k4', '🧃', '鋁箔包', 0, '每個面都是平平的'),
  battery: kind('g1u5-v-k5', '🔋', '電池', 1, '兩頭平平、旁邊彎彎的'),

  // 滾動與堆疊
  stack: {
    id: 'g1u5-paper-r1', type: 'choice', prompt: '哪一個容易堆疊？', options: ['⚽ 球', '📦 方盒'], answer: 1,
    hint: '堆疊就是一個一個疊上去不會掉下來，平平的面比較好疊。',
    explain: '方盒的面都是平平的，最容易堆疊；球會滾走，疊不起來。',
  },
  both: {
    id: 'g1u5-paper-r2', type: 'choice', prompt: '哪一個容易堆疊，也容易滾動？', options: ['📦 方盒', '🥫 圓罐'], answer: 1,
    hint: '想想它的面：平平的面可以疊，彎彎的面可以滾。哪一個兩種面都有？',
    explain: '圓罐上下是平平的，可以堆疊；旁邊是彎彎的，可以滾動。',
  },
  tfBall: tf('g1u5-paper-t1', '🏐', '明華摸到的東西可以滾動，也可以堆疊，可能是這顆球。', false,
    '球很會滾，可是能疊得起來嗎？', '不對。球只有彎彎的面，可以滾動，但是不能堆疊；又能滾又能疊的是圓罐。'),
  tfPencil: tf('g1u5-paper-t2', '✏️', '小瑩摸到的東西，每個面描出來的形狀都一樣，可能是這枝鉛筆。', false,
    '鉛筆的旁邊是長長的面，前面是小小的面，描出來一樣嗎？', '不對。鉛筆旁邊的面是長長的，跟頭尾的面形狀不一樣。'),
  tfCube: tf('g1u5-paper-t3', '🎲', '莉旻摸到骰子，可以描出正方形，也可以堆疊。', true,
    '骰子每一面都是一樣大的方形，而且平平的。', '對。骰子每一面都是正方形，平平的面可以堆疊。'),
  tfCan: tf('g1u5-paper-t4', '🥫', '承宗摸到罐子，可以滾動，也可以堆疊。', true,
    '罐子有彎彎的面，也有平平的面。', '對。罐子旁邊彎彎的可以滾動，上下平平的可以堆疊。'),

  // 平面與曲面
  fBrick: faces('g1u5-paper-f1', '🧱', '這塊長長的積木', 0),
  fCube: faces('g1u5-paper-f2', '🎲', '骰子', 0),
  fWedge: faces('g1u5-paper-f3', '🧀', '這塊三角形的起司', 0),
  fCan: faces('g1u5-paper-f4', '🥫', '罐子', 2),
  fBall: faces('g1u5-paper-f5', '🏀', '籃球', 1),
  fBattery: faces('g1u5-paper-f6', '🔋', '躺著的電池', 2),

  // 描出形狀
  tBrick: trace('g1u5-paper-d1', '🧱', '把長長積木最大的那一面描下來，是什麼形狀？', 1),
  tCan: trace('g1u5-paper-d2', '🥫', '把罐子的底面描下來，是什麼形狀？', 2),
  tWedge: trace('g1u5-paper-d3', '🧀', '把三角形起司尖尖的那一面描下來，是什麼形狀？', 3),
  tCube: trace('g1u5-paper-d4', '🎲', '把骰子的一個面描下來，是什麼形狀？', 0),
  tBox: trace('g1u5-v-d1', '🧃', '把鋁箔包最大的那一面描下來，是什麼形狀？', 1),
} satisfies Record<string, Question>

export const g1u5: Unit = {
  id: 'g1u5',
  number: 5,
  grade: 1,
  subject: '數學',
  title: '方盒、圓罐、球',
  source: '數學1上單元卷05（康軒）',
  tasks: [
    {
      id: 'g1u5-t1', skill: '認識方盒、圓罐、球', title: '分分類', icon: '📦', blurb: '它是方盒、圓罐，還是球？',
      questions: [Q.match, Q.roll, Q.dice, Q.orange, Q.juice, Q.battery],
    },
    {
      id: 'g1u5-t2', skill: '滾動與堆疊', title: '會滾還是會疊', icon: '🎳', blurb: '哪個會滾？哪個疊得高？',
      questions: [Q.stack, Q.both, Q.tfBall, Q.tfPencil, Q.tfCube, Q.tfCan],
    },
    {
      id: 'g1u5-t3', skill: '平平的面和彎彎的面', title: '摸摸看', icon: '✋', blurb: '平平的面還是彎彎的面？',
      questions: [Q.fBrick, Q.fCube, Q.fWedge, Q.fCan, Q.fBall, Q.fBattery],
    },
    {
      id: 'g1u5-t4', skill: '描出形狀', title: '描描看', icon: '✏️', blurb: '把一個面描下來，是什麼形狀？',
      questions: [Q.tBrick, Q.tCan, Q.tWedge, Q.tCube, Q.tBox],
    },
  ],
  boss: {
    id: 'g1u5-boss', skill: '整份單元', title: '單元五魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.stack, Q.both,
      Q.fBrick, Q.fCube, Q.fWedge, Q.fCan, Q.fBall, Q.fBattery,
      Q.tBrick, Q.tCan, Q.tWedge, Q.tCube,
      Q.match,
      Q.tfBall, Q.tfPencil, Q.tfCube, Q.tfCan,
    ],
  },
}
