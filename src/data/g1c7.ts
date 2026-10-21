import type { BinsQ, ChoiceQ, MatchQ, NumberQ, Question, SortQ, TrueFalseQ, TypoQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/1上/PDF/02_國小國語1上單課卷_第02課_(教).pdf
// 「paper」開頭的 id 是單課卷原題（插圖改用 emoji）。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「寫國字」改成國字和注音連連看；「造詞」要自己想語詞，App 沒有放。

const match = (id: string, pairs: [string, string][], text: string): MatchQ => ({
  id, type: 'match', prompt: '把字和它的注音連起來。', pairs,
  hint: `念念課文：「${text}」一個字一個字對。`, explain: text,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain: `「${wrongChar}」要改成「${right}」。`,
})

const strokes = (id: string, char: string, n: number): NumberQ => ({
  id, type: 'number', picture: char, prompt: '這個字一共有幾畫？', answers: [String(n)], unit: '畫',
  hint: '用手指在桌上一筆一筆寫，邊寫邊數。', explain: `「${char}」一共 ${n} 畫。`,
})

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string, picture?: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain, picture,
})

const fact = (id: string, prompt: string, answer: boolean, explain: string): TrueFalseQ => ({
  id, type: 'trueFalse', prompt: `根據課文，「${prompt}」對不對？`, answer, hint: '想一想課文裡分積木的事。', explain,
})

const order = (id: string, items: string[], steps: number[], explain: string): SortQ => ({
  id, type: 'sort', order: 'steps', prompt: '把詞語排成通順的句子。', items, steps,
  hint: '先念念看，哪一個放在最前面最通順？', explain,
})

const Q = {
  // 字和音
  m1: match('g1c7-paper-m1', [['這', 'ㄓㄜˋ'], ['是', 'ㄕˋ'], ['誰', 'ㄕㄟˊ'], ['的', '˙ㄉㄜ'], ['書', 'ㄕㄨ']], '這是誰的書？'),
  m2: match('g1c7-paper-m2', [['我', 'ㄨㄛˇ'], ['多', 'ㄉㄨㄛ'], ['分', 'ㄈㄣ'], ['到', 'ㄉㄠˋ'], ['積', 'ㄐㄧ'], ['木', 'ㄇㄨˋ']], '我多分到了一個積木。'),
  m3: match('g1c7-paper-m3', [['啊', 'ㄚ'], ['了', '˙ㄌㄜ'], ['個', '˙ㄍㄜ'], ['真', 'ㄓㄣ'], ['好', 'ㄏㄠˇ']], '啊！我多分到了一個積木，真好！'),

  // 錯字偵探
  t1: typo('g1c7-paper-t1', '誰裡有隻貓。', '誰', ['這', '是', '的'], '這', '說的是「這個地方」。'),
  t2: typo('g1c7-paper-t2', '桌上多子一顆蘋果。', '子', ['了', '的', '是'], '了', '「多了」一顆，念念看。'),
  t3: typo('g1c7-paper-t3', '找喜歡和爺爺一起去散步。', '找', ['我', '他', '你'], '我', '是誰喜歡去散步？念念看。'),
  t4: typo('g1c7-paper-t4', '老師芬給大家不同的任務。', '芬', ['分', '粉', '份'], '分', '把東西給每一個人，是「分給」。'),
  t5: typo('g1c7-paper-t5', '姐姐的頭髮又黑又長，仔漂亮。', '仔', ['好', '子', '字'], '好', '很漂亮，也可以說「好漂亮」。'),
  t6: typo('g1c7-paper-t6', '放在我桌上的這本筆記本最誰的呢？', '最', ['是', '這', '的'], '是', '問「這本是誰的」。'),
  t7: typo('g1c7-paper-t7', '今天早上，妹妹吃了一固紅豆麵包。', '固', ['個', '古', '故'], '個', '一個麵包，「個」有人字旁。'),

  // 筆畫與部件
  n1: strokes('g1c7-paper-n1', '我', 7),
  n2: strokes('g1c7-paper-n2', '的', 8),
  n3: strokes('g1c7-paper-n3', '這', 11),
  n4: strokes('g1c7-paper-n4', '多', 6),
  n5: strokes('g1c7-paper-n5', '是', 9),
  parts: {
    id: 'g1c7-paper-h1', type: 'bins', prompt: '這些字裡面，藏著「口」還是「手」？把字放進對的籃子。', bins: ['有「口」', '有「手」或「扌」', '都沒有'],
    items: [{ label: '吸', bin: 0 }, { label: '多', bin: 2 }, { label: '抓', bin: 1 }, { label: '啊', bin: 0 }, { label: '喝', bin: 0 }, { label: '拳', bin: 1 }, { label: '右', bin: 0 }, { label: '把', bin: 1 }, { label: '叫', bin: 0 }, { label: '挖', bin: 1 }],
    hint: '找找看字裡有沒有一個方方的「口」，或是「扌」、「手」。', explain: '有口：吸、啊、喝、右、叫。有手：抓、拳、把、挖。都沒有：多。',
  } satisfies BinsQ,

  // 看圖選詞、字的小知識
  bottle: choice('g1c7-paper-p1', '這是什麼？', ['鉛筆盒', '水壺'], 1, '看圖，這是裝水的東西。', '這是水壺。', '🧴'),
  teacher: choice('g1c7-paper-p2', '他是我的誰？', ['老師', '警察'], 0, '看圖，他在黑板前面上課。', '他是我的老師。', '👨‍🏫'),
  library: choice('g1c7-paper-p3', '這裡是哪裡？', ['公園', '圖書館'], 1, '看圖，這裡有很多書。', '這裡是圖書館。', '📚📚📚'),
  white: choice('g1c7-paper-x1', '「的」和「拍」這兩個字，哪一句說得對？', ['「白」都在右邊', '「白」都在左邊', '都有「白」這個部件'], 2,
    '看看「的」的白在哪一邊，「拍」的白在哪一邊？', '「的」的白在左邊，「拍」的白在右邊，兩個字都有「白」。'),
  noE: choice('g1c7-paper-x2', '下面哪一個字的讀音，沒有上面這個音？', ['誰', '這', '個'], 0,
    '一個一個念念看：誰、這、個。', '「誰」念 ㄕㄟˊ，沒有 ㄜ；「這」「個」都有。', 'ㄜ'),

  // 說話與句子
  rain: choice('g1c7-paper-x3', '「（　）！下雨了，我忘了帶傘！」空格要填哪一個字？', ['哈', '啊', '耶'], 1,
    '忘了帶傘，心裡是開心還是著急？', '「啊！」表示嚇了一跳、著急。'),
  coat: choice('g1c7-paper-x4', '有人撿到你弄丟的外套，你要怎麼說最合適？', ['這是你的外套。', '這是我的外套。', '這是他的外套。'], 1,
    '外套是自己的，要說「我的」。', '自己的外套，要說「這是我的外套。」'),
  who: choice('g1c7-paper-x5', '宇軒聽到「請問你是誰？」，怎麼回答最合適？', ['你好！你是宇軒。', '你好！他是宇軒。', '你好！我是宇軒。'], 2,
    '說自己的名字，要用「我」。', '介紹自己要說「我是宇軒」。'),
  cake: choice('g1c7-paper-x6', '「哪個人吃了蛋糕？」和下面哪一句的意思一樣？', ['是誰吃了蛋糕？', '蛋糕把誰吃了？', '沒有人吃蛋糕。'], 0,
    '「哪個人」就是「誰」。', '哪個人吃了蛋糕＝是誰吃了蛋糕。'),
  s1: order('g1c7-paper-s1', ['一個', '啊！', '多了'], [1, 2, 0], '啊！多了一個。'),
  s2: order('g1c7-paper-s2', ['是', '書包', '誰的', '這'], [3, 0, 2, 1], '這是誰的書包。'),
  s3: order('g1c7-paper-s3', ['是', '蘋果', '我最喜歡的水果。'], [1, 0, 2], '蘋果是我最喜歡的水果。'),

  // 課文
  f1: fact('g1c7-paper-f1', '小朋友一起玩家家酒遊戲', false, '不對，課文裡小朋友是在分積木。'),
  f2: fact('g1c7-paper-f2', '課文中的積木多了一個', true, '對。'),
  f3: fact('g1c7-paper-f3', '我拿到點數「一二三」的積木，我的積木最少', false, '不對。'),
  f4: fact('g1c7-paper-f4', '他拿到點數「七八九」的積木，他的積木最多', false, '不對。'),
  f5: fact('g1c7-paper-f5', '課文中的積木一共有十個', true, '對。'),
  f6: fact('g1c7-paper-f6', '小朋友分積木時數一數，是因為數一數比較不會分錯', true, '對。'),
} satisfies Record<string, Question>

export const g1c7: Unit = {
  id: 'g1c7',
  number: 7,
  grade: 1,
  subject: '國語',
  label: '1上第 2 課',
  title: '這是誰的',
  source: '國語1上單課卷 第 2 課（康軒）',
  tasks: [
    {
      id: 'g1c7-t1', skill: '國字和注音', title: '字和音', icon: '🔤', blurb: '這是誰的書？',
      questions: [Q.m1, Q.m2, Q.m3],
    },
    {
      id: 'g1c7-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '句子裡有一個字寫錯了！',
      questions: [Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6, Q.t7],
    },
    {
      id: 'g1c7-t3', skill: '筆畫與部件', title: '數一數筆畫', icon: '✋', blurb: '這有幾畫？哪些字裡藏著口？',
      questions: [Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.parts],
    },
    {
      id: 'g1c7-t4', skill: '字與詞', title: '看圖選詞', icon: '🧴', blurb: '水壺、老師、圖書館。',
      questions: [Q.bottle, Q.teacher, Q.library, Q.white, Q.noE],
    },
    {
      id: 'g1c7-t5', skill: '說話與句子', title: '會說話', icon: '💬', blurb: '這是我的外套！',
      questions: [Q.rain, Q.coat, Q.who, Q.cake, Q.s1, Q.s2, Q.s3],
    },
    {
      id: 'g1c7-t6', skill: '課文', title: '分積木', icon: '🧱', blurb: '課文裡說的對不對？',
      questions: [Q.f1, Q.f2, Q.f3, Q.f4, Q.f5, Q.f6],
    },
  ],
  boss: {
    id: 'g1c7-boss', skill: '整份單課卷', title: '第二課魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.m1, Q.m2, Q.m3,
      Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6, Q.t7,
      Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.parts,
      Q.bottle, Q.teacher, Q.library,
      Q.white, Q.noE, Q.rain, Q.coat, Q.who, Q.cake,
      Q.f1, Q.f2, Q.f3, Q.f4, Q.f5, Q.f6,
      Q.s1, Q.s2, Q.s3,
    ],
  },
}
