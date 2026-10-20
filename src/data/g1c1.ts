import type { ChoiceQ, MatchQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/首冊/PDF/01.國語首冊單課卷 第1-2課(教).pdf
// 「paper」開頭的 id 是單課卷原題（圖片改用 emoji）。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在上面的大圖（picture）和選項裡。
// 卷子上「照樣寫兩次」要用手寫，改成「找出一樣的符號」（看清楚長相）。

const same = (id: string, symbol: string, options: string[]): ChoiceQ => ({
  id, type: 'choice', picture: symbol, prompt: '找一找，哪一個和上面的注音符號一樣？', options, answer: options.indexOf(symbol),
  hint: '仔細看筆畫的方向和開口朝哪裡，長得很像的符號要小心。', explain: `上面的符號是 ${symbol}。`,
})

const spell = (id: string, a: string, b: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${a} ＋ ${b}`, prompt: '拼拼看，兩個合起來是哪一個？', options, answer: options.indexOf(answer),
  hint: '先念前面的，再念後面的，快快的連在一起念，最後加上聲調。', explain: `${a} 和 ${b} 拼起來是 ${answer}。`,
})

const MATCH_HINT = '念念看，兩個合起來是不是你聽過的語詞，像「喝茶」、「毛衣」。'
const match = (id: string, pairs: [string, string][], words: string): MatchQ => ({
  id, type: 'match', prompt: '把可以連成語詞的連起來。', pairs, hint: MATCH_HINT, explain: words,
})

const sound = (id: string, emoji: string, word: string, shown: string, options: string[], answer: number): ChoiceQ => ({
  id, type: 'choice', picture: `${emoji}\n${shown}`, prompt: `這是${word}。空格要填哪一個音？`, options, answer,
  hint: `慢慢念「${word}」，聽聽看空格那個字的聲音。`, explain: `${word}：${shown.replace('（　）', options[answer])}`,
})

const lesson = (id: string, zhuyin: string, said: string, options: string[], answer: number, explain: string): ChoiceQ => ({
  id, type: 'choice', picture: zhuyin, prompt: `課文說：「${said}」空格要填哪一個？`, options, answer,
  hint: '想一想課文裡的句子，念念看哪一個放進去最通順。', explain,
})

const Q = {
  // 找一樣的符號
  ao: same('g1c1-paper-f1', 'ㄠ', ['ㄡ', 'ㄠ', 'ㄛ']),
  b: same('g1c1-paper-f2', 'ㄅ', ['ㄅ', 'ㄉ', 'ㄆ']),
  d: same('g1c1-paper-f3', 'ㄉ', ['ㄌ', 'ㄅ', 'ㄉ']),
  f: same('g1c1-paper-f4', 'ㄈ', ['ㄇ', 'ㄈ', 'ㄖ']),
  zh: same('g1c1-paper-f5', 'ㄓ', ['ㄓ', 'ㄔ', 'ㄕ']),
  ch: same('g1c1-paper-f6', 'ㄔ', ['ㄕ', 'ㄓ', 'ㄔ']),
  e: same('g1c1-paper-f7', 'ㄜ', ['ㄝ', 'ㄜ', 'ㄛ']),

  // 拼音練習
  mao: spell('g1c1-paper-p1', 'ㄇ', 'ㄠ', ['ㄇㄚ', 'ㄇㄠ', 'ㄋㄠ'], 'ㄇㄠ'),
  pi: spell('g1c1-paper-p2', 'ㄆ', 'ㄧ', ['ㄆㄧ', 'ㄅㄧ', 'ㄆㄨ'], 'ㄆㄧ'),
  ha: spell('g1c1-paper-p3', 'ㄏ', 'ㄚ', ['ㄈㄚ', 'ㄏㄜ', 'ㄏㄚ'], 'ㄏㄚ'),
  de: spell('g1c1-paper-p4', 'ㄉ', 'ㄜˊ', ['ㄉㄜˊ', 'ㄊㄜˊ', 'ㄉㄜˇ'], 'ㄉㄜˊ'),
  chao: spell('g1c1-paper-p5', 'ㄔ', 'ㄠˇ', ['ㄓㄠˇ', 'ㄔㄠˇ', 'ㄔㄠˋ'], 'ㄔㄠˇ'),
  fu: spell('g1c1-paper-p6', 'ㄈ', 'ㄨ', ['ㄏㄨ', 'ㄈㄚ', 'ㄈㄨ'], 'ㄈㄨ'),

  // 連成語詞
  m1: match('g1c1-paper-m1', [['ㄓㄨ', 'ㄅㄠˇ'], ['ㄇㄠˊ', 'ㄧ'], ['ㄏㄜ', 'ㄔㄚˊ']], '珠寶、毛衣、喝茶。'),
  m2: match('g1c1-paper-m2', [['ㄇㄚˇ', 'ㄔㄜ'], ['ㄈㄨ', 'ㄧㄠˋ'], ['ㄉㄠˋ', 'ㄇㄧˇ']], '馬車、敷藥、稻米。'),
  m3: match('g1c1-paper-m3', [['ㄓㄜˊ', 'ㄓˇ'], ['ㄨ', 'ㄧㄚ'], ['ㄧㄚˊ', 'ㄔˇ']], '摺紙、烏鴉、牙齒。'),

  // 看圖選音
  brush: sound('g1c1-paper-s1', '🖌️', '毛筆', 'ㄇㄠˊ（　）', ['ㄅㄧˇ', 'ㄉㄧˇ'], 0),
  hippo: sound('g1c1-paper-s2', '🦛', '河馬', '（　）ㄇㄚˇ', ['ㄏㄨˊ', 'ㄏㄜˊ'], 1),
  bag: sound('g1c1-paper-s3', '👜', '皮包', 'ㄆㄧˊ（　）', ['ㄅㄠ', 'ㄉㄠ'], 0),
  spider: sound('g1c1-paper-s4', '🕷️', '蜘蛛', '（　）ㄓㄨ', ['ㄓ', 'ㄔ'], 0),

  // 根據課文
  first: lesson('g1c1-paper-r1', '（　）ㄉㄧˋ ˙ㄉㄧ ㄆㄠˇ ㄉㄧˋ ㄧ', '（　）弟弟跑第一。', ['ㄓ ㄓㄨ', 'ㄇㄚˇ ㄧˇ', 'ㄇㄠ ㄇㄧ'], 2,
    'ㄇㄠ ㄇㄧ（貓咪）弟弟跑第一。'),
  goose: lesson('g1c1-paper-r2', 'ㄜˊ ㄇㄚ ˙ㄇㄚ ㄈㄨ ㄔㄨ（　）ㄜˊ ㄅㄠˇ ˙ㄅㄠ', '鵝媽媽孵出（　）鵝寶寶。', ['ㄨˇ ㄓ', 'ㄅㄚ ㄓ', 'ㄧˋ ㄓ'], 0,
    '鵝媽媽孵出 ㄨˇ ㄓ（五隻）鵝寶寶。'),
  meow: lesson('g1c1-paper-r3', 'ㄇㄠ ㄇㄧ（　）', '貓咪（　）。', ['ㄅㄨ ㄅㄨ ㄅㄨ', 'ㄅㄚ ㄅㄚ', 'ㄇㄧ ㄇㄧ ㄇㄧ'], 2,
    '貓咪 ㄇㄧ ㄇㄧ ㄇㄧ（咪咪咪）。'),
  proud: lesson('g1c1-paper-r4', 'ㄜˊ ㄇㄚ ˙ㄇㄚ ㄏㄚ ㄏㄚ ㄏㄚ（　）', '鵝媽媽哈哈哈，（　）。', ['ㄏㄠˇ ㄅㄨˊ ㄧˋ', 'ㄏㄠˇ ㄉㄜˊ ㄧˋ', 'ㄏㄠˇ ㄇㄧˋ ㄇㄧˋ'], 1,
    '鵝媽媽哈哈哈，ㄏㄠˇ ㄉㄜˊ ㄧˋ（好得意）。'),
} satisfies Record<string, Question>

export const g1c1: Unit = {
  id: 'g1c1',
  number: 1,
  grade: 1,
  subject: '國語',
  label: '首冊 1～2 課',
  title: '注音符號（一）',
  source: '國語首冊單課卷 第 1-2 課（康軒）',
  tasks: [
    {
      id: 'g1c1-t1', skill: '認識注音符號', title: '找一樣的', icon: '👀', blurb: '長得很像的符號，看清楚喔！',
      questions: [Q.ao, Q.b, Q.d, Q.f, Q.zh, Q.ch, Q.e],
    },
    {
      id: 'g1c1-t2', skill: '拼音', title: '拼拼看', icon: '🧲', blurb: '兩個符號合起來念。',
      questions: [Q.mao, Q.pi, Q.ha, Q.de, Q.chao, Q.fu],
    },
    {
      id: 'g1c1-t3', skill: '連成語詞', title: '連成語詞', icon: '🔗', blurb: '兩個音連起來，變成一個語詞。',
      questions: [Q.m1, Q.m2, Q.m3],
    },
    {
      id: 'g1c1-t4', skill: '看圖選音', title: '看圖選音', icon: '🦛', blurb: '河馬、蜘蛛，空格是哪一個音？',
      questions: [Q.brush, Q.hippo, Q.bag, Q.spider],
    },
    {
      id: 'g1c1-t5', skill: '課文填空', title: '鵝媽媽和貓咪', icon: '🪿', blurb: '課文裡說了什麼？',
      questions: [Q.first, Q.goose, Q.meow, Q.proud],
    },
  ],
  boss: {
    id: 'g1c1-boss', skill: '整份單課卷', title: '首冊魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.ao, Q.b, Q.d, Q.f, Q.zh, Q.ch, Q.e,
      Q.mao, Q.pi, Q.ha, Q.de, Q.chao, Q.fu,
      Q.m1, Q.m2, Q.m3,
      Q.brush, Q.hippo, Q.bag, Q.spider,
      Q.first, Q.goose, Q.meow, Q.proud,
    ],
  },
}
