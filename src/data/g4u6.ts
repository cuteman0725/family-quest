import type { NumberQ, Question, TriangleQ, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷06三角形(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。
// 卷子上的「用尺畫等腰三角形、正三角形」要在紙上畫，沒有放進 App。

const SUM_HINT = '三角形的三個角合起來一定是 180 度（撕下來拼起來剛好一直線），用 180 減掉知道的角。'
const KIND_HINT = '看最大的那個角：比 90 度小是銳角三角形，剛好 90 度是直角三角形，比 90 度大是鈍角三角形。'
const SIDES_HINT = '三個角都一樣（都是 60 度）是正三角形；有兩個角一樣是等腰三角形。'

const missing = (id: string, angles: [number, number, number], unknown: 0 | 1 | 2, prompt = '算算看，「?」那個角是幾度？'): TriangleQ => ({
  id, type: 'triangle', ask: 'missing', angles, unknown, prompt,
  hint: SUM_HINT,
  explain: `180 － ${angles.filter((_, i) => i !== unknown).join(' － ')} ＝ ${angles[unknown]} 度。`,
})

const kind = (id: string, angles: [number, number, number], prompt = '這是銳角、直角，還是鈍角三角形？'): TriangleQ => ({
  id, type: 'triangle', ask: 'kind', angles, prompt, hint: KIND_HINT,
  explain: `最大的角是 ${Math.max(...angles)} 度，所以是${Math.max(...angles) < 90 ? '銳角' : Math.max(...angles) === 90 ? '直角' : '鈍角'}三角形。`,
})

const sides = (id: string, angles: [number, number, number]): TriangleQ => {
  const [a, b, c] = angles
  const name = a === b && b === c ? '正三角形' : a === b || b === c || a === c ? '等腰三角形' : '一般的三角形，不是正三角形也不是等腰三角形'
  return {
    id, type: 'triangle', ask: 'sides', angles, prompt: '這個三角形是正三角形、等腰三角形，還是都不是？',
    hint: SIDES_HINT, explain: `三個角是 ${a}、${b}、${c} 度，是${name}。`,
  }
}

const n = (id: string, prompt: string, answer: number, unit: string, hint: string, explain: string, context?: string): NumberQ => ({
  id, type: 'number', prompt, answers: [String(answer)], unit, hint, explain, context,
})

const congruent = [
  '△ABC 和 △GEF 是全等三角形，A 對應 G、B 對應 E、C 對應 F。',
  '△ABC：AB ＝ 8 公分，AC ＝ 6 公分，∠C ＝ 60°',
  '△GEF：EF ＝ 9 公分，∠E ＝ 40°，∠G ＝ 80°',
].join('\n')
const CONGRUENT_HINT = '全等三角形可以完全疊在一起，對應的邊一樣長、對應的角一樣大。先找出這條邊（這個角）對應到哪裡。'

const folding = [
  '把四張紙對摺，沿著虛線剪開。摺線那一邊的角和下面的角分別是：',
  '甲：45° 和 45°　乙：40° 和 50°',
  '丙：30° 和 60°　丁：60° 和 30°',
].join('\n')
const FOLD_HINT = '對摺剪下來，攤開後摺線上的角會變成 2 倍，下面兩個角一樣大。算出攤開後的三個角再判斷。'

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string, context?: string): Question => ({
  id, type: 'choice', prompt, options, answer, hint, explain, context,
})

const Q = {
  // 三角形內角和
  iso110: missing('g4u6-paper-a1', [35, 35, 110], 1, '這是一個等腰三角形，兩個角分別是 110 度和 35 度，「?」那個角是幾度？'),
  a1: missing('g4u6-v-a1', [60, 70, 50], 2),
  a2: missing('g4u6-v-a2', [90, 35, 55], 2),
  a3: missing('g4u6-v-a3', [40, 40, 100], 2),
  a4: missing('g4u6-v-a4', [25, 30, 125], 1),

  // 銳角、直角、鈍角三角形
  k79: kind('g4u6-paper-k1', [79, 52, 49], '有一個三角形的三個角分別是 79 度、52 度和 49 度，它是銳角、直角，還是鈍角三角形？'),
  k107: kind('g4u6-paper-k2', [48, 25, 107], '有一個三角形的三個角分別是 48 度、107 度和 25 度，它是銳角、直角，還是鈍角三角形？'),
  k90: kind('g4u6-v-k1', [90, 30, 60]),
  k100: kind('g4u6-v-k2', [40, 40, 100]),
  k60: kind('g4u6-v-k3', [60, 60, 60]),
  k50: kind('g4u6-v-k4', [50, 40, 90]),

  // 正三角形與等腰三角形
  per48: n('g4u6-paper-s1', '有一個邊長 16 公分的正三角形，它的周長是幾公分？', 48, '公分', '正三角形的三條邊一樣長，周長是三條邊加起來。', '16 × 3 ＝ 48 公分。'),
  side35: n('g4u6-paper-s2', '用一條長 105 公分的繩子圍成一個最大的正三角形，這個正三角形的邊長是幾公分？', 35, '公分', '繩子全部用完，平分成一樣長的三條邊。', '105 ÷ 3 ＝ 35 公分。'),
  leg35: n('g4u6-paper-s3', '有一個等腰三角形的周長是 100 公分，它的底邊是 30 公分，它的一腰長是幾公分？', 35, '公分', '等腰三角形的兩腰一樣長：先用周長減掉底邊，剩下的是兩腰，再分成兩半。', '100 － 30 ＝ 70，70 ÷ 2 ＝ 35 公分。'),
  sEq: sides('g4u6-v-s1', [60, 60, 60]),
  sIso: sides('g4u6-v-s2', [70, 70, 40]),
  sNone: sides('g4u6-v-s3', [50, 60, 70]),
  tf60: {
    id: 'g4u6-v-tf1', type: 'trueFalse', prompt: '正三角形的三個角都是 60 度。', answer: true,
    hint: '三個角一樣大，合起來是 180 度。', explain: '對。180 ÷ 3 ＝ 60，每個角都是 60 度。',
  },

  // 全等三角形
  bc: n('g4u6-paper-c1', 'BC 的對應邊是 EF，BC 是幾公分？', 9, '公分', CONGRUENT_HINT, 'BC 對應 EF，一樣長，是 9 公分。', congruent),
  ge: n('g4u6-paper-c2', 'GE 的對應邊是 AB，GE 是幾公分？', 8, '公分', CONGRUENT_HINT, 'GE 對應 AB，一樣長，是 8 公分。', congruent),
  gf: n('g4u6-paper-c3', 'GF 的對應邊是 AC，GF 是幾公分？', 6, '公分', CONGRUENT_HINT, 'GF 對應 AC，一樣長，是 6 公分。', congruent),
  angA: n('g4u6-paper-c4', '∠A 是幾度？', 80, '度', CONGRUENT_HINT, 'A 對應 G，∠A ＝ ∠G ＝ 80 度。', congruent),
  angB: n('g4u6-paper-c5', '∠B 是幾度？', 40, '度', CONGRUENT_HINT, 'B 對應 E，∠B ＝ ∠E ＝ 40 度。', congruent),
  angF: n('g4u6-paper-c6', '∠F 是幾度？', 60, '度', CONGRUENT_HINT, 'F 對應 C，∠F ＝ ∠C ＝ 60 度。', congruent),
  perim: n('g4u6-paper-c7', '兩個三角形的周長都是幾公分？', 23, '公分', '周長是三條邊加起來：AB、BC、AC。BC 和 EF 一樣長。', '8 ＋ 9 ＋ 6 ＝ 23 公分。', congruent),

  // 摺紙剪三角形
  foldEq: choice('g4u6-paper-f1', '小鴻說：「我剪下來的紙攤開後是正三角形。」小鴻剪的是哪一張紙？', ['甲', '乙', '丙', '丁'], 2,
    FOLD_HINT, '丙攤開後是 60°、60°、60°（30 × 2 ＝ 60），是正三角形。', folding),
  foldObtuse: choice('g4u6-paper-f2', '小媛說：「我剪下來的紙攤開後是鈍角三角形。」小媛剪的是哪一張紙？', ['甲', '乙', '丙', '丁'], 3,
    FOLD_HINT, '丁攤開後頂角是 60 × 2 ＝ 120 度，比 90 度大，是鈍角三角形。', folding),
  foldRight: choice('g4u6-paper-f3', '小章說：「我剪下來的紙攤開後是直角三角形。」小章剪的是哪一張紙？', ['甲', '乙', '丙', '丁'], 0,
    FOLD_HINT, '甲攤開後頂角是 45 × 2 ＝ 90 度，是直角三角形。', folding),
  foldSame: choice('g4u6-paper-f4', '乙攤開後的三角形，和下面哪一個三角形全等？',
    ['A：40°、50°、90°', 'B：50°、40°、90°', 'C：80°、50°、50°', 'D：100°、40°、40°'], 2,
    FOLD_HINT, '乙攤開後頂角 40 × 2 ＝ 80 度，下面兩個角都是 50 度，和 C 一樣。', folding),
} satisfies Record<string, Question>

export const g4u6: Unit = {
  id: 'g4u6',
  number: 6,
  grade: 4,
  subject: '數學',
  title: '三角形',
  source: '4上單元卷06（南一）',
  tasks: [
    {
      id: 'g4u6-t1', skill: '三角形內角和', title: '找出缺的角', icon: '🔺', blurb: '三個角加起來是 180 度。',
      questions: [Q.iso110, Q.a1, Q.a2, Q.a3, Q.a4],
    },
    {
      id: 'g4u6-t2', skill: '銳角、直角、鈍角三角形', title: '三角形分類', icon: '📐', blurb: '看最大的那個角。',
      questions: [Q.k79, Q.k107, Q.k90, Q.k100, Q.k60, Q.k50],
    },
    {
      id: 'g4u6-t3', skill: '正三角形與等腰三角形', title: '正三角形和等腰', icon: '🔷', blurb: '邊一樣長、角一樣大。',
      questions: [Q.per48, Q.side35, Q.leg35, Q.sEq, Q.sIso, Q.sNone, Q.tf60],
    },
    {
      id: 'g4u6-t4', skill: '全等三角形', title: '全等三角形', icon: '🪞', blurb: '對應的邊和角一樣大。',
      questions: [Q.bc, Q.ge, Q.gf, Q.angA, Q.angB, Q.angF, Q.perim],
    },
    {
      id: 'g4u6-t5', skill: '摺紙剪三角形', title: '剪紙遊戲', icon: '✂️', blurb: '攤開後會是什麼三角形？',
      questions: [Q.foldEq, Q.foldObtuse, Q.foldRight, Q.foldSame],
    },
  ],
  boss: {
    id: 'g4u6-boss', skill: '整份單元', title: '單元六魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.iso110, Q.per48, Q.side35, Q.leg35, Q.k79, Q.k107,
      Q.bc, Q.ge, Q.gf, Q.angA, Q.angB, Q.angF, Q.perim,
      Q.foldEq, Q.foldObtuse, Q.foldRight, Q.foldSame,
    ],
  },
}
