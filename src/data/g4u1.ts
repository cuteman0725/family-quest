import type { Question, Unit } from './types'

// 來源：瑄_4年級數學/4上/單面/教用/4上單元卷01一億以內的數(教).pdf
// 「paper」開頭的 id 是單元卷原題；「v」開頭的是同類型的練習變化題。

const travel = [
  '民國112、113年暑假出國到亞洲的人次：',
  '112年7月　112萬8885',
  '112年8月　108萬3486',
  '113年7月　146萬0736',
  '113年8月　144萬1044',
].join('\n')

const Q = {
  tf1: {
    id: 'g4u1-paper-tf1', type: 'trueFalse', prompt: '10000000 讀作一億。', answer: false,
    hint: '數一數有幾個 0。一億是 1 後面有 8 個 0。',
    explain: '10000000 只有 7 個 0，讀作「一千萬」。',
  },
  tf2: {
    id: 'g4u1-paper-tf2', type: 'trueFalse', prompt: '20100600 讀作二千零一十萬零六百。', answer: true,
    hint: '從右邊每四位切一段：2010｜0600。',
    explain: '2010 萬 0600，讀作二千零一十萬零六百，是對的。',
  },
  tf3: {
    id: 'g4u1-paper-tf3', type: 'trueFalse', prompt: '最大的八位數是 90000000。', answer: false,
    hint: '想要最大，每一位都要放最大的數字。',
    explain: '最大的八位數是 99999999。',
  },
  tf4: {
    id: 'g4u1-paper-tf4', type: 'trueFalse', prompt: '最小的八位數是 10000001。', answer: false,
    hint: '最高位放 1，其他位都放最小的數字。',
    explain: '最小的八位數是 10000000。',
  },
  tf5: {
    id: 'g4u1-paper-tf5', type: 'trueFalse', prompt: '一億是九位數。', answer: true,
    hint: '一億寫成 100000000，數數看有幾位。',
    explain: '100000000 有 9 位，所以一億是九位數。',
  },
  tf6: {
    id: 'g4u1-paper-tf6', type: 'trueFalse', prompt: '「七千二百萬零五十」用阿拉伯數字記作「7200050」。', answer: false,
    hint: '七千二百萬是 7200 萬，後面還要有四位。',
    explain: '7200 萬 0050，要記作 72000050。',
  },
  tfv1: {
    id: 'g4u1-v-tf1', type: 'trueFalse', prompt: '30405000 讀作三千零四十萬五千。', answer: true,
    hint: '每四位切一段：3040｜5000。',
    explain: '3040 萬 5000，讀作三千零四十萬五千，是對的。',
  },
  tfv2: {
    id: 'g4u1-v-tf2', type: 'trueFalse', prompt: '6000 萬和 60000000 一樣大。', answer: true,
    hint: '把 6000 萬後面補上 4 個 0 試試看。',
    explain: '6000 萬 = 60000000，一樣大。',
  },

  match1: {
    id: 'g4u1-v-match1', type: 'match', prompt: '連連看：把數字和正確的讀法連起來。',
    pairs: [
      ['10239705', '一千零二十三萬九千七百零五'],
      ['10329750', '一千零三十二萬九千七百五十'],
      ['1035976', '一百零三萬五千九百七十六'],
      ['1036975', '一百零三萬六千九百七十五'],
      ['12039075', '一千二百零三萬九千零七十五'],
    ],
    hint: '先從右邊每四位切一段，前面那段是「幾萬」。',
  },
  match2: {
    id: 'g4u1-v-match2', type: 'match', prompt: '連連看：數字有好多 0，小心看！',
    pairs: [
      ['50060000', '五千零六萬'],
      ['5060000', '五百零六萬'],
      ['50006000', '五千萬六千'],
      ['500600', '五十萬零六百'],
    ],
    hint: '先數有幾位數，再每四位切一段。',
  },
  ch8digit: {
    id: 'g4u1-v-ch1', type: 'choice', prompt: '一千萬是幾位數？', options: ['七位數', '八位數', '九位數'], answer: 1,
    hint: '一千萬寫成 10000000，數數看有幾位。',
    explain: '10000000 有 8 位，是八位數。',
  },
  ch10m: {
    id: 'g4u1-v-ch2', type: 'choice', prompt: '10 個一千萬合起來是多少？', options: ['一千萬', '一億', '十億'], answer: 1,
    hint: '10 個一萬是十萬，10 個一千萬就再往前一位。',
    explain: '10 個一千萬是一億。',
  },
  n8015400: {
    id: 'g4u1-paper-n4', type: 'number', prompt: '「八百零一萬五千四百」用阿拉伯數字記作？', answers: ['8015400'],
    hint: '先寫「八百零一萬」= 801 萬，後面四位是 5400。',
    explain: '801 萬 5400 = 8015400。',
  },
  n40090030: {
    id: 'g4u1-v-n1', type: 'number', prompt: '「四千零九萬零三十」用阿拉伯數字記作？', answers: ['40090030'],
    hint: '四千零九萬 = 4009 萬，後面四位是 0030。',
    explain: '4009 萬 0030 = 40090030。',
  },

  pv2: {
    id: 'g4u1-paper-pv1', type: 'choice', prompt: '26075 可以分成 2 個（　），這個空格要填什麼？',
    options: ['萬', '千', '百', '十', '一'], answer: 0,
    hint: '26075 是五位數，最左邊那一位是什麼位？',
    explain: '2 在萬位，所以是 2 個萬。',
  },
  pv6: {
    id: 'g4u1-paper-pv2', type: 'choice', prompt: '26075 可以分成 6 個（　），這個空格要填什麼？',
    options: ['萬', '千', '百', '十', '一'], answer: 1,
    hint: '從右邊數：一、十、百、千、萬，6 在第幾位？',
    explain: '6 在千位，所以是 6 個千。',
  },
  pv7: {
    id: 'g4u1-paper-pv3', type: 'choice', prompt: '26075 可以分成 7 個（　），這個空格要填什麼？',
    options: ['萬', '千', '百', '十', '一'], answer: 3,
    hint: '百位是 0，7 在百位的右邊。',
    explain: '7 在十位，所以是 7 個十。',
  },
  pv47: {
    id: 'g4u1-v-pv1', type: 'choice', prompt: '47302815 中的 7 在哪一位？',
    options: ['千萬位', '百萬位', '十萬位', '萬位'], answer: 1,
    hint: '八位數最左邊是千萬位，再往右一位呢？',
    explain: '4 在千萬位，7 在百萬位。',
  },
  n306009: {
    id: 'g4u1-paper-n2', type: 'number', prompt: '3 個十萬、6 個千和 9 個一合起來是多少？', answers: ['306009'],
    hint: '十萬位寫 3，千位寫 6，一位寫 9，其他位補 0。',
    explain: '300000 + 6000 + 9 = 306009。',
  },
  n1000000: {
    id: 'g4u1-paper-n3', type: 'number', prompt: '10 個 10 萬合起來是多少？（用阿拉伯數字）', answers: ['1000000'],
    hint: '10 個 10 萬就是 100 萬。',
    explain: '100 萬 = 1000000。',
  },
  n5020300: {
    id: 'g4u1-v-n2', type: 'number', prompt: '5 個百萬、2 個萬和 3 個百合起來是多少？', answers: ['5020300'],
    hint: '百萬位寫 5，萬位寫 2，百位寫 3，其他位補 0。',
    explain: '5000000 + 20000 + 300 = 5020300。',
  },
  nMillions: {
    id: 'g4u1-paper-n6a', type: 'number', prompt: '12854176 的百萬位數字是多少？', answers: ['2'],
    hint: '八位數從左邊數：千萬、百萬、十萬、萬…',
    explain: '1 在千萬位，2 在百萬位。',
  },
  nTenThousands: {
    id: 'g4u1-paper-n6b', type: 'number', prompt: '12854176 的萬位數字是多少？', answers: ['5'],
    hint: '從右邊數：一、十、百、千、萬。',
    explain: '從右邊數第 5 位是 5，在萬位。',
  },

  cmp1: {
    id: 'g4u1-paper-cmp1', type: 'compare', prompt: '比比看（? 是 0～9 的任一個數字）', left: '84?6600', right: '8396666', answer: '>',
    hint: '位數一樣多，就從最左邊一位一位比。',
    explain: '前兩位 84 比 83 大，不管 ? 是多少，左邊都比較大。',
  },
  cmp2: {
    id: 'g4u1-paper-cmp2', type: 'compare', prompt: '比比看（? 是 0～9 的任一個數字）', left: '5000?120', right: '50010000', answer: '<',
    hint: '把 ? 想成最大的 9，左邊會比右邊大嗎？',
    explain: '就算 ? 是 9，50009120 還是比 50010000 小。',
  },
  cmp3: {
    id: 'g4u1-paper-cmp3', type: 'compare', prompt: '比比看（? 是 0～9 的任一個數字）', left: '9990000', right: '999?001', answer: '<',
    hint: '把 ? 想成最小的 0，右邊是多少？',
    explain: '就算 ? 是 0，9990001 還是比 9990000 大，所以左邊比較小。',
  },
  cmp4: {
    id: 'g4u1-paper-cmp4', type: 'compare', prompt: '比比看（? 是 0～9 的任一個數字）', left: '1000000', right: '7?9999', answer: '>',
    hint: '先數數看兩邊各是幾位數。',
    explain: '1000000 是七位數，7?9999 只有六位數，七位數比較大。',
  },
  cmpv1: {
    id: 'g4u1-v-cmp1', type: 'compare', prompt: '比比看', left: '6789萬', right: '67890000', answer: '=',
    hint: '把「萬」換成 4 個 0。',
    explain: '6789 萬 = 67890000，一樣大。',
  },
  cmpv2: {
    id: 'g4u1-v-cmp2', type: 'compare', prompt: '比比看', left: '4300萬', right: '43000001', answer: '<',
    hint: '4300 萬寫成阿拉伯數字是多少？',
    explain: '4300 萬 = 43000000，比 43000001 少 1。',
  },
  dig1: {
    id: 'g4u1-paper-dig1', type: 'digits', prompt: '95□7428 > 9567400，□ 可以是哪些數字？（全部選出來）', answer: [6, 7, 8, 9],
    hint: '前兩位一樣，比第三位：□ 和 6 比。□ 剛好是 6 的時候也要比後面。',
    explain: '□ 是 7、8、9 一定比較大；□ 是 6 時，9567428 也比 9567400 大。',
  },
  digv1: {
    id: 'g4u1-v-dig1', type: 'digits', prompt: '3□56000 < 3456000，□ 可以是哪些數字？（全部選出來）', answer: [0, 1, 2, 3],
    hint: '第一位一樣是 3，比第二位：□ 和 4 比。',
    explain: '□ 比 4 小才會比較小；□ 是 4 時兩數一樣大，不算。',
  },

  wp1: {
    id: 'g4u1-paper-wp1', type: 'number', paper: true, unit: '萬個',
    prompt: '王叔叔的工廠這個月生產 190 萬個橡皮擦，比上個月多 47 萬個。上個月生產幾萬個？',
    answers: ['143'],
    hint: '這個月比較多，上個月要用減的：190 萬 − 47 萬。',
    explain: '190 萬 − 47 萬 = 143 萬。',
  },
  wp2: {
    id: 'g4u1-paper-wp2', type: 'number', paper: true, unit: '公斤',
    prompt: '甲地今年高粱收成比去年少了約 1310000 公斤，今年收成約 2520000 公斤。去年收成約多少公斤？',
    answers: ['3830000'],
    hint: '今年比較少，去年要用加的。',
    explain: '2520000 + 1310000 = 3830000。',
  },
  wp3: {
    id: 'g4u1-paper-wp3', type: 'number', paper: true, unit: '人次', context: travel,
    prompt: '民國 112 年 7 月和 8 月，出國到亞洲地區共有多少人次？',
    answers: ['2212371'],
    hint: '112 萬 8885 + 108 萬 3486，萬的部分和後四位分開加，記得進位。',
    explain: '112 萬 8885 + 108 萬 3486 = 221 萬 2371。',
  },
  wp4: {
    id: 'g4u1-paper-wp4', type: 'number', paper: true, unit: '人次', context: travel,
    prompt: '民國 113 年 7 月和 8 月，出國到亞洲地區共有多少人次？',
    answers: ['2901780'],
    hint: '146 萬 0736 + 144 萬 1044。',
    explain: '146 萬 0736 + 144 萬 1044 = 290 萬 1780。',
  },
  wp5: {
    id: 'g4u1-paper-wp5', type: 'number', paper: true, unit: '人次', context: travel,
    prompt: '113 年 7、8 月和 112 年 7、8 月出國到亞洲的人次，相差多少？',
    answers: ['689409'],
    hint: '用前兩題的答案相減：2901780 − 2212371。',
    explain: '290 萬 1780 − 221 萬 2371 = 68 萬 9409。',
  },
  wp6: {
    id: 'g4u1-paper-wp6', type: 'number', paper: true,
    prompt: '用 2、0、1、7、4 排成的五位數中，最大的數和最小的數相差多少？',
    answers: ['63963'],
    hint: '最大：大的數字放前面。最小：0 不能放最前面喔。',
    explain: '最大 74210，最小 10247，74210 − 10247 = 63963。',
  },
  n1yi: {
    id: 'g4u1-paper-n5', type: 'number', prompt: '九千萬再加一千萬是幾億？', answers: ['1'], unit: '億',
    hint: '9000 萬 + 1000 萬 = 10000 萬，10000 萬是多少？',
    explain: '10000 萬 = 1 億。',
  },
} satisfies Record<string, Question>

export const g4u1: Unit = {
  id: 'g4u1',
  grade: 4,
  subject: '數學',
  title: '一億以內的數',
  source: '4上單元卷01（南一）',
  tasks: [
    {
      id: 'g4u1-t1', skill: '判斷讀法對錯', title: '讀數字偵探', icon: '🔍', blurb: '判斷對或錯，抓出讀錯的數字！',
      questions: [Q.tf1, Q.tf2, Q.tf3, Q.tf4, Q.tf5, Q.tf6, Q.tfv1, Q.tfv2],
    },
    {
      id: 'g4u1-t2', skill: '數字讀寫', title: '數字連連看', icon: '🔗', blurb: '把數字和讀法配對，再把讀法寫成數字。',
      questions: [Q.match1, Q.match2, Q.ch8digit, Q.ch10m, Q.n8015400, Q.n40090030],
    },
    {
      id: 'g4u1-t3', skill: '位值', title: '位值積木', icon: '🧱', blurb: '每個數字住在哪一位？',
      questions: [Q.pv2, Q.pv6, Q.pv7, Q.pv47, Q.n306009, Q.n1000000, Q.n5020300, Q.nMillions],
    },
    {
      id: 'g4u1-t4', skill: '比大小', title: '數字天秤', icon: '⚖️', blurb: '哪邊比較大？讓天秤告訴你。',
      questions: [Q.cmp1, Q.cmp2, Q.cmp3, Q.cmp4, Q.cmpv1, Q.cmpv2, Q.dig1, Q.digv1],
    },
    {
      id: 'g4u1-t5', skill: '大數應用題', title: '應用題工坊', icon: '📝', blurb: '拿出紙筆算一算，再把答案填進來。',
      questions: [Q.wp1, Q.wp2, Q.wp3, Q.wp4, Q.wp5, Q.wp6],
    },
  ],
  boss: {
    id: 'g4u1-boss', skill: '整份單元', title: '單元一魔王', icon: '🐉', blurb: '整份單元卷，交卷後才知道答案！',
    questions: [
      Q.tf1, Q.tf2, Q.tf3, Q.tf4, Q.tf5, Q.tf6,
      Q.pv2, Q.pv6, Q.pv7, Q.n306009, Q.n1000000, Q.n8015400, Q.n1yi, Q.nMillions, Q.nTenThousands,
      Q.dig1, Q.wp6, Q.cmp1, Q.cmp2, Q.cmp3, Q.cmp4,
      Q.wp1, Q.wp2, Q.wp3, Q.wp4, Q.wp5,
    ],
  },
}
