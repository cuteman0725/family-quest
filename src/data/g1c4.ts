import type { ChoiceQ, MatchQ, Question, TrueFalseQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/首冊/PDF/04.國語首冊單課卷 第7-8課(教).pdf
// 「paper」開頭的 id 是單課卷原題（圖片改用 emoji）。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 卷子上「照樣寫兩次」改成「找出一樣的符號」；「造詞」要自己想語詞，App 沒有放。
// 連成語詞第 5 組（ㄨㄢˇ）看不出要連成哪個語詞，先不放。

const same = (id: string, symbol: string, options: string[]): ChoiceQ => ({
  id, type: 'choice', picture: symbol, prompt: '找一找，哪一個和上面的一樣？', options, answer: options.indexOf(symbol),
  hint: '仔細看筆畫的方向和開口朝哪裡，長得很像的要小心。', explain: `上面的是 ${symbol}。`,
})

const spell = (id: string, a: string, b: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${a} ＋ ${b}`, prompt: '拼拼看，兩個合起來是哪一個？', options, answer: options.indexOf(answer),
  hint: '先念前面的，再念後面的，快快的連在一起念，最後加上聲調。', explain: `${a} 和 ${b} 拼起來是 ${answer}。`,
})

const MATCH_HINT = '念念看，兩個合起來是不是你聽過的語詞，像「吹泡泡」、「菜園」。'
const match = (id: string, pairs: [string, string][], words: string): MatchQ => ({
  id, type: 'match', prompt: '把可以連成語詞的連起來。', pairs, hint: MATCH_HINT, explain: words,
})

const sound = (id: string, picture: string, said: string, char: string, options: string[], answer: number): ChoiceQ => ({
  id, type: 'choice', picture, prompt: `${said}「${char}」的注音是哪一個？`, options, answer,
  hint: `念念看「${char}」，兩個音很像，仔細聽。`, explain: `「${char}」念 ${options[answer]}。`,
})

const tf = (id: string, zhuyin: string, said: string, answer: boolean, explain: string): TrueFalseQ => ({
  id, type: 'trueFalse', picture: zhuyin, prompt: `根據課文，「${said}」對不對？`, answer,
  hint: '想一想課文裡是怎麼說的。', explain,
})

const Q = {
  // 認識符號與拼音
  k: same('g1c4-paper-f1', 'ㄎ', ['ㄏ', 'ㄎ', 'ㄍ']),
  r: same('g1c4-paper-f2', 'ㄖ', ['ㄖ', 'ㄗ', 'ㄓ']),
  wei: same('g1c4-paper-f3', 'ㄨㄟ', ['ㄨㄞ', 'ㄩㄟ', 'ㄨㄟ']),
  yo: same('g1c4-paper-f4', 'ㄧㄛ', ['ㄧㄛ', 'ㄧㄡ', 'ㄧㄜ']),
  yong: same('g1c4-paper-f5', 'ㄩㄥ', ['ㄨㄥ', 'ㄩㄥ', 'ㄩㄣ']),
  ting: spell('g1c4-paper-p1', 'ㄊ', 'ㄧㄥˇ', ['ㄊㄧㄥˇ', 'ㄉㄧㄥˇ', 'ㄊㄧㄣˇ'], 'ㄊㄧㄥˇ'),
  guai: spell('g1c4-paper-p2', 'ㄍ', 'ㄨㄞ', ['ㄎㄨㄞ', 'ㄍㄨㄞ', 'ㄍㄨㄟ'], 'ㄍㄨㄞ'),
  kuang: spell('g1c4-paper-p3', 'ㄎ', 'ㄨㄤˊ', ['ㄎㄨㄢˊ', 'ㄏㄨㄤˊ', 'ㄎㄨㄤˊ'], 'ㄎㄨㄤˊ'),

  // 連成語詞
  m1: match('g1c4-paper-m1', [['ㄔㄨㄟ', 'ㄆㄠˋ ㄆㄠˋ'], ['ㄓㄨㄢˋ', 'ㄑㄩㄢ ㄑㄩㄢ'], ['ㄉㄤˋ', 'ㄑㄧㄡ ㄑㄧㄢ']], '吹泡泡、轉圈圈、盪鞦韆。'),
  m2: match('g1c4-paper-m2', [['ㄨ', 'ㄍㄨㄟ'], ['ㄏㄨㄤˊ', 'ㄋㄧㄡˊ']], '烏龜、黃牛。'),
  m3: match('g1c4-paper-m3', [['ㄏㄟ', 'ㄧㄛ'], ['ㄖㄜˋ', 'ㄋㄠˋ'], ['ㄌㄧㄥˇ', 'ㄒㄧㄢ'], ['ㄘㄞˋ', 'ㄩㄢˊ']], '嘿呦、熱鬧、領先、菜園。'),

  // 填入適當的字音
  bear: sound('g1c4-paper-c1', '🧸\nㄇㄠ（　）ㄅㄠˇ ˙ㄅㄠ', '毛熊寶寶。', '熊', ['ㄒㄩㄢˊ', 'ㄒㄩㄥˊ'], 1),
  carousel: sound('g1c4-paper-c2', '🎠\n（　）ㄓㄨㄢˇ ㄇㄨˋ ㄇㄚˇ', '旋轉木馬。', '旋', ['ㄒㄩㄢˊ', 'ㄒㄩㄥˊ'], 0),
  story: sound('g1c4-paper-c3', '📖\nㄏㄠˇ ㄊㄧㄥ ˙ㄉㄜ（　）ㄕˋ', '好聽的故事。', '故', ['ㄎㄨˋ', 'ㄍㄨˋ'], 1),
  pants: sound('g1c4-paper-c4', '👖\nㄏㄠˇ ㄔㄤˊ ˙ㄉㄜ（　）˙ㄗ', '好長的褲子。', '褲', ['ㄎㄨˋ', 'ㄍㄨˋ'], 0),
  wing: sound('g1c4-paper-c5', '🦅\nㄌㄠˇ ㄧㄥ ㄓㄤ ㄎㄞ（　）ㄅㄤˇ', '老鷹張開翅膀。', '翅', ['ㄘˋ', 'ㄔˋ'], 1),
  bone: sound('g1c4-paper-c6', '🐟\nㄇㄚ ˙ㄇㄚ ㄊㄧㄠ ㄔㄨ ㄩˊ（　）', '媽媽挑出魚刺。', '刺', ['ㄘˋ', 'ㄔˋ'], 0),

  // 句子裡很像的音
  turtle: sound('g1c4-paper-s1', 'ㄨ（　）ㄇㄢˋ ㄇㄢˋ ㄆㄚˊ', '烏龜慢慢爬。', '龜', ['ㄍㄨㄟ', 'ㄍㄨㄞ'], 0),
  ouch: sound('g1c4-paper-s2', 'ㄞ（　）ㄨㄛˇ ㄉㄧㄝˊ ㄉㄠˇ ˙ㄌㄜ', '哎呦，我跌倒了。', '呦', ['ㄧㄛ', 'ㄧㄡ'], 0),
  jump: sound('g1c4-paper-s3', 'ㄊㄚ ㄋㄨˇ ㄌㄧˋ（　）ㄒㄧˊ ㄊㄧㄠˋ ㄩㄢˇ', '她努力練習跳遠。', '練', ['ㄌㄧㄢˋ', 'ㄌㄧㄤˋ'], 0),
  fly: sound('g1c4-paper-s4', '（　）ㄧㄥˊ ㄊㄧㄥˊ ㄗㄞˋ ㄓㄨㄛ ㄇㄧㄢˋ ㄕㄤˋ', '蒼蠅停在桌面上。', '蒼', ['ㄔㄤˊ', 'ㄘㄤˊ'], 1),
  grandpa: sound('g1c4-paper-s5', '（　）ㄍㄨㄥ ㄓㄥˋ ㄗㄞˋ ㄔ ㄨˇ ㄘㄢ', '外公正在吃午餐。', '外', ['ㄨㄤˋ', 'ㄨㄞˋ'], 1),
  fluffy: sound('g1c4-paper-s6', 'ㄨㄛˇ ㄅㄠˋ ˙ㄓㄜ ㄇㄠˊ（　）˙ㄉㄜ ㄨㄢˊ ㄡˇ', '我抱著毛茸茸的玩偶。', '茸茸', ['ㄖㄨㄥˊ ㄖㄨㄥˊ', 'ㄌㄨㄥˊ ㄌㄨㄥˊ'], 0),

  // 課文
  melon: tf('g1c4-paper-t1', 'ㄘㄞˋ ㄩㄢˊ ㄌㄧˇ ㄓㄤˇ ㄔㄨ ㄉㄚˋ ㄉㄨㄥ ㄍㄨㄚ', '菜園裡長出大冬瓜', false, '不對。'),
  race: tf('g1c4-paper-t2', 'ㄨ ㄍㄨㄟ ㄌㄧㄥˇ ㄒㄧㄢ ㄊㄨˋ ˙ㄗ ㄏㄚ ㄏㄚ ㄒㄧㄠˋ', '烏龜領先兔子哈哈笑', false, '不對。'),
  radish: tf('g1c4-paper-t3', 'ㄉㄚˋ ㄐㄧㄚ ㄧˋ ㄑㄧˇ ㄅㄚˊ ㄌㄨㄛˊ ˙ㄅㄛ', '大家一起拔蘿蔔', true, '對。大家一起拔蘿蔔。'),
} satisfies Record<string, Question>

export const g1c4: Unit = {
  id: 'g1c4',
  number: 4,
  grade: 1,
  subject: '國語',
  label: '首冊 7～8 課',
  title: '注音符號（四）',
  source: '國語首冊單課卷 第 7-8 課（康軒）',
  tasks: [
    {
      id: 'g1c4-t1', skill: '認識符號與拼音', title: '找一樣、拼拼看', icon: '🧲', blurb: '看清楚，再拼一拼。',
      questions: [Q.k, Q.r, Q.wei, Q.yo, Q.yong, Q.ting, Q.guai, Q.kuang],
    },
    {
      id: 'g1c4-t2', skill: '連成語詞', title: '連成語詞', icon: '🔗', blurb: '吹泡泡、盪鞦韆，連起來！',
      questions: [Q.m1, Q.m2, Q.m3],
    },
    {
      id: 'g1c4-t3', skill: '選對的字音', title: '熊還是旋', icon: '🧸', blurb: '兩個音很像，選對的那一個。',
      questions: [Q.bear, Q.carousel, Q.story, Q.pants, Q.wing, Q.bone],
    },
    {
      id: 'g1c4-t4', skill: '分辨很像的音', title: '耳朵豎起來', icon: '👂', blurb: '烏龜、蒼蠅，仔細聽！',
      questions: [Q.turtle, Q.ouch, Q.jump, Q.fly, Q.grandpa, Q.fluffy],
    },
    {
      id: 'g1c4-t5', skill: '課文', title: '拔蘿蔔', icon: '🥕', blurb: '課文裡說的對不對？',
      questions: [Q.melon, Q.race, Q.radish],
    },
  ],
  boss: {
    id: 'g1c4-boss', skill: '整份單課卷', title: '首冊魔王（四）', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.k, Q.r, Q.wei, Q.yo, Q.yong,
      Q.ting, Q.guai, Q.kuang,
      Q.m1, Q.m2, Q.m3,
      Q.bear, Q.carousel, Q.story, Q.pants, Q.wing, Q.bone,
      Q.turtle, Q.ouch, Q.jump, Q.fly, Q.grandpa, Q.fluffy,
      Q.melon, Q.race, Q.radish,
    ],
  },
}
