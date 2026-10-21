import type { ChoiceQ, Question, SortQ, TrueFalseQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/11_4上國語隨堂卷_第11課豆粥婆婆(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；照樣寫改成選出合適的語詞；造句改成排句子。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const WORDS = ['黑漆漆', '飛砂走石', '放聲大哭', '黏答答', '面無血色', '滿頭大汗']
const WORDS_MEANING = '黑漆漆：非常黑。飛砂走石：風很大，砂石亂飛。放聲大哭：大聲的哭。黏答答：又溼又黏。面無血色：嚇得臉發白。滿頭大汗：頭上都是汗。'
const word = (id: string, sentence: string, answer: string, explain: string) =>
  choice(id, `${sentence}（　）裡要填哪一個語詞？`, WORDS, WORDS.indexOf(answer), WORDS_MEANING, explain)

const TIGER = ['大拇指與食指相連的部位', '比喻非常危險的地方']

const fact = (id: string, prompt: string, answer: boolean, explain: string): TrueFalseQ => ({
  id, type: 'trueFalse', prompt: `依據課文：${prompt}`, answer, hint: '回想〈豆粥婆婆〉的故事。', explain,
})

const sentence = (id: string, prompt: string, items: string[], steps: number[], hint: string, explain: string): SortQ => ({
  id, type: 'sort', order: 'steps', prompt, items, steps, hint, explain,
})

const Q = {
  // 字音字形
  li: choice('g4c11-paper-z1', '「ㄌㄧˋ」子雞湯是媽媽的拿手好菜。「ㄌㄧˋ」是哪一個字？', ['粒', '栗', '立', '利'], 1,
    '一種秋天的堅果，下面是木。', '栗子的「栗」，下面是木。'),
  chang: choice('g4c11-paper-z2', '栗子雞湯「嘗」起來甘甜又順口。「嘗」怎麼念？', ['ㄔㄤˊ', 'ㄕㄤˇ', 'ㄔㄤˇ'], 0,
    '和「嘗試」的嘗一樣，翹舌音、第二聲。', '嘗起來的「嘗」念 ㄔㄤˊ。'),
  tong: choice('g4c11-paper-z3', '感冒的妹妹頭「痛」又流鼻涕。「痛」怎麼念？', ['ㄊㄨㄥ', 'ㄊㄨㄥˊ', 'ㄊㄨㄥˋ'], 2,
    '痛就是很不舒服，第四聲。', '頭痛的「痛」念 ㄊㄨㄥˋ。'),
  jia: choice('g4c11-paper-z4', '妹妹頭痛又流鼻涕，臉「ㄐㄧㄚˊ」發燙。「ㄐㄧㄚˊ」是哪一個字？', ['夾', '頰', '莢', '俠'], 1,
    '臉的兩邊，右邊是「頁」（跟頭有關）。', '臉頰的「頰」是頁部。'),
  po: choice('g4c11-paper-z5', '生態保育員苦口「ㄆㄛˊ」心的勸導大家。「ㄆㄛˊ」是哪一個字？', ['破', '婆', '坡', '頗'], 1,
    '苦口婆心：像老婆婆一樣好心的一直勸。', '苦口婆心的「婆」。'),
  xie: choice('g4c11-paper-z6', '希望大家不要在海邊留下垃圾，還給招潮「ㄒㄧㄝˋ」乾淨的家。「ㄒㄧㄝˋ」是哪一個字？', ['謝', '蟹', '卸', '瀉'], 1,
    '螃蟹是動物，下面是虫。', '招潮蟹的「蟹」是虫部。'),
  yin: choice('g4c11-paper-z7', '森林裡「ㄧㄣ」森森的，一點點風吹草動便嚇得小娟拚命奔跑。「ㄧㄣ」是哪一個字？', ['音', '陰', '因', '茵'], 1,
    '陰森森：暗暗的、讓人害怕，阝字旁。', '陰森森的「陰」。'),
  pan: choice('g4c11-paper-z8', '一點點風吹草動，便嚇得小娟「拚」命奔跑。「拚」怎麼念？', ['ㄆㄧㄣ', 'ㄆㄢ', 'ㄆㄢˋ'], 1,
    '拚命：用盡全力，這裡念 ㄆㄢ。', '拚命的「拚」念 ㄆㄢ。'),

  // 改錯字
  ai: typo('g4c11-paper-t1', '親人突然離世，讓小萱衷痛不已。', '衷', ['哀', '衰', '表'], '哀',
    '非常傷心叫做哀痛，中間是口。', '哀痛的「哀」，中間是口；「衷」中間是中。'),
  xue: typo('g4c11-paper-t2', '哥哥會定期到醫院捐皿，希望能幫助有需要的人。', '皿', ['血', '雪', '穴'], '血',
    '捐給醫院幫助病人的，是身體裡紅紅的液體。', '捐血的「血」，比「皿」多一撇。'),
  heng: typo('g4c11-paper-t3', '面對國王蠻璜不講理的命令，各地的人民紛紛發起抗議。', '璜', ['橫', '黃', '煌'], '橫',
    '蠻橫：很兇、不講道理，木字旁。', '蠻橫的「橫」是木部。'),
  gang: typo('g4c11-paper-t4', '爸爸利用假日清洗魚扛，讓魚兒有良好的生活環境。', '扛', ['缸', '江', '杠'], '缸',
    '養魚的容器叫魚缸，左邊是缶（瓶罐）。', '魚缸的「缸」是缶部。'),
  xi: typo('g4c11-paper-t5', '夏天的夜晚，奶奶在床上鋪上涼席，舒舒服服的睡著了。', '席', ['蓆', '習', '息'], '蓆',
    '用草編成、鋪在床上的，要有草字頭。', '涼蓆的「蓆」有草字頭。'),

  // 選詞填寫
  w1: word('g4c11-paper-c1', '大卡車經過時，一片（　），瑪莉趕緊用手遮住口鼻，抵擋風沙。', '飛砂走石', '砂石亂飛：飛砂走石。'),
  w2: word('g4c11-paper-c2', '社區因颱風而停電了，屋裡（　）的，什麼都看不到。', '黑漆漆', '停電非常黑：黑漆漆。'),
  w3: word('g4c11-paper-c3', '阿峻被突如其來的意外嚇得（　），到現在仍然驚魂未定。', '面無血色', '嚇得臉發白：面無血色。'),
  w4: word('g4c11-paper-c4', '大雨過後，屋外到處都是（　）的泥濘地，很不好走。', '黏答答', '泥巴又溼又黏：黏答答。'),
  w5: word('g4c11-paper-c5', '校車遲到了十分鐘都還沒有出現，趕著上學的小晴急得（　）。', '滿頭大汗', '急得流汗：滿頭大汗。'),
  w6: word('g4c11-paper-c6', '妹妹發現自己心愛的洋娃娃不見了，難過得（　）。', '放聲大哭', '大聲的哭：放聲大哭。'),

  // 語詞與句型
  tiger1: choice('g4c11-paper-m1', '「哥哥使用美工刀的姿勢不正確，因此不小心劃傷自己的『虎口』。」「虎口」是什麼意思？', TIGER, 0,
    '美工刀劃傷的是手上的地方。', '這裡的虎口是手上大拇指和食指中間的地方。'),
  tiger2: choice('g4c11-paper-m2', '「這場車禍只有他一人倖免於難，真是『虎口』餘生。」「虎口」是什麼意思？', TIGER, 1,
    '「虎口餘生」：從老虎嘴裡逃出來。', '虎口餘生：從非常危險的地方活下來。'),
  copy1: choice('g4c11-paper-y1', '照樣寫：「品嘗」「熱呼呼」的「豆粥」。採摘（　）的蘋果', ['紅通通', '放聲大哭', '草蓆上'], 0,
    '中間要填形容蘋果樣子的疊字詞。', '採摘紅通通的蘋果。'),
  copy2: choice('g4c11-paper-y2', '照樣寫：「坐」在「草蓆上」「放聲大哭」。站在巷子口（　）', ['東張西望', '紅通通', '熱呼呼'], 0,
    '最後要填「在做什麼」的動作。', '站在巷子口東張西望。'),
  until: sentence('g4c11-paper-s1', '用「等到……再……」造句：把句子排好。',
    ['我們再一起去海邊玩。', '我和麗麗約好，', '等到明年夏天，'], [1, 2, 0],
    '「等到」後面接時間，「再」後面接要做的事。', '我和麗麗約好，等到明年夏天，我們再一起去海邊玩。'),
  steps: sentence('g4c11-paper-s2', '用「先……接著……最後……」造句：把句子排好。',
    ['最後幫忙媽媽準備晚餐。', '爸爸回家後先換下工作服，', '接著到院子裡澆花，'], [1, 2, 0],
    '先、接著、最後，照順序排。', '爸爸回家後先換下工作服，接著到院子裡澆花，最後幫忙媽媽準備晚餐。'),

  // 課文是非
  f1: fact('g4c11-paper-f1', '豆粥婆婆的故事發生在韓國。', true, '對。'),
  f2: fact('g4c11-paper-f2', '老虎決定在冬至當天吃掉婆婆。', true, '對。'),
  f3: fact('g4c11-paper-f3', '故事中的「山神爺」指的是豆粥婆婆的丈夫。', false, '不對。'),
  f4: fact('g4c11-paper-f4', '老虎雖然沒有吃到婆婆，但是有吃到婆婆做的豆粥。', false, '不對，老虎沒有吃到豆粥。'),
  f5: fact('g4c11-paper-f5', '婆婆煮的豆粥令人齒頰留香，因此被稱為「豆粥婆婆」。', true, '對。'),
  f6: fact('g4c11-paper-f6', '婆婆用好吃的豆粥，請求家裡的器物們保護她不被老虎吃掉。', false, '不對。'),
} satisfies Record<string, Question>

export const g4c11: Unit = {
  id: 'g4c11',
  number: 11,
  grade: 4,
  subject: '國語',
  label: '第 11 課',
  title: '豆粥婆婆',
  source: '4上國語隨堂卷第 11 課（南一）',
  tasks: [
    {
      id: 'g4c11-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '栗子還是粒子？臉頰還是臉夾？',
      questions: [Q.li, Q.chang, Q.tong, Q.jia, Q.po, Q.xie, Q.yin, Q.pan],
    },
    {
      id: 'g4c11-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '捐皿？魚扛？',
      questions: [Q.ai, Q.xue, Q.heng, Q.gang, Q.xi],
    },
    {
      id: 'g4c11-t3', skill: '選詞填寫', title: '語詞填空', icon: '🧩', blurb: '黑漆漆、黏答答、面無血色。',
      questions: [Q.w1, Q.w2, Q.w3, Q.w4, Q.w5, Q.w6],
    },
    {
      id: 'g4c11-t4', skill: '語詞與句型', title: '虎口是哪裡', icon: '🐯', blurb: '同一個詞，兩種意思。',
      questions: [Q.tiger1, Q.tiger2, Q.copy1, Q.copy2, Q.until, Q.steps],
    },
    {
      id: 'g4c11-t5', skill: '課文理解', title: '豆粥婆婆', icon: '🥣', blurb: '婆婆怎麼躲過老虎？',
      questions: [Q.f1, Q.f2, Q.f3, Q.f4, Q.f5, Q.f6],
    },
  ],
  boss: {
    id: 'g4c11-boss', skill: '整份隨堂卷', title: '第十一課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.li, Q.chang, Q.tong, Q.jia, Q.po, Q.xie, Q.yin, Q.pan,
      Q.ai, Q.xue, Q.heng, Q.gang, Q.xi,
      Q.w1, Q.w2, Q.w3, Q.w4, Q.w5, Q.w6,
      Q.tiger1, Q.tiger2,
      Q.f1, Q.f2, Q.f3, Q.f4, Q.f5, Q.f6,
      Q.copy1, Q.copy2, Q.until, Q.steps,
    ],
  },
}
