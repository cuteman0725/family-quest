import type { ChoiceQ, MatchQ, NumberQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/1上/PDF/04_國小國語1上單課卷_第04課_(教).pdf
// 「paper」開頭的 id 是單課卷原題。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「寫國字」改成國字和注音連連看；「造詞」要自己想語詞，App 沒有放。

const match = (id: string, prompt: string, pairs: [string, string][], hint: string, explain: string): MatchQ => ({
  id, type: 'match', prompt, pairs, hint, explain,
})

const common = (id: string, a: string, b: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${a}　${b}`, prompt: '這兩個字，有哪一個相同的部分？', options, answer: options.indexOf(answer),
  hint: '把兩個字拆開來看，找一找兩個字都有的那一塊。', explain: `「${a}」和「${b}」都有「${answer}」。`,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain: `「${wrongChar}」要改成「${right}」。`,
})

const extra = (id: string, sentence: string, wrongChar: string, fixed: string): TypoQ => ({
  id, type: 'typo', extra: true, prompt: '句子裡多了一個字，把它點掉。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options: [], answer: -1, hint: '一個字一個字慢慢念，哪一個字念起來怪怪的、可以拿掉？', explain: `拿掉「${wrongChar}」：${fixed}`,
})

const strokes = (id: string, char: string, n: number): NumberQ => ({
  id, type: 'number', picture: char, prompt: '這個字一共有幾畫？', answers: [String(n)], unit: '畫',
  hint: '用手指在桌上一筆一筆寫，邊寫邊數。', explain: `「${char}」一共 ${n} 畫。`,
})

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const PUNCT = ['，', '。']
const punct = (id: string, sentence: string, answer: string, why: string): ChoiceQ => ({
  id, type: 'choice', prompt: `「${sentence}」空格要填逗號還是句號？`, options: PUNCT, answer: PUNCT.indexOf(answer),
  hint: '話還沒說完，要停一下用逗號；整句話說完了用句號。', explain: why,
})

const Q = {
  // 字和音
  m1: match('g1c9-paper-m1', '把字和它的注音連起來。', [['找', 'ㄓㄠˇ'], ['課', 'ㄎㄜˋ'], ['本', 'ㄅㄣˇ'], ['矮', 'ㄞˇ'], ['開', 'ㄎㄞ'], ['心', 'ㄒㄧㄣ']],
    '念念課文：「找到課本，小矮人真開心。」', '找到課本，小矮人真開心。'),
  m2: match('g1c9-paper-m2', '把字和它的注音連起來。', [['看', 'ㄎㄢˋ'], ['見', 'ㄐㄧㄢˋ'], ['兩', 'ㄌㄧㄤˇ'], ['隻', 'ㄓ'], ['青', 'ㄑㄧㄥ'], ['蛙', 'ㄨㄚ']],
    '念念課文：「看見兩隻大青蛙。」', '看見兩隻大青蛙。'),

  // 相同的部分
  p1: common('g1c9-paper-c1', '隻', '誰', ['口', '隹', '又'], '隹'),
  p2: common('g1c9-paper-c2', '青', '朋', ['月', '日', '主'], '月'),
  p3: common('g1c9-paper-c3', '開', '們', ['亻', '开', '門'], '門'),
  p4: common('g1c9-paper-c4', '了', '子', ['了', '一', '口'], '了'),
  p5: common('g1c9-paper-c5', '蛙', '在', ['虫', '土', '亻'], '土'),
  p6: common('g1c9-paper-c6', '課', '這', ['言', '果', '辶'], '言'),

  // 錯字偵探
  t1: typo('g1c9-paper-t1', '過生日真開新。', '新', ['心', '星', '親'], '心', '很快樂叫做「開心」。'),
  t2: typo('g1c9-paper-t2', '小青哇愛唱歌。', '哇', ['蛙', '娃', '挖'], '蛙', '青蛙是動物，要有「虫」。'),
  t3: typo('g1c9-paper-t3', '哥哥的個了高。', '了', ['子', '字', '仔'], '子', '「個子」就是身高。'),
  t4: typo('g1c9-paper-t4', '我和妹妹手位手。', '位', ['拉', '啦', '垃'], '拉', '用手牽手，「拉」有提手旁。'),
  t5: typo('g1c9-paper-t5', '我們雨個人是好朋友。', '雨', ['兩', '雪', '而'], '兩', '一個、兩個的「兩」，不是下雨的雨。'),
  t6: typo('g1c9-paper-t6', '大樹上有三枝小鳥歡樂的唱著歌。', '枝', ['隻', '支', '只'], '隻', '小鳥要用「隻」來數。'),
  e1: extra('g1c9-paper-e1', '兩個子人，左看看，右找找。', '子', '兩個人，左看看，右找找。'),
  e2: extra('g1c9-paper-e2', '小個子，大個子，看看找找好有開心。', '有', '小個子，大個子，看看找找好開心。'),

  // 量詞與標點
  cup: choice('g1c9-paper-q1', '弟弟喝了一（　）牛奶。', ['本', '杯'], 1, '牛奶裝在杯子裡。', '一杯牛奶。'),
  umbrella: choice('g1c9-paper-q2', '下雨了，老師借我一（　）雨傘。', ['把', '隻'], 0, '雨傘要用手拿著，用「把」。', '一把雨傘。'),
  clothes: choice('g1c9-paper-q3', '這（　）衣服是媽媽買給我的。', ['片', '件'], 1, '衣服要用「件」來數。', '一件衣服。'),
  pc1: punct('g1c9-paper-d1', '天上的白雲好像在變魔術（　）一下子變成長頸鹿', '，', '後面還有話，要停一下，用逗號。'),
  pc2: punct('g1c9-paper-d2', '一下子又變成小白兔（　）', '。', '整句話說完了，用句號。'),
  pc3: punct('g1c9-paper-d3', '明天早上（　）姐姐要出門跑步', '，', '話還沒說完，用逗號停一下。'),
  comma: choice('g1c9-paper-x6', '一個句子還沒說完，要停一下的時候，要用哪一個標點符號？', ['逗號', '句號', '問號'], 0,
    '停一下、還要接著說。', '還沒說完要停一下，用逗號。'),

  // 筆畫與讀音
  n1: strokes('g1c9-paper-n1', '青', 8),
  n2: strokes('g1c9-paper-n2', '開', 12),
  n3: strokes('g1c9-paper-n3', '課', 15),
  zi: choice('g1c9-paper-x1', '下面哪一個「子」的讀音和其他的不一樣？', ['車子', '種子', '扇子'], 1,
    '念念看：車子、種子、扇子，哪一個「子」念得比較重？', '種子的「子」念第三聲，車子、扇子的「子」念輕聲。'),
  same: choice('g1c9-paper-x2', '下面哪兩個字的總筆畫數一樣多？', ['拉／看', '蛙／開', '兩／找'], 1,
    '一個一個數：蛙幾畫？開幾畫？', '蛙和開都是 12 畫。'),

  // 課文與句子
  bell: choice('g1c9-paper-x3', '「（　）的鐘聲響了，我們要趕快回教室。」空格要填哪一個？', ['下課', '早上', '上課'], 2,
    '要回教室，是要做什麼？', '上課的鐘聲響了，要回教室。'),
  extraWord: choice('g1c9-paper-x4', '「妹妹看到不是喜歡的玩具，高興得跳起來。」哪一個詞語是多餘的？', ['不是', '喜歡', '高興'], 0,
    '妹妹高興得跳起來，所以是喜歡還是不喜歡？', '「不是」要拿掉：妹妹看到喜歡的玩具，高興得跳起來。'),
  classmates: choice('g1c9-paper-x5', '〈大個子，小個子〉這一課，從哪裡看出大個子和小個子是同學？', ['手拉手', '一起上課', '一起玩'], 1,
    '同學會在哪裡一起做什麼？', '一起上課，所以是同學。'),
  intro: {
    id: 'g1c9-paper-s1', type: 'sort', order: 'steps', prompt: '自我介紹要先說什麼？依照順序排排看。',
    items: ['說出自己的名字', '向對方問好', '介紹自己喜歡做的事情'], steps: [1, 0, 2],
    hint: '見到人先打招呼，再說自己是誰。', explain: '先向對方問好，再說出名字，最後介紹喜歡做的事。',
  } satisfies SortQ,
  pattern: match('g1c9-paper-m3', '組成方式一樣的語詞，把它們連起來。', [['左看看', '右找找'], ['好開心', '真快樂'], ['手拉手', '面對面']],
    '像「大青蛙」和「小個子」：前面一個字，後面兩個字。', '左看看—右找找、好開心—真快樂、手拉手—面對面。'),
  good: choice('g1c9-paper-y1', '照樣寫：好開心。下面哪一個也可以接在「好」的後面？', ['幸福', '蘋果', '跑步'], 0,
    '要接一種心情，像開心一樣。', '好幸福：幸福也是一種心情。'),
  apple: choice('g1c9-paper-y2', '照樣寫：一隻大青蛙。一顆紅（　）', ['蘋果', '青蛙', '開心'], 0,
    '「一顆紅紅的」什麼？', '一顆紅蘋果。'),
} satisfies Record<string, Question>

export const g1c9: Unit = {
  id: 'g1c9',
  number: 9,
  grade: 1,
  subject: '國語',
  label: '1上第 4 課',
  title: '大個子，小個子',
  source: '國語1上單課卷 第 4 課（康軒）',
  tasks: [
    {
      id: 'g1c9-t1', skill: '國字和注音', title: '字和音', icon: '🔤', blurb: '看見兩隻大青蛙。',
      questions: [Q.m1, Q.m2],
    },
    {
      id: 'g1c9-t2', skill: '字的部件', title: '相同的部分', icon: '🧩', blurb: '隻和誰，哪裡一樣？',
      questions: [Q.p1, Q.p2, Q.p3, Q.p4, Q.p5, Q.p6],
    },
    {
      id: 'g1c9-t3', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '小青哇？雨個人？',
      questions: [Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6, Q.e1, Q.e2],
    },
    {
      id: 'g1c9-t4', skill: '量詞與標點', title: '一杯、一把、一件', icon: '☂️', blurb: '逗號還是句號？',
      questions: [Q.cup, Q.umbrella, Q.clothes, Q.pc1, Q.pc2, Q.pc3, Q.comma],
    },
    {
      id: 'g1c9-t5', skill: '筆畫與讀音', title: '數一數筆畫', icon: '✋', blurb: '課有幾畫？種子的子怎麼念？',
      questions: [Q.n1, Q.n2, Q.n3, Q.zi, Q.same],
    },
    {
      id: 'g1c9-t6', skill: '課文與句子', title: '大個子，小個子', icon: '🧍', blurb: '一起上課的好同學。',
      questions: [Q.bell, Q.extraWord, Q.classmates, Q.intro, Q.pattern, Q.good, Q.apple],
    },
  ],
  boss: {
    id: 'g1c9-boss', skill: '整份單課卷', title: '第四課魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.m1, Q.m2,
      Q.p1, Q.p2, Q.p3, Q.p4, Q.p5, Q.p6,
      Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6,
      Q.e1, Q.e2, Q.pc1, Q.pc2, Q.pc3,
      Q.cup, Q.umbrella, Q.clothes,
      Q.n1, Q.n2, Q.n3,
      Q.zi, Q.same, Q.bell, Q.extraWord, Q.classmates, Q.comma,
      Q.intro, Q.pattern, Q.good, Q.apple,
    ],
  },
}
