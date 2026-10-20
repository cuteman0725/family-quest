import type { ChoiceQ, Question, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/首冊/PDF/02.國語首冊單課卷 第3-4課(教).pdf
// 「paper」開頭的 id 是單課卷原題（圖片改用 emoji）；「v」開頭的是練習變化題。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在上面的大圖（picture）和選項裡。
// 卷子上「寫出正確的注音符號」是幫語詞加上聲調，改成從四個聲調裡選。

const spell = (id: string, a: string, b: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${a} ＋ ${b}`, prompt: '拼拼看，兩個合起來是哪一個？', options, answer: options.indexOf(answer),
  hint: '先念前面的，再念後面的，快快的連在一起念，最後加上聲調。', explain: `${a} 和 ${b} 拼起來是 ${answer}。`,
})

/** 聲調：base 是沒有聲調的音，tone 是正確的聲調（'' 是一聲） */
const TONES = ['', 'ˊ', 'ˇ', 'ˋ']
const tone = (id: string, emoji: string, word: string, char: string, shown: string, base: string, right: string): ChoiceQ => {
  const options = TONES.map((t) => base + t)
  return {
    id, type: 'choice', picture: `${emoji}\n${shown}`, prompt: `這是${word}。「${char}」要加上哪一個聲調？`, options, answer: options.indexOf(base + right),
    hint: `慢慢念「${word}」，聽聽看「${char}」的聲音是平平的、往上、先下再上，還是往下。`,
    explain: `${word}的「${char}」念 ${base + right}。`,
  }
}

/** 選出正確的拼音：念出整句（包含要選的語詞），從拼法很像的選項裡選 */
const pick = (id: string, picture: string, said: string, word: string, options: string[], answer: number, explain: string): ChoiceQ => ({
  id, type: 'choice', picture, prompt: `${said}「${word}」的注音是哪一個？`, options, answer,
  hint: `慢慢念「${word}」，一個字一個字聽，再看哪一個拼得一樣。`, explain,
})

/** 句子裡的音：大圖是注音句子，空格的字要選對 */
const sound = (id: string, picture: string, said: string, char: string, options: string[], answer: number): ChoiceQ => ({
  id, type: 'choice', picture, prompt: `${said}「${char}」的注音是哪一個？`, options, answer,
  hint: `念念看「${char}」，兩個音很像，仔細聽。`, explain: `「${char}」念 ${options[answer]}。`,
})

const lesson = (id: string, zhuyin: string, said: string, options: string[], answer: number, explain: string): ChoiceQ => ({
  id, type: 'choice', picture: zhuyin, prompt: `課文說：「${said}」空格要填哪一個？`, options, answer,
  hint: '想一想課文裡的句子，念念看哪一個放進去最通順。', explain,
})

const Q = {
  // 拼音練習
  zhou: spell('g1c2-paper-p1', 'ㄓ', 'ㄡˋ', ['ㄔㄡˋ', 'ㄓㄡˋ', 'ㄓㄠˋ'], 'ㄓㄡˋ'),
  shan: spell('g1c2-paper-p2', 'ㄕ', 'ㄢ', ['ㄕㄢ', 'ㄙㄢ', 'ㄕㄤ'], 'ㄕㄢ'),
  xi: spell('g1c2-paper-p3', 'ㄒ', 'ㄧˋ', ['ㄑㄧˋ', 'ㄒㄩˋ', 'ㄒㄧˋ'], 'ㄒㄧˋ'),
  lei: spell('g1c2-paper-p4', 'ㄌ', 'ㄟˇ', ['ㄌㄟˇ', 'ㄋㄟˇ', 'ㄌㄞˇ'], 'ㄌㄟˇ'),
  chuan: spell('g1c2-paper-p5', 'ㄔ', 'ㄨㄢˋ', ['ㄓㄨㄢˋ', 'ㄔㄨㄢˋ', 'ㄔㄨㄤˋ'], 'ㄔㄨㄢˋ'),
  qiao: spell('g1c2-paper-p6', 'ㄑ', 'ㄧㄠˊ', ['ㄒㄧㄠˊ', 'ㄑㄧㄡˊ', 'ㄑㄧㄠˊ'], 'ㄑㄧㄠˊ'),

  // 聲調
  magic: tone('g1c2-v-d1', '🪄', '魔法', '魔', '（ㄇㄛ）ㄈㄚˇ', 'ㄇㄛ', 'ˊ'),
  penguin: tone('g1c2-paper-d1', '🐧', '企鵝', '企', '（ㄑㄧ）ㄜˊ', 'ㄑㄧ', 'ˋ'),
  bridge: tone('g1c2-paper-d2', '🌉', '吊橋', '吊', '（ㄉㄧㄠ）ㄑㄧㄠˊ', 'ㄉㄧㄠ', 'ˋ'),
  floor: tone('g1c2-paper-d3', '🏢', '二樓', '二', '（ㄦ）ㄌㄡˊ', 'ㄦ', 'ˋ'),
  treasure: tone('g1c2-paper-d4', '💰', '寶藏', '藏', 'ㄅㄠˇ（ㄗㄤ）', 'ㄗㄤ', 'ˋ'),
  bowl: tone('g1c2-paper-d5', '🍽️', '碗盤', '碗', '（ㄨㄢ）ㄆㄢˊ', 'ㄨㄢ', 'ˇ'),
  diamond: tone('g1c2-paper-d6', '💎', '鑽石', '鑽', '（ㄗㄨㄢ）ㄕˊ', 'ㄗㄨㄢ', 'ˋ'),

  // 選出正確的拼音
  corn: pick('g1c2-paper-k1', '🌽', '這是玉米。', '玉米', ['ㄧˋ ㄇㄧˇ', 'ㄩˋ ㄇㄧˇ', 'ㄩˋ ㄇㄟˇ'], 1, '玉米念 ㄩˋ ㄇㄧˇ。'),
  witch: pick('g1c2-paper-k2', '🧙', '這是巫婆。', '巫婆', ['ㄨ ㄆㄛˊ', 'ㄏㄨ ㄆㄛˊ', 'ㄨ ㄆㄡˊ'], 0, '巫婆念 ㄨ ㄆㄛˊ。'),
  onetwo: pick('g1c2-paper-k3', '（　）ㄕㄡˇ ㄌㄚ ㄕㄡˇ', '一二一，手拉手。', '一二一', ['ㄧ ㄜˋ ㄧ', 'ㄧ ㄦˋ ㄧ', 'ㄧ ㄡˋ ㄧ'], 1, '一二一念 ㄧ ㄦˋ ㄧ。'),
  fox: pick('g1c2-paper-k4', 'ㄕ ˙ㄗ ㄩˋ ㄉㄠˋ ˙ㄌㄜ（　）', '獅子遇到了狐狸。', '狐狸', ['ㄏㄨˊ ㄌㄧˊ', 'ㄏㄜˊ ㄌㄧˊ', 'ㄈㄨˊ ㄌㄧˊ'], 0, '狐狸念 ㄏㄨˊ ㄌㄧˊ。'),
  giggle: pick('g1c2-paper-k5', 'ㄇㄟˋ ˙ㄇㄟ（　）', '妹妹笑嘻嘻。', '笑嘻嘻', ['ㄒㄧㄠˋ ㄒㄧ ㄒㄧ', 'ㄑㄧㄠˋ ㄑㄧ ㄑㄧ', 'ㄉㄧㄠˋ ㄇㄧ ㄇㄧ'], 0, '笑嘻嘻念 ㄒㄧㄠˋ ㄒㄧ ㄒㄧ。'),
  frisbee: pick('g1c2-paper-k6', 'ㄉㄧˋ ˙ㄉㄧ ㄨㄢˊ（　）', '弟弟玩飛盤。', '飛盤', ['ㄏㄟ ㄆㄢˊ', 'ㄈㄟ ㄆㄢˊ', 'ㄈㄟ ㄆㄤˊ'], 1, '飛盤念 ㄈㄟ ㄆㄢˊ。'),
  shark: pick('g1c2-paper-k7', '（　）˙ㄉㄜ ㄧㄚˊ ㄔˇ ㄏㄠˇ ㄉㄚˋ', '鯊魚的牙齒好大。', '鯊魚', ['ㄓㄚ ㄩˊ', 'ㄔㄚ ㄩˊ', 'ㄕㄚ ㄩˊ'], 2, '鯊魚念 ㄕㄚ ㄩˊ。'),
  soap: pick('g1c2-paper-k8', 'ㄨㄛˇ ㄓㄠˇ ㄉㄠˋ（　）˙ㄌㄜ', '我找到肥皂了。', '肥皂', ['ㄈㄟˊ ㄓㄠˋ', 'ㄇㄟˊ ㄗㄠˋ', 'ㄈㄟˊ ㄗㄠˋ'], 2, '肥皂念 ㄈㄟˊ ㄗㄠˋ。'),

  // 句子裡很像的音
  huan: sound('g1c2-paper-s1', 'ㄏㄜˊ ㄇㄚˇ（　）ㄒㄧˇ ㄑㄩˋ ㄆㄠˋ ㄗㄠˇ', '河馬歡喜去泡澡。', '歡', ['ㄏㄨㄢ', 'ㄏㄢ'], 0),
  qu: sound('g1c2-paper-s2', 'ㄏㄜˊ ㄇㄚˇ ㄏㄨㄢ ㄒㄧˇ（　）ㄆㄠˋ ㄗㄠˇ', '河馬歡喜去泡澡。', '去', ['ㄑㄧˋ', 'ㄑㄩˋ'], 1),
  seesaw: sound('g1c2-paper-s3', 'ㄨㄛˇ ㄨㄢˊ（　）ㄅㄢˇ ㄒㄧㄠˋ ㄒㄧ ㄒㄧ', '我玩蹺蹺板笑嘻嘻。', '蹺蹺', ['ㄑㄧㄠˋ ㄑㄧㄠˋ', 'ㄒㄧㄠˋ ㄒㄧㄠˋ'], 0),
  laugh: sound('g1c2-paper-s4', 'ㄨㄛˇ ㄨㄢˊ ㄑㄧㄠˋ ㄑㄧㄠˋ ㄅㄢˇ（　）ㄒㄧ ㄒㄧ', '我玩蹺蹺板笑嘻嘻。', '笑', ['ㄑㄧㄠˋ', 'ㄒㄧㄠˋ'], 1),
  date: sound('g1c2-paper-s5', 'ㄅㄚˋ ˙ㄅㄚ ㄔ（　）ㄉㄨˊ ㄅㄠˋ ㄓˇ', '爸爸吃棗子讀報紙。', '棗子', ['ㄗㄠˇ ˙ㄗ', 'ㄓㄠˇ ˙ㄗ'], 0),
  paper: sound('g1c2-paper-s6', 'ㄅㄚˋ ˙ㄅㄚ ㄔ ㄗㄠˇ ˙ㄗ ㄉㄨˊ（　）', '爸爸吃棗子讀報紙。', '報紙', ['ㄅㄠˋ ㄓˇ', 'ㄅㄠˋ ㄗˇ'], 0),
  hungry: sound('g1c2-paper-s7', 'ㄉㄧˋ ˙ㄉㄧ ㄉㄨˋ ˙ㄗ（　）˙ㄌㄜ ㄧㄠˋ ㄔ ㄈㄢˋ', '弟弟肚子餓了要吃飯。', '餓', ['ㄦˋ', 'ㄜˋ'], 1),
  rice: sound('g1c2-paper-s8', 'ㄉㄧˋ ˙ㄉㄧ ㄉㄨˋ ˙ㄗ ㄜˋ ˙ㄌㄜ ㄧㄠˋ ㄔ（　）', '弟弟肚子餓了要吃飯。', '飯', ['ㄈㄤˋ', 'ㄈㄢˋ'], 1),

  // 根據課文
  beaver: lesson('g1c2-paper-r1', 'ㄏㄜˊ ㄌㄧˊ ㄇㄤˊ ˙ㄓㄜ ㄑㄩˋ（　）', '河狸忙著去（　）。', ['ㄆㄠˋ ㄗㄠˇ', 'ㄆㄠˇ ㄅㄨˋ', 'ㄓㄨˊ ㄔㄠˊ'], 2,
    '河狸忙著去 ㄓㄨˊ ㄔㄠˊ（築巢）。'),
  schoolbag: lesson('g1c2-paper-r2', 'ㄅㄟ ˙ㄓㄜ（　）ㄏㄠˇ ㄏㄨㄢ ㄒㄧˇ', '背著（　）好歡喜。', ['ㄆㄧˊ ㄅㄠ', 'ㄕㄨ ㄅㄠ', 'ㄑㄧㄢˊ ㄅㄠ'], 1,
    '背著 ㄕㄨ ㄅㄠ（書包）好歡喜。'),
  hippo: lesson('g1c2-v-r1', 'ㄏㄜˊ ㄇㄚˇ ㄏㄨㄢ ㄒㄧˇ ㄑㄩˋ（　）', '河馬歡喜去（　）。', ['ㄆㄠˋ ㄗㄠˇ', 'ㄓㄨˊ ㄔㄠˊ', 'ㄉㄨˊ ㄅㄠˋ ㄓˇ'], 0,
    '河馬歡喜去 ㄆㄠˋ ㄗㄠˇ（泡澡）。'),
  play: lesson('g1c2-v-r2', 'ㄨㄛˇ ㄨㄢˊ（　）ㄒㄧㄠˋ ㄒㄧ ㄒㄧ', '我玩（　）笑嘻嘻。', ['ㄈㄟ ㄆㄢˊ', 'ㄑㄧㄠˋ ㄑㄧㄠˋ ㄅㄢˇ', 'ㄗㄠˇ ˙ㄗ'], 1,
    '我玩 ㄑㄧㄠˋ ㄑㄧㄠˋ ㄅㄢˇ（蹺蹺板）笑嘻嘻。'),
} satisfies Record<string, Question>

export const g1c2: Unit = {
  id: 'g1c2',
  number: 2,
  grade: 1,
  subject: '國語',
  label: '首冊 3～4 課',
  title: '注音符號（二）',
  source: '國語首冊單課卷 第 3-4 課（康軒）',
  tasks: [
    {
      id: 'g1c2-t1', skill: '拼音', title: '拼拼看', icon: '🧲', blurb: '兩個、三個符號合起來念。',
      questions: [Q.zhou, Q.shan, Q.xi, Q.lei, Q.chuan, Q.qiao],
    },
    {
      id: 'g1c2-t2', skill: '聲調', title: '聲調小高手', icon: '🎵', blurb: '平平的、往上、先下再上、往下。',
      questions: [Q.magic, Q.penguin, Q.bridge, Q.floor, Q.treasure, Q.bowl, Q.diamond],
    },
    {
      id: 'g1c2-t3', skill: '選出正確的拼音', title: '哪一個拼對了', icon: '🦈', blurb: '狐狸、鯊魚、肥皂，怎麼拼？',
      questions: [Q.corn, Q.witch, Q.onetwo, Q.fox, Q.giggle, Q.frisbee, Q.shark, Q.soap],
    },
    {
      id: 'g1c2-t4', skill: '分辨很像的音', title: '耳朵豎起來', icon: '👂', blurb: '歡和寒、去和氣，仔細聽！',
      questions: [Q.huan, Q.qu, Q.seesaw, Q.laugh, Q.date, Q.paper, Q.hungry, Q.rice],
    },
    {
      id: 'g1c2-t5', skill: '課文填空', title: '河馬和河狸', icon: '🦫', blurb: '課文裡說了什麼？',
      questions: [Q.beaver, Q.schoolbag, Q.hippo, Q.play],
    },
  ],
  boss: {
    id: 'g1c2-boss', skill: '整份單課卷', title: '首冊魔王（二）', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.zhou, Q.shan, Q.xi, Q.lei, Q.chuan, Q.qiao,
      Q.huan, Q.qu, Q.seesaw, Q.laugh, Q.date, Q.paper, Q.hungry, Q.rice,
      Q.corn, Q.witch,
      Q.penguin, Q.bridge, Q.floor, Q.treasure, Q.bowl, Q.diamond,
      Q.onetwo, Q.fox, Q.giggle, Q.frisbee, Q.shark, Q.soap,
      Q.beaver, Q.schoolbag,
    ],
  },
}
