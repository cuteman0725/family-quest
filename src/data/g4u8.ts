import type { ChoiceQ, NumberQ, Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷08整數四則計算(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是練習變化題。

const ORDER_HINT = '算式的順序：括號先算；再算乘、除；最後算加、減。同一種的就由左往右算。'
const ONE_LINE_HINT = '先想「要先知道什麼」，那一步就放在括號裡，再接著算下一步。'

/** 兩個算式的答案一樣嗎？ */
const same = (id: string, left: string, right: string, isSame: boolean, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt: `「${left}」和「${right}」的答案一樣嗎？`, options: ['○ 一樣', '× 不一樣'], answer: isSame ? 0 : 1,
  hint: ORDER_HINT, explain,
})

const calc = (id: string, expr: string, answer: number, explain: string): NumberQ => ({
  id, type: 'number', prompt: `算算看：${expr}`, answers: [String(answer)], hint: ORDER_HINT, explain,
})

const word = (id: string, prompt: string, answer: number, unit: string, hint: string, explain: string, context?: string): NumberQ => ({
  id, type: 'number', prompt, answers: [String(answer)], unit, paper: true, hint, explain, context,
})

const yingge = [
  '新北市鶯歌區最著名的特產就是陶瓷工藝：',
  '有建築用的琉璃瓦、地磚、壁磚、衛浴設備，',
  '也有裝飾用的花瓶、裝飾品，以及茶壺、茶杯、碗盤等日常用品。',
  '當地的陶瓷博物館、陶瓷公園和陶瓷老街，每到假日都吸引很多遊客。',
].join('\n')

const Q = {
  // 括號的祕密
  s1: same('g4u8-paper-s1', '72 × 60 × 80', '(72 × 60) × 80', true, '連乘本來就由左往右，先算 72 × 60，加不加括號都一樣，都是 345600。'),
  s2: same('g4u8-paper-s2', '549 ＋ 321 － 270', '(549 ＋ 321) － 270', true, '加減由左往右，本來就先算 549 ＋ 321 ＝ 870，870 － 270 ＝ 600，兩邊一樣。'),
  s3: same('g4u8-paper-s3', '900 － (468 ＋ 302)', '900 － 468 ＋ 302', false, '左邊：900 － 770 ＝ 130；右邊：432 ＋ 302 ＝ 734，不一樣。'),
  s4: same('g4u8-paper-s4', '180 ÷ 6 ÷ 2', '180 ÷ (6 ÷ 2)', false, '左邊：30 ÷ 2 ＝ 15；右邊：180 ÷ 3 ＝ 60，不一樣。'),
  s5: same('g4u8-paper-s5', '19 ＋ 45 × 6', '(19 ＋ 45) × 6', false, '左邊先乘：19 ＋ 270 ＝ 289；右邊先算括號：64 × 6 ＝ 384，不一樣。'),
  s6: same('g4u8-paper-s6', '520 ÷ 13 － 9', '520 ÷ (13 － 9)', false, '左邊先除：40 － 9 ＝ 31；右邊先算括號：520 ÷ 4 ＝ 130，不一樣。'),
  s7: same('g4u8-v-s1', '300 － 120 － 80', '300 － (120 ＋ 80)', true, '連減兩個數，等於減掉它們的和：100 和 100 一樣。'),
  s8: same('g4u8-v-s2', '25 × 4 ＋ 6', '25 × (4 ＋ 6)', false, '左邊：100 ＋ 6 ＝ 106；右邊：25 × 10 ＝ 250，不一樣。'),

  // 先乘除、後加減
  c1: calc('g4u8-v-c1', '48 ＋ 72 ÷ 6', 60, '先除：72 ÷ 6 ＝ 12，再加：48 ＋ 12 ＝ 60。'),
  c2: calc('g4u8-v-c2', '(48 ＋ 72) ÷ 6', 20, '先算括號：48 ＋ 72 ＝ 120，再除：120 ÷ 6 ＝ 20。'),
  c3: calc('g4u8-v-c3', '500 － 25 × 8', 300, '先乘：25 × 8 ＝ 200，再減：500 － 200 ＝ 300。'),
  c4: calc('g4u8-v-c4', '36 ÷ (4 × 3)', 3, '先算括號：4 × 3 ＝ 12，再除：36 ÷ 12 ＝ 3。'),
  c5: calc('g4u8-v-c5', '(15 ＋ 25) × 4', 160, '先算括號：15 ＋ 25 ＝ 40，再乘：40 × 4 ＝ 160。'),

  // 用一個算式解題
  pickToy: {
    id: 'g4u8-v-w1', type: 'choice', context: '哥哥有 127 個公仔，妹妹有 63 個，弟弟比妹妹多 15 個，哥哥的公仔比弟弟多幾個？', prompt: '哪一個算式是對的？',
    options: ['127 － (63 ＋ 15)', '127 － 63 ＋ 15', '(127 － 63) － 15'], answer: 0,
    hint: '要先知道弟弟有幾個（63 ＋ 15），這一步要放在括號裡。', explain: '弟弟有 63 ＋ 15 個，哥哥比弟弟多 127 － (63 ＋ 15) 個。',
  } satisfies ChoiceQ,
  pickLunch: {
    id: 'g4u8-v-w2', type: 'choice', context: '爸爸買了 8 個一樣的便當，付 1000 元找回 320 元，一個便當多少元？', prompt: '哪一個算式是對的？',
    options: ['1000 － 320 ÷ 8', '(1000 － 320) ÷ 8', '1000 ÷ 8 － 320'], answer: 1,
    hint: '要先知道 8 個便當一共花多少錢（1000 － 320），再平分成 8 份。', explain: '先算花了 1000 － 320 元，要放在括號裡：(1000 － 320) ÷ 8。',
  } satisfies ChoiceQ,
  toys: word('g4u8-paper-w1', '哥哥有 127 個公仔，妹妹有 63 個，弟弟比妹妹多 15 個，哥哥的公仔比弟弟多幾個？', 49, '個',
    ONE_LINE_HINT, '127 － (63 ＋ 15) ＝ 127 － 78 ＝ 49 個。'),
  paper: word('g4u8-paper-w2', '老師把 690 張作文紙平分給 5 個班級，每個班級有 23 人，平均每人可以分到幾張作文紙？', 6, '張',
    '先算每班分到幾張，再分給班上的 23 人。', '690 ÷ 5 ÷ 23 ＝ 138 ÷ 23 ＝ 6 張。'),
  dress: word('g4u8-paper-w3', '洋裝每件 1150 元，姊姊買了 5 件，妹妹買了 3 件，一共要付多少元？', 9200, '元',
    '先算兩個人一共買幾件，再乘上一件的價錢。', '1150 × (5 ＋ 3) ＝ 1150 × 8 ＝ 9200 元。'),

  // 生活應用題
  mango: word('g4u8-paper-w4', '芒果園收成了 312 公斤的芒果，每 6 公斤裝成一箱，每箱賣 375 元，全部賣完共賣得多少元？', 19500, '元',
    '先算可以裝幾箱，再算賣得多少錢。', '375 × (312 ÷ 6) ＝ 375 × 52 ＝ 19500 元。'),
  lunch: word('g4u8-paper-w5', '爸爸買了 8 個相同的排骨便當，付給老闆 1000 元後找回 320 元，一個排骨便當賣多少元？', 85, '元',
    '先算 8 個便當一共多少錢，再平分成 8 份。', '(1000 － 320) ÷ 8 ＝ 680 ÷ 8 ＝ 85 元。'),
  balloons: word('g4u8-paper-w6', '運動會時需要準備 510 顆氣球，學生共有 136 人，每 4 人一組，每組要準備多少顆氣球？', 15, '顆',
    '先算有幾組，再把氣球平分給每一組。', '510 ÷ (136 ÷ 4) ＝ 510 ÷ 34 ＝ 15 顆。'),

  // 鶯歌陶瓷
  flute: word('g4u8-paper-y1', '友仁有 345 元，立欣有 282 元，兩個人的錢合起來剛好可以買 3 個相同的陶笛，一個陶笛賣多少元？', 209, '元',
    '先算兩個人的錢合起來有多少，再平分成 3 份。', '(345 ＋ 282) ÷ 3 ＝ 627 ÷ 3 ＝ 209 元。', yingge),
  plate: word('g4u8-paper-y2', '日常用品特價：4 個相同的碗賣 100 元，1 個盤子賣 88 元。一個盤子比一個碗貴多少元？', 63, '元',
    '先算一個碗多少錢（100 ÷ 4），再和盤子比。', '88 － 100 ÷ 4 ＝ 88 － 25 ＝ 63 元。', yingge),
  teaSet: word('g4u8-v-y1', '一個茶壺賣 450 元，一個茶杯賣 85 元。媽媽買 1 個茶壺和 6 個茶杯，一共要付多少元？', 960, '元',
    '先算 6 個茶杯多少錢，再加上茶壺。乘法會先算，不用括號。', '450 ＋ 85 × 6 ＝ 450 ＋ 510 ＝ 960 元。', yingge),
} satisfies Record<string, Question>

export const g4u8: Unit = {
  id: 'g4u8',
  number: 8,
  grade: 4,
  subject: '數學',
  title: '整數四則計算',
  source: '4上單元卷08（南一）',
  tasks: [
    {
      id: 'g4u8-t1', skill: '括號與計算順序', title: '括號的祕密', icon: '🔐', blurb: '加了括號，答案會變嗎？',
      questions: [Q.s1, Q.s2, Q.s3, Q.s4, Q.s5, Q.s6, Q.s7, Q.s8],
    },
    {
      id: 'g4u8-t2', skill: '先乘除後加減', title: '誰先算', icon: '🥇', blurb: '括號先算，再乘除，最後加減。',
      questions: [Q.c1, Q.c2, Q.c3, Q.c4, Q.c5],
    },
    {
      id: 'g4u8-t3', skill: '用一個算式解題', title: '一個算式', icon: '🧩', blurb: '把兩步驟寫成一個算式。',
      questions: [Q.pickToy, Q.pickLunch, Q.toys, Q.paper, Q.dress],
    },
    {
      id: 'g4u8-t4', skill: '四則應用題', title: '生活算算看', icon: '🥭', blurb: '芒果、便當、氣球怎麼算？',
      questions: [Q.mango, Q.lunch, Q.balloons],
    },
    {
      id: 'g4u8-t5', skill: '生活中的四則', title: '鶯歌陶瓷', icon: '🏺', blurb: '逛陶瓷老街買東西。',
      questions: [Q.flute, Q.plate, Q.teaSet],
    },
  ],
  boss: {
    id: 'g4u8-boss', skill: '整份單元', title: '單元八魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.s1, Q.s2, Q.s3, Q.s4, Q.s5, Q.s6,
      Q.toys, Q.paper, Q.dress, Q.mango, Q.lunch, Q.balloons,
      Q.flute, Q.plate,
    ],
  },
}
