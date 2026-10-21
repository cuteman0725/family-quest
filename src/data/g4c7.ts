import type { BinsQ, ChoiceQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/07_4上國語隨堂卷_第7課到此「藝」遊(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；多音字「禁」用分類籃子；照樣寫改成選出合適的語詞。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const IDIOMS = ['古色古香', '喜氣洋洋', '五顏六色', '目不轉睛', '流連忘返']
const IDIOM_MEANING = '古色古香：有古代的味道。喜氣洋洋：到處充滿歡喜。五顏六色：顏色很多。目不轉睛：眼睛一直盯著看。流連忘返：玩得捨不得離開。'
const idiom = (id: string, sentence: string, answer: string, explain: string) =>
  choice(id, `${sentence}（　）裡要填哪一個語詞？`, IDIOMS, IDIOMS.indexOf(answer), IDIOM_MEANING, explain)

const COPY = '照樣寫：「一個個」「紅燈籠」，「看」起來「喜氣洋洋」。'

const Q = {
  // 字音字形
  ju: choice('g4c7-paper-z1', '電影的「ㄐㄩˋ」情緊張刺激，大家都看得目不轉睛。「ㄐㄩˋ」是哪一個字？', ['據', '劇', '鋸', '具'], 1,
    '電影、戲劇的故事內容叫做什麼情？', '劇情的「劇」，是戲劇的劇。'),
  mu: choice('g4c7-paper-z2', '電影的劇情緊張刺激，大家都看得「目」不轉睛。「目」怎麼念？', ['ㄇㄨˇ', 'ㄇㄨˋ', 'ㄇㄛˋ'], 1,
    '目就是眼睛，第四聲。', '目不轉睛的「目」念 ㄇㄨˋ。'),
  nian: choice('g4c7-paper-z3', '今天是爸媽的結婚紀「念」日。「念」怎麼念？', ['ㄋㄧㄢˋ', 'ㄋㄧㄤˋ', 'ㄌㄧㄢˋ'], 0,
    '前鼻音 ㄢ、第四聲。', '紀念的「念」念 ㄋㄧㄢˋ。'),
  zhi: choice('g4c7-paper-z4', '今天是爸媽的結婚紀念日，「ㄓˊ」得好好慶祝一番。「ㄓˊ」是哪一個字？', ['直', '值', '植', '殖'], 1,
    '值得：有意義、應該去做。', '值得的「值」，人字旁。'),
  tong: choice('g4c7-paper-z5', '工作人員正在「ㄊㄨㄥˇ」計搭乘渡輪的人數。「ㄊㄨㄥˇ」是哪一個字？', ['桶', '筒', '統', '痛'], 2,
    '把數字一個一個算起來叫什麼計？', '統計的「統」，糸部。'),
  du: choice('g4c7-paper-z6', '工作人員正在統計搭乘「渡」輪的人數。「渡」怎麼念？', ['ㄉㄨˇ', 'ㄉㄨˋ', 'ㄊㄨˋ'], 1,
    '和「度」的聲音一樣，第四聲。', '渡輪的「渡」念 ㄉㄨˋ，是過河、過海的船。'),
  mian: choice('g4c7-paper-z7', '媽媽把煮好的「ㄇㄧㄢˋ」條和湯放入陶碗中。「ㄇㄧㄢˋ」是哪一個字？', ['面', '麵', '棉', '免'], 1,
    '可以吃的麵條，左邊是「麥」。', '麵條的「麵」是麥部；「面」是臉、表面。'),
  tao: choice('g4c7-paper-z8', '媽媽把麵條和湯放入「陶」碗中。「陶」怎麼念？', ['ㄉㄠˊ', 'ㄊㄠˊ', 'ㄊㄠˋ'], 1,
    '陶瓷的陶，送氣音 ㄊ、第二聲。', '陶碗的「陶」念 ㄊㄠˊ。'),

  // 改錯字
  dou: typo('g4c7-paper-t1', '農夫戴著抖笠，在大太陽下除草。', '抖', ['斗', '陡', '豆'], '斗',
    '戴在頭上遮太陽的帽子，叫什麼笠？', '斗笠的「斗」；「抖」是發抖的抖。'),
  mang: typo('g4c7-paper-t2', '太陽發出耀眼的光芷，照亮了大地。', '芷', ['芒', '忙', '盲'], '芒',
    '光線一條一條射出來，叫光什麼？', '光芒的「芒」。'),
  // 「請」在句子裡出現兩次（後面的「出門請攜帶」是對的），所以用語詞模式
  qing: {
    id: 'g4c7-paper-t3', type: 'typo', prompt: '找出句子裡的錯字，再把它改正。',
    sentence: '最近天氣陰請不定，出門請攜帶雨傘。',
    words: ['最近', '天氣', '陰請不定', '，', '出門', '請', '攜帶', '雨傘', '。'], wrong: 2,
    options: ['陰情不定', '陰晴不定', '陰清不定'], answer: 1,
    hint: '天氣有陰天、有晴天，要用日字旁。', explain: '陰晴不定的「晴」，日部。',
  } satisfies TypoQ,
  suo: typo('g4c7-paper-t4', '特技演員在鋼牽上靈巧的表演，獲得觀眾如雷掌聲。', '牽', ['索', '鎖', '所'], '索',
    '很粗的繩子叫繩索，鋼做的繩子叫鋼什麼？', '鋼索的「索」：粗繩子。'),
  fan: typo('g4c7-paper-t5', '每到除夕，過年反鄉的人潮總會造成交通嚴重堵塞。', '反', ['返', '飯', '範'], '返',
    '回到家鄉，是走路的動作，要有辵（辶）。', '返鄉的「返」：回去。'),
  yu: typo('g4c7-paper-t6', '這位母親身兼數職，獨自養肓兒女長大。', '肓', ['育', '欲', '浴'], '育',
    '養大孩子叫做養什麼？', '養育的「育」；「肓」是另一個字（病入膏肓）。'),

  // 成語填空
  i1: idiom('g4c7-paper-c1', '日月潭的湖光山色讓我們（　），遲遲不肯離開。', '流連忘返', '玩得捨不得離開：流連忘返。'),
  i2: idiom('g4c7-paper-c2', '過年時，家家戶戶都貼上紅色春聯，村裡一片（　）。', '喜氣洋洋', '過年到處都很歡喜：喜氣洋洋。'),
  i3: idiom('g4c7-paper-c3', '妹妹房間裡裝飾著（　）的花朵，顯得繽紛活潑。', '五顏六色', '很多顏色的花朵：五顏六色。'),
  i4: idiom('g4c7-paper-c4', '小貓（　）的看著牆壁上的壁虎，似乎在好奇牠會不會移動。', '目不轉睛', '眼睛一直盯著看：目不轉睛。'),
  i5: idiom('g4c7-paper-c5', '看到故宮博物院裡（　）的文物，遊客們的眼睛都為之一亮。', '古色古香', '很古老、有古代味道的文物：古色古香。'),

  // 語詞與多音字
  jin: {
    id: 'g4c7-paper-b1', type: 'bins', prompt: '「禁」有兩個讀音。把語詞放進對的讀音籃子。', bins: ['ㄐㄧㄣˋ（不准）', 'ㄐㄧㄣ（忍得住、受得了）'],
    items: [{ label: '禁止通行', bin: 0 }, { label: '禁不起強烈颱風', bin: 1 }, { label: '嚴禁大聲喧嘩', bin: 0 }, { label: '情不自禁', bin: 1 }],
    hint: '是「不准做」念第四聲；是「忍住、受得住」念第一聲。',
    explain: 'ㄐㄧㄣˋ：禁止通行、嚴禁大聲喧嘩。ㄐㄧㄣ：禁不起強烈颱風、情不自禁。',
  } satisfies BinsQ,
  bujin: choice('g4c7-paper-x1', '「這部電影中主角悲慘的遭遇，讓觀眾□□留下同情的淚水。」□□要填哪一個？', ['不只', '不禁', '不但', '不僅'], 1,
    '忍不住就流下眼淚，是「不禁」。', '不禁：忍不住。'),
  fear: choice('g4c7-paper-x2', '「即使經過好多年，但只要提到九二一大地震，大家仍然□□□□。」要填哪一個？', ['如釋重負', '興高采烈', '流連忘返', '心有餘悸'], 3,
    '想到可怕的事，心裡還是會怕。', '心有餘悸：事情過去了，想起來還是害怕。'),
  copy1: choice('g4c7-paper-y1', `${COPY}一道道佳餚，嘗起來（　）`, ['美味無比', '一本本', '紅燈籠'], 0,
    '最後要填「嘗起來」的感覺。', '一道道佳餚，嘗起來美味無比。'),
  copy2: choice('g4c7-paper-y2', `${COPY}一本本故事書，（　）起來趣味橫生`, ['嘗', '讀', '喝'], 1,
    '故事書要用什麼動作？', '一本本故事書，讀起來趣味橫生。'),

  // 課文理解與造句
  weather: choice('g4c7-paper-r1', '依據課文，戶外教育日當天的天氣如何？', ['陽光普照的晴天', '雷電交加的雨天', '天色灰暗的陰天', '天寒地凍的下雪天'], 2,
    '回想課文一開始寫的天氣。', '戶外教育日那天是天色灰暗的陰天。'),
  fact: choice('g4c7-paper-r2', '依據課文，下列敘述何者正確？', ['作者買了五顏六色的捏麵人當作紀念品', '作者是和爸爸媽媽一起去參觀宜蘭傳藝園區', '魯班街販賣許多特色紀念品', '劇場表演的劇目是「噶瑪蘭公主」'], 3,
    '一個一個想：誰去的？在劇場看了什麼？', '劇場表演的劇目是「噶瑪蘭公主」。'),
  some: {
    id: 'g4c7-paper-s1', type: 'sort', order: 'steps', prompt: '用「有人……有人……」造句：把句子排好。',
    items: ['有人在品嘗道地的傳統料理。', '美食街有各式各樣的餐廳，', '有人在大啖異國美食，'], steps: [1, 2, 0],
    hint: '先說地方，再用兩個「有人」說大家在做什麼。', explain: '美食街有各式各樣的餐廳，有人在大啖異國美食，有人在品嘗道地的傳統料理。',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c7: Unit = {
  id: 'g4c7',
  number: 7,
  grade: 4,
  subject: '國語',
  label: '第 7 課',
  title: '到此「藝」遊',
  source: '4上國語隨堂卷第 7 課（南一）',
  tasks: [
    {
      id: 'g4c7-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '麵條還是面條？劇情還是據情？',
      questions: [Q.ju, Q.mu, Q.nian, Q.zhi, Q.tong, Q.du, Q.mian, Q.tao],
    },
    {
      id: 'g4c7-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '抖笠？光芷？把錯字抓出來！',
      questions: [Q.dou, Q.mang, Q.qing, Q.suo, Q.fan, Q.yu],
    },
    {
      id: 'g4c7-t3', skill: '成語填空', title: '成語填空', icon: '🧩', blurb: '流連忘返、目不轉睛，放進對的句子。',
      questions: [Q.i1, Q.i2, Q.i3, Q.i4, Q.i5],
    },
    {
      id: 'g4c7-t4', skill: '語詞與多音字', title: '禁有兩個音', icon: '🚫', blurb: '禁止和情不自禁，念法不一樣。',
      questions: [Q.jin, Q.bujin, Q.fear, Q.copy1, Q.copy2],
    },
    {
      id: 'g4c7-t5', skill: '課文理解與造句', title: '傳藝園區', icon: '🎭', blurb: '戶外教育日去了哪裡？',
      questions: [Q.weather, Q.fact, Q.some],
    },
  ],
  boss: {
    id: 'g4c7-boss', skill: '整份隨堂卷', title: '第七課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.ju, Q.mu, Q.nian, Q.zhi, Q.tong, Q.du, Q.mian, Q.tao,
      Q.dou, Q.mang, Q.qing, Q.suo, Q.fan, Q.yu,
      Q.i1, Q.i2, Q.i3, Q.i4, Q.i5,
      Q.jin, Q.bujin, Q.fear, Q.weather, Q.fact,
      Q.copy1, Q.copy2, Q.some,
    ],
  },
}
