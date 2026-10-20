import type { BarBuildQ, Chart, ChoiceQ, NumberQ, Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷10統計圖(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。
// 圖上的數字照卷子畫；讀圖題的答案從圖的資料算出來，不手寫。

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const argMax = (xs: number[]) => xs.indexOf(Math.max(...xs))
const argMin = (xs: number[]) => xs.indexOf(Math.min(...xs))

const READ_HINT = '先在橫軸找到那一格，往上看到長條（或點）的頂端，再往左對到縱軸的數字。'

const num = (id: string, chart: Chart, prompt: string, answer: number, unit: string, hint: string, explain: string): NumberQ => ({
  id, type: 'number', chart, prompt, answers: [String(answer)], unit, hint, explain,
})

const pick = (id: string, chart: Chart, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', chart, prompt, options, answer, hint, explain,
})

// 一、搶答長條圖
const QUIZ = { names: ['奇奇', '妙妙', '豆豆', '妮妮'], values: [8, 3, 4, 6] }
const quizChart: Chart = {
  kind: 'bar', title: '4 位學生數學課搶答正確題數長條圖', categories: QUIZ.names,
  series: [{ name: '題數', values: QUIZ.values }], yMax: 8, yStep: 1, xLabel: '姓名', yLabel: '題數（題）',
}
const build = (id: string, categories: string[], values: number[], yMax: number, xLabel: string, yLabel: string, prompt: string): BarBuildQ => ({
  id, type: 'barBuild', categories, values, yMax, xLabel, yLabel, prompt,
  hint: '一格是 1。每個人的數字是幾，長條就畫到第幾格（點那一格）。',
  explain: `照統計表畫：${categories.map((c, i) => `${c} ${values[i]}`).join('、')}。`,
})

// 二、英語成績折線圖
const CLASSES = ['甲', '乙', '丙'] as const
const SCORES = { 甲: [6, 7, 4, 6, 5], 乙: [4, 3, 5, 7, 6], 丙: [3, 2, 4, 5, 4] }
const BANDS = ['59 以下', '60～69', '70～79', '80～89', '90 以上']
const englishChart: Chart = {
  kind: 'line', title: '某國小四年級三個班的英語成績折線圖', categories: BANDS,
  series: CLASSES.map((c) => ({ name: `${c}班`, values: SCORES[c], labels: true })),
  yMax: 10, yStep: 1, xLabel: '分數（分）', yLabel: '人數（人）',
}
const at = (band: number) => CLASSES.map((c) => SCORES[c][band])
const passed = (c: (typeof CLASSES)[number]) => sum(SCORES[c].slice(1))

// 三、兩間餐廳雙長條圖
const DAYS = ['日', '一', '二', '三', '四', '五', '六']
const MEIWEI = [70, 30, 50, 35, 40, 60, 70]
const XINHE = [55, 40, 35, 55, 45, 50, 75]
const foodChart: Chart = {
  kind: 'bar', title: '兩間餐廳上週顧客人數長條圖', categories: DAYS,
  series: [{ name: '美味餐廳', values: MEIWEI }, { name: '新禾餐廳', values: XINHE }],
  yMax: 80, yStep: 10, yGrid: 5, xLabel: '星期', yLabel: '人數（人）',
}
const FOOD_HINT = READ_HINT + '淺色是美味餐廳、深色是新禾餐廳。一條格線是 5 人，對不準的時候看長條頂端在哪兩條線中間。'

// 四、颱風折線圖
const YEARS = [2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]
const TYPHOONS = [21, 25, 31, 23, 27, 26, 27, 28, 28, 21]
const typhoonChart: Chart = {
  kind: 'line', title: '近 10 年西北太平洋海域每年颱風生成數折線圖（資料來源：內政部消防署）',
  categories: YEARS.map(String),
  series: [{ name: '颱風', values: TYPHOONS }], yMin: 18, yMax: 32, yStep: 2, xLabel: '年分（年）', yLabel: '颱風生成數（個）',
}
const typhoonContext = '臺灣往年遇到的颱風大多來自西北太平洋海域。下面是近 10 年（2011～2020 年）西北太平洋海域每年颱風生成數的折線圖。'
const TYPHOON_HINT = '縱軸從 18 開始（下面的「≈」表示中間省略），一格是 2 個，點在兩條線中間就是單數。'
const tf = (i: number) => TYPHOONS[i]
/** 颱風題都附上短文 */
const ty = <T extends Question>(q: T): T => ({ ...q, context: typhoonContext })

const Q = {
  // 畫長條圖
  quizBuild: build('g4u10-paper-b1', QUIZ.names, QUIZ.values, 8, '姓名', '題數（題）', '照「4 位學生數學課搶答正確題數統計表」，把長條圖畫完。'),
  fruitBuild: build('g4u10-v-b1', ['蘋果', '香蕉', '芭樂', '葡萄'], [5, 7, 2, 4], 8, '水果', '人數（人）', '班上最喜歡的水果統計表，把長條圖畫出來。'),
  quizMost: pick('g4u10-v-q1', quizChart, '誰搶答正確的題數最多？', QUIZ.names, argMax(QUIZ.values),
    '長條最高的就是最多。', `${QUIZ.names[argMax(QUIZ.values)]}的長條最高，答對 ${Math.max(...QUIZ.values)} 題。`),
  quizDiff: num('g4u10-v-q2', quizChart, '妮妮比妙妙多答對幾題？', QUIZ.values[3] - QUIZ.values[1], '題',
    '先讀出兩個人的題數，再相減。', `妮妮 ${QUIZ.values[3]} 題，妙妙 ${QUIZ.values[1]} 題，${QUIZ.values[3]} － ${QUIZ.values[1]} ＝ ${QUIZ.values[3] - QUIZ.values[1]} 題。`),

  // 雙長條圖
  f1: num('g4u10-paper-f1', foodChart, '新禾餐廳星期一的顧客有幾人？', XINHE[1], '人', FOOD_HINT, `深色長條在星期一到 ${XINHE[1]}。`),
  f2: num('g4u10-paper-f2', foodChart, '美味餐廳星期二的顧客有幾人？', MEIWEI[2], '人', FOOD_HINT, `淺色長條在星期二到 ${MEIWEI[2]}。`),
  f3: num('g4u10-paper-f3', foodChart, '兩間餐廳星期三的顧客共有幾人？', MEIWEI[3] + XINHE[3], '人', '先讀出兩間餐廳星期三的人數，再加起來。',
    `${MEIWEI[3]} ＋ ${XINHE[3]} ＝ ${MEIWEI[3] + XINHE[3]} 人。`),
  f4: pick('g4u10-paper-f4', foodChart, '新禾餐廳星期幾的顧客人數最少？', DAYS.map((d) => `星期${d}`), argMin(XINHE), '找深色長條裡最矮的那一條。',
    `深色長條最矮的是星期${DAYS[argMin(XINHE)]}，只有 ${Math.min(...XINHE)} 人。`),
  f5: num('g4u10-paper-f5', foodChart, '美味餐廳星期五的顧客人數比新禾餐廳多幾人？', MEIWEI[5] - XINHE[5], '人', '讀出星期五兩條長條的人數，再相減。',
    `${MEIWEI[5]} － ${XINHE[5]} ＝ ${MEIWEI[5] - XINHE[5]} 人。`),
  f6: pick('g4u10-paper-f6', foodChart, '新禾餐廳星期幾的顧客人數最多？', DAYS.map((d) => `星期${d}`), argMax(XINHE), '找深色長條裡最高的那一條。',
    `深色長條最高的是星期${DAYS[argMax(XINHE)]}，有 ${Math.max(...XINHE)} 人。`),
  f7: num('g4u10-paper-f7', foodChart, '美味餐廳上週顧客共有幾人？', sum(MEIWEI), '人', '把淺色長條七天的人數一天一天加起來，可以在紙上寫下來再加。',
    `${MEIWEI.join(' ＋ ')} ＝ ${sum(MEIWEI)} 人。`),

  // 折線圖
  e1: pick('g4u10-paper-e1', englishChart, '哪一個班的英語成績在 80～89 分的人數最多？', CLASSES.map((c) => `${c}班`), argMax(at(3)),
    '在「80～89」那一格往上看，哪一條線的點最高？', `80～89 分：${CLASSES.map((c, i) => `${c}班 ${at(3)[i]} 人`).join('、')}。`),
  e2: pick('g4u10-paper-e2', englishChart, '哪兩個班的英語成績在 70～79 分的人數相同？', ['甲班和乙班', '甲班和丙班', '乙班和丙班'], 1,
    '在「70～79」那一格，看哪兩條線的點疊在一起。', `70～79 分：${CLASSES.map((c, i) => `${c}班 ${at(2)[i]} 人`).join('、')}，甲班和丙班一樣。`),
  e3: num('g4u10-paper-e3', englishChart, '乙班的英語成績不到 60 分的有幾人？', SCORES.乙[0], '人', '「不到 60 分」就是「59 以下」那一格。',
    `乙班在 59 以下有 ${SCORES.乙[0]} 人。`),
  e4: pick('g4u10-paper-e4', englishChart, '哪一個班級英語成績不及格（不到 60 分）的人數最少？', CLASSES.map((c) => `${c}班`), argMin(at(0)),
    '看「59 以下」那一格，哪一條線的點最低？', `59 以下：${CLASSES.map((c, i) => `${c}班 ${at(0)[i]} 人`).join('、')}。`),
  e5a: num('g4u10-paper-e5', englishChart, '甲班英語成績在 60 分以上的有幾人？', passed('甲'), '人', '60 分以上是後面四格：60～69、70～79、80～89、90 以上，全部加起來。',
    `${SCORES.甲.slice(1).join(' ＋ ')} ＝ ${passed('甲')} 人。`),
  e5b: num('g4u10-paper-e6', englishChart, '乙班英語成績在 60 分以上的有幾人？', passed('乙'), '人', '60 分以上是後面四格，全部加起來。',
    `${SCORES.乙.slice(1).join(' ＋ ')} ＝ ${passed('乙')} 人。`),
  e5c: num('g4u10-paper-e7', englishChart, '丙班英語成績在 60 分以上的有幾人？', passed('丙'), '人', '60 分以上是後面四格，全部加起來。',
    `${SCORES.丙.slice(1).join(' ＋ ')} ＝ ${passed('丙')} 人。`),

  // 颱風
  t1: ty({ ...num('g4u10-paper-t1', typhoonChart, '颱風生成數最多的是哪一年？', YEARS[argMax(TYPHOONS)], '年', '找折線最高的那一點，再往下看是哪一年。',
    `最高點在 ${YEARS[argMax(TYPHOONS)]} 年，有 ${Math.max(...TYPHOONS)} 個。`), plain: true }),
  t2: ty(num('g4u10-paper-t2', typhoonChart, `${YEARS[argMax(TYPHOONS)]} 年有幾個颱風生成？`, Math.max(...TYPHOONS), '個', TYPHOON_HINT,
    `最高點在 30 和 32 的中間，是 ${Math.max(...TYPHOONS)} 個。`)),
  t3: ty(pick('g4u10-paper-t3', typhoonChart, '從 2011 年到 2013 年，颱風生成數是越來越多，還是越來越少？', ['越來越多', '越來越少'], 0,
    '看這三年的折線是往上還是往下。', `${tf(0)}、${tf(1)}、${tf(2)}，折線一直往上，越來越多。`)),
  t4: ty(pick('g4u10-paper-t4', typhoonChart, '2020 年的颱風生成數比 2019 年多還是少？', ['多', '少'], tf(9) > tf(8) ? 0 : 1,
    '比比看最後兩個點，哪一個比較高？', `2019 年 ${tf(8)} 個，2020 年 ${tf(9)} 個，2020 年比較少。`)),
  t5: ty(num('g4u10-paper-t5', typhoonChart, '2020 年和 2019 年的颱風生成數相差多少個？', tf(8) - tf(9), '個', TYPHOON_HINT,
    `${tf(8)} － ${tf(9)} ＝ ${tf(8) - tf(9)} 個。`)),
  t6: ty(pick('g4u10-v-t1', typhoonChart, '哪兩年的颱風生成數一樣多，而且是第二多？', ['2015 年和 2017 年', '2018 年和 2019 年', '2011 年和 2020 年'], 1,
    '找一樣高、連在一起的兩個點。', `2018 年和 2019 年都是 ${tf(7)} 個，只比 2013 年少。`)),
  t7: ty(num('g4u10-v-t2', typhoonChart, '從 2014 年到 2015 年，颱風生成數增加了幾個？', tf(4) - tf(3), '個', TYPHOON_HINT,
    `${tf(4)} － ${tf(3)} ＝ ${tf(4) - tf(3)} 個。`)),
  which: {
    id: 'g4u10-v-k1', type: 'choice', prompt: '想看一個月每天的氣溫是升高還是降低，用哪一種統計圖比較清楚？', options: ['長條圖', '折線圖'], answer: 1,
    hint: '長條圖適合比大小；要看「變化」（越來越多或越來越少），看線往上還是往下比較清楚。', explain: '折線圖的線往上、往下，最容易看出變化。',
  } satisfies ChoiceQ,
} satisfies Record<string, Question>

export const g4u10: Unit = {
  id: 'g4u10',
  number: 10,
  grade: 4,
  subject: '數學',
  title: '統計圖',
  source: '4上單元卷10（南一）',
  tasks: [
    {
      id: 'g4u10-t1', skill: '畫長條圖', title: '畫長條圖', icon: '📊', blurb: '照統計表，把長條畫出來。',
      questions: [Q.quizBuild, Q.fruitBuild, Q.quizMost, Q.quizDiff],
    },
    {
      id: 'g4u10-t2', skill: '報讀雙長條圖', title: '兩間餐廳', icon: '🍜', blurb: '淺色、深色兩組長條一起比。',
      questions: [Q.f1, Q.f2, Q.f3, Q.f4, Q.f5, Q.f6, Q.f7],
    },
    {
      id: 'g4u10-t3', skill: '報讀折線圖', title: '英語成績', icon: '📈', blurb: '三條折線，三個班。',
      questions: [Q.e1, Q.e2, Q.e3, Q.e4, Q.e5a, Q.e5b, Q.e5c],
    },
    {
      id: 'g4u10-t4', skill: '折線圖的變化', title: '颱風報告', icon: '🌀', blurb: '颱風是越來越多，還是越來越少？',
      questions: [Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6, Q.t7, Q.which],
    },
  ],
  boss: {
    id: 'g4u10-boss', skill: '整份單元', title: '單元十魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.quizBuild,
      Q.e1, Q.e2, Q.e3, Q.e4, Q.e5a, Q.e5b, Q.e5c,
      Q.f1, Q.f2, Q.f3, Q.f4, Q.f5, Q.f6, Q.f7,
      Q.t1, Q.t2, Q.t3, Q.t4, Q.t5,
    ],
  },
}
