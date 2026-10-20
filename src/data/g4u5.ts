import type { CompareQ, NumberQ, PairQ, Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷05公里(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。
// 提示寫成小教學：1 公里 ＝ 1000 公尺 ＝ 100000 公分，方便在家先學。

const KM_HINT = '1 公里 ＝ 1000 公尺。公尺換公里就看有幾個 1000；公里換公尺就乘以 1000。'
const CM_HINT = '1 公尺 ＝ 100 公分，所以 1 公里 ＝ 1000 公尺 ＝ 100000 公分。'

const toNumber = (id: string, prompt: string, answer: number, unit: string, hint: string, explain: string): NumberQ => ({
  id, type: 'number', prompt, answers: [String(answer)], unit, hint, explain,
})

const kmM = (id: string, meters: number): PairQ => ({
  id, type: 'pair', prompt: `${meters} 公尺 ＝ （　）公里（　）公尺`,
  answers: [Math.floor(meters / 1000), meters % 1000], labels: ['公里', '公尺'],
  hint: '1000 公尺是 1 公里。從右邊數三位切開：左邊是公里，右邊三位是公尺。',
  explain: `${meters} 公尺 ＝ ${Math.floor(meters / 1000)} 公里 ${meters % 1000} 公尺。`,
})

const cmp = (id: string, left: string, right: string, answer: CompareQ['answer'], explain: string): CompareQ => ({
  id, type: 'compare', prompt: '比比看', left, right, answer,
  hint: '先把兩邊換成同一個單位，單位一樣才能比大小。1 公里 ＝ 1000 公尺 ＝ 100000 公分。',
  explain,
})

const UNITS = ['公里', '公尺', '公分', '毫米']
const pickUnit = (id: string, prompt: string, answer: string, hint: string, explain: string): Question => ({
  id, type: 'choice', prompt, options: UNITS, answer: UNITS.indexOf(answer), hint, explain,
})

const trails = [
  '搭臺北捷運可以到的步道長度：',
  '仙跡岩步道　3km540m',
  '象山親山步道　？',
  '劍潭山親山步道　3km300m',
  '關渡親山步道　？',
  '紅樹林生態步道　500m',
].join('\n')

const Q = {
  // 公里與公尺換算
  c5000: toNumber('g4u5-paper-n1', '5000 公尺 ＝ 幾公里？', 5, '公里', KM_HINT, '5000 裡有 5 個 1000，所以是 5 公里。'),
  c25000: toNumber('g4u5-paper-n2', '25000 公尺 ＝ 幾公里？', 25, '公里', KM_HINT, '25000 裡有 25 個 1000，所以是 25 公里。'),
  c1606: toNumber('g4u5-paper-n3', '1 公里 606 公尺 ＝ 幾公尺？', 1606, '公尺', KM_HINT, '1 公里是 1000 公尺，1000 ＋ 606 ＝ 1606 公尺。'),
  c20048: toNumber('g4u5-paper-n4', '20 公里 48 公尺 ＝ 幾公尺？', 20048, '公尺', '20 公里是 20000 公尺，再加上 48 公尺。小心：48 要放在最後兩位，前面補 0。', '20000 ＋ 48 ＝ 20048 公尺。'),
  p70301: kmM('g4u5-paper-p1', 70301),
  p45800: kmM('g4u5-paper-p2', 45800),
  c3km: toNumber('g4u5-v-n1', '3 公里 ＝ 幾公尺？', 3000, '公尺', KM_HINT, '3 × 1000 ＝ 3000 公尺。'),
  c7025: toNumber('g4u5-v-n2', '7 公里 25 公尺 ＝ 幾公尺？', 7025, '公尺', '7 公里是 7000 公尺，再加 25 公尺。25 放在最後兩位，前面補 0。', '7000 ＋ 25 ＝ 7025 公尺。'),
  p8040: kmM('g4u5-v-p1', 8040),

  // 公里與公分換算
  p9km: {
    id: 'g4u5-paper-p3', type: 'pair', prompt: '9 公里 ＝ （　）公尺 ＝ （　）公分',
    answers: [9000, 900000], labels: ['公尺', '公分'], joiner: '＝',
    hint: CM_HINT, explain: '9 公里 ＝ 9000 公尺；9000 公尺 × 100 ＝ 900000 公分。',
  },
  c10km: toNumber('g4u5-paper-n5', '10 公里 ＝ 幾公分？', 1000000, '公分', CM_HINT, '10 公里 ＝ 10000 公尺 ＝ 1000000 公分。'),
  c6000000: toNumber('g4u5-paper-n6', '6000000 公分 ＝ 幾公里？', 60, '公里', '先除以 100 換成公尺，再除以 1000 換成公里；也可以想 100000 公分是 1 公里。', '6000000 公分 ＝ 60000 公尺 ＝ 60 公里。'),
  c2km: toNumber('g4u5-v-n3', '2 公里 ＝ 幾公分？', 200000, '公分', CM_HINT, '2 公里 ＝ 2000 公尺 ＝ 200000 公分。'),
  tf1000cm: {
    id: 'g4u5-v-tf1', type: 'trueFalse', prompt: '1 公里 ＝ 1000 公分。', answer: false,
    hint: '1 公里是 1000「公尺」，每 1 公尺又有 100 公分。',
    explain: '不對。1 公里 ＝ 1000 公尺 ＝ 100000 公分。',
  },
  tf100cm: {
    id: 'g4u5-v-tf2', type: 'trueFalse', prompt: '1 公尺 ＝ 100 公分。', answer: true,
    hint: '想想 1 公尺的直尺上有幾個 1 公分。',
    explain: '對。1 公尺 ＝ 100 公分。',
  },

  // 比較長度
  k40: cmp('g4u5-paper-k1', '40 公里', '4000000 公分', '=', '40 公里 ＝ 40000 公尺 ＝ 4000000 公分，一樣長。'),
  k4567: cmp('g4u5-paper-k2', '4567 公尺', '45 公里 67 公尺', '<', '45 公里 67 公尺 ＝ 45067 公尺，比 4567 公尺長。'),
  k10010: cmp('g4u5-paper-k3', '10010 公尺', '100 公里 10 公尺', '<', '100 公里 10 公尺 ＝ 100010 公尺，比 10010 公尺長。'),
  k5500: cmp('g4u5-paper-k4', '5 公里 500 公尺', '5050 公尺', '>', '5 公里 500 公尺 ＝ 5500 公尺，比 5050 公尺長。'),
  k1km: cmp('g4u5-paper-k5', '1 公里', '100001 公分', '<', '1 公里 ＝ 100000 公分，比 100001 公分少 1 公分。'),
  k8km: cmp('g4u5-paper-k6', '8km', '80000 cm', '>', '8 km ＝ 800000 cm，比 80000 cm 長。'),
  k10km: cmp('g4u5-paper-k7', '10 km', '100000 m', '<', '10 km ＝ 10000 m，比 100000 m 短。'),
  k12km: cmp('g4u5-paper-k8', '12 km 30 m', '12030 m', '=', '12 km 30 m ＝ 12030 m，一樣長。'),
  k3km: cmp('g4u5-v-k1', '3 公里', '2999 公尺', '>', '3 公里 ＝ 3000 公尺，比 2999 公尺多 1 公尺。'),
  k6km: cmp('g4u5-v-k2', '6 km 6 m', '6060 m', '<', '6 km 6 m ＝ 6006 m，比 6060 m 短。'),

  // 選擇長度單位
  eiffel: pickUnit('g4u5-paper-u1', '巴黎鐵塔的高度大約是 330（　）。', '公尺', '大樓一層大約 3 公尺高。330 公里比好幾個城市還遠，太長了。', '巴黎鐵塔大約 330 公尺高。'),
  room: pickUnit('g4u5-paper-u2', '房間的高度大約是 300（　）。', '公分', '大人的身高大約 170 公分，房間比大人高一些。', '房間大約 300 公分高，也就是 3 公尺。'),
  marathon: pickUnit('g4u5-paper-u3', '哥哥參加馬拉松大約跑了 42（　）。', '公里', '馬拉松要跑好幾個小時，比走到學校遠很多。', '馬拉松大約 42 公里。'),
  coin: pickUnit('g4u5-paper-u4', '10 元硬幣的厚度大約是 2（　）。', '毫米', '硬幣很薄，比 1 公分還薄很多。1 公分 ＝ 10 毫米。', '10 元硬幣大約 2 毫米厚。'),
  dict: pickUnit('g4u5-paper-u5', '字典的厚度大約有 3（　）。', '公分', '用手指比比看，字典大約是三根手指併起來那麼厚。', '字典大約 3 公分厚。'),
  taipei: pickUnit('g4u5-paper-u6', '從臺北到彰化的距離大約是 175（　）。', '公里', '兩個縣市之間要開車好幾個小時，用最大的單位。', '臺北到彰化大約 175 公里。'),
  track: pickUnit('g4u5-v-u1', '學校操場跑一圈大約是 200（　）。', '公尺', '跑一圈大約一兩分鐘，不到 1 公里。', '操場一圈大約 200 公尺。'),
  pencil: pickUnit('g4u5-v-u2', '一枝新鉛筆的長度大約是 18（　）。', '公分', '鉛筆可以放在手掌上，比直尺短一點。', '鉛筆大約 18 公分長。'),

  // 長度應用題
  relay: {
    id: 'g4u5-paper-w1', type: 'pair', paper: true, labels: ['公里', '公尺'], answers: [1, 520],
    prompt: '4 人一組參加 6 公里 80 公尺的接力賽跑，前面 3 人已經跑了 4560 公尺，最後一個人要跑幾公里幾公尺？',
    hint: '先把單位換成一樣：6 公里 80 公尺 ＝ 6080 公尺，再減掉已經跑的 4560 公尺。',
    explain: '6080 － 4560 ＝ 1520 公尺 ＝ 1 公里 520 公尺。',
  },
  bike: {
    id: 'g4u5-paper-w2', type: 'pair', paper: true, labels: ['公里', '公尺'], answers: [5, 50],
    prompt: '小和家到學校的距離是 2 公里 525 公尺，小和騎腳踏車從家裡到學校來回一趟，一共騎了幾公里幾公尺？',
    hint: '來回就是去一次、回一次，要加兩次。公尺加起來超過 1000，就進位成 1 公里。',
    explain: '2 公里 525 公尺 ＋ 2 公里 525 公尺 ＝ 4 公里 1050 公尺 ＝ 5 公里 50 公尺。',
  },
  elephant: {
    id: 'g4u5-paper-w3', type: 'pair', paper: true, labels: ['公里', '公尺'], answers: [2, 200], context: trails,
    prompt: '象山親山步道比紅樹林生態步道長 1700 公尺，象山親山步道的長度大約是幾公里幾公尺？',
    hint: '紅樹林生態步道是 500 公尺，比它長就用加的：500 ＋ 1700。',
    explain: '500 ＋ 1700 ＝ 2200 公尺 ＝ 2 公里 200 公尺。',
  },
  guandu: {
    id: 'g4u5-paper-w4', type: 'pair', paper: true, labels: ['公里', '公尺'], answers: [4, 650], context: trails,
    prompt: '關渡親山步道比仙跡岩步道和劍潭山親山步道合起來還少 2 公里 190 公尺，關渡親山步道大約是幾公里幾公尺？',
    hint: '先把仙跡岩和劍潭山加起來，再減掉 2 公里 190 公尺。公里和公里算、公尺和公尺算。',
    explain: '3 公里 540 公尺 ＋ 3 公里 300 公尺 ＝ 6 公里 840 公尺；再減 2 公里 190 公尺 ＝ 4 公里 650 公尺。',
  },
  walk: {
    id: 'g4u5-v-w1', type: 'number', paper: true, unit: '公尺',
    prompt: '從家裡到公園是 1 公里 800 公尺，已經走了 950 公尺，還要走幾公尺？',
    answers: ['850'],
    hint: '先把 1 公里 800 公尺換成 1800 公尺，再減掉走過的。',
    explain: '1800 － 950 ＝ 850 公尺。',
  },
  jog: {
    id: 'g4u5-v-w2', type: 'number', paper: true, unit: '公里',
    prompt: '媽媽每天慢跑 1 公里 250 公尺，連續跑 4 天，一共跑了幾公里？',
    answers: ['5'],
    hint: '1 公里 250 公尺 ＝ 1250 公尺，乘以 4 天，再換回公里。',
    explain: '1250 × 4 ＝ 5000 公尺 ＝ 5 公里。',
  },
} satisfies Record<string, Question>

export const g4u5: Unit = {
  id: 'g4u5',
  number: 5,
  grade: 4,
  subject: '數學',
  title: '公里',
  source: '4上單元卷05（南一）',
  tasks: [
    {
      id: 'g4u5-t1', skill: '公里公尺換算', title: '公里換公尺', icon: '🛣️', blurb: '1 公里有幾公尺？',
      questions: [Q.c5000, Q.c1606, Q.c20048, Q.p70301, Q.p45800, Q.c3km, Q.c7025, Q.p8040],
    },
    {
      id: 'g4u5-t2', skill: '公里與公分換算', title: '換成公分', icon: '📏', blurb: '1 公里有好多好多公分！',
      questions: [Q.p9km, Q.c10km, Q.c6000000, Q.c2km, Q.tf1000cm, Q.tf100cm],
    },
    {
      id: 'g4u5-t3', skill: '比較長度', title: '長度天秤', icon: '⚖️', blurb: '換成同一個單位再比。',
      questions: [Q.k40, Q.k4567, Q.k5500, Q.k1km, Q.k8km, Q.k12km, Q.k3km, Q.k6km],
    },
    {
      id: 'g4u5-t4', skill: '選擇長度單位', title: '選對單位', icon: '🗼', blurb: '公里、公尺、公分還是毫米？',
      questions: [Q.eiffel, Q.room, Q.marathon, Q.coin, Q.dict, Q.taipei, Q.track, Q.pencil],
    },
    {
      id: 'g4u5-t5', skill: '長度應用題', title: '步道探險', icon: '🥾', blurb: '公里和公尺一起算。',
      questions: [Q.relay, Q.bike, Q.elephant, Q.guandu, Q.walk, Q.jog],
    },
  ],
  boss: {
    id: 'g4u5-boss', skill: '整份單元', title: '單元五魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.c5000, Q.c25000, Q.c1606, Q.c20048, Q.p9km, Q.c10km, Q.c6000000, Q.p70301, Q.p45800,
      Q.k40, Q.k4567, Q.k10010, Q.k5500, Q.k1km, Q.k8km, Q.k10km, Q.k12km,
      Q.relay, Q.bike,
      Q.eiffel, Q.room, Q.marathon, Q.coin, Q.dict, Q.taipei,
      Q.elephant, Q.guandu,
    ],
  },
}
