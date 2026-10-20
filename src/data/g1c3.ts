import type { BinsQ, ChoiceQ, MatchQ, Question, TrueFalseQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/首冊/PDF/03.國語首冊單課卷 第5-6課(教).pdf
// 「paper」開頭的 id 是單課卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint、任務名稱，放在大圖和選項裡。

const spell = (id: string, a: string, b: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${a} ＋ ${b}`, prompt: '拼拼看，兩個合起來是哪一個？', options, answer: options.indexOf(answer),
  hint: '先念前面的，再念後面的，快快的連在一起念，最後加上聲調。', explain: `${a} 和 ${b} 拼起來是 ${answer}。`,
})

const TONES = ['', 'ˊ', 'ˇ', 'ˋ']
const tone = (id: string, emoji: string, word: string, char: string, shown: string, base: string, right: string): ChoiceQ => {
  const options = TONES.map((t) => base + t)
  return {
    id, type: 'choice', picture: `${emoji}\n${shown}`, prompt: `這是${word}。「${char}」要加上哪一個聲調？`, options, answer: options.indexOf(base + right),
    hint: `慢慢念「${word}」，聽聽看「${char}」的聲音是平平的、往上、先下再上，還是往下。`,
    explain: `${word}的「${char}」念 ${base + right}。`,
  }
}

const sound = (id: string, picture: string, said: string, char: string, options: string[], answer: number): ChoiceQ => ({
  id, type: 'choice', picture, prompt: `${said}「${char}」的注音是哪一個？`, options, answer,
  hint: `念念看「${char}」，兩個音很像，仔細聽。`, explain: `「${char}」念 ${options[answer]}。`,
})

const lesson = (id: string, zhuyin: string, said: string, options: string[], answer: number, explain: string): ChoiceQ => ({
  id, type: 'choice', picture: zhuyin, prompt: `課文說：「${said}」空格要填哪一個？`, options, answer,
  hint: '想一想課文裡的句子，念念看哪一個放進去最通順。', explain,
})

const tf = (id: string, zhuyin: string, said: string, answer: boolean, explain: string): TrueFalseQ => ({
  id, type: 'trueFalse', picture: zhuyin, prompt: `根據課文，「${said}」對不對？`, answer,
  hint: '想一想課文裡是怎麼說的。', explain,
})

const AI_BINS = ['有 ㄞ', '沒有 ㄞ']
const AI_HINT = '念念看，結尾有沒有「愛」的聲音？像「奶奶」「買」「賣」都有；「到」「找」的尾巴是「凹」，不一樣。'

const Q = {
  // 拼音練習
  zheng: spell('g1c3-paper-p1', 'ㄓ', 'ㄥ', ['ㄓㄥ', 'ㄓㄣ', 'ㄗㄥ'], 'ㄓㄥ'),
  san: spell('g1c3-paper-p2', 'ㄙ', 'ㄢˇ', ['ㄕㄢˇ', 'ㄙㄢˇ', 'ㄙㄤˇ'], 'ㄙㄢˇ'),
  niu: spell('g1c3-paper-p3', 'ㄋ', 'ㄧㄡˊ', ['ㄌㄧㄡˊ', 'ㄋㄧㄠˊ', 'ㄋㄧㄡˊ'], 'ㄋㄧㄡˊ'),
  hong: spell('g1c3-paper-p4', 'ㄏ', 'ㄨㄥˊ', ['ㄏㄨㄥˊ', 'ㄈㄨㄥˊ', 'ㄏㄨㄣˊ'], 'ㄏㄨㄥˊ'),
  jie: spell('g1c3-paper-p5', 'ㄐ', 'ㄧㄝˇ', ['ㄑㄧㄝˇ', 'ㄐㄧㄝˇ', 'ㄐㄩㄝˇ'], 'ㄐㄧㄝˇ'),
  gua: spell('g1c3-paper-p6', 'ㄍ', 'ㄨㄚˋ', ['ㄍㄨㄚˋ', 'ㄎㄨㄚˋ', 'ㄍㄨㄛˋ'], 'ㄍㄨㄚˋ'),

  // 聲調
  ball: tone('g1c3-v-d1', '⚽', '小皮球', '球', 'ㄒㄧㄠˇ ㄆㄧˊ（ㄑㄧㄡ）', 'ㄑㄧㄡ', 'ˊ'),
  bow: tone('g1c3-paper-d1', '🎀', '蝴蝶結', '結', 'ㄏㄨˊ ㄉㄧㄝˊ（ㄐㄧㄝ）', 'ㄐㄧㄝ', 'ˊ'),
  dog: tone('g1c3-paper-d2', '🐶', '小白狗', '狗', 'ㄒㄧㄠˇ ㄅㄞˊ（ㄍㄡ）', 'ㄍㄡ', 'ˇ'),
  friend: tone('g1c3-paper-d3', '👭', '好朋友', '朋', 'ㄏㄠˇ（ㄆㄥ）ㄧㄡˇ', 'ㄆㄥ', 'ˊ'),
  leaf: tone('g1c3-paper-d4', '🍃', '樹葉飄', '葉', 'ㄕㄨˋ（ㄧㄝ）ㄆㄧㄠ', 'ㄧㄝ', 'ˋ'),
  gull: tone('g1c3-paper-d5', '🕊️', '海鷗飛', '海', '（ㄏㄞ）ㄡ ㄈㄟ', 'ㄏㄞ', 'ˇ'),

  // 句子裡很像的音
  clock: sound('g1c3-paper-s1', '⏰\n（　）ㄓㄨㄥ', '這是鬧鐘。', '鬧', ['ㄉㄠˋ', 'ㄋㄠˋ'], 1),
  house: sound('g1c3-paper-s2', '🏠\n（　）ㄈㄤˊ ˙ㄗ', '蓋房子。', '蓋', ['ㄍㄞˋ', 'ㄉㄞˋ'], 0),
  sprout: sound('g1c3-paper-s3', 'ㄨㄢ ㄉㄡˋ ㄈㄚ（　）', '豌豆發芽。', '芽', ['ㄧㄚˊ', 'ㄧㄤˊ'], 0),
  flower: sound('g1c3-paper-s4', 'ㄧˋ ㄉㄨㄛˇ ㄏㄨㄥˊ（　）', '一朵紅花。', '花', ['ㄏㄚ', 'ㄏㄨㄚ'], 1),
  jelly: sound('g1c3-paper-s5', 'ㄨㄛˇ ˙ㄉㄜ（　）', '我的果凍。', '果凍', ['ㄍㄨㄢˇ ㄉㄨㄥˋ', 'ㄍㄨㄛˇ ㄉㄨㄥˋ'], 1),
  teach: sound('g1c3-paper-s6', 'ㄌㄠˇ ㄕ（　）ㄨㄛˇ ㄏㄨㄚˋ ㄏㄨㄚˋ', '老師教我畫畫。', '教', ['ㄑㄧㄠ', 'ㄐㄧㄠ'], 1),

  // 找出有「ㄞ」的音
  ai1: {
    id: 'g1c3-paper-a1', type: 'bins', picture: 'ㄋㄞˇ ˙ㄋㄞ ㄒㄧㄤˇ ㄧㄠˋ ㄇㄞˇ ㄋㄧㄡˊ ㄋㄞˇ\nㄉㄞˋ ㄨㄛˇ ㄉㄠˋ ㄇㄞˋ ㄔㄤˇ',
    prompt: '奶奶想要買牛奶，帶我到賣場。把這些音分一分，放進對的籃子。', bins: AI_BINS,
    items: [{ label: 'ㄋㄞˇ', bin: 0 }, { label: 'ㄒㄧㄤˇ', bin: 1 }, { label: 'ㄇㄞˇ', bin: 0 }, { label: 'ㄧㄠˋ', bin: 1 }, { label: 'ㄉㄞˋ', bin: 0 }, { label: 'ㄉㄠˋ', bin: 1 }],
    hint: AI_HINT, explain: '有 ㄞ：ㄋㄞˇ（奶）、ㄇㄞˇ（買）、ㄉㄞˋ（帶）。沒有 ㄞ：ㄒㄧㄤˇ（想）、ㄧㄠˋ（要）、ㄉㄠˋ（到）。',
  } satisfies BinsQ,
  ai2: {
    id: 'g1c3-paper-a2', type: 'bins', picture: 'ㄉㄢˋ ㄕˋ ㄧˋ ㄓˊ ㄇㄟˊ ㄓㄠˇ ㄉㄠˋ\nㄩㄢˊ ㄌㄞˊ ㄕˋ ㄋㄧㄡˊ ㄋㄞˇ ㄇㄞˋ ㄨㄢˊ ˙ㄌㄜ',
    prompt: '但是一直沒找到，原來是牛奶賣完了。把這些音分一分，放進對的籃子。', bins: AI_BINS,
    items: [{ label: 'ㄌㄞˊ', bin: 0 }, { label: 'ㄓㄠˇ', bin: 1 }, { label: 'ㄇㄞˋ', bin: 0 }, { label: 'ㄇㄟˊ', bin: 1 }, { label: 'ㄋㄧㄡˊ', bin: 1 }],
    hint: AI_HINT, explain: '有 ㄞ：ㄌㄞˊ（來）、ㄇㄞˋ（賣）。沒有 ㄞ：ㄓㄠˇ（找）、ㄇㄟˊ（沒）、ㄋㄧㄡˊ（牛）。',
  } satisfies BinsQ,

  // 連一連、課文
  words: {
    id: 'g1c3-paper-m1', type: 'match', prompt: '把可以連成語詞的連起來。',
    pairs: [['ㄕㄨㄚ', 'ㄧㄚˊ'], ['ㄌㄨㄥˊ', 'ㄓㄡ'], ['ㄇㄧˋ', 'ㄈㄥ'], ['ㄩˇ', 'ㄙㄢˇ']],
    hint: '念念看，兩個合起來是不是你聽過的語詞，像「刷牙」、「雨傘」。', explain: '刷牙、龍舟、蜜蜂、雨傘。',
  } satisfies MatchQ,
  gift: tf('g1c3-paper-t1', 'ㄨㄛˇ ㄙㄨㄥˋ ㄌㄠˇ ㄕ ㄧˋ ㄈㄨˊ ㄏㄨㄚˋ', '我送老師一幅畫', false, '不對。課文說我想要送老師一朵小紅花。'),
  seesaw: tf('g1c3-paper-t2', 'ㄨㄢˊ ㄑㄧㄠˋ ㄑㄧㄠˋ ㄅㄢˇ ㄒㄧㄤˋ ㄒㄧㄠˇ ㄋㄧㄠˇ ㄈㄟ', '玩蹺蹺板像小鳥飛', true, '對。玩蹺蹺板好像小鳥飛飛飛。'),
  draw: lesson('g1c3-paper-r1', 'ㄌㄠˇ ㄕ ㄐㄧㄠ ㄨㄛˇ（　）', '老師教我（　）。', ['ㄈㄤˋ ㄈㄥ ㄓㄥ', 'ㄓㄨㄥˇ ㄏㄨㄚ', 'ㄏㄨㄚˋ ㄏㄨㄚˋ'], 2,
    '老師教我 ㄏㄨㄚˋ ㄏㄨㄚˋ（畫畫）。'),
  bird: lesson('g1c3-paper-r2', 'ㄨㄢˊ ㄑㄧㄠˋ ㄑㄧㄠˋ ㄅㄢˇ ㄏㄠˇ ㄒㄧㄤˋ（　）', '玩蹺蹺板好像（　）。', ['ㄒㄧㄠˇ ㄋㄧㄠˇ ㄈㄟ ㄈㄟ ㄈㄟ', 'ㄒㄧㄠˇ ㄇㄠ', 'ㄒㄧㄠˇ ㄍㄡˇ'], 0,
    '玩蹺蹺板好像 ㄒㄧㄠˇ ㄋㄧㄠˇ ㄈㄟ ㄈㄟ ㄈㄟ（小鳥飛飛飛）。'),
  red: lesson('g1c3-paper-r3', 'ㄨㄛˇ ㄒㄧㄤˇ ㄧㄠˋ ㄙㄨㄥˋ ㄌㄠˇ ㄕ ㄧˋ ㄉㄨㄛˇ（　）', '我想要送老師一朵（　）。', ['ㄏㄨˊ ㄉㄧㄝˊ ㄐㄧㄝˊ', 'ㄒㄧㄠˇ ㄌㄧˇ ㄨˋ', 'ㄒㄧㄠˇ ㄏㄨㄥˊ ㄏㄨㄚ'], 2,
    '我想要送老師一朵 ㄒㄧㄠˇ ㄏㄨㄥˊ ㄏㄨㄚ（小紅花）。'),
  together: lesson('g1c3-paper-r4', 'ㄨㄛˇ ㄧㄠˋ ㄏㄢˋ（　）ㄧˋ ㄑㄧˇ ㄨㄢˊ ㄑㄧㄠˋ ㄑㄧㄠˋ ㄅㄢˇ', '我要和（　）一起玩蹺蹺板。', ['ㄌㄠˇ ㄕ', 'ㄏㄠˇ ㄆㄥˊ ㄧㄡˇ', 'ㄉㄚˋ ㄍㄜ ˙ㄍㄜ'], 1,
    '我要和 ㄏㄠˇ ㄆㄥˊ ㄧㄡˇ（好朋友）一起玩蹺蹺板。'),
} satisfies Record<string, Question>

export const g1c3: Unit = {
  id: 'g1c3',
  number: 3,
  grade: 1,
  subject: '國語',
  label: '首冊 5～6 課',
  title: '注音符號（三）',
  source: '國語首冊單課卷 第 5-6 課（康軒）',
  tasks: [
    {
      id: 'g1c3-t1', skill: '拼音', title: '拼拼看', icon: '🧲', blurb: '兩個、三個符號合起來念。',
      questions: [Q.zheng, Q.san, Q.niu, Q.hong, Q.jie, Q.gua],
    },
    {
      id: 'g1c3-t2', skill: '聲調', title: '聲調小高手', icon: '🎵', blurb: '蝴蝶結、小白狗，聲調對了嗎？',
      questions: [Q.ball, Q.bow, Q.dog, Q.friend, Q.leaf, Q.gull],
    },
    {
      id: 'g1c3-t3', skill: '分辨很像的音', title: '耳朵豎起來', icon: '👂', blurb: '鬧鐘、蓋房子，仔細聽！',
      questions: [Q.clock, Q.house, Q.sprout, Q.flower, Q.jelly, Q.teach],
    },
    {
      id: 'g1c3-t4', skill: '找出一樣的韻母', title: '奶奶買牛奶', icon: '🥛', blurb: '哪些音念起來有「愛」的聲音？',
      questions: [Q.ai1, Q.ai2],
    },
    {
      id: 'g1c3-t5', skill: '語詞與課文', title: '蹺蹺板', icon: '🛝', blurb: '連一連、想一想課文。',
      questions: [Q.words, Q.gift, Q.seesaw, Q.draw, Q.bird, Q.red, Q.together],
    },
  ],
  boss: {
    id: 'g1c3-boss', skill: '整份單課卷', title: '首冊魔王（三）', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.zheng, Q.san, Q.niu, Q.hong, Q.jie, Q.gua,
      Q.clock, Q.house, Q.sprout, Q.flower, Q.jelly, Q.teach,
      Q.words, Q.gift, Q.seesaw,
      Q.bow, Q.dog, Q.friend, Q.leaf, Q.gull,
      Q.ai1, Q.ai2,
      Q.draw, Q.bird, Q.red, Q.together,
    ],
  },
}
