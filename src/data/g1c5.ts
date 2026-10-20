import type { ChoiceQ, MatchQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/首冊/PDF/05.國語首冊單課卷 第9課(教).pdf
// 「paper」開頭的 id 是單課卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「造詞」要自己想語詞，App 沒有放。

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
  hint: `念念看「${char}」，幾個音很像，仔細聽。`, explain: `「${char}」念 ${options[answer]}。`,
})

const MATCH_HINT = '念念看，兩個合起來是不是你聽過的語詞，像「海豚」、「春聯」。'
const match = (id: string, pairs: [string, string][], words: string): MatchQ => ({
  id, type: 'match', prompt: '把可以連成語詞的連起來。', pairs, hint: MATCH_HINT, explain: words,
})

const lesson = (id: string, picture: string, asked: string, options: string[], answer: number, explain: string): ChoiceQ => ({
  id, type: 'choice', picture, prompt: `根據課文：${asked}`, options, answer,
  hint: '想一想課文裡的狂歡會，有誰、在哪裡、做了什麼？', explain,
})

const XIN = ['ㄒㄧㄣ', 'ㄐㄧㄣ', 'ㄑㄧㄣ']
const XUE = ['ㄒㄧㄝˊ', 'ㄒㄩㄝˊ', 'ㄒㄩㄢˊ']

const Q = {
  // 句子裡很像的音
  happy: sound('g1c5-paper-s1', 'ㄨㄛˇ ㄏㄣˇ ㄎㄞ（　）', '我很開心。', '心', ['ㄒㄧㄥ', 'ㄒㄧㄣ'], 1),
  spring: sound('g1c5-paper-s2', 'ㄨㄛˇ ㄒㄧˇ ㄏㄨㄢ（　）ㄊㄧㄢ', '我喜歡春天。', '春', ['ㄔㄨㄥ', 'ㄔㄨㄣ'], 1),
  school: sound('g1c5-paper-s3', 'ㄨㄛˇ ㄑㄩˋ（　）ㄒㄧㄠˋ ㄕㄤˋ ㄎㄜˋ', '我去學校上課。', '學', ['ㄒㄩㄝˊ', 'ㄒㄧㄝˊ'], 0),
  music: sound('g1c5-paper-s4', 'ㄨㄛˇ ㄒㄧˇ ㄏㄨㄢ ㄊㄧㄥ（　）ㄩㄝˋ', '我喜歡聽音樂。', '音', ['ㄧㄥ', 'ㄧㄣ'], 1),
  moon: sound('g1c5-paper-s5', 'ㄧㄡˋ ㄉㄚˋ ㄧㄡˋ ㄩㄢˊ ˙ㄉㄜ（　）ㄌㄧㄤˋ', '又大又圓的月亮。', '月', ['ㄧㄝˋ', 'ㄩㄝˋ'], 1),
  goat: sound('g1c5-paper-s6', 'ㄕㄢ ㄧㄤˊ ㄓㄢˋ ㄗㄞˋ ㄕㄢ（　）ㄕㄤˋ', '山羊站在山崖上。', '崖', ['ㄧㄞˊ', 'ㄧㄝˊ'], 0),

  // 聲調
  tomato: tone('g1c5-v-d1', '🍅', '番茄炒蛋', '茄', 'ㄈㄢ（ㄑㄧㄝ）ㄔㄠˇ ㄉㄢˋ', 'ㄑㄧㄝ', 'ˊ'),
  peacock: tone('g1c5-paper-d1', '🦚', '孔雀開屏', '雀', 'ㄎㄨㄥˇ（ㄑㄩㄝ）ㄎㄞ ㄆㄧㄥˊ', 'ㄑㄩㄝ', 'ˋ'),
  reindeer: tone('g1c5-paper-d2', '🦌', '馴鹿吃草', '馴', '（ㄒㄩㄣ）ㄌㄨˋ ㄔ ㄘㄠˇ', 'ㄒㄩㄣ', 'ˊ'),
  piano: tone('g1c5-paper-d3', '🎹', '鋼琴演奏', '琴', 'ㄍㄤ（ㄑㄧㄣ）ㄧㄢˇ ㄗㄡˋ', 'ㄑㄧㄣ', 'ˊ'),
  skirt: tone('g1c5-paper-d4', '👗', '紅色裙子', '裙', 'ㄏㄨㄥˊ ㄙㄜˋ（ㄑㄩㄣ）˙ㄗ', 'ㄑㄩㄣ', 'ˊ'),
  snowman: tone('g1c5-paper-d5', '⛄', '來堆雪人', '雪', 'ㄌㄞˊ ㄉㄨㄟ（ㄒㄩㄝ）ㄖㄣˊ', 'ㄒㄩㄝ', 'ˇ'),

  // 連成語詞
  m1: match('g1c5-paper-m1', [['ㄒㄩㄣˊ', 'ㄌㄨˋ'], ['ㄎㄨㄥˇ', 'ㄑㄩㄝˋ'], ['ㄏㄞˇ', 'ㄊㄨㄣˊ']], '馴鹿、孔雀、海豚。'),
  m2: match('g1c5-paper-m2', [['ㄇㄚˊ', 'ㄑㄩㄝˋ'], ['ㄐㄩㄣ', 'ㄖㄣˊ'], ['ㄔㄨㄣ', 'ㄌㄧㄢˊ']], '麻雀、軍人、春聯。'),
  m3: match('g1c5-paper-m3', [['ㄍㄨㄣˇ', 'ㄉㄚˋ ㄑㄧㄡˊ'], ['ㄆㄠˋ', 'ㄨㄣ ㄑㄩㄢˊ'], ['ㄊㄢˊ', 'ㄍㄤ ㄑㄧㄣˊ']], '滾大球、泡溫泉、彈鋼琴。'),

  // 選對的字音
  mother: sound('g1c5-paper-c1', '💐\nㄇㄨˇ（　）ㄐㄧㄝˊ ㄎㄨㄞˋ ˙ㄌㄜ', '母親節快樂。', '親', XIN, 2),
  heart: sound('g1c5-paper-c2', '💖\n（　）ㄌㄧˇ ㄓㄣ ㄏㄨㄢ ㄒㄧˇ', '心裡真歡喜。', '心', XIN, 0),
  gold: sound('g1c5-paper-c3', '🥇\nㄏㄨㄛˋ ㄉㄜˊ（　）ㄆㄞˊ', '獲得金牌。', '金', XIN, 1),
  carousel: sound('g1c5-paper-c4', '🎠\nㄨㄛˇ ㄗㄨㄛˋ（　）ㄓㄨㄢˇ ㄇㄨˋ ㄇㄚˇ', '我坐旋轉木馬。', '旋', XUE, 2),
  shoes: sound('g1c5-paper-c5', '👟\nㄒㄧㄠˇ ㄏㄨㄥˊ（　）ㄓㄣ ㄎㄜˇ ㄞˋ', '小紅鞋真可愛。', '鞋', XUE, 0),
  noschool: sound('g1c5-paper-c6', '🏫\nㄐㄧㄣ ㄊㄧㄢ ㄅㄨˊ ㄩㄥˋ ㄕㄤˋ（　）', '今天不用上學。', '學', XUE, 1),

  // 很像的韻母
  grandson: sound('g1c5-paper-c7', '⚽\nㄧㄝˊ ˙ㄧㄝ ㄆㄟˊ（　）˙ㄗ ㄨㄢˊ ㄑㄧㄡˊ', '爺爺陪孫子玩球。', '孫', ['ㄙㄨㄣ', 'ㄙㄨㄥ'], 0),
  squirrel: sound('g1c5-paper-c8', '🐿️\nㄕㄨˋ ㄕㄤˋ ㄧㄡˇ ㄧˋ ㄓ（　）ㄕㄨˇ', '樹上有一隻松鼠。', '松', ['ㄙㄨㄣ', 'ㄙㄨㄥ'], 1),
  cloud: sound('g1c5-paper-c9', '☁️\nㄊㄧㄢ ㄕㄤˋ ㄅㄞˊ（　）ㄆㄧㄠ ˙ㄨㄚ ㄆㄧㄠ', '天上白雲飄哇飄。', '雲', ['ㄧㄣˊ', 'ㄩㄣˊ'], 1),
  bank: sound('g1c5-paper-c10', '🏦\nㄇㄚ ˙ㄇㄚ ㄑㄩˋ（　）ㄏㄤˊ ㄘㄨㄣˊ ㄑㄧㄢˊ', '媽媽去銀行存錢。', '銀', ['ㄧㄣˊ', 'ㄩㄣˊ'], 0),

  // 課文
  where: lesson('g1c5-paper-r1', 'ㄎㄨㄤˊ ㄏㄨㄢ ㄏㄨㄟˋ ˙ㄉㄜ ㄉㄧˋ ㄉㄧㄢˇ ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ', '狂歡會的地點在哪裡？', ['ㄕㄢ ㄧㄞˊ ㄒㄧㄚˋ', 'ㄉㄚˋ ㄏㄞˇ ㄌㄧˇ', 'ㄊㄧㄢ ㄎㄨㄥ ㄓㄨㄥ'], 0,
    '狂歡會在 ㄕㄢ ㄧㄞˊ ㄒㄧㄚˋ（山崖下）。'),
  frog: lesson('g1c5-paper-r2', 'ㄎㄨㄤˊ ㄏㄨㄢ ㄏㄨㄟˋ ㄌㄧˇ，ㄑㄧㄥ ㄨㄚ ㄗㄨㄛˋ ㄕㄣˊ ˙ㄇㄜ', '狂歡會裡，青蛙做什麼？', ['ㄅㄢˋ ㄇㄛˊ ㄕㄨˋ', 'ㄑㄧㄠ ㄉㄚˋ ㄍㄨˇ', 'ㄉㄚˋ ㄏㄜˊ ㄔㄤˋ'], 2,
    '青蛙 ㄉㄚˋ ㄏㄜˊ ㄔㄤˋ（大合唱）。'),
  ball: lesson('g1c5-paper-r3', 'ㄕㄟˊ ㄗㄞˋ ㄎㄨㄤˊ ㄏㄨㄢ ㄏㄨㄟˋ ㄌㄧˇ ㄍㄨㄣˇ ㄉㄚˋ ㄑㄧㄡˊ', '誰在狂歡會裡滾大球？', ['ㄎㄨㄥˇ ㄑㄩㄝˋ', 'ㄒㄧㄠˇ ㄒㄩㄥˊ', 'ㄒㄩㄣˊ ㄌㄨˋ'], 1,
    'ㄒㄧㄠˇ ㄒㄩㄥˊ（小熊）滾大球。'),
  show: lesson('g1c5-paper-r4', 'ㄉㄚˋ ㄐㄧㄚ ˙ㄉㄜ ㄅㄧㄠˇ ㄧㄢˇ ㄗㄣˇ ˙ㄇㄜ ㄧㄤˋ ˙ㄋㄜ', '大家的表演怎麼樣呢？', ['ㄓㄣ ㄐㄧㄥ ㄘㄞˇ', 'ㄏㄠˇ ㄨˊ ㄌㄧㄠˊ', 'ㄏㄣˇ ㄎㄜˇ ㄆㄚˋ'], 0,
    '大家的表演 ㄓㄣ ㄐㄧㄥ ㄘㄞˇ（真精彩）。'),
} satisfies Record<string, Question>

export const g1c5: Unit = {
  id: 'g1c5',
  number: 5,
  grade: 1,
  subject: '國語',
  label: '首冊第 9 課',
  title: '注音符號（五）',
  source: '國語首冊單課卷 第 9 課（康軒）',
  tasks: [
    {
      id: 'g1c5-t1', skill: '分辨很像的音', title: '耳朵豎起來', icon: '👂', blurb: '開心、春天、月亮，仔細聽！',
      questions: [Q.happy, Q.spring, Q.school, Q.music, Q.moon, Q.goat],
    },
    {
      id: 'g1c5-t2', skill: '聲調', title: '聲調小高手', icon: '🎵', blurb: '孔雀、馴鹿、鋼琴，聲調對了嗎？',
      questions: [Q.tomato, Q.peacock, Q.reindeer, Q.piano, Q.skirt, Q.snowman],
    },
    {
      id: 'g1c5-t3', skill: '連成語詞', title: '連成語詞', icon: '🔗', blurb: '海豚、春聯、泡溫泉，連起來！',
      questions: [Q.m1, Q.m2, Q.m3],
    },
    {
      id: 'g1c5-t4', skill: '選對的字音', title: '心、金、親', icon: '💐', blurb: '三個音很像，選對的那一個。',
      questions: [Q.mother, Q.heart, Q.gold, Q.carousel, Q.shoes, Q.noschool],
    },
    {
      id: 'g1c5-t5', skill: '很像的韻母', title: '孫子和松鼠', icon: '🐿️', blurb: '孫和松、雲和銀，差在哪裡？',
      questions: [Q.grandson, Q.squirrel, Q.cloud, Q.bank],
    },
    {
      id: 'g1c5-t6', skill: '課文', title: '山崖下的狂歡會', icon: '🎉', blurb: '誰來了？做了什麼？',
      questions: [Q.where, Q.frog, Q.ball, Q.show],
    },
  ],
  boss: {
    id: 'g1c5-boss', skill: '整份單課卷', title: '首冊魔王（五）', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.happy, Q.spring, Q.school, Q.music, Q.moon, Q.goat,
      Q.peacock, Q.reindeer, Q.piano, Q.skirt, Q.snowman,
      Q.m1, Q.m2, Q.m3,
      Q.mother, Q.heart, Q.gold, Q.carousel, Q.shoes, Q.noschool,
      Q.grandson, Q.squirrel, Q.cloud, Q.bank,
      Q.where, Q.frog, Q.ball, Q.show,
    ],
  },
}
