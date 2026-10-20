import type { MultiplyQ, NumberQ, PairQ, Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷02整數的乘法(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。

const ZERO_HINT = '先把 0 前面的數相乘，再把兩個數後面的 0 一共有幾個，補在答案後面。'

const n = (id: string, prompt: string, answer: number, hint: string, explain: string, unit?: string, paper?: boolean): NumberQ => ({
  id, type: 'number', prompt, answers: [String(answer)], hint, explain, unit, paper,
})

const mul = (id: string, a: number, b: number): MultiplyQ => ({
  id, type: 'multiply', a, b, prompt: `用直式算算看：${a} × ${b}`,
  hint: '把位數多的寫上面、少的寫下面，個位對齊。先用個位乘，再用十位乘（答案往左移一格），最後加起來。',
  explain: `${a} × ${b} ＝ ${a * b}。`,
})

const Q = {
  // 乘以 10、100 的倍數
  m5x9: n('g4u2-paper-z1', '5 × 9 ＝ ？', 45, '九九乘法：五九？', '5 × 9 ＝ 45。'),
  m50x9: n('g4u2-paper-z2', '50 × 9 ＝ ？', 450, ZERO_HINT, '5 × 9 ＝ 45，50 有 1 個 0，補上變成 450。'),
  m500x9: n('g4u2-paper-z3', '500 × 9 ＝ ？', 4500, ZERO_HINT, '5 × 9 ＝ 45，500 有 2 個 0，補上變成 4500。'),
  m12x50: n('g4u2-paper-z4', '12 × 50 ＝ ？', 600, ZERO_HINT, '12 × 5 ＝ 60，再補 1 個 0 變成 600。'),
  m12x60: n('g4u2-paper-z5', '12 × 60 ＝ ？', 720, ZERO_HINT, '12 × 6 ＝ 72，再補 1 個 0 變成 720。'),
  m12x70: n('g4u2-paper-z6', '12 × 70 ＝ ？', 840, ZERO_HINT, '12 × 7 ＝ 84，再補 1 個 0 變成 840。'),
  zeros440: n('g4u2-paper-z7', '440 × 50 的積會有幾個 0？', 3, '先算 44 × 5，再數 440 和 50 後面一共有幾個 0。小心：44 × 5 的答案自己也可能有 0！', '44 × 5 ＝ 220，再補 2 個 0 是 22000，一共 3 個 0。', '個'),
  zeros300: n('g4u2-v-z1', '300 × 60 的積會有幾個 0？', 3, ZERO_HINT, '3 × 6 ＝ 18，再補 3 個 0 是 18000，有 3 個 0。', '個'),
  zeros250: n('g4u2-v-z2', '250 × 40 的積會有幾個 0？', 4, '先算 25 × 4，再補上後面的 0。25 × 4 的答案本身也有 0 喔！', '25 × 4 ＝ 100，再補 2 個 0 是 10000，一共 4 個 0。', '個'),

  // 直式乘法
  d346: mul('g4u2-v-d1', 346, 27),
  d508: mul('g4u2-v-d2', 508, 46),
  d1250: mul('g4u2-v-d3', 1250, 8),
  d75: mul('g4u2-v-d4', 75, 40),
  d203: mul('g4u2-v-d5', 203, 34),

  // 估算與比較
  bun10: n('g4u2-paper-e1', '一個包子 18 元，買 10 個需要幾元？', 180, '買 10 個就是 18 × 10，在 18 後面補一個 0。', '18 × 10 ＝ 180 元。', '元'),
  bun20: n('g4u2-paper-e2', '一個包子 18 元，買 20 個需要幾元？', 360, '20 個是 10 個的 2 倍，也可以算 18 × 2 再補一個 0。', '18 × 20 ＝ 360 元。', '元'),
  pencil: n('g4u2-paper-e3', '一枝鉛筆 8 元，買 25 枝鉛筆要幾元？', 200, '8 × 25：可以想成 4 個 25 是 100，8 個 25 就是 2 個 100。', '8 × 25 ＝ 200 元。', '元'),
  brush: n('g4u2-paper-e4', '一枝毛筆 80 元，買 25 枝毛筆要幾元？', 2000, '80 是 8 的 10 倍，所以答案也是鉛筆的 10 倍。', '80 × 25 ＝ 2000 元。', '元'),
  water: {
    id: 'g4u2-paper-e5', type: 'choice',
    prompt: '一瓶礦泉水 22 元，叔叔買了 20 瓶；一箱礦泉水 220 元，媽媽買了 2 箱。誰花的錢比較多？',
    options: ['叔叔', '媽媽', '一樣多'], answer: 2,
    hint: '分別算出來再比：22 × 20 和 220 × 2。',
    explain: '叔叔 22 × 20 ＝ 440 元，媽媽 220 × 2 ＝ 440 元，一樣多。',
  },
  est398: {
    id: 'g4u2-v-e1', type: 'choice', prompt: '398 × 21 大約是多少？', options: ['6000', '8000', '10000'], answer: 1,
    hint: '把 398 想成很接近的 400，21 想成 20，再相乘。',
    explain: '398 大約是 400，21 大約是 20，400 × 20 ＝ 8000。',
  },

  // 乘法應用題
  buns: {
    id: 'g4u2-paper-w1', type: 'pair', paper: true, answers: [4000, 700], labels: ['賣出（個）', '剩下（個）'],
    prompt: '一袋饅頭 100 個，饅頭店今天做了 47 袋，賣到最後剩下 7 袋。老闆共賣出幾個饅頭？還剩下幾個饅頭？',
    hint: '先算賣出幾袋：47 － 7。每袋 100 個，再乘以 100。',
    explain: '賣出 40 袋 × 100 ＝ 4000 個；剩下 7 袋 × 100 ＝ 700 個。',
  } satisfies PairQ,
  blocks: n('g4u2-paper-w2', '一桶積木 1299 元，玩具店今天賣出 7 桶積木，共賣得多少元？', 9093, '一桶的價錢 × 桶數：1299 × 7。', '1299 × 7 ＝ 9093 元。', '元', true),
  seats: n('g4u2-paper-w3', '視聽教室的座位共有 36 排，每排可坐 24 人，要坐滿全部的座位，需要多少人？', 864, '每排的人數 × 排數：24 × 36。', '24 × 36 ＝ 864 人。', '人', true),
  trucks: n('g4u2-paper-w4', '一輛大卡車一趟最多可以載 203 箱高麗菜，34 輛大卡車同時運送，最多可以載幾箱高麗菜？', 6902, '一輛的箱數 × 輛數：203 × 34。203 的十位是 0，直式時要小心。', '203 × 34 ＝ 6902 箱。', '箱', true),
  alcohol: n('g4u2-paper-w5', '一桶酒精 369 元，爸爸買了 12 桶，付了 5000 元，會找回多少元？', 572, '先算 12 桶要多少錢，再用 5000 去減。', '369 × 12 ＝ 4428，5000 － 4428 ＝ 572 元。', '元', true),
  milk: n('g4u2-paper-w6', '一瓶保久乳有 275 毫升，一組有 6 瓶，一組保久乳共有多少毫升？', 1650, '一瓶的毫升 × 6 瓶。', '275 × 6 ＝ 1650 毫升。', '毫升', true),
  school: n('g4u2-paper-w7', '一箱保久乳 162 元。樂樂國小有 34 班，每班發一箱保久乳，共要多少元？', 5508, '一箱的價錢 × 班數：162 × 34。', '162 × 34 ＝ 5508 元。', '元', true),
  single: {
    id: 'g4u2-paper-w8', type: 'pair', paper: true, answers: [216, 54], labels: ['元（買 18 瓶）', '元（相差）'],
    context: '保久乳的價錢：一瓶 12 元、一組（6 瓶）60 元、一箱（18 瓶）162 元。',
    prompt: '單瓶的保久乳買 18 瓶要多少元？買單瓶的保久乳和直接買一箱保久乳相差多少元？',
    hint: '先算 12 × 18，再和一箱的 162 元相減。',
    explain: '12 × 18 ＝ 216 元；216 － 162 ＝ 54 元。',
  } satisfies PairQ,
} satisfies Record<string, Question>

export const g4u2: Unit = {
  id: 'g4u2',
  number: 2,
  grade: 4,
  subject: '數學',
  title: '整數的乘法',
  source: '4上單元卷02（南一）',
  tasks: [
    {
      id: 'g4u2-t1', skill: '乘以整十整百', title: '補上 0', icon: '0️⃣', blurb: '先乘前面，再補後面的 0。',
      questions: [Q.m50x9, Q.m500x9, Q.m12x60, Q.m12x70, Q.zeros440, Q.zeros300, Q.zeros250],
    },
    {
      id: 'g4u2-t2', skill: '直式乘法', title: '直式乘法', icon: '✏️', blurb: '在紙上算，再填答案。',
      questions: [Q.d346, Q.d508, Q.d1250, Q.d75, Q.d203],
    },
    {
      id: 'g4u2-t3', skill: '估算與比較', title: '算一算比一比', icon: '🛒', blurb: '買東西要花多少錢？',
      questions: [Q.bun10, Q.bun20, Q.pencil, Q.brush, Q.water, Q.est398],
    },
    {
      id: 'g4u2-t4', skill: '乘法應用題', title: '乘法應用題', icon: '🥛', blurb: '幾個一數，用乘法最快。',
      questions: [Q.buns, Q.blocks, Q.seats, Q.trucks, Q.alcohol, Q.milk, Q.school, Q.single],
    },
  ],
  boss: {
    id: 'g4u2-boss', skill: '整份單元', title: '單元二魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.m5x9, Q.m50x9, Q.m500x9, Q.m12x50, Q.m12x60, Q.m12x70, Q.zeros440,
      Q.bun10, Q.bun20, Q.pencil, Q.brush, Q.water, Q.buns,
      Q.blocks, Q.seats, Q.trucks, Q.alcohol,
      Q.milk, Q.school, Q.single,
    ],
  },
}
