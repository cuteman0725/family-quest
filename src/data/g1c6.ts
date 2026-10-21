import type { BinsQ, ChoiceQ, MatchQ, NumberQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/1上/PDF/01_國小國語1上單課卷_第01課_(教).pdf
// 「paper」開頭的 id 是單課卷原題（插圖改用 emoji）。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「寫國字」改成國字和注音連連看；「造詞」要自己想語詞，App 沒有放。

/** 看注音選字：大圖是句子（要選的字用注音），選項是長得很像的字 */
const pickChar = (id: string, sentence: string, options: string[], answer: string, hint: string): ChoiceQ => ({
  id, type: 'choice', picture: sentence, prompt: '上面句子裡注音的地方，是哪一個字？', options, answer: options.indexOf(answer),
  hint, explain: `是「${answer}」。`,
})

/** 看字選注音 */
const reading = (id: string, char: string, options: string[], answer: number): ChoiceQ => ({
  id, type: 'choice', picture: char, prompt: '這個字怎麼念？', options, answer,
  hint: '想想這個字在課文裡怎麼念，聲調也要對。', explain: `「${char}」念 ${options[answer]}。`,
})

const strokes = (id: string, char: string, n: number): NumberQ => ({
  id, type: 'number', picture: char, prompt: '這個字一共有幾畫？', answers: [String(n)], unit: '畫',
  hint: '用手指在桌上一筆一筆寫，邊寫邊數。', explain: `「${char}」一共 ${n} 畫。`,
})

const DIR = ['上', '下', '左', '右']
const where = (id: string, picture: string, prompt: string, answer: string, explain: string): ChoiceQ => ({
  id, type: 'choice', picture, prompt, options: DIR, answer: DIR.indexOf(answer),
  hint: '看圖：東西在上面、下面，還是左邊、右邊？', explain,
})

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const HAND = ['有「手」或「扌」', '沒有']

const Q = {
  // 國字和注音
  m1: {
    id: 'g1c6-paper-m1', type: 'match', prompt: '把字和它的注音連起來。',
    pairs: [['拍', 'ㄆㄞ'], ['手', 'ㄕㄡˇ'], ['上', 'ㄕㄤˋ'], ['下', 'ㄒㄧㄚˋ'], ['左', 'ㄗㄨㄛˇ'], ['右', 'ㄧㄡˋ']],
    hint: '念念課文：「拍手，上下左右。」一個字一個字對。', explain: '拍手，上下左右。',
  } satisfies MatchQ,
  m2: {
    id: 'g1c6-paper-m2', type: 'match', prompt: '把字和它的注音連起來。',
    pairs: [['你', 'ㄋㄧˇ'], ['跑', 'ㄆㄠˇ'], ['步', 'ㄅㄨˋ'], ['他', 'ㄊㄚ'], ['也', 'ㄧㄝˇ']],
    hint: '念念課文：「你跑步，他也跑步。」一個字一個字對。', explain: '你跑步，他也跑步。',
  } satisfies MatchQ,

  // 看注音選字
  pat: pickChar('g1c6-v-c1', '大家一起「ㄆㄞ」球。', ['伯', '拍', '怕'], '拍', '拍球要用手，找有提手旁的字。'),
  glove: pickChar('g1c6-paper-c1', '這是奶奶的「ㄕㄡˇ」套。', ['丰', '毛', '手'], '手', '戴在手上的套子。'),
  stage: pickChar('g1c6-paper-c2', '講臺「ㄕㄤˋ」站了兩個人。', ['卜', '土', '上'], '上', '人站在講臺的上面。'),
  he: pickChar('g1c6-paper-c3', '「ㄊㄚ」做事讓人很放心。', ['他', '地', '也'], '他', '說的是一個人，要有人字旁。'),
  right: pickChar('g1c6-paper-c4', '我們要在前面的路口「ㄧㄡˋ」轉。', ['石', '右', '古'], '右', '左轉、右轉的右。'),
  also: pickChar('g1c6-paper-c5', '哥哥「ㄧㄝˇ」想再聽一次故事。', ['也', '他', '池'], '也', '「也」是沒有偏旁的那一個。'),

  // 看字選注音
  r1: reading('g1c6-paper-r1', '下', ['ㄒㄧㄚ', 'ㄒㄧㄚˊ', 'ㄒㄧㄚˋ'], 2),
  r2: reading('g1c6-paper-r2', '你', ['ㄋㄧ', 'ㄋㄧˇ', 'ㄋㄧˋ'], 1),
  r3: reading('g1c6-paper-r3', '左', ['ㄗㄨㄛˇ', 'ㄗㄨㄛˋ', 'ㄓㄨㄛˇ'], 0),
  r4: reading('g1c6-paper-r4', '也', ['ㄧˇ', 'ㄧㄡˇ', 'ㄧㄝˇ'], 2),
  r5: reading('g1c6-paper-r5', '手', ['ㄕㄡ', 'ㄕㄡˇ', 'ㄙㄡˇ'], 1),

  // 筆畫
  n1: strokes('g1c6-paper-n1', '右', 5),
  n2: strokes('g1c6-paper-n2', '拍', 8),
  n3: strokes('g1c6-paper-n3', '下', 3),
  n4: strokes('g1c6-paper-n4', '上', 3),
  n5: strokes('g1c6-paper-n5', '手', 4),

  // 找出有手的字、找出有ㄡ／ㄚ的音
  hand1: {
    id: 'g1c6-paper-h1', type: 'bins', picture: '拔河比賽　打掃教室　拿走球拍', prompt: '哪些字裡面藏著「手」？把字放進對的籃子。', bins: HAND,
    items: [{ label: '拔', bin: 0 }, { label: '河', bin: 1 }, { label: '打', bin: 0 }, { label: '掃', bin: 0 }, { label: '教', bin: 1 }, { label: '拿', bin: 0 }, { label: '走', bin: 1 }, { label: '拍', bin: 0 }],
    hint: '「手」寫在左邊會變成提手旁「扌」；「拿」的手在下面。', explain: '有手：拔、打、掃、拿、拍。沒有：河、教、走。',
  } satisfies BinsQ,
  hand2: {
    id: 'g1c6-paper-h2', type: 'bins', picture: '擁抱家人　捉迷藏遊戲', prompt: '哪些字裡面藏著「手」？把字放進對的籃子。', bins: HAND,
    items: [{ label: '擁', bin: 0 }, { label: '抱', bin: 0 }, { label: '家', bin: 1 }, { label: '捉', bin: 0 }, { label: '迷', bin: 1 }, { label: '遊', bin: 1 }],
    hint: '找左邊有「扌」的字。', explain: '有手：擁、抱、捉。沒有：家、迷、遊。',
  } satisfies BinsQ,
  sounds: {
    id: 'g1c6-paper-k1', type: 'bins', prompt: '念念看，把字放進對的籃子。', bins: ['有 ㄡ 的音', '有 ㄚ 的音', '都沒有'],
    items: [{ label: '右', bin: 0 }, { label: '他', bin: 1 }, { label: '左', bin: 2 }, { label: '手', bin: 0 }, { label: '下', bin: 1 }, { label: '你', bin: 2 }, { label: '也', bin: 2 }, { label: '拍', bin: 2 }, { label: '上', bin: 2 }],
    hint: '慢慢念每一個字，聽聽看尾巴是「歐」還是「啊」。', explain: '有 ㄡ：右、手。有 ㄚ：他、下。都沒有：左、你、也、拍、上。',
  } satisfies BinsQ,

  // 看圖：上下左右
  desk1: where('g1c6-paper-w1', '📚 🟫 💡', '哥哥把書放在桌子的哪一邊？', '左', '書在桌子的左邊。'),
  desk2: where('g1c6-paper-w2', '📚 🟫 💡', '檯燈在桌子的哪一邊？', '右', '檯燈在桌子的右邊。'),
  cat: where('g1c6-paper-w3', '🐱\n🪑', '小貓在椅子的哪一面睡覺？', '上', '小貓在椅子上面睡覺。'),
  tree: where('g1c6-paper-w4', '🌳\n👧👦', '小朋友在樹的哪裡玩耍？', '下', '小朋友在樹下玩耍。'),

  // 選出正確的答案
  find: choice('g1c6-paper-x1', '「我的課本不見了，可以請你幫我（　）嗎？」空格要填哪一個？', ['聽一聽', '找一找', '猜一猜'], 1,
    '東西不見了，要怎麼辦？', '課本不見了，要「找一找」。'),
  racket: choice('g1c6-paper-x2', '下面哪一個「拍」，和手的動作沒有關係？', ['拍打大鼓', '收好球拍', '拍手遊戲'], 1,
    '哪一個「拍」是一個東西，不是動作？', '「球拍」是打球用的東西，不是手的動作。'),
  doing: choice('g1c6-paper-x3', '〈拍拍手〉這一課裡，小朋友正在做什麼？', ['拍手', '拍球', '唱歌'], 0,
    '想想課文的名字。', '小朋友在拍手。'),
  story: choice('g1c6-paper-x4', '聽故事的時候，哪一個做法是不對的？', ['一邊聽，一邊聊天', '安靜聽', '專心聽'], 0,
    '聽故事要怎麼樣，才聽得清楚？', '一邊聽一邊聊天，就聽不清楚故事了。'),
  brother: choice('g1c6-paper-x5', '「哥哥（　）。」空格要填哪一個？', ['小貓咪', '紅蘋果', '打籃球'], 2,
    '哥哥在「做什麼」？要找一個動作。', '哥哥打籃球：打籃球是一個動作。'),
  clap: choice('g1c6-paper-x6', '〈拍拍手〉這一課裡，小朋友沒有做哪一種拍手的玩法？', ['上拍、下拍', '左拍、右拍', '前拍、後拍'], 2,
    '課文說「上下左右」，有沒有說前面、後面？', '課文只有上下左右，沒有前拍、後拍。'),
  pattern: choice('g1c6-paper-y1', '照樣造句：「你拍手。」下面哪一句也是「誰在做什麼」？', ['姐姐看書。', '看書姐姐。', '書看姐姐。'], 0,
    '先說「誰」，再說「做什麼」。', '姐姐看書：先說誰（姐姐），再說做什麼（看書）。'),
} satisfies Record<string, Question>

export const g1c6: Unit = {
  id: 'g1c6',
  number: 6,
  grade: 1,
  subject: '國語',
  label: '1上第 1 課',
  title: '拍拍手',
  source: '國語1上單課卷 第 1 課（康軒）',
  tasks: [
    {
      id: 'g1c6-t1', skill: '國字和注音', title: '字和音', icon: '🔤', blurb: '拍手，上下左右。',
      questions: [Q.m1, Q.m2, Q.r1, Q.r2, Q.r3, Q.r4, Q.r5],
    },
    {
      id: 'g1c6-t2', skill: '認識國字', title: '找對的字', icon: '👀', blurb: '他、地、也，長得好像！',
      questions: [Q.pat, Q.glove, Q.stage, Q.he, Q.right, Q.also],
    },
    {
      id: 'g1c6-t3', skill: '筆畫與部件', title: '數一數筆畫', icon: '✋', blurb: '拍有幾畫？哪些字裡藏著手？',
      questions: [Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.hand1, Q.hand2, Q.sounds],
    },
    {
      id: 'g1c6-t4', skill: '上下左右', title: '上下左右', icon: '🧭', blurb: '小貓在椅子的哪裡？',
      questions: [Q.desk1, Q.desk2, Q.cat, Q.tree],
    },
    {
      id: 'g1c6-t5', skill: '課文與句子', title: '拍拍手', icon: '👏', blurb: '小朋友在做什麼？',
      questions: [Q.find, Q.racket, Q.doing, Q.story, Q.brother, Q.clap, Q.pattern],
    },
  ],
  boss: {
    id: 'g1c6-boss', skill: '整份單課卷', title: '第一課魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.m1, Q.m2,
      Q.glove, Q.stage, Q.he, Q.right, Q.also,
      Q.r1, Q.r2, Q.r3, Q.r4, Q.r5,
      Q.n1, Q.n2, Q.n3, Q.n4, Q.n5,
      Q.hand1, Q.hand2, Q.sounds,
      Q.desk1, Q.desk2, Q.cat, Q.tree,
      Q.find, Q.racket, Q.doing, Q.story, Q.brother, Q.clap,
      Q.pattern,
    ],
  },
}
