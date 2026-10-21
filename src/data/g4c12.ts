import type { ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/12_4上國語隨堂卷_第12課戴斗笠的地藏(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；部首用連連看（造詞要自己想，沒有放）；照樣寫改成選出合適的語詞。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const Q = {
  // 字音字形
  ji: choice('g4c12-paper-z1', '姐姐閉目養神幾分鐘後，「ㄐㄧˋ」續回到書桌前讀書。「ㄐㄧˋ」是哪一個字？', ['記', '繼', '計', '既'], 1,
    '接下去、不中斷，糸字旁。', '繼續的「繼」是糸部。'),
  xu: choice('g4c12-paper-z2', '姐姐閉目養神幾分鐘後，繼「續」回到書桌前讀書。「續」怎麼念？', ['ㄒㄩˋ', 'ㄒㄩˊ', 'ㄕㄨˋ'], 0,
    '連續、繼續的續，第四聲。', '繼續的「續」念 ㄒㄩˋ。'),
  bang: choice('g4c12-paper-z3', '「傍」晚時，他們夫妻兩人會一起到附近的河堤慢跑。「傍」怎麼念？', ['ㄅㄤˋ', 'ㄅㄤ', 'ㄆㄤˊ'], 1,
    '傍晚的傍，臺灣念第一聲。', '傍晚的「傍」念 ㄅㄤ。'),
  qi: choice('g4c12-paper-z4', '傍晚時，他們夫「ㄑㄧ」兩人會一起到附近的河堤慢跑。「ㄑㄧ」是哪一個字？', ['棲', '妻', '淒', '欺'], 1,
    '先生和太太叫夫妻，下面是女。', '夫妻的「妻」，下面是女。'),
  nai: choice('g4c12-paper-z5', '獅子「ㄋㄞˋ」心的等待機會。「ㄋㄞˋ」是哪一個字？', ['奈', '耐', '乃', '賴'], 1,
    '耐心：能等待、不著急。', '耐心的「耐」。'),
  li: choice('g4c12-paper-z6', '一直到獵物走到十分接近的距「ㄌㄧˊ」，獅子才發動攻擊。「ㄌㄧˊ」是哪一個字？', ['梨', '璃', '離', '籬'], 2,
    '距離：兩個東西中間有多遠。', '距離的「離」。'),
  mang: choice('g4c12-paper-z7', '在「ㄇㄤˊ ㄇㄤˊ」大海上，只有一艘巨大的油輪。「ㄇㄤˊ」是哪一個字？', ['忙', '盲', '茫', '芒'], 2,
    '茫茫大海：大海很大、一眼看不到邊，有三點水。', '茫茫大海的「茫」。'),
  jian: choice('g4c12-paper-z8', '油輪逐「漸」朝著地平線的盡頭駛去。「漸」怎麼念？', ['ㄐㄧㄢ', 'ㄐㄧㄢˋ', 'ㄑㄧㄢˋ'], 1,
    '漸漸、逐漸的漸，第四聲。', '逐漸的「漸」念 ㄐㄧㄢˋ。'),

  // 改錯字
  tuo: typo('g4c12-paper-t1', '出國旅遊前，瑞克將貓咪托付給鄰居奶奶照顧。', '托', ['託', '拖', '脫'], '託',
    '請別人幫忙照顧，要用說的，言字旁。', '託付的「託」是言部。'),
  yi: typo('g4c12-paper-t2', '這裡氣候誼人，風景優美，是著名的觀光景點。', '誼', ['宜', '儀', '疑'], '宜',
    '氣候宜人：天氣讓人覺得舒服。', '宜人的「宜」。'),
  suan: typo('g4c12-paper-t3', '媽媽喜歡在百貨公司週年慶的時候購買新衣服，比較划莧。', '莧', ['算', '蒜', '酸'], '算',
    '划算：花的錢值得，用竹字頭。', '划算的「算」。'),
  qi2: typo('g4c12-paper-t4', '農夫們向上天析求今年能夠風調雨順，農作物大豐收。', '析', ['祈', '旗', '期'], '祈',
    '向天、向神明請求，要用示字旁。', '祈求的「祈」是示部。'),
  na: typo('g4c12-paper-t5', '小峻接吶了大家的建議，一改過去不健康的飲食習慣。', '吶', ['納', '那', '拿'], '納',
    '接受別人的意見叫接納，糸字旁。', '接納的「納」是糸部。'),

  // 部首與詞義
  radicals: {
    id: 'g4c12-paper-m1', type: 'match', prompt: '把字和它的部首連起來。',
    pairs: [['宜', '宀部'], ['貧', '貝部'], ['耐', '而部'], ['隱', '阜部'], ['離', '隹部']],
    hint: '宜的上面是寶蓋頭；貧的下面是貝；隱的左邊是阝；離的右邊是隹。',
  } satisfies MatchQ,
  plan: choice('g4c12-paper-x1', '「打算」的意思是什麼？', ['考慮、計畫', '核對數目', '整理、處理', '依數學算式算出答案'], 0,
    '「我打算明天去公園」是什麼意思？', '打算：考慮、計畫要做什麼。'),
  faint: choice('g4c12-paper-x2', '「隱約」的意思是什麼？', ['退居山野，不問世事', '不清楚、不明顯的樣子', '壓抑感情或感受', '有所忌諱而隱瞞'], 1,
    '「隱約聽到聲音」：聽得清楚嗎？', '隱約：不清楚、不明顯。'),
  accept: choice('g4c12-paper-x3', '「笑納」的意思是什麼？', ['接受、採納', '贈送禮物時，請人接受的客氣話', '嘲諷譏笑', '邊笑邊聊天的樣子'], 1,
    '送禮的人會說「請笑納」。', '笑納：送禮時請對方收下的客氣話。'),
  fit: choice('g4c12-paper-x4', '「應景」的意思是什麼？', ['處理應付', '遭遇到緊急的情況', '符合當時的情景、節令', '接受別人的邀請'], 2,
    '中秋節吃月餅很「應景」。', '應景：符合那個時候的節日、情景。'),

  // 課文理解
  wrongFact: choice('g4c12-paper-r1', '有關課文中的老爺爺和老婆婆，下列哪一個敘述錯誤？', ['家裡非常貧窮', '平時會下田耕作', '會到山下販賣斗笠賺錢', '擁有製作石像的好手藝'], 3,
    '地藏菩薩的石像是他們做的嗎？', '老爺爺和老婆婆沒有製作石像的手藝。'),
  wish: choice('g4c12-paper-r2', '新年快到了，老婆婆有什麼心願？', ['想吃年糕', '想戴新的頭巾', '想買新的斗笠', '想向地藏菩薩求好運'], 0,
    '過年的時候想吃什麼？', '老婆婆想吃年糕。'),
  turn: choice('g4c12-paper-r3', '故事中的哪一件事，是改變結局的主要原因？', ['老婆婆告訴老爺爺自己想吃年糕', '老爺爺用斗笠換到了年糕', '老爺爺幫地藏菩薩們戴上斗笠和頭巾', '老婆婆對老爺爺感到失望'], 2,
    '老爺爺做了什麼好事，後來才有好報？', '老爺爺幫地藏菩薩戴上斗笠和頭巾，才得到回報。'),
  gift: choice('g4c12-paper-r4', '是誰在除夕夜裡送了許多食物給老爺爺和老婆婆？', ['隔壁鄰居', '山腳下的村民', '年糕店老闆', '地藏菩薩'], 3,
    '誰收到了老爺爺的斗笠？', '地藏菩薩在除夕夜送來許多食物。'),
  theme: choice('g4c12-paper-r5', '下面哪一個是本課的主旨？', ['團結合作力量大', '心存善念有好報', '天生我才必有用', '自信是成功的祕訣'], 1,
    '老爺爺做了好事，最後怎麼樣？', '心存善念有好報。'),

  // 句型與造句
  copy1: choice('g4c12-paper-y1', '照樣寫：「便宜」又「耐用」的「斗笠」。精緻又（　）的蛋糕', ['美味', '玩具', '吸引'], 0,
    '「又」的前後都是形容蛋糕的詞。', '精緻又美味的蛋糕。'),
  copy2: choice('g4c12-paper-y2', '照樣寫：被「奇怪」的「歌聲」「驚醒」。被新奇的玩具（　）', ['吸引', '美味', '斗笠'], 0,
    '最後要填一個動作：被玩具怎麼樣了？', '被新奇的玩具吸引。'),
  instead: {
    id: 'g4c12-paper-s1', type: 'sort', order: 'steps', prompt: '用「不但……反而……」造句：把句子排好。',
    items: ['反而友好的舔著他的手。', '看到阿奇溫柔的撫摸著小貓，', '貓媽媽不但沒有生氣，'], steps: [1, 2, 0],
    hint: '「不但沒有……」後面接「反而……」，是跟想的相反的結果。', explain: '看到阿奇溫柔的撫摸著小貓，貓媽媽不但沒有生氣，反而友好的舔著他的手。',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c12: Unit = {
  id: 'g4c12',
  number: 12,
  grade: 4,
  subject: '國語',
  label: '第 12 課',
  title: '戴斗笠的地藏',
  source: '4上國語隨堂卷第 12 課（南一）',
  tasks: [
    {
      id: 'g4c12-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '繼續還是記續？茫茫還是忙忙？',
      questions: [Q.ji, Q.xu, Q.bang, Q.qi, Q.nai, Q.li, Q.mang, Q.jian],
    },
    {
      id: 'g4c12-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '氣候誼人？比較划莧？',
      questions: [Q.tuo, Q.yi, Q.suan, Q.qi2, Q.na],
    },
    {
      id: 'g4c12-t3', skill: '部首與詞義', title: '語詞的意思', icon: '📖', blurb: '笑納、應景是什麼意思？',
      questions: [Q.radicals, Q.plan, Q.faint, Q.accept, Q.fit],
    },
    {
      id: 'g4c12-t4', skill: '課文理解', title: '戴斗笠的地藏', icon: '🗿', blurb: '老爺爺做了什麼好事？',
      questions: [Q.wrongFact, Q.wish, Q.turn, Q.gift, Q.theme],
    },
    {
      id: 'g4c12-t5', skill: '句型與造句', title: '照樣寫', icon: '✏️', blurb: '不但沒有生氣，反而……',
      questions: [Q.copy1, Q.copy2, Q.instead],
    },
  ],
  boss: {
    id: 'g4c12-boss', skill: '整份隨堂卷', title: '第十二課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.ji, Q.xu, Q.bang, Q.qi, Q.nai, Q.li, Q.mang, Q.jian,
      Q.tuo, Q.yi, Q.suan, Q.qi2, Q.na,
      Q.radicals, Q.plan, Q.faint, Q.accept, Q.fit,
      Q.wrongFact, Q.wish, Q.turn, Q.gift, Q.theme,
      Q.copy1, Q.copy2, Q.instead,
    ],
  },
}
