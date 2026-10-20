import type { CompareQ, NumberQ, PairQ, Question, SortQ, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷07小數(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。

const ORDER_HINT = '看看數字每次多（或少）多少：小數點後第二位每次變 1，就是每次 0.01。到 9 再往前進位。'
const COMPARE_HINT = '先比整數部分；一樣的話，從十分位開始一位一位比。位數不夠可以在後面補 0 再比，例如 6.8 ＝ 6.80。'
const ADD_HINT = '直式加減時，小數點要對齊，位數不夠的在後面補 0，算完把小數點點在同一直線上。'

const next2 = (id: string, prompt: string, answers: [number, number], explain: string): PairQ => ({
  id, type: 'pair', decimal: true, prompt, answers, labels: ['第 1 格', '第 2 格'], hint: ORDER_HINT, explain,
})

const dec = (id: string, prompt: string, answer: string, hint: string, explain: string, unit?: string, paper?: boolean, context?: string): NumberQ => ({
  id, type: 'number', decimal: true, prompt, answers: [answer], hint, explain, unit, paper, context,
})

const cmp = (id: string, left: string, right: string, answer: CompareQ['answer'], explain: string): CompareQ => ({
  id, type: 'compare', prompt: '比比看', left, right, answer, hint: COMPARE_HINT, explain,
})

const sort = (id: string, items: string[], explain: string): SortQ => ({
  id, type: 'sort', items, order: 'desc', prompt: '把這些數由大到小排出來。', hint: COMPARE_HINT, explain,
})

const zoo = [
  '臺北市立木柵動物園剛出生的動物體重：',
  '貓熊「圓寶」0.19 公斤',
  '長頸鹿「麥芽」79.6 公斤',
  '馬來貘「貘樹」8.42 公斤、「貘豆」5.19 公斤',
].join('\n')

const Q = {
  // 小數的順序與位值
  s1: next2('g4u7-paper-o1', '3.07 →（　）→（　）→ 3.1 → 3.11', [3.08, 3.09], '每次多 0.01：3.07、3.08、3.09、3.1（就是 3.10）。'),
  s2: next2('g4u7-paper-o2', '7.31 → 7.21 → 7.11 →（　）→（　）→ 6.81', [7.01, 6.91], '每次少 0.1：7.11、7.01、6.91、6.81。'),
  s3: next2('g4u7-paper-o3', '8.28 → 8.29 →（　）→（　）→ 8.32', [8.3, 8.31], '每次多 0.01：8.29 再多 0.01 是 8.30（就是 8.3），再來 8.31。'),
  s4: next2('g4u7-paper-o4', '（　）→（　）→ 0.98 → 0.96', [1.02, 1], '每次少 0.02，倒回去每次多 0.02：0.98 前面是 1（1.00），再前面是 1.02。'),
  s5: dec('g4u7-paper-o5', '1.02 → 1 → 0.98 → 0.96 →（　）→ 0.92', '0.94', ORDER_HINT, '每次少 0.02：0.96 再少 0.02 是 0.94。'),
  place: {
    id: 'g4u7-paper-p1', type: 'pair', prompt: '10.05 的百分位數字是幾？十分位數字是幾？', answers: [5, 0], labels: ['百分位', '十分位'],
    hint: '小數點右邊第一位是十分位，第二位是百分位。', explain: '10.05：十分位是 0，百分位是 5。',
  } satisfies PairQ,
  pos437: {
    id: 'g4u7-v-p1', type: 'choice', prompt: '4.37 的「7」在哪一位？', options: ['個位', '十分位', '百分位'], answer: 2,
    hint: '小數點右邊第一位是十分位，第二位是百分位。', explain: '4 在個位、3 在十分位、7 在百分位。',
  },

  // 小數與單位
  n625: dec('g4u7-paper-u1', '6 個 1 和 25 個 0.01 合起來是多少？', '6.25', '25 個 0.01 是 0.25。', '6 ＋ 0.25 ＝ 6.25。'),
  cm27: dec('g4u7-paper-u2', '27 公分 ＝ 幾公尺？（用小數表示）', '0.27', '1 公尺 ＝ 100 公分，1 公分是 0.01 公尺。', '27 公分是 27 個 0.01 公尺，就是 0.27 公尺。', '公尺'),
  m270: dec('g4u7-paper-u3', '2 公尺 70 公分 ＝ 幾公尺？（用小數表示）', '2.7', '70 公分是 0.7 公尺（70 個 0.01）。', '2 ＋ 0.7 ＝ 2.7 公尺（寫 2.70 也可以）。', '公尺'),
  hundredths: dec('g4u7-v-u1', '0.1 是幾個 0.01？', '10', '0.01 是把 1 分成 100 份的 1 份，0.1 是分成 10 份的 1 份。', '10 個 0.01 是 0.1。', '個'),
  m305: dec('g4u7-v-u2', '3 公尺 5 公分 ＝ 幾公尺？（用小數表示）', '3.05', '5 公分是 0.05 公尺，小心不是 0.5。', '3 ＋ 0.05 ＝ 3.05 公尺。', '公尺'),

  // 比較小數大小
  c1: cmp('g4u7-paper-c1', '1.01', '0.99', '>', '整數部分 1 比 0 大，所以 1.01 比較大。'),
  c2: cmp('g4u7-paper-c2', '四點三七', '4.37', '=', '四點三七就是 4.37，一樣大。'),
  c3: cmp('g4u7-paper-c3', '6.08', '6.8', '<', '整數一樣；十分位 0 比 8 小，所以 6.08 比較小。'),
  c4: cmp('g4u7-paper-c4', '30.14', '三點一四', '>', '三點一四是 3.14，30.14 的整數部分 30 比 3 大。'),
  dig1: {
    id: 'g4u7-paper-d1', type: 'digits', prompt: '9.57 > 9.□7，□ 裡可以填入哪些數字？（全部選出來）', answer: [0, 1, 2, 3, 4],
    hint: '整數部分一樣，比十分位：□ 和 5 比。□ 是 5 的時候兩個數一樣大，不算。',
    explain: '□ 比 5 小才會比較小：0、1、2、3、4。',
  },
  dig2: {
    id: 'g4u7-paper-d2', type: 'digits', prompt: '12.66 < 12.□，□ 裡可以填入哪些數字？（全部選出來）', answer: [7, 8, 9],
    hint: '12.□ 只有十分位，可以想成 12.□0，再和 12.66 比十分位。',
    explain: '12.7、12.8、12.9 都比 12.66 大；12.6 ＝ 12.60 比 12.66 小。',
  },
  sort1: sort('g4u7-paper-r1', ['1.2', '2.01', '1.02', '0.21'], '2.01 ＞ 1.2 ＞ 1.02 ＞ 0.21。'),
  sort2: sort('g4u7-paper-r2', ['3.06', '6.03', '0.63', '60.3'], '60.3 ＞ 6.03 ＞ 3.06 ＞ 0.63。'),

  // 小數加減
  add1: dec('g4u7-v-a1', '用直式算算看：3.45 ＋ 2.68', '6.13', ADD_HINT, '3.45 ＋ 2.68 ＝ 6.13。', undefined, true),
  sub1: dec('g4u7-v-a2', '用直式算算看：7.2 － 3.56', '3.64', '7.2 要先看成 7.20，小數點對齊再減。', '7.20 － 3.56 ＝ 3.64。', undefined, true),
  add2: dec('g4u7-v-a3', '用直式算算看：0.8 ＋ 0.25', '1.05', '0.8 看成 0.80，再和 0.25 相加。', '0.80 ＋ 0.25 ＝ 1.05。', undefined, true),
  rope: dec('g4u7-paper-w1', '有粗、細兩條繩子，粗繩子比細繩子長 1.13 公尺，粗繩子長 8.8 公尺，兩條繩子共長多少公尺？', '16.47',
    '先算細繩子：粗繩子比較長，細繩子 ＝ 8.8 － 1.13。再把兩條加起來。', '8.8 － 1.13 ＝ 7.67，8.8 ＋ 7.67 ＝ 16.47 公尺。', '公尺', true),
  tape: dec('g4u7-paper-w2', '把一條長 13.88 公分的紙帶和一條長 15.48 公分的紙帶接在一起，連接後的總長度是 23.86 公分，這兩條紙帶的連接處是幾公分？', '5.5',
    '兩條加起來比接好的長，多出來的就是重疊的地方：先加再減。', '13.88 ＋ 15.48 ＝ 29.36，29.36 － 23.86 ＝ 5.5 公分。', '公分', true),

  // 動物園
  heavier: {
    id: 'g4u7-paper-z1', type: 'choice', context: zoo, prompt: '馬來貘「貘樹」和「貘豆」出生時的體重，誰比較重？', options: ['貘樹', '貘豆'], answer: 0,
    hint: '比 8.42 和 5.19：先比整數部分。', explain: '8.42 ＞ 5.19，貘樹比較重。',
  },
  diff: dec('g4u7-paper-z2', '「貘樹」和「貘豆」出生時的體重相差多少公斤？', '3.23', '大的減小的：8.42 － 5.19。', '8.42 － 5.19 ＝ 3.23 公斤。', '公斤', true, zoo),
  panda: dec('g4u7-paper-z3', '貓熊「圓寶」出生第 99 天的體重，比剛出生時增加了 5.89 公斤，圓寶出生第 99 天的體重是幾公斤？', '6.08',
    '增加了就用加的：0.19 ＋ 5.89。', '0.19 ＋ 5.89 ＝ 6.08 公斤。', '公斤', true, zoo),
  giraffe: dec('g4u7-paper-z4', '長頸鹿「麥芽」的哥哥「麥照」，出生時的體重比麥芽少 7.6 公斤，麥照出生時的體重是多少公斤？', '72',
    '比麥芽少就用減的：79.6 － 7.6。', '79.6 － 7.6 ＝ 72 公斤。', '公斤', true, zoo),
} satisfies Record<string, Question>

export const g4u7: Unit = {
  id: 'g4u7',
  number: 7,
  grade: 4,
  subject: '數學',
  title: '小數',
  source: '4上單元卷07（南一）',
  tasks: [
    {
      id: 'g4u7-t1', skill: '小數的順序與位值', title: '小數排隊', icon: '🔢', blurb: '每次多 0.01，還是多 0.1？',
      questions: [Q.s1, Q.s2, Q.s3, Q.s4, Q.s5, Q.place, Q.pos437],
    },
    {
      id: 'g4u7-t2', skill: '小數與單位', title: '公尺換小數', icon: '📏', blurb: '公分換成公尺，用小數表示。',
      questions: [Q.n625, Q.cm27, Q.m270, Q.hundredths, Q.m305],
    },
    {
      id: 'g4u7-t3', skill: '比較小數大小', title: '小數天秤', icon: '⚖️', blurb: '6.08 和 6.8，誰比較大？',
      questions: [Q.c1, Q.c2, Q.c3, Q.c4, Q.dig1, Q.dig2, Q.sort1, Q.sort2],
    },
    {
      id: 'g4u7-t4', skill: '小數加減', title: '小數加減', icon: '➕', blurb: '小數點對齊再算。',
      questions: [Q.add1, Q.sub1, Q.add2, Q.rope, Q.tape],
    },
    {
      id: 'g4u7-t5', skill: '生活中的小數', title: '動物寶寶', icon: '🐼', blurb: '動物寶寶有多重？',
      questions: [Q.heavier, Q.diff, Q.panda, Q.giraffe],
    },
  ],
  boss: {
    id: 'g4u7-boss', skill: '整份單元', title: '單元七魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.s1, Q.s2, Q.s3, Q.s4, Q.s5, Q.place, Q.n625, Q.cm27, Q.m270,
      Q.c1, Q.c2, Q.c3, Q.c4, Q.dig1, Q.dig2, Q.sort1, Q.sort2,
      Q.rope, Q.tape, Q.heavier, Q.diff, Q.panda, Q.giraffe,
    ],
  },
}
