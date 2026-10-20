import type { ChoiceQ, CompareQ, FracLineQ, FractionQ, Question, SortQ, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷09分數(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。
// 分數寫成「3/5」，帶分數寫成「2 3/5」，畫面會畫成上下排的分數。

export const FRACTION_KINDS = ['真分數', '假分數', '帶分數'] as const

const KIND_EXPLAIN = {
  真分數: '分子比分母小，是真分數。',
  假分數: '分子比分母大，或是和分母一樣大，是假分數。',
  帶分數: '一個整數和一個真分數合起來，是帶分數。',
}

const kind = (id: string, frac: string, answer: (typeof FRACTION_KINDS)[number]): ChoiceQ => ({
  id, type: 'choice', prompt: `${frac} 是哪一種分數？`, options: [...FRACTION_KINDS], answer: FRACTION_KINDS.indexOf(answer),
  hint: '前面有整數的是帶分數；只有分數的，比比看分子和分母誰大。', explain: KIND_EXPLAIN[answer],
})

const MIXED_HINT = '帶分數換假分數：整數 × 分母，再加上分子。假分數換帶分數：分子裡有幾個分母，就是幾，剩下的是分子。'
const COMPARE_HINT = '先都換成假分數（或都換成帶分數），分母一樣時，分子大的就比較大。國字的「七分之四十二」是 42/7。'
const ADD_HINT = '分母一樣，整數和整數算、分子和分子算；分子不夠減就從整數借 1，分子超過分母就進位成 1。'

const cmp = (id: string, left: string, right: string, answer: CompareQ['answer'], explain: string): CompareQ => ({
  id, type: 'compare', prompt: '比比看', left, right, answer, hint: COMPARE_HINT, explain,
})

const frac = (
  id: string, prompt: string, den: number, whole: number, num: number, hint: string, explain: string,
  extra: Partial<FractionQ> = {},
): FractionQ => ({ id, type: 'fraction', prompt, den, answer: { whole, num }, hint, explain, ...extra })

const line = (id: string, den: number, max: number, target: number, show: FracLineQ['show'], text: string): FracLineQ => ({
  id, type: 'fracLine', den, max, target, show, prompt: `在數線上點出 ${text} 的位置。`,
  hint: `先數一大格（從 0 到 1）分成幾小格，一小格就是 1/${den}；${text} 要往右數幾小格？`,
  explain: `一小格是 1/${den}，${text} 是從 0 往右數 ${target} 小格。`,
})

const scarf = [
  '瑾玟和姐姐編織圍巾一天的成果：',
  '瑾玟：上午 7/8 公尺，下午 1 1/8 公尺',
  '姐姐：上午 1 3/8 公尺，一天合計 3 2/8 公尺',
].join('\n')

const Q = {
  // 分數家族
  k1: kind('g4u9-paper-k1', '2/9', '真分數'),
  k2: kind('g4u9-paper-k2', '27/8', '假分數'),
  k3: kind('g4u9-paper-k3', '1 5/10', '帶分數'),
  k4: kind('g4u9-paper-k4', '14/6', '假分數'),
  k5: kind('g4u9-paper-k5', '10/12', '真分數'),
  k6: kind('g4u9-paper-k6', '3 5/11', '帶分數'),
  k7: kind('g4u9-paper-k7', '6 4/5', '帶分數'),
  k8: kind('g4u9-paper-k8', '12/4', '假分數'),
  k9: kind('g4u9-v-k1', '9/9', '假分數'),

  // 數線、帶分數和假分數互換
  l1: line('g4u9-v-l1', 10, 2, 13, 'improper', '13/10'),
  l2: line('g4u9-v-l2', 4, 2, 7, 'improper', '7/4'),
  l3: line('g4u9-v-l3', 3, 3, 7, 'mixed', '2 1/3'),
  l4: line('g4u9-v-l4', 5, 2, 3, 'improper', '3/5'),
  match: {
    id: 'g4u9-paper-m1', type: 'match', prompt: '把一樣大的連起來。',
    pairs: [['1 3/10', '13/10'], ['44/9', '4 8/9'], ['24/8', '3'], ['10 1/3', '31/3'], ['35/8', '4 3/8'], ['21/3', '7']],
    hint: MIXED_HINT,
  },
  toMixed: frac('g4u9-v-x1', '把 17/5 換成帶分數。', 5, 3, 2, MIXED_HINT, '17 裡面有 3 個 5（15），還剩 2，17/5 ＝ 3 2/5。'),
  toImproper: frac('g4u9-v-x2', '把 2 3/4 換成假分數。', 4, 0, 11, MIXED_HINT, '2 × 4 ＝ 8，8 ＋ 3 ＝ 11，2 3/4 ＝ 11/4。', { improper: true }),
  toImproper2: frac('g4u9-v-x3', '把 3 2/7 換成假分數。', 7, 0, 23, MIXED_HINT, '3 × 7 ＝ 21，21 ＋ 2 ＝ 23，3 2/7 ＝ 23/7。', { improper: true }),

  // 比較分數大小
  c1: cmp('g4u9-paper-c1', '2 3/5', '16/5', '<', '2 3/5 ＝ 13/5，13 比 16 小。'),
  c2: cmp('g4u9-paper-c2', '29/8', '3 3/8', '>', '3 3/8 ＝ 27/8，29 比 27 大。'),
  c3: cmp('g4u9-paper-c3', '1 2/17', '十七分之十二', '>', '十七分之十二是 12/17，比 1 小；1 2/17 比 1 大。'),
  c4: cmp('g4u9-paper-c4', '48/9', '五又九分之四', '<', '五又九分之四是 5 4/9 ＝ 49/9，48 比 49 小。'),
  c5: cmp('g4u9-paper-c5', '七分之四十二', '6', '=', '七分之四十二是 42/7，42 裡有 6 個 7，就是 6。'),
  c6: cmp('g4u9-paper-c6', '一又十二分之十', '1 2/12', '>', '一又十二分之十是 1 10/12，整數一樣，10/12 比 2/12 大。'),
  sort: {
    id: 'g4u9-v-r1', type: 'sort', items: ['7/6', '1 2/6', '5/6', '11/6'], order: 'desc', prompt: '把這些分數由大到小排出來。',
    hint: '都換成假分數：1 2/6 ＝ 8/6，再比分子。', explain: '11/6 ＞ 1 2/6 ＞ 7/6 ＞ 5/6。',
  } satisfies SortQ,

  // 同分母加減
  a1: frac('g4u9-v-a1', '算算看：1 4/7 ＋ 2 5/7', 7, 4, 2, ADD_HINT, '1 4/7 ＋ 2 5/7 ＝ 3 9/7 ＝ 4 2/7（9/7 是 1 2/7）。'),
  a2: frac('g4u9-v-a2', '算算看：5 － 2 3/4', 4, 2, 1, '5 可以看成 4 4/4，再減。', '5 ＝ 4 4/4，4 4/4 － 2 3/4 ＝ 2 1/4。'),
  a3: frac('g4u9-v-a3', '算算看：3/8 ＋ 5/8', 8, 1, 0, ADD_HINT, '3/8 ＋ 5/8 ＝ 8/8 ＝ 1。'),
  soup: frac('g4u9-paper-w1', '奶奶煮了一鍋酸梅湯，喝掉 2 5/6 公升後，還剩下 1 3/6 公升，奶奶煮的酸梅湯一共有多少公升？', 6, 4, 2,
    '喝掉的和剩下的合起來，就是一開始煮的：用加的。', '2 5/6 ＋ 1 3/6 ＝ 3 8/6 ＝ 4 2/6 公升。', { unit: '公升', paper: true }),
  beef: frac('g4u9-paper-w2', '媽媽買了 3 2/5 公斤的牛肉，阿姨買的牛肉比媽媽買的少了 4/5 公斤，阿姨買了多少公斤的牛肉？', 5, 2, 3,
    '比媽媽少，用減的；2/5 不夠減 4/5，要從 3 借 1。', '3 2/5 ＝ 2 7/5，2 7/5 － 4/5 ＝ 2 3/5 公斤。', { unit: '公斤', paper: true }),

  // 編織圍巾
  z1: frac('g4u9-paper-z1', '瑾玟一天共編織了幾公尺長的圍巾？', 8, 2, 0,
    '把瑾玟上午和下午的加起來。', '7/8 ＋ 1 1/8 ＝ 1 8/8 ＝ 2 公尺。', { unit: '公尺', paper: true, context: scarf }),
  z2: frac('g4u9-paper-z2', '姐姐下午編織了幾公尺長的圍巾？', 8, 1, 7,
    '一天合計減掉上午的，就是下午的。', '3 2/8 ＝ 2 10/8，2 10/8 － 1 3/8 ＝ 1 7/8 公尺。', { unit: '公尺', paper: true, context: scarf }),
  z3: frac('g4u9-paper-z3', '媽媽說：「我一天可以編織的圍巾，比姐姐長 1 5/8 公尺。」媽媽一天共可以編織幾公尺的圍巾？', 8, 4, 7,
    '姐姐一天編 3 2/8 公尺，媽媽比姐姐長，用加的。', '3 2/8 ＋ 1 5/8 ＝ 4 7/8 公尺。', { unit: '公尺', paper: true, context: scarf }),
} satisfies Record<string, Question>

export const g4u9: Unit = {
  id: 'g4u9',
  number: 9,
  grade: 4,
  subject: '數學',
  title: '分數',
  source: '4上單元卷09（南一）',
  tasks: [
    {
      id: 'g4u9-t1', skill: '真分數、假分數、帶分數', title: '分數家族', icon: '🍕', blurb: '真分數、假分數、帶分數，分得清楚嗎？',
      questions: [Q.k1, Q.k2, Q.k3, Q.k4, Q.k5, Q.k6, Q.k7, Q.k8, Q.k9],
    },
    {
      id: 'g4u9-t2', skill: '帶分數與假分數', title: '分數數線', icon: '📏', blurb: '在數線上找分數，帶分數和假分數換一換。',
      questions: [Q.l1, Q.l2, Q.l3, Q.l4, Q.match, Q.toMixed, Q.toImproper, Q.toImproper2],
    },
    {
      id: 'g4u9-t3', skill: '比較分數大小', title: '分數天秤', icon: '⚖️', blurb: '換成一樣的寫法再比。',
      questions: [Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6, Q.sort],
    },
    {
      id: 'g4u9-t4', skill: '同分母分數加減', title: '分數加減', icon: '➕', blurb: '分母一樣，分子加加減減。',
      questions: [Q.a1, Q.a2, Q.a3, Q.soup, Q.beef],
    },
    {
      id: 'g4u9-t5', skill: '生活中的分數', title: '編織圍巾', icon: '🧣', blurb: '姊妹一起織圍巾。',
      questions: [Q.z1, Q.z2, Q.z3],
    },
  ],
  boss: {
    id: 'g4u9-boss', skill: '整份單元', title: '單元九魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.k1, Q.k2, Q.k3, Q.k4, Q.k5, Q.k6, Q.k7, Q.k8,
      Q.match, Q.soup, Q.beef,
      Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6,
      Q.z1, Q.z2, Q.z3,
    ],
  },
}
