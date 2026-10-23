import type { DivideQ, Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷04整數的除法(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。
// 孩子可能在家先學（超前進度），所以提示寫成小教學，不只是提醒。

const LONG_DIVISION_HINT = '從被除數最左邊開始，看夠不夠除數分：先估商、乘回去、相減、再把下一位移下來，一位一位做。'

const drill = (id: string, dividend: number, divisor: number): DivideQ => {
  const q = Math.floor(dividend / divisor)
  const r = dividend % divisor
  return {
    id, type: 'divide', prompt: `用直式算算看：${dividend} ÷ ${divisor}`, dividend, divisor,
    hint: LONG_DIVISION_HINT,
    explain: `${dividend} ÷ ${divisor} ＝ ${q} … ${r}。驗算：${divisor} × ${q} ＋ ${r} ＝ ${dividend}。`,
  }
}

/** 跟著寫：在 App 裡一格一格填直式，學會「怎麼寫」（會心算但不會寫直式時用） */
const write = (id: string, dividend: number, divisor: number): DivideQ => ({
  ...drill(id, dividend, divisor),
  prompt: `跟著寫直式：${dividend} ÷ ${divisor}`,
  hint: '照課本的順序一格一格寫：估商 → 乘回去 → 相減 → 把下一位移下來，再估下一位的商。',
  write: true,
})

const Q = {
  // 跟著寫直式：從簡單到難（一位數除數 → 商中間有 0 → 二位數除數）
  w84: write('g4u4-v-lw1', 84, 4),
  w735: write('g4u4-v-lw2', 735, 6),
  w1627: write('g4u4-v-lw3', 1627, 4),
  w975: write('g4u4-v-lw4', 975, 31),
  w3024: write('g4u4-v-lw5', 3024, 24),

  // 估商與商的位數
  digits2: {
    id: 'g4u4-paper-c1', type: 'choice', prompt: '下面哪一個算式的商是二位數？',
    options: ['2564 ÷ 25', '609 ÷ 38', '318 ÷ 44', '97 ÷ 12'], answer: 1,
    hint: '比比看被除數的前幾位夠不夠除數分。609 的前兩位 60 比 38 大，所以從十位開始商。',
    explain: '609 ÷ 38 ＝ 16 … 1，商是二位數。2564 ÷ 25 的商是三位數，另外兩個是一位數。',
  },
  box3: {
    id: 'g4u4-paper-c2', type: 'choice', prompt: '□ 裡的數字是多少時，「□501 ÷ 46」得到的商會是三位數？',
    options: ['2', '3', '4', '5'], answer: 3,
    hint: '商要是三位數，被除數的前兩位「□5」就要夠 46 分，也就是 □5 要大於或等於 46。',
    explain: '□ 是 5 時，55 比 46 大，5501 ÷ 46 ＝ 119 …，商是三位數；□ 是 4 時，45 比 46 小，商只有二位數。',
  },
  c785: {
    id: 'g4u4-v-c1', type: 'choice', prompt: '785 ÷ 26 的商是幾位數？', options: ['一位數', '二位數', '三位數'], answer: 1,
    hint: '7 不夠 26 分，要看前兩位 78。78 夠分，所以商從十位開始。',
    explain: '785 ÷ 26 ＝ 30 … 5，商是二位數。',
  },
  c3456: {
    id: 'g4u4-v-c2', type: 'choice', prompt: '3456 ÷ 9 的商是幾位數？', options: ['二位數', '三位數', '四位數'], answer: 1,
    hint: '3 不夠 9 分，要看前兩位 34，所以商從百位開始。',
    explain: '3456 ÷ 9 ＝ 384，商是三位數。',
  },
  c432: {
    id: 'g4u4-v-c3', type: 'choice', prompt: '432 ÷ 54 的商是幾位數？', options: ['一位數', '二位數', '三位數'], answer: 0,
    hint: '前兩位 43 比 54 小，不夠分，要看整個 432，所以商只有個位。',
    explain: '432 ÷ 54 ＝ 8，商是一位數。',
  },

  // 直式除法
  d2352: drill('g4u4-paper-d1', 2352, 42),
  d816: drill('g4u4-paper-d2', 816, 23),
  d745: drill('g4u4-v-d1', 745, 6),
  d968: drill('g4u4-v-d2', 968, 4),
  d1000: drill('g4u4-v-d3', 1000, 27),
  d6534: drill('g4u4-v-d4', 6534, 18),
  d4085: drill('g4u4-v-d5', 4085, 35),

  // 餘數與驗算
  tfCheck: {
    id: 'g4u4-v-tf1', type: 'trueFalse', prompt: '驗算除法時，「除數 × 商 ＋ 餘數」應該等於被除數。', answer: true,
    hint: '想想看：每份分到「商」那麼多，分了「除數」份，再加上剩下的，就是全部。',
    explain: '對。例如 816 ÷ 23 ＝ 35 … 11，驗算 23 × 35 ＋ 11 ＝ 816。',
  },
  tfBigRemainder: {
    id: 'g4u4-v-tf2', type: 'trueFalse', prompt: '除法的餘數可以比除數大。', answer: false,
    hint: '如果剩下的比除數還多，是不是還可以再分一次？',
    explain: '不對。餘數一定比除數小；比除數大就表示還能再分，商要再加大。',
  },
  tfMax25: {
    id: 'g4u4-v-tf3', type: 'trueFalse', prompt: '除數是 25 時，餘數最大是 25。', answer: false,
    hint: '剩下 25 個的話，剛好還能再分 1 份。',
    explain: '不對。餘數要比 25 小，最大是 24。',
  },
  nMax24: {
    id: 'g4u4-v-n1', type: 'number', prompt: '除數是 25 時，餘數最大可能是多少？', answers: ['24'],
    hint: '餘數一定比除數小。',
    explain: '比 25 小的最大整數是 24。',
  },
  cards1507: {
    id: 'g4u4-paper-c4', type: 'choice', prompt: '把 1507 張遊戲卡平分給 5 個小朋友，最後會剩下幾張遊戲卡？',
    options: ['1 張', '2 張', '3 張', '4 張'], answer: 1,
    hint: '用 1507 ÷ 5，餘數就是剩下的張數。',
    explain: '1507 ÷ 5 ＝ 301 … 2，剩下 2 張。',
  },

  // 商與除數的關係
  times4: {
    id: 'g4u4-paper-c3', type: 'choice',
    prompt: '在餘數是 0 的除法算式，如果除數不變，當商變成原來的 4 倍時，被除數是原來的幾倍？',
    options: ['1/4 倍', '2 倍', '4 倍', '8 倍'], answer: 2,
    hint: '被除數 ＝ 除數 × 商。除數不變、商變 4 倍，相乘的結果會怎樣？',
    explain: '例如 12 ÷ 3 ＝ 4，商變 4 倍成 16 時，被除數要是 3 × 16 ＝ 48，是 12 的 4 倍。',
  },
  c840: {
    id: 'g4u4-v-c4', type: 'choice', prompt: '840 ÷ 20 ＝ 42，那 840 ÷ 40 ＝ ？', options: ['21', '42', '84'], answer: 0,
    hint: '東西一樣多，分成的份數變 2 倍，每份會變多還是變少？',
    explain: '除數變 2 倍，商就變一半：42 的一半是 21。',
  },
  c600: {
    id: 'g4u4-v-c5', type: 'choice', prompt: '600 ÷ 30 ＝ 20，那 600 ÷ 15 ＝ ？', options: ['10', '20', '40'], answer: 2,
    hint: '除數變成一半，每份能分到的會變多。',
    explain: '除數變一半，商就變 2 倍：20 × 2 ＝ 40。',
  },
  tf84: {
    id: 'g4u4-v-tf4', type: 'trueFalse', prompt: '84 ÷ 7 ＝ 12，所以 84 ÷ 14 ＝ 6。', answer: true,
    hint: '14 是 7 的幾倍？除數變大，商會怎樣？',
    explain: '對。除數 7 變成 14（2 倍），商 12 就變成一半 6。',
  },
  cTimes10: {
    id: 'g4u4-v-c6', type: 'choice', prompt: '被除數和除數都乘以 10，商會怎樣？（例如 36 ÷ 4 和 360 ÷ 40）',
    options: ['變大', '不變', '變小'], answer: 1,
    hint: '算算看 36 ÷ 4 和 360 ÷ 40 各是多少。',
    explain: '36 ÷ 4 ＝ 9，360 ÷ 40 ＝ 9，商不變。',
  },

  // 除法應用題（在紙上算）
  beads: {
    id: 'g4u4-paper-w1', type: 'number', paper: true, unit: '顆',
    prompt: '妹妹用珠子做手鍊，用了 98 顆珠子，做成 14 條相同的手鍊。每條手鍊用了幾顆珠子？',
    answers: ['7'],
    hint: '全部的珠子平分成 14 條，用除法：98 ÷ 14。',
    explain: '98 ÷ 14 ＝ 7，每條 7 顆。',
  },
  rope: {
    id: 'g4u4-paper-w2', type: 'divide', units: ['段', '公尺'], dividend: 500, divisor: 21,
    prompt: '爸爸有一條 500 公尺長的繩子，每 21 公尺剪成一段，最多可以剪成幾段？還剩下幾公尺？',
    hint: '用 500 ÷ 21：商是剪成的段數，餘數是剩下的公尺數。',
    explain: '500 ÷ 21 ＝ 23 … 17，最多 23 段，剩下 17 公尺。',
  },
  peas: {
    id: 'g4u4-paper-w3', type: 'divide', units: ['盒', '公斤'], dividend: 2769, divisor: 4,
    context: '青青蔬果商進口豌豆 2769 公斤。',
    prompt: '每 4 公斤裝一盒，最多可以裝成幾盒？還剩下幾公斤？',
    hint: '用 2769 ÷ 4：商是盒數，餘數是剩下的公斤數。',
    explain: '2769 ÷ 4 ＝ 692 … 1，最多 692 盒，剩下 1 公斤。',
  },
  apples: {
    id: 'g4u4-paper-w4', type: 'number', paper: true, unit: '個',
    context: '松松水果商進口 3294 顆蘋果。',
    prompt: '一個箱子最多可以裝 15 顆蘋果，全部裝完，一共需要幾個箱子？',
    answers: ['220'],
    hint: '先算 3294 ÷ 15。剩下的蘋果也要裝，所以要多一個箱子。',
    explain: '3294 ÷ 15 ＝ 219 … 9，剩下 9 顆還要 1 個箱子，219 ＋ 1 ＝ 220 個。',
  },
  trucks: {
    id: 'g4u4-paper-w5', type: 'number', paper: true, unit: '趟',
    context: '全鮮水果商進口 880 箱奇異果。',
    prompt: '一輛貨車一趟可以載 72 箱，最少要幾趟才能將奇異果載完？',
    answers: ['13'],
    hint: '先算 880 ÷ 72。剩下的箱子還要再載一趟。',
    explain: '880 ÷ 72 ＝ 12 … 16，剩下 16 箱還要 1 趟，12 ＋ 1 ＝ 13 趟。',
  },
  flowers: {
    id: 'g4u4-paper-c5', type: 'choice', prompt: '妮妮和 5 個朋友一起去士林官邸賞花，共花了 2160 元，平均一人要付多少元？',
    options: ['360 元', '432 元', '524 元', '540 元'], answer: 0,
    hint: '小心人數：妮妮和 5 個朋友，一共是幾個人？',
    explain: '一共 6 個人，2160 ÷ 6 ＝ 360 元。',
  },
  candy: {
    id: 'g4u4-v-w1', type: 'divide', units: ['包', '顆'], dividend: 150, divisor: 12,
    prompt: '有 150 顆糖，每 12 顆裝一包，可以裝滿幾包？還剩下幾顆？',
    hint: '用 150 ÷ 12：商是裝滿的包數，餘數是剩下的顆數。',
    explain: '150 ÷ 12 ＝ 12 … 6，裝滿 12 包，剩下 6 顆。',
  },
  pages: {
    id: 'g4u4-v-w2', type: 'number', paper: true, unit: '天',
    prompt: '一本書有 236 頁，每天看 8 頁，最少要幾天才能看完？',
    answers: ['30'],
    hint: '先算 236 ÷ 8。剩下沒看完的頁數，還要再一天。',
    explain: '236 ÷ 8 ＝ 29 … 4，剩下 4 頁還要 1 天，29 ＋ 1 ＝ 30 天。',
  },
} satisfies Record<string, Question>

export const g4u4: Unit = {
  id: 'g4u4',
  number: 4,
  grade: 4,
  subject: '數學',
  title: '整數的除法',
  source: '4上單元卷04（南一）',
  tasks: [
    {
      id: 'g4u4-t1', skill: '估商與商的位數', title: '商有幾位', icon: '🔭', blurb: '還沒算，先猜猜商有幾位數。',
      questions: [Q.digits2, Q.box3, Q.c785, Q.c3456, Q.c432],
    },
    {
      id: 'g4u4-t2w', skill: '直式的寫法', title: '跟著寫直式', icon: '📝', blurb: '一格一格寫，學會直式怎麼寫。',
      questions: [Q.w84, Q.w735, Q.w1627, Q.w975, Q.w3024],
    },
    {
      id: 'g4u4-t2', skill: '直式除法', title: '直式除法', icon: '✏️', blurb: '在紙上算，再填商和餘數。',
      questions: [Q.d2352, Q.d816, Q.d745, Q.d968, Q.d1000, Q.d6534, Q.d4085],
    },
    {
      id: 'g4u4-t3', skill: '餘數與驗算', title: '餘數偵探', icon: '🔍', blurb: '餘數有多大？怎麼驗算？',
      questions: [Q.tfCheck, Q.tfBigRemainder, Q.tfMax25, Q.nMax24, Q.cards1507],
    },
    {
      id: 'g4u4-t4', skill: '商與除數的關係', title: '分給更多人', icon: '🍰', blurb: '份數變多，每份會變怎樣？',
      questions: [Q.times4, Q.c840, Q.c600, Q.tf84, Q.cTimes10],
    },
    {
      id: 'g4u4-t5', skill: '除法應用題', title: '除法應用題', icon: '🚚', blurb: '剩下的要不要再多一份？',
      questions: [Q.flowers, Q.beads, Q.rope, Q.peas, Q.apples, Q.trucks, Q.candy, Q.pages],
    },
  ],
  boss: {
    id: 'g4u4-boss', skill: '整份單元', title: '單元四魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.digits2, Q.box3, Q.times4, Q.cards1507, Q.flowers,
      Q.d2352, Q.d816,
      Q.beads, Q.rope,
      Q.peas, Q.apples, Q.trucks,
    ],
  },
}
