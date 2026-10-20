import type { AngleFigure, AngleQ, NumberQ, Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷03角度(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。
// 組合圖用「射線＋弧線標籤」描述，題庫檢查會核對每個標籤的度數跟圖一致。

const KIND_HINT = '和直角比一比：比直角小是銳角，剛好是直角，比直角大、比平角（一直線）小是鈍角。'

const kind = (id: string, degrees: number, tilt: number): AngleQ => ({
  id, type: 'angle', ask: 'kind', degrees, tilt,
  prompt: '這個角是銳角、直角、鈍角，還是平角？',
  hint: KIND_HINT,
  explain: `這個角是 ${degrees} 度，是${degrees < 90 ? '銳角' : degrees === 90 ? '直角' : degrees < 180 ? '鈍角' : '平角'}。`,
})

const measure = (id: string, degrees: number): AngleQ => ({
  id, type: 'angle', ask: 'measure', degrees,
  prompt: '看量角器，這個角是幾度？',
  hint: '一條邊對準 0，從 0 那一圈開始數，看另一條邊指到哪個數字。',
  explain: `從 0 數起，另一條邊指在 ${degrees}，所以是 ${degrees} 度。`,
})

const draw = (id: string, degrees: number): AngleQ => ({
  id, type: 'angle', ask: 'draw', degrees,
  prompt: `以黑點為中心，畫出一個 ${degrees} 度的角。`,
  hint: '量角器的中心對準黑點，從右邊 0 那一圈開始數，數到要的度數，把邊拖到那裡。',
  explain: `從 0 開始的那一圈，數到 ${degrees} 就是 ${degrees} 度。`,
})

const compute = (id: string, degrees: number, figure: AngleFigure, hint: string, explain: string): AngleQ => ({
  id, type: 'angle', ask: 'compute', degrees, figure,
  prompt: '算算看，圖中的 ∠A 是幾度？',
  hint, explain,
})

const n = (id: string, prompt: string, answer: number, hint: string, explain: string): NumberQ => ({
  id, type: 'number', prompt, answers: [String(answer)], unit: '度', hint, explain,
})

const Q = {
  // 銳角、直角、鈍角
  k1: kind('g4u3-paper-k1', 120, 30),
  k2: kind('g4u3-paper-k2', 70, 0),
  k3: kind('g4u3-paper-k3', 80, 100),
  k4: kind('g4u3-paper-k4', 90, 45),
  k5: kind('g4u3-v-k1', 180, 0),
  k6: kind('g4u3-v-k2', 35, 60),
  k7: kind('g4u3-v-k3', 150, 15),

  // 用量角器量角
  m140: measure('g4u3-paper-m1', 140),
  m60: measure('g4u3-paper-m2', 60),
  m30: measure('g4u3-v-m1', 30),
  m110: measure('g4u3-v-m2', 110),
  m170: measure('g4u3-v-m3', 170),
  straw: n('g4u3-paper-m3',
    '吸管從量角器內圈 110 度開始，往順時針方向轉了 26 度，再往逆時針方向轉了 33 度，吸管最後會指在內圈幾度？', 117,
    '內圈的數字從左邊的 0 開始。順時針轉（往右轉）內圈數字變小，逆時針轉（往左轉）內圈數字變大。',
    '110 － 26 ＝ 84，84 ＋ 33 ＝ 117 度。'),

  // 畫出指定的角
  d160: draw('g4u3-paper-d1', 160),
  d45: draw('g4u3-v-d1', 45),
  d75: draw('g4u3-v-d2', 75),
  d120: draw('g4u3-v-d3', 120),
  d135: draw('g4u3-v-d4', 135),

  // 角度的計算
  c1: compute('g4u3-paper-c1', 54,
    { rays: [0, 36, 90], arcs: [{ from: 0, to: 90, label: '∟' }, { from: 0, to: 36, label: '36°' }, { from: 36, to: 90, label: 'A' }] },
    '整個是直角 90 度，∠A 是直角裡扣掉 36 度剩下的部分。', '90 － 36 ＝ 54 度。'),
  c2: compute('g4u3-paper-c2', 148,
    { rays: [0, 58, 148], arcs: [{ from: 0, to: 58, label: '58°' }, { from: 58, to: 148, label: '∟' }, { from: 0, to: 148, label: 'A', level: 1 }] },
    '∠A 是 58 度加上一個直角。', '90 ＋ 58 ＝ 148 度。'),
  c3: compute('g4u3-paper-c3', 40,
    { rays: [0, 40, 55, 180], arcs: [{ from: 0, to: 40, label: 'A' }, { from: 40, to: 55, label: '15°' }, { from: 55, to: 180, label: '125°' }] },
    '下面是一直線，一直線是平角 180 度。先把 125 度和 15 度加起來，再用 180 去減。', '125 ＋ 15 ＝ 140，180 － 140 ＝ 40 度。'),
  c4: compute('g4u3-paper-c4', 105,
    { rays: [0, 25, 60, 105], arcs: [{ from: 0, to: 25, label: '25°' }, { from: 25, to: 60, label: '35°' }, { from: 60, to: 105, label: '45°' }, { from: 0, to: 105, label: 'A', level: 2 }] },
    '∠A 是三個小角合起來，把它們加起來。', '25 ＋ 35 ＋ 45 ＝ 105 度。'),
  c5: compute('g4u3-v-c1', 110,
    { rays: [0, 70, 180], arcs: [{ from: 0, to: 70, label: '70°' }, { from: 70, to: 180, label: 'A' }] },
    '下面是一直線，是平角 180 度。', '180 － 70 ＝ 110 度。'),
  c6: compute('g4u3-v-c2', 130,
    { rays: [0, 90, 130], arcs: [{ from: 0, to: 90, label: '∟' }, { from: 90, to: 130, label: '40°' }, { from: 0, to: 130, label: 'A', level: 1 }] },
    '∠A 是一個直角再加 40 度。', '90 ＋ 40 ＝ 130 度。'),
  puzzle5: n('g4u3-paper-p1', '小玲畫了 ∠ㄅ，5 個 ∠ㄅ 合起來可以拼成一個平角。∠ㄅ 是幾度？', 36,
    '平角是 180 度，平分成 5 個一樣大的角。', '180 ÷ 5 ＝ 36 度。'),
  puzzle2: n('g4u3-paper-p2', '小立畫了 ∠ㄆ，2 個 ∠ㄆ 合起來可以拼成一個直角。∠ㄆ 是幾度？', 45,
    '直角是 90 度，平分成 2 個。', '90 ÷ 2 ＝ 45 度。'),
  puzzle3: n('g4u3-paper-p3', '小慶畫了 ∠ㄇ，3 個 ∠ㄇ 合起來可以拼成一個周角。∠ㄇ 是幾度？', 120,
    '周角是轉一整圈，360 度，平分成 3 個。', '360 ÷ 3 ＝ 120 度。'),
} satisfies Record<string, Question>

export const g4u3: Unit = {
  id: 'g4u3',
  number: 3,
  grade: 4,
  subject: '數學',
  title: '角度',
  source: '4上單元卷03（南一）',
  tasks: [
    {
      id: 'g4u3-t1', skill: '銳角、直角、鈍角', title: '角的種類', icon: '📐', blurb: '比直角大還是小？',
      questions: [Q.k1, Q.k2, Q.k3, Q.k4, Q.k5, Q.k6, Q.k7],
    },
    {
      id: 'g4u3-t2', skill: '用量角器量角', title: '量角器', icon: '🧭', blurb: '對準 0，看另一條邊指到哪裡。',
      questions: [Q.m140, Q.m60, Q.m30, Q.m110, Q.m170, Q.straw],
    },
    {
      id: 'g4u3-t3', skill: '畫出指定的角', title: '畫角', icon: '✍️', blurb: '把邊拖到正確的度數。',
      questions: [Q.d160, Q.d45, Q.d75, Q.d120, Q.d135],
    },
    {
      id: 'g4u3-t4', skill: '角度的計算', title: '角度拼圖', icon: '🧩', blurb: '直角 90、平角 180、周角 360。',
      questions: [Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6, Q.puzzle5, Q.puzzle2, Q.puzzle3],
    },
  ],
  boss: {
    id: 'g4u3-boss', skill: '整份單元', title: '單元三魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.k1, Q.k2, Q.k3, Q.k4, Q.m140, Q.m60, Q.straw, Q.d160,
      Q.c1, Q.c2, Q.c3, Q.c4, Q.puzzle5, Q.puzzle2, Q.puzzle3,
    ],
  },
}
