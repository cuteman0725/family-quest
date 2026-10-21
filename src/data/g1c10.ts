import type { BinsQ, ChoiceQ, MatchQ, NumberQ, Question, SortQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/1上/PDF/05_國小國語1上單課卷_第05課_(教).pdf
// 「paper」開頭的 id 是單課卷原題（插圖改用 emoji）。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「寫國字」改成國字和注音連連看；「造詞」要自己想語詞，App 沒有放。

const match = (id: string, pairs: [string, string][], text: string): MatchQ => ({
  id, type: 'match', prompt: '把字和它的注音連起來。', pairs, hint: `念念課文：「${text}」一個字一個字對。`, explain: text,
})

const pickChar = (id: string, sentence: string, options: string[], answer: string, hint: string): ChoiceQ => ({
  id, type: 'choice', picture: sentence, prompt: '上面句子裡注音的地方，是哪一個字？', options, answer: options.indexOf(answer),
  hint, explain: `是「${answer}」。`,
})

const strokes = (id: string, char: string, n: number): NumberQ => ({
  id, type: 'number', picture: char, prompt: '這個字一共有幾畫？', answers: [String(n)], unit: '畫',
  hint: '用手指在桌上一筆一筆寫，邊寫邊數。', explain: `「${char}」一共 ${n} 畫。`,
})

/** 加加減減：加上或拿掉一個部分，變成哪一個字 */
const morph = (id: string, from: string, op: '＋' | '－', part: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${from} ${op} ${part}`, prompt: op === '＋' ? '加上去以後，變成哪一個字？' : '拿掉以後，變成哪一個字？',
  options, answer: options.indexOf(answer), hint: '在心裡把它拼起來（或拿掉），再找長得一樣的字。', explain: `變成「${answer}」。`,
})

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string, picture?: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain, picture,
})

const DIFF = ['地點不同', '意思不同', '時間不同']

const Q = {
  // 字和音
  m1: match('g1c10-paper-m1', [['門', 'ㄇㄣˊ'], ['外', 'ㄨㄞˋ'], ['早', 'ㄗㄠˇ'], ['晚', 'ㄨㄢˇ'], ['同', 'ㄊㄨㄥˊ'], ['賽', 'ㄙㄞˋ']], '門外，早晚，不同，比賽。'),
  m2: match('g1c10-paper-m2', [['又', 'ㄧㄡˋ'], ['什', 'ㄕㄣˊ'], ['比', 'ㄅㄧˇ'], ['主', 'ㄓㄨˇ'], ['王', 'ㄨㄤˊ'], ['裡', 'ㄌㄧˇ']], '又有什麼比賽？主人，大王，裡面。'),

  // 找對的字
  c1: pickChar('g1c10-paper-c1', '大家一起「ㄅㄧˇ」賽，看誰跑得快。', ['化', '北', '比'], '比', '比賽要「比一比」。'),
  c2: pickChar('g1c10-paper-c2', '「ㄇㄣˊ」前的矮牆上有一朵朵小黃花。', ['門', '捫', '們'], '門', '家裡的大門，沒有偏旁。'),
  c3: pickChar('g1c10-paper-c3', '童話裡的白雪公「ㄓㄨˇ」很善良。', ['主', '王', '注'], '主', '公主的主，上面有一點。'),
  c4: pickChar('g1c10-paper-c4', '「ㄨㄤˊ」子騎著馬到森林打獵。', ['主', '王', '注'], '王', '國王的王，上面沒有點。'),
  c5: pickChar('g1c10-paper-c5', '我和哥哥參加相「ㄊㄨㄥˊ」的社團。', ['回', '問', '同'], '同', '一樣叫做「相同」。'),
  c6: pickChar('g1c10-paper-c6', '我「ㄅㄨˋ」知道他住在哪裡。', ['下', '不', '丕'], '不', '「不知道」的不。'),

  // 筆畫與部件
  n1: strokes('g1c10-paper-n1', '外', 5),
  n2: strokes('g1c10-paper-n2', '有', 6),
  n3: strokes('g1c10-paper-n3', '早', 6),
  n4: strokes('g1c10-paper-n4', '晚', 11),
  n5: strokes('g1c10-paper-n5', '裡', 12),
  sun: {
    id: 'g1c10-paper-h1', type: 'bins', picture: '今天是週日，是個陰天。吃完早點，爸爸在日曆上標記，假如下週日天氣放晴，我們就去郊遊。',
    prompt: '哪些字裡面藏著「日」？把字放進對的籃子。', bins: ['有「日」', '沒有'],
    items: [{ label: '是', bin: 0 }, { label: '今', bin: 1 }, { label: '早', bin: 0 }, { label: '天', bin: 1 }, { label: '曆', bin: 0 }, { label: '爸', bin: 1 }, { label: '晴', bin: 0 }, { label: '假', bin: 1 }, { label: '日', bin: 0 }],
    hint: '找找看字裡有沒有一個「日」，可能在上面、下面或左邊。', explain: '有日：是、早、曆、晴、日。沒有：今、天、爸、假。',
  } satisfies BinsQ,

  // 加加減減
  a1: morph('g1c10-paper-a1', '日', '＋', '十', ['早', '旦', '田'], '早'),
  a2: morph('g1c10-paper-a2', '王', '－', '丨', ['土', '三', '工'], '三'),
  a3: morph('g1c10-paper-a3', '子', '－', '一', ['了', '丁', '孑'], '了'),
  a4: morph('g1c10-paper-a4', '丿', '＋', '十', ['干', '午', '千'], '千'),
  a5: morph('g1c10-paper-a5', '主', '－', '丶', ['王', '玉', '土'], '王'),
  a6: morph('g1c10-paper-a6', '一', '＋', '卜', ['上', '下', '卞'], '下'),

  // 看圖與句子
  inside: choice('g1c10-paper-w1', '看圖：小狗在房子裡面，小貓在房子外面。小狗在（　）。', ['門裡', '門外', '山上'], 0, '小狗在房子的裡面。', '小狗在門裡。', '🏠🐶　　🐱🌳'),
  outside: choice('g1c10-paper-w2', '看圖：小狗在房子裡面，小貓在房子外面。小貓在（　）。', ['門裡', '門外', '晚上'], 1, '小貓在房子的外面。', '小貓在門外。', '🏠🐶　　🐱🌳'),
  morning: choice('g1c10-paper-w3', '看圖：（　）我們出門上學。', ['早上', '晚上', '山上'], 0, '太陽剛出來，要去上學。', '早上我們出門上學。', '🌅🎒'),
  evening: choice('g1c10-paper-w4', '看圖：（　）我們回家吃晚餐。', ['早上', '晚上', '門外'], 1, '月亮出來了，回家吃晚餐。', '晚上我們回家吃晚餐。', '🌙🍲'),
  ball: choice('g1c10-paper-x4', '「小貓（　）毛線球。」空格要填哪一個？', ['玩一玩', '畫一畫', '跑一跑'], 0, '小貓會怎麼樣毛線球？', '小貓玩一玩毛線球。'),
  map: choice('g1c10-paper-x5', '「爸爸看一看地圖，（　）應該走哪一條路。」空格要填哪一個？', ['拍一拍', '比一比', '想一想'], 2, '看地圖的時候，腦袋在做什麼？', '想一想應該走哪一條路。'),
  order: {
    id: 'g1c10-paper-s1', type: 'sort', order: 'steps', prompt: '把詞語排成通順的句子。',
    items: ['不同', '什麼', '比一比', '有'], steps: [2, 3, 1, 0],
    hint: '課文的題目放在最前面。', explain: '比一比，有什麼不同。',
  } satisfies SortQ,
  pattern: choice('g1c10-paper-y1', '照樣寫：比一比。下面哪一個也是一樣的寫法？', ['吃一吃', '吃吃飯', '一吃吃'], 0,
    '「比一比」是「比」、「一」、「比」，中間夾一個「一」。', '吃一吃：吃、一、吃，和比一比一樣。'),
  what: {
    id: 'g1c10-paper-s2', type: 'sort', order: 'steps', prompt: '用「什麼」造句：把句子排好。',
    items: ['做什麼呢？', '姐姐', '在房間裡'], steps: [1, 2, 0],
    hint: '先說誰，再說在哪裡，最後問做什麼。', explain: '姐姐在房間裡做什麼呢？',
  } satisfies SortQ,

  // 讀音與意思
  second: choice('g1c10-paper-x1', '下面哪一個句子裡，有念第二聲的字？', ['門外的人是誰呢？', '他是我的好夥伴。', '我們在外面走一走。'], 0,
    '第二聲的聲音是往上揚的，念念看「門」、「誰」。', '「門」和「誰」都念第二聲。'),
  shen: choice('g1c10-paper-x2', '「這款『什』錦燴飯『什』麼時候開始賣？」兩個「什」分別怎麼念？', ['ㄕˊ／ㄕˊ', 'ㄕˊ／ㄕㄣˊ', 'ㄕㄣˊ／ㄕˊ'], 1,
    '什錦是很多種東西混在一起，念起來像「石」；什麼的「什」念起來像「神」。', '什錦的「什」念 ㄕˊ，什麼的「什」念 ㄕㄣˊ。'),
  similar: choice('g1c10-paper-x3', '下面哪一組「」裡的詞語，意思差不多？', ['我要「上車」了／公車「車上」有好多人', '我有「一本」故事書／架子上有「一本本」故事書', '這兩本書哪裡「不同」呢／我們喜歡的顏色「不一樣」'], 2,
    '哪兩個詞換來換去，意思都一樣？', '「不同」和「不一樣」意思差不多。'),
  d1: choice('g1c10-paper-x6', '「門裡」和「門外」哪裡不同？', DIFF, 0, '一個在裡面，一個在外面。', '門裡和門外，是地點不同。'),
  d2: choice('g1c10-paper-x7', '「早上」和「晚上」哪裡不同？', DIFF, 2, '一個是太陽出來，一個是月亮出來。', '早上和晚上，是時間不同。'),
  d3: choice('g1c10-paper-x8', '「山上」和「上山」哪裡不同？', DIFF, 1, '「山上」是一個地方，「上山」是往山上走。', '山上和上山，字一樣、順序不同，意思不同。'),
} satisfies Record<string, Question>

export const g1c10: Unit = {
  id: 'g1c10',
  number: 10,
  grade: 1,
  subject: '國語',
  label: '1上第 5 課',
  title: '比一比',
  source: '國語1上單課卷 第 5 課（康軒）',
  tasks: [
    {
      id: 'g1c10-t1', skill: '國字和注音', title: '字和音', icon: '🔤', blurb: '門外，早晚，不同。',
      questions: [Q.m1, Q.m2],
    },
    {
      id: 'g1c10-t2', skill: '認識國字', title: '找對的字', icon: '👀', blurb: '主和王，差一點點！',
      questions: [Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6],
    },
    {
      id: 'g1c10-t3', skill: '筆畫與部件', title: '數一數筆畫', icon: '☀️', blurb: '哪些字裡藏著日？',
      questions: [Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.sun],
    },
    {
      id: 'g1c10-t4', skill: '加加減減', title: '字的魔術', icon: '🪄', blurb: '日加十，變成什麼字？',
      questions: [Q.a1, Q.a2, Q.a3, Q.a4, Q.a5, Q.a6],
    },
    {
      id: 'g1c10-t5', skill: '看圖與句子', title: '門裡門外', icon: '🏠', blurb: '早上、晚上，門裡、門外。',
      questions: [Q.inside, Q.outside, Q.morning, Q.evening, Q.order, Q.pattern, Q.what],
    },
    {
      id: 'g1c10-t6', skill: '讀音與意思', title: '哪裡不同', icon: '🔍', blurb: '山上和上山，哪裡不一樣？',
      questions: [Q.ball, Q.map, Q.second, Q.shen, Q.similar, Q.d1, Q.d2, Q.d3],
    },
  ],
  boss: {
    id: 'g1c10-boss', skill: '整份單課卷', title: '第五課魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.m1, Q.m2,
      Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6,
      Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.sun,
      Q.a1, Q.a2, Q.a3, Q.a4, Q.a5, Q.a6,
      Q.inside, Q.outside, Q.morning, Q.evening,
      Q.second, Q.shen, Q.similar, Q.ball, Q.map, Q.d1, Q.d2, Q.d3,
      Q.order, Q.pattern, Q.what,
    ],
  },
}
