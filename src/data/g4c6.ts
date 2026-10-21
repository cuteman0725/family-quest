import type { ChoiceQ, NumberQ, Question, TrueFalseQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/06_4上國語隨堂卷_第6課臺灣的驕傲(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；寫筆畫數用數字鍵盤（造詞要自己想，沒有放）；照樣寫改成選出合適的語詞。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const strokes = (id: string, char: string, n: number, hint: string): NumberQ => ({
  id, type: 'number', prompt: `「${char}」一共有幾畫？`, answers: [String(n)], unit: '畫',
  hint: `一筆一筆數，可以用手指在桌上寫寫看。${hint}`, explain: `「${char}」一共 ${n} 畫。`,
})

const SAME = ['○ 意思相似', '× 意思相反']
const pairQ = (id: string, a: string, b: string, isSame: boolean, explain: string) =>
  choice(id, `「${a}」和「${b}」，兩個語詞的意思？`, SAME, isSame ? 0 : 1, '把兩個語詞放回句子裡想一想：意思差不多，還是剛好相反？', explain)

const fact = (id: string, prompt: string, answer: boolean, explain: string): TrueFalseQ => ({
  id, type: 'trueFalse', prompt, answer, hint: '回想課文是怎麼介紹的。', explain,
})

const Q = {
  // 讀音與筆畫
  fu: choice('g4c6-paper-z1', '阿義「俯」身摸摸小狗。「俯」怎麼念？', ['ㄈㄨˊ', 'ㄈㄨˇ', 'ㄈㄨˋ'], 1,
    '和「俯視」的俯一樣，第三聲。', '俯身的「俯」念 ㄈㄨˇ，是彎下身體。'),
  rong: choice('g4c6-paper-z4', '春天到了，積雪也逐漸「融」化。「融」怎麼念？', ['ㄖㄨㄥˊ', 'ㄌㄨㄥˊ', 'ㄖㄨㄣˊ'], 0,
    '翹舌的 ㄖ、後鼻音、第二聲。', '融化的「融」念 ㄖㄨㄥˊ。'),
  kua: choice('g4c6-paper-z6', '選手要在今年的「跨」欄比賽中奪冠。「跨」怎麼念？', ['ㄎㄨㄚ', 'ㄎㄨㄚˇ', 'ㄎㄨㄚˋ'], 2,
    '跨過去、跨越，是第四聲。', '跨欄的「跨」念 ㄎㄨㄚˋ。'),
  reng: choice('g4c6-paper-z7', '不論多忙碌，姐姐每天「仍」會空出時間練習。「仍」怎麼念？', ['ㄖㄥˊ', 'ㄖㄣˊ', 'ㄌㄥˊ'], 0,
    '「仍然」的仍，後鼻音、第二聲。', '仍然的「仍」念 ㄖㄥˊ。'),
  ya: choice('g4c6-paper-z9', '稻米是「亞」洲國家很常見的食物。「亞」怎麼念？', ['ㄧㄚˇ', 'ㄧㄚˋ', 'ㄧㄚˊ'], 1,
    '亞洲的「亞」，臺灣念第四聲。', '亞洲的「亞」念 ㄧㄚˋ。'),
  s1: strokes('g4c6-paper-n1', '跨', 13, '左邊的足有 7 畫，右邊的夸有 6 畫。'),
  s2: strokes('g4c6-paper-n2', '融', 16, '左邊的鬲有 10 畫，右邊的虫有 6 畫。'),
  s3: strokes('g4c6-paper-n3', '仰', 6, '左邊的人字旁有 2 畫。'),

  // 同音字
  yan: choice('g4c6-paper-z2', '整天的疲憊都「ㄧㄢ」消雲散了。「ㄧㄢ」是哪一個字？', ['煙', '菸', '淹', '湮'], 0,
    '像煙一樣散掉，是火字旁的煙。', '煙消雲散的「煙」是火部。'),
  ceng: choice('g4c6-paper-z3', '春天到了，地上「ㄘㄥˊ ㄘㄥˊ」積雪也逐漸融化。「ㄘㄥˊ」是哪一個字？', ['曾', '層', '增', '贈'], 1,
    '一層一層疊起來，是尸部的「層」。', '層層積雪的「層」。'),
  biao: choice('g4c6-paper-z5', '選手立下目「ㄅㄧㄠ」，要在今年的跨欄比賽中奪冠。「ㄅㄧㄠ」是哪一個字？', ['錶', '表', '標', '鏢'], 2,
    '目標：想要達到的地方，木字旁。', '目標的「標」是木部。'),
  gang: choice('g4c6-paper-z8', '姐姐每天仍會空出時間練習彈「ㄍㄤ」琴。「ㄍㄤ」是哪一個字？', ['剛', '鋼', '綱', '缸'], 1,
    '鋼琴裡有金屬的弦，要用金字旁。', '鋼琴的「鋼」是金部。'),
  zhou: choice('g4c6-paper-z10', '稻米是亞「ㄓㄡ」國家很常見的食物。「ㄓㄡ」是哪一個字？', ['州', '洲', '舟', '週'], 1,
    '亞洲、歐洲是大陸，四周有海水，要用三點水。', '亞洲的「洲」是水部；「州」是行政區（像加州）。'),

  // 選字填空
  chi: choice('g4c6-paper-c1', '這件衣服的（　）寸太小，只有妹妹穿得下。', ['只', '尺'], 1, '衣服的大小叫做什麼寸？', '尺寸的「尺」。'),
  zhi: choice('g4c6-paper-c2', '這件衣服的尺寸太小，（　）有妹妹穿得下。', ['只', '尺'], 0, '「只有」：就只有一個。', '只有的「只」。'),
  rou: choice('g4c6-paper-c3', '這家包子店的（　）包麵皮鬆軟。', ['內', '肉'], 1, '包子裡包著豬肉。', '肉包的「肉」。'),
  nei: choice('g4c6-paper-c4', '這家包子店的肉包麵皮鬆軟、（　）餡扎實。', ['內', '肉'], 0, '包在裡面的餡，裡面就是「內」。', '內餡的「內」：裡面的餡。'),
  chao1: choice('g4c6-paper-c5', '爸爸從皮包裡取出（　）票來付款。', ['抄', '鈔'], 1, '紙鈔是錢，跟金屬錢一樣用金字旁。', '鈔票的「鈔」是金部。'),
  chao2: choice('g4c6-paper-c6', '小毅將喜愛的詩句（　）寫在筆記本上。', ['抄', '鈔'], 0, '用手寫下來，是提手旁。', '抄寫的「抄」是手部。'),
  huo1: choice('g4c6-paper-c7', '歌手的新專輯（　）得許多聽眾的好評。', ['護', '獲', '穫'], 1, '得到，是「獲得」。', '獲得的「獲」是犬部。'),
  hu: choice('g4c6-paper-c8', '稻草人可以嚇走麻雀，保（　）作物不被啄食。', ['護', '獲', '穫'], 0, '保護要用說的、守著，言字旁。', '保護的「護」是言部。'),
  huo2: choice('g4c6-paper-c9', '稻草人保護作物，讓農夫在秋天有滿滿的收（　）。', ['護', '獲', '穫'], 2, '收成稻子，禾字旁。', '收穫的「穫」是禾部。'),

  // 語詞
  look: pairQ('g4c6-paper-m1', '仰望', '俯視', false, '仰望是抬頭往上看，俯視是低頭往下看，意思相反。'),
  precious: pairQ('g4c6-paper-m2', '珍貴', '寶貴', true, '珍貴和寶貴都是很有價值，意思相似。'),
  inside: pairQ('g4c6-paper-m3', '內部', '外面', false, '內部是裡面，外面是外頭，意思相反。'),
  protect: pairQ('g4c6-paper-m4', '保護', '愛護', true, '保護和愛護都是照顧、不讓它受傷害，意思相似。'),
  plane: choice('g4c6-paper-y1', '照樣寫：讓「世界」「看見」「臺灣」。讓紙飛機（　）遠方', ['飛向', '俯視', '默默'], 0,
    '中間要填一個動作：紙飛機怎麼樣到遠方？', '讓紙飛機飛向遠方。'),
  lighthouse: choice('g4c6-paper-y2', '照樣寫：「臺北一〇一」總是「靜靜」「俯視」著「街道」。燈塔總是（　）指引著船隻', ['飛向', '默默', '臺灣'], 1,
    '「總是」後面要接「怎麼樣的」，像靜靜、默默。', '燈塔總是默默指引著船隻。'),

  // 西螺大橋
  x1: fact('g4c6-paper-x1', '依據課文，西螺大橋曾是世界第一長橋。', false, '不對。'),
  x2: fact('g4c6-paper-x2', '依據課文，西螺大橋由數十個鋼拱隧道連接而成。', true, '對。'),
  x3: fact('g4c6-paper-x3', '依據課文，西螺大橋位在彰化，橫跨濁水溪。', false, '不對。西螺大橋的地點不是在彰化（西螺在雲林）。'),
  x4: fact('g4c6-paper-x4', '依據課文，每年當地人會在橋下舉辦「西螺大橋觀光文化節」，感謝大橋的守護。', true, '對。'),
  x5: fact('g4c6-paper-x5', '依據課文，過去發行的紙鈔中可以看到西螺大橋的身影。', true, '對。'),

  // 臺北一〇一
  t1: fact('g4c6-paper-t1', '依據課文，臺北一〇一每年都會舉辦跨年煙火。', true, '對。'),
  t2: fact('g4c6-paper-t2', '依據課文，臺北一〇一現在仍然是世界第一高樓。', false, '不對，它曾經是世界第一高樓，現在已經不是了。'),
  t3: fact('g4c6-paper-t3', '依據課文，臺北一〇一大樓的外觀是「高」字造型。', false, '不對。'),
  t4: fact('g4c6-paper-t4', '依據課文，臺北一〇一內部的「阻尼器」是為了減輕地震或強風吹襲所帶來的搖晃。', true, '對。阻尼器可以減少大樓的搖晃。'),
} satisfies Record<string, Question>

export const g4c6: Unit = {
  id: 'g4c6',
  number: 6,
  grade: 4,
  subject: '國語',
  label: '第 6 課',
  title: '臺灣的驕傲',
  source: '4上國語隨堂卷第 6 課（南一）',
  tasks: [
    {
      id: 'g4c6-t1', skill: '讀音與筆畫', title: '讀音與筆畫', icon: '✍️', blurb: '跨有幾畫？融怎麼念？',
      questions: [Q.fu, Q.rong, Q.kua, Q.reng, Q.ya, Q.s1, Q.s2, Q.s3],
    },
    {
      id: 'g4c6-t2', skill: '同音字', title: '同音字大考驗', icon: '🔤', blurb: '亞洲還是亞州？鋼琴還是剛琴？',
      questions: [Q.yan, Q.ceng, Q.biao, Q.gang, Q.zhou],
    },
    {
      id: 'g4c6-t3', skill: '選字填空', title: '只還是尺', icon: '🧩', blurb: '護、獲、穫，三個長得很像！',
      questions: [Q.chi, Q.zhi, Q.rou, Q.nei, Q.chao1, Q.chao2, Q.huo1, Q.hu, Q.huo2],
    },
    {
      id: 'g4c6-t4', skill: '語詞與句型', title: '相似還是相反', icon: '↔️', blurb: '仰望和俯視，意思一樣嗎？',
      questions: [Q.look, Q.precious, Q.inside, Q.protect, Q.plane, Q.lighthouse],
    },
    {
      id: 'g4c6-t5', skill: '課文：西螺大橋', title: '西螺大橋', icon: '🌉', blurb: '紅色的大橋，對還是錯？',
      questions: [Q.x1, Q.x2, Q.x3, Q.x4, Q.x5],
    },
    {
      id: 'g4c6-t6', skill: '課文：臺北一〇一', title: '臺北一〇一', icon: '🏙️', blurb: '阻尼器是做什麼的？',
      questions: [Q.t1, Q.t2, Q.t3, Q.t4],
    },
  ],
  boss: {
    id: 'g4c6-boss', skill: '整份隨堂卷', title: '第六課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.fu, Q.yan, Q.ceng, Q.rong, Q.biao, Q.kua, Q.reng, Q.gang, Q.ya, Q.zhou,
      Q.chi, Q.zhi, Q.rou, Q.nei, Q.chao1, Q.chao2, Q.huo1, Q.hu, Q.huo2,
      Q.s1, Q.s2, Q.s3,
      Q.look, Q.precious, Q.inside, Q.protect,
      Q.x1, Q.x2, Q.x3, Q.x4, Q.x5, Q.t1, Q.t2, Q.t3, Q.t4,
      Q.plane, Q.lighthouse,
    ],
  },
}
