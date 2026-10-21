import type { ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/08_4上國語隨堂卷_第8課四季的頭髮(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；形近字的注音用連連看、造詞改成選字填空。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const DOUBLED = ['冷絲絲', '灰濛濛', '滑溜溜', '白茫茫', '毛茸茸']
const DOUBLED_HINT = '冷絲絲：有點冷。灰濛濛：灰灰暗暗。滑溜溜：很滑。白茫茫：一片白、看不清楚。毛茸茸：毛又多又軟。'
const doubled = (id: string, sentence: string, answer: string, explain: string) =>
  choice(id, `${sentence}（　）裡要填哪一個？`, DOUBLED, DOUBLED.indexOf(answer), DOUBLED_HINT, explain)

const COPY = '照樣寫：「嚇」得「大地」一下「溼了眼眶」。'

const Q = {
  // 字音字形
  pi: choice('g4c8-paper-z1', '小弟弟用毛巾當「ㄆㄧ」風，想像自己是超人。「ㄆㄧ」是哪一個字？', ['批', '披', '劈', '坯'], 1,
    '把東西搭在肩膀上，要用手，提手旁。', '披風的「披」是手部。'),
  ting: choice('g4c8-paper-z2', '小弟弟「挺」直身體，想像自己是超人。「挺」怎麼念？', ['ㄊㄧㄥˊ', 'ㄊㄧㄥˇ', 'ㄉㄧㄥˇ'], 1,
    '和「挺好的」的挺一樣，第三聲。', '挺直的「挺」念 ㄊㄧㄥˇ。'),
  li: choice('g4c8-paper-z3', '再往前走大約一公「ㄌㄧˇ」，就可以看到公車站牌。「ㄌㄧˇ」是哪一個字？', ['理', '里', '裡', '李'], 1,
    '公里是距離的單位。', '一公里的「里」。'),
  cheng: choice('g4c8-paper-z4', '再往前走就可以看到搭「乘」公車的站牌。「乘」怎麼念？', ['ㄔㄥˊ', 'ㄔㄣˊ', 'ㄕㄥˋ'], 0,
    '搭乘、乘車的乘，翹舌音、第二聲。', '搭乘的「乘」念 ㄔㄥˊ。'),
  san: choice('g4c8-paper-z5', '小妹妹跟媽媽走「ㄙㄢˋ」了，在百貨公司大聲哭。「ㄙㄢˋ」是哪一個字？', ['傘', '散', '三', '參'], 1,
    '分開了、走丟了，叫做走什麼？', '走散的「散」。'),
  kuang: choice('g4c8-paper-z6', '小妹妹在百貨公司大聲哭，哭紅了眼「ㄎㄨㄤ」。「ㄎㄨㄤ」是哪一個字？', ['框', '筐', '眶', '狂'], 2,
    '眼睛周圍，要用目字旁。', '眼眶的「眶」是目部；「框」是相框的框。'),
  si: choice('g4c8-paper-z7', '微微的春風吹來，姐姐的髮「絲」輕輕拂過臉龐。「絲」怎麼念？', ['ㄙ', 'ㄕ', 'ㄙˇ'], 0,
    '平舌音 ㄙ、第一聲。', '髮絲的「絲」念 ㄙ。'),
  pang: choice('g4c8-paper-z8', '姐姐的髮絲輕輕拂過臉「ㄆㄤˊ」。「ㄆㄤˊ」是哪一個字？', ['旁', '龐', '胖', '膀'], 1,
    '臉的樣子叫臉龐，下面是龍。', '臉龐的「龐」。'),

  // 改錯字
  xia: typo('g4c8-paper-t1', '媽媽在煮飯時，老鼠突然跑出來，讓媽媽赫了一大跳。', '赫', ['嚇', '喝', '賀'], '嚇',
    '被嚇到會叫出聲音，要用口字旁。', '嚇一跳的「嚇」是口部。'),
  dian: typo('g4c8-paper-t2', '弟弟店起腳尖，趴在農場的欄杆上，想要看清楚裡頭綿羊的動靜。', '店', ['踮', '點', '墊'], '踮',
    '用腳尖站起來，要用足字旁。', '踮起腳尖的「踮」是足部。'),
  ban: typo('g4c8-paper-t3', '咖啡店裡的陳設太過古版老舊，阿英打算好好改造一番。', '版', ['板', '扳', '闆'], '板',
    '古板：老舊、不會變化，木字旁。', '古板的「板」是木部；「版」是出版的版。'),
  zhen: {
    id: 'g4c8-paper-t4', type: 'typo', prompt: '找出句子裡的錯字，再把它改正。',
    sentence: '一陳陳微風，送來撲鼻的花香。',
    words: ['一陳陳', '微風', '，', '送來', '撲鼻的', '花香', '。'], wrong: 0,
    options: ['一陣陣', '一振振', '一鎮鎮'], answer: 0,
    hint: '風一次一次吹來，量詞是「陣」。', explain: '一陣陣微風：「陣」是量詞；「陳」是陳列的陳。',
  } satisfies TypoQ,

  // 疊字形容詞
  d1: doubled('g4c8-paper-c1', '到了下午，天空變得（　）的，不一會兒就下起大雨。', '灰濛濛', '要下雨了，天空灰灰暗暗：灰濛濛。'),
  d2: doubled('g4c8-paper-c2', '山裡起霧了，四周（　）一片，彷彿置身在仙境。', '白茫茫', '霧很大，一片白：白茫茫。'),
  d3: doubled('g4c8-paper-c3', '剛使用完的肥皂（　）的，一不小心就會掉到地上。', '滑溜溜', '肥皂很滑：滑溜溜。'),
  d4: doubled('g4c8-paper-c4', '小狗一看到下班回家的爸爸，就開心的搖著（　）的尾巴迎接他。', '毛茸茸', '小狗的尾巴毛很多：毛茸茸。'),
  d5: doubled('g4c8-paper-c5', '初春的天氣還是有點（　）的，小心著涼了。', '冷絲絲', '有一點冷：冷絲絲。'),

  // 形近字與四季的風
  readings: {
    id: 'g4c8-paper-m1', type: 'match', prompt: '這些字長得很像，把字和正確的注音連起來。',
    pairs: [['散', 'ㄙㄢˋ'], ['敗', 'ㄅㄞˋ'], ['敢', 'ㄍㄢˇ']],
    hint: '散步的散、失敗的敗、勇敢的敢，念念看。', explain: '散 ㄙㄢˋ（散步）、敗 ㄅㄞˋ（失敗）、敢 ㄍㄢˇ（勇敢）。',
  } satisfies MatchQ,
  braid: choice('g4c8-paper-w1', '髮（　）', ['辮', '辦', '辨'], 0, '頭髮編起來，中間是「糸」（跟線有關）。', '髮辮的「辮」，中間是糸。'),
  handle: choice('g4c8-paper-w2', '（　）理', ['辮', '辦', '辨'], 1, '做事情、處理，中間是「力」。', '辦理的「辦」，中間是力。'),
  tell: choice('g4c8-paper-w3', '分（　）', ['辮', '辦', '辨'], 2, '分清楚、看出不一樣，中間是一點一撇。', '分辨的「辨」。'),
  winds: {
    id: 'g4c8-paper-m2', type: 'match', prompt: '依據課文，把四季和對應的風連起來。',
    pairs: [['春天', '東風'], ['夏天', '南風'], ['秋天', '西風'], ['冬天', '北風']],
    hint: '春東、夏南、秋西、冬北。', explain: '春天東風、夏天南風、秋天西風、冬天北風。',
  } satisfies MatchQ,

  // 課文文意
  autumn: choice('g4c8-paper-r1', '課文中，作者將秋天的頭髮比擬成什麼？', ['西北雨', '小青草', '滿山芒草', '山頂白雪'], 2,
    '秋天山上一片白白的、隨風搖的是什麼？', '秋天的頭髮是滿山的芒草。'),
  sense: choice('g4c8-paper-r2', '課文中，作者運用了哪種感官來形容山頂上的白雪？', ['聽覺', '觸覺', '嗅覺', '味覺'], 1,
    '白雪摸起來冰冰的，是用身體去感覺。', '用摸、碰的感覺是觸覺。'),
  rain: choice('g4c8-paper-r3', '依據課文，下列哪一個是「西北雨」的特點？', ['來得又急又快', '雨勢很小', '會持續下一整天', '不會有閃電和打雷'], 0,
    '夏天午後的大雷雨，是怎麼來的？', '西北雨來得又急又快。'),
  winter: choice('g4c8-paper-r4', '依據課文，冬天長長的「辮子」指的是什麼？', ['山頂上的白雪', '滿山的芒草', '滑雪板留下的痕跡', '枯萎的樹木'], 2,
    '雪地上長長的線，是什麼留下來的？', '冬天長長的辮子是滑雪板留下的痕跡。'),
  spring: choice('g4c8-paper-r5', '可以用下列哪個四字語詞來形容春天給人的感受？', ['暮氣沉沉', '生氣蓬勃', '乘風破浪', '披荊斬棘'], 1,
    '春天萬物生長，充滿活力。', '生氣蓬勃：充滿活力，像春天一樣。'),
  copy1: choice('g4c8-paper-y1', `${COPY}苦得弟弟一下（　）`, ['皺緊眉頭', '拍手叫好', '溼了眼眶'], 0,
    '吃到很苦的東西，臉會怎麼樣？', '苦得弟弟一下皺緊眉頭。'),
  copy2: choice('g4c8-paper-y2', `${COPY}樂得姐姐一下（　）`, ['皺緊眉頭', '拍手叫好', '溼了眼眶'], 1,
    '很開心的時候會怎麼樣？', '樂得姐姐一下拍手叫好。'),
  far: {
    id: 'g4c8-paper-s1', type: 'sort', order: 'steps', prompt: '用「一散千里」造句：把句子排好。',
    items: ['一散千里，十分壯觀。', '秋風一吹，', '滿樹火紅色的楓葉'], steps: [1, 2, 0],
    hint: '先說發生什麼事，再說什麼東西「一散千里」。', explain: '秋風一吹，滿樹火紅色的楓葉一散千里，十分壯觀。',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c8: Unit = {
  id: 'g4c8',
  number: 8,
  grade: 4,
  subject: '國語',
  label: '第 8 課',
  title: '四季的頭髮',
  source: '4上國語隨堂卷第 8 課（南一）',
  tasks: [
    {
      id: 'g4c8-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '眼眶還是眼框？臉龐還是臉旁？',
      questions: [Q.pi, Q.ting, Q.li, Q.cheng, Q.san, Q.kuang, Q.si, Q.pang],
    },
    {
      id: 'g4c8-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '赫了一大跳？店起腳尖？',
      questions: [Q.xia, Q.dian, Q.ban, Q.zhen],
    },
    {
      id: 'g4c8-t3', skill: '疊字形容詞', title: '疊字形容詞', icon: '🌫️', blurb: '灰濛濛、白茫茫、毛茸茸。',
      questions: [Q.d1, Q.d2, Q.d3, Q.d4, Q.d5],
    },
    {
      id: 'g4c8-t4', skill: '形近字', title: '長得很像的字', icon: '👯', blurb: '辮、辦、辨，差在中間！',
      questions: [Q.readings, Q.braid, Q.handle, Q.tell, Q.winds],
    },
    {
      id: 'g4c8-t5', skill: '課文理解與造句', title: '四季的頭髮', icon: '🍂', blurb: '秋天的頭髮是什麼？',
      questions: [Q.autumn, Q.sense, Q.rain, Q.winter, Q.spring, Q.copy1, Q.copy2, Q.far],
    },
  ],
  boss: {
    id: 'g4c8-boss', skill: '整份隨堂卷', title: '第八課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.pi, Q.ting, Q.li, Q.cheng, Q.san, Q.kuang, Q.si, Q.pang,
      Q.xia, Q.dian, Q.ban, Q.zhen,
      Q.d1, Q.d2, Q.d3, Q.d4, Q.d5,
      Q.winds, Q.readings, Q.braid, Q.handle, Q.tell,
      Q.autumn, Q.sense, Q.rain, Q.winter, Q.spring,
      Q.copy1, Q.copy2, Q.far,
    ],
  },
}
