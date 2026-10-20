import { clockExplain, clockText } from '../lib/answer'
import type { ChoiceQ, ClockQ, ClockTime, Question, SortQ, Unit } from './types'

// 來源：115上康軒/單元卷/02數學單元卷/1上/單面/教用/數學1上單元卷09_幾點鐘(教).pdf
// 「paper」開頭的 id 是單元卷原題（圖片改用 emoji、時鐘用畫的）；「v」開頭的是練習變化題。
// 一年級會自動朗讀，prompt 不放符號。

const READ_HINT = '短針（紅色、比較短）指著幾，就是幾點；長針（藍色、比較長）指著 12 是「點鐘」，指著 6 是「點半」。'
const HALF_HINT = '點半的時候，短針在兩個數字的中間，要看它剛剛走過的那一個數字。'

const t = (h: number, m: 0 | 30 = 0): ClockTime => ({ h, m })

const read = (id: string, time: ClockTime): ClockQ => ({
  id, type: 'clock', ask: 'read', time, prompt: '看看時鐘，現在是幾點？',
  hint: time.m === 0 ? READ_HINT : HALF_HINT, explain: clockExplain(time),
})

const pick = (id: string, prompt: string, options: ClockTime[], answer: number, context?: string): ClockQ => ({
  id, type: 'clock', ask: 'pick', options, answer, prompt, context,
  hint: READ_HINT, explain: `${clockText(options[answer])}：${clockExplain(options[answer])}`,
})

const longer = (id: string, prompt: string, options: string[], answer: number, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer,
  hint: '想一想，你做這兩件事的時候，哪一件要等比較久？', explain,
})

const steps = (id: string, prompt: string, items: string[], order: number[], explain: string): SortQ => ({
  id, type: 'sort', order: 'steps', items, steps: order, prompt,
  hint: '想一想，哪一件事要先做，後面的事才能接著做？', explain,
})

const park = '小杏下午 4 點鐘寫完功課後，媽媽帶她去公園玩，到公園的時間是下午 4 點半。他們玩到下午 5 點半才回家，開始吃晚餐的時間是晚上 7 點鐘。'
const parkClocks = [t(4, 30), t(5, 30), t(7), t(4)]

const Q = {
  // 事情的先後
  plant: steps('g1u9-paper-o1', '種一盆花，依照事情發生的先後排排看。', ['🌱 長出小芽', '🕳️ 放進種子', '🪴 長成大苗', '🚿 澆水'], [1, 3, 0, 2],
    '先放進種子，再澆水，然後長出小芽，最後長成大苗。'),
  times: steps('g1u9-paper-o2', '依照時間的先後排排看。', ['上午 8 點鐘', '上午 6 點半', '中午 12 點鐘'], [1, 0, 2],
    '上午 6 點半最早，接著上午 8 點鐘，中午 12 點鐘最晚。'),
  morning: steps('g1u9-v-o1', '早上起床後，依照事情的先後排排看。', ['🪥 刷牙', '⏰ 起床', '🎒 去上學'], [1, 0, 2],
    '先起床，再刷牙，最後去上學。'),

  // 時間的長短
  bath: longer('g1u9-paper-l1', '洗手和洗澡，做哪一件事花的時間比較長？', ['🧼 洗手', '🛁 洗澡'], 1, '洗澡要洗全身，花的時間比洗手長。'),
  meal: longer('g1u9-paper-l2', '吃飯和刷牙，做哪一件事花的時間比較長？', ['🍚 吃飯', '🪥 刷牙'], 0, '吃一餐飯要慢慢吃，花的時間比刷牙長。'),
  cartoon: longer('g1u9-v-l1', '看一集卡通和眨一下眼睛，哪一個花的時間比較長？', ['📺 看一集卡通', '👀 眨一下眼睛'], 0, '眨眼睛一下子就好，看一集卡通要比較久。'),

  // 幾點鐘
  r5: read('g1u9-paper-r1', t(5)),
  r8: read('g1u9-paper-r2', t(8)),
  r10: read('g1u9-paper-r3', t(10)),
  r3: read('g1u9-v-r1', t(3)),
  r12: read('g1u9-v-r2', t(12)),
  tfHour: {
    id: 'g1u9-v-t1', type: 'trueFalse', prompt: '7 點鐘的時候，短針指在 12。', answer: false,
    hint: READ_HINT, explain: '不對。7 點鐘是短針指在 7、長針指在 12。',
  },

  // 幾點半
  h11: read('g1u9-paper-h1', t(11, 30)),
  h2: read('g1u9-paper-h2', t(2, 30)),
  h9: read('g1u9-paper-h3', t(9, 30)),
  h6: read('g1u9-v-h1', t(6, 30)),
  tfHalf: {
    id: 'g1u9-v-t2', type: 'trueFalse', prompt: '3 點半的時候，長針指在 6。', answer: true,
    hint: READ_HINT, explain: '對。點半的時候長針指在 6，短針在 3 和 4 的中間。',
  },
  pickHalf: pick('g1u9-v-k1', '哪一個時鐘是 3 點半？', [t(3), t(3, 30), t(4, 30), t(2, 30)], 1),

  // 小杏的一天
  homework: pick('g1u9-paper-k1', '小杏寫完功課的時間，是哪一個時鐘？', parkClocks, 3, park),
  arrive: pick('g1u9-paper-k2', '小杏到公園的時間，是哪一個時鐘？', parkClocks, 0, park),
  home: pick('g1u9-paper-k3', '小杏回家的時間，是哪一個時鐘？', parkClocks, 1, park),
  dinner: pick('g1u9-paper-k4', '小杏開始吃晚餐的時間，是哪一個時鐘？', parkClocks, 2, park),
  pick12: pick('g1u9-v-k2', '哪一個時鐘是 12 點鐘？', [t(6), t(12, 30), t(12), t(11, 30)], 2),
} satisfies Record<string, Question>

export const g1u9: Unit = {
  id: 'g1u9',
  number: 9,
  grade: 1,
  subject: '數學',
  title: '幾點鐘',
  source: '數學1上單元卷09（康軒）',
  tasks: [
    {
      id: 'g1u9-t1', skill: '事情的先後與長短', title: '先做什麼', icon: '🌱', blurb: '哪一件先做？哪一件比較久？',
      questions: [Q.plant, Q.times, Q.morning, Q.bath, Q.meal, Q.cartoon],
    },
    {
      id: 'g1u9-t2', skill: '幾點鐘', title: '幾點鐘', icon: '🕐', blurb: '長針指 12，短針指幾就是幾點。',
      questions: [Q.r5, Q.r8, Q.r10, Q.r3, Q.r12, Q.tfHour],
    },
    {
      id: 'g1u9-t3', skill: '幾點半', title: '幾點半', icon: '🕧', blurb: '長針指 6，短針在中間。',
      questions: [Q.h11, Q.h2, Q.h9, Q.h6, Q.tfHalf, Q.pickHalf],
    },
    {
      id: 'g1u9-t4', skill: '生活中的時間', title: '小杏的一天', icon: '🏞️', blurb: '寫功課、去公園、吃晚餐。',
      questions: [Q.homework, Q.arrive, Q.home, Q.dinner, Q.pick12],
    },
  ],
  boss: {
    id: 'g1u9-boss', skill: '整份單元', title: '單元九魔王', icon: '🐲', blurb: '整份單元卷，做完才看答案！',
    questions: [
      Q.plant, Q.times, Q.bath, Q.meal,
      Q.r5, Q.r8, Q.r10, Q.h11, Q.h2, Q.h9,
      Q.homework, Q.arrive, Q.home, Q.dinner,
    ],
  },
}
