import type { ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/03_4上國語隨堂卷_第3課充滿希望的五味屋(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字、圈出不適當的語詞用「找錯字」小遊戲；形近字的注音用連連看。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

/** 找錯字：wrongChar 在句子裡只出現一次 */
const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

/** 找用錯的語詞：words 接起來是整句，wrongWord 只出現一次 */
const wordTypo = (id: string, prompt: string, words: string[], wrongWord: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt, sentence: words.join(''), words, wrong: words.indexOf(wrongWord),
  options, answer: options.indexOf(right), hint, explain,
})
const BAD_WORD = '找出用得不適當的語詞，再把它改正。'

const Q = {
  // 字音字形
  yu: choice('g4c3-paper-z1', '小瑜積極參「與」各項公益活動。「與」怎麼念？', ['ㄩˇ', 'ㄩˋ', 'ㄩˊ'], 1,
    '「參與」是加入一起做，這裡念第四聲。', '參與的「與」念 ㄩˋ（「我與你」的與才念 ㄩˇ）。'),
  cun: choice('g4c3-paper-z2', '小桐相信有外星人的「ㄘㄨㄣˊ」在。「ㄘㄨㄣˊ」是哪一個字？', ['存', '村', '寸', '純'], 0,
    '「存在」就是有、在那裡。', '存在的「存」。'),
  suan: choice('g4c3-paper-z3', '冰箱裡的牛奶已經過期了，發出陣陣「ㄙㄨㄢ」臭味。「ㄙㄨㄢ」是哪一個字？', ['蒜', '算', '酸', '痠'], 2,
    '壞掉的牛奶是什麼味道？跟「醋」一樣是酉部。', '酸臭的「酸」是酉部；「痠」是肌肉痠痛的痠。'),
  min: choice('g4c3-paper-z4', '這兩個國家因政治因素而長年戰爭，導致「民」不聊生。「民」怎麼念？', ['ㄇㄧㄣˊ', 'ㄇㄧㄥˊ', 'ㄇㄧㄣˇ'], 0,
    '和「人民」的民一樣，是前鼻音、第二聲。', '民不聊生的「民」念 ㄇㄧㄣˊ。'),
  kao: choice('g4c3-paper-z5', '當救援隊「ㄎㄠˋ」近小貓時，貓媽媽立刻警戒起來。「ㄎㄠˋ」是哪一個字？', ['烤', '考', '靠', '銬'], 2,
    '慢慢走近、接近，是「靠近」的哪一個字？', '靠近的「靠」。'),
  zhi: choice('g4c3-paper-z6', '王叔叔和爸爸「ㄓˋ」同道合，因此兩人決定一起創業。「ㄓˋ」是哪一個字？', ['至', '志', '制', '致'], 1,
    '志同道合：兩個人的志向、想法一樣。', '志同道合的「志」是「志向」的志，心部。'),

  // 改錯字
  shi: typo('g4c3-paper-t1', '這間飯店提供西武早餐給旅客享用。', '武', ['式', '試', '市'], '式',
    '中式、西式、日式，是哪一個字？', '西式早餐的「式」，是樣式、方式的式。'),
  zhu: typo('g4c3-paper-t2', '這座橋梁的攴柱已出現細微的裂痕。', '攴', ['支', '枝', '之'], '支',
    '撐住東西的柱子叫什麼柱？', '支柱的「支」，是支撐的支。'),
  lian: typo('g4c3-paper-t3', '連花出汙泥而不染，是我最喜歡的花。', '連', ['蓮', '憐', '聯'], '蓮',
    '是一種花，要用草字頭。', '蓮花的「蓮」是草字頭。'),
  la: {
    id: 'g4c3-paper-t4', type: 'typo', prompt: '找出句子裡的錯字，再把它改正。',
    sentence: '中午時分，太陽火刺刺的，大家都躲在屋內乘涼。',
    words: ['中午時分', '，', '太陽', '火刺刺', '的', '，', '大家', '都', '躲在', '屋內', '乘涼', '。'], wrong: 3,
    options: ['火喇喇', '火辣辣', '火拉拉'], answer: 1,
    hint: '太陽很大、很熱，像辣椒一樣「辣」。', explain: '火辣辣：形容太陽或天氣非常熱。',
  } satisfies TypoQ,
  tai: typo('g4c3-paper-t5', '小君認真不苟且的學習能度，得到老師大力稱讚。', '能', ['態', '太', '台'], '態',
    '學習的樣子叫學習什麼「度」？要有心。', '學習態度的「態」，下面是心。'),
  huo: typo('g4c3-paper-t6', '在隊長的帶領之下，球隊一路過關斬將，最終穫得冠軍。', '穫', ['獲', '或', '貨'], '獲',
    '得到冠軍是「獲得」，不是收成稻子。', '獲得的「獲」是犬部；禾字旁的「穫」用在收穫。'),

  // 形近字與部首
  readings: {
    id: 'g4c3-paper-m1', type: 'match', prompt: '這些字長得很像，把字和正確的注音連起來。',
    pairs: [['士', 'ㄕˋ'], ['土', 'ㄊㄨˇ'], ['未', 'ㄨㄟˋ'], ['末', 'ㄇㄛˋ'], ['折', 'ㄓㄜˊ'], ['拆', 'ㄔㄞ']],
    hint: '士的上面長、土的下面長；未的上面短、末的上面長；拆比折多一點。',
  } satisfies MatchQ,
  w1: choice('g4c3-paper-w1', '紳（　）', ['士', '土'], 0, '紳士是有禮貌的男生，「士」上面那一橫比較長。', '紳士的「士」，上面長下面短。'),
  w2: choice('g4c3-paper-w2', '（　）地', ['士', '土'], 1, '腳踩的泥土，「土」下面那一橫比較長。', '土地的「土」，上面短下面長。'),
  w3: choice('g4c3-paper-w3', '（　）知', ['未', '末'], 0, '「還不知道」的意思，上面那一橫短。', '未知：還不知道。「未」上面短。'),
  w4: choice('g4c3-paper-w4', '（　）日', ['未', '末'], 1, '最後的一天，上面那一橫長。', '末日：最後一天。「末」上面長。'),
  w5: choice('g4c3-paper-w5', '（　）扣', ['折', '拆'], 0, '打折、便宜一點的價錢。', '折扣的「折」。'),
  w6: choice('g4c3-paper-w6', '（　）穿', ['折', '拆'], 1, '把祕密打開、揭穿，多一點的那個字。', '拆穿的「拆」，比「折」多一點。'),
  radical: choice('g4c3-paper-x1', '下列哪個字的部首錯了？', ['與：臼部', '民：氏部', '支：支部', '式：工部'], 3,
    '「式」的部首是右上角那一部分（弋）。', '式是弋部，不是工部。'),

  // 不適當的語詞
  alone: wordTypo('g4c3-paper-b0', BAD_WORD, ['表姐', '選擇', '到', '外縣市', '讀書', '，', '學習', '獨家', '生活', '。'], '獨家', ['獨立', '獨特', '獨唱'], '獨立',
    '自己照顧自己的生活，叫做什麼生活？', '學習獨立生活：自己照顧自己。「獨家」是只有一家有的。'),
  support: wordTypo('g4c3-paper-b1', BAD_WORD, ['爸爸', '總是', '默默的', '抱持', '哥哥', '追逐', '自己的', '夢想', '。'], '抱持', ['支持', '保持', '抱住'], '支持',
    '在背後幫哥哥加油，是什麼意思？', '支持：在旁邊幫忙、加油。'),
  kind: wordTypo('g4c3-paper-b2', BAD_WORD, ['鄭奶奶', '總是', '熱鬧', '助人', '，', '因此', '受到', '大家的', '敬重', '。'], '熱鬧', ['熱心', '熱水', '熱門'], '熱心',
    '很願意幫忙別人，叫做什麼助人？', '熱心助人：很樂意幫助別人。「熱鬧」是很多人、很吵的樣子。'),
  future: wordTypo('g4c3-paper-b3', BAD_WORD, ['小楷', '努力的', '練習', '唱歌', '，', '希望', '過去', '能', '成為', '一位', '歌手', '。'], '過去', ['未來', '過來', '過年'], '未來',
    '希望以後能當歌手，以後是過去還是未來？', '希望未來能成為歌手；過去是已經過去的時間。'),
  attitude: wordTypo('g4c3-paper-b4', BAD_WORD, ['不管', '遇到', '什麼', '困境', '，', '小熙', '都', '保持著', '積極', '樂觀的', '生活', '溫度', '。'], '溫度', ['態度', '溫暖', '角度'], '態度',
    '積極樂觀是一個人的什麼？', '生活態度：面對生活的想法和樣子。溫度是冷熱。'),
  build: wordTypo('g4c3-paper-b5', BAD_WORD, ['老師', '希望', '透過', '這次的', '淨灘', '活動', '，', '讓', '學生們', '能', '建造', '愛護', '地球的', '觀念', '。'], '建造', ['建立', '建築', '造成'], '建立',
    '觀念不是房子，不能「蓋」出來。', '建立觀念：讓想法慢慢形成；建造是蓋房子、橋。'),
  used: choice('g4c3-paper-x2', '「這家商店以販賣二手商品為主。」句中「二手」的意思是什麼？', ['兩隻手的', '已使用過的', '用雙手製成的', '助手、協助處理事務的人'], 1,
    '二手書、二手車，是新的還是別人用過的？', '二手：已經有人用過，再拿出來賣。'),

  // 課文理解與造句
  wrongFact: choice('g4c3-paper-r1', '依據課文，有關五味屋，下列哪一個敘述錯誤？', ['民國九十七年開幕', '地點在花蓮', '是當地社區孩子重要的學習場所', '主要販賣五種口味的零食'], 3,
    '「五味」指的是人生的酸甜苦辣鹹，不是零食的口味。', '五味屋不是賣五種口味的零食，「五味」是人生的酸甜苦辣鹹。'),
  notDo: choice('g4c3-paper-r2', '依據課文，在五味屋裡，孩子不會做下列哪件事？', ['學習管理商店', '用工作點數換日用品', '學習修整房屋的技術', '體會「酸甜苦辣鹹」人生五味'], 2,
    '回想課文裡孩子在五味屋做的事。', '課文沒有寫到孩子學修房子。'),
  idea: choice('g4c3-paper-r3', '依據課文，五味屋的理念不包括下列哪一種？', ['讓孩子們在學習中變得獨立', '讓孩子們了解古蹟保留的程序', '讓孩子們懂得靠自己努力得到機會', '讓孩子們相信自己能變得更好'], 1,
    '五味屋想幫孩子什麼？哪一個跟孩子的成長沒有關係？', '古蹟保留的程序跟五味屋的理念無關。'),
  copy1: choice('g4c3-paper-y1', '照樣寫：從「陪伴」中「得到」「支持」。從閱讀中（　）知識', ['獲取', '丟掉', '打破'], 0,
    '從閱讀中「得到」知識，換一個意思一樣的詞。', '從閱讀中獲取知識：獲取就是得到。'),
  copy2: choice('g4c3-paper-y2', '照樣寫：從「陪伴」中「得到」「支持」。從實作中累積（　）', ['經驗', '點心', '雨傘'], 0,
    '自己動手做，慢慢會累積什麼？', '從實作中累積經驗。'),
  same: {
    id: 'g4c3-paper-s1', type: 'sort', order: 'steps', prompt: '用「……同時……」造句：把句子排好。',
    items: ['同時也是', '莉莉是班上', '籃球校隊的隊長。', '成績最好的同學，'], steps: [1, 3, 0, 2],
    hint: '「同時」前後是同一個人的兩件事。', explain: '莉莉是班上成績最好的同學，同時也是籃球校隊的隊長。',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c3: Unit = {
  id: 'g4c3',
  number: 3,
  grade: 4,
  subject: '國語',
  label: '第 3 課',
  title: '充滿希望的五味屋',
  source: '4上國語隨堂卷第 3 課（南一）',
  tasks: [
    {
      id: 'g4c3-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '酸、蒜、算，哪一個才對？',
      questions: [Q.yu, Q.cun, Q.suan, Q.min, Q.kao, Q.zhi],
    },
    {
      id: 'g4c3-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '西武早餐？火刺刺？快把錯字抓出來！',
      questions: [Q.shi, Q.zhu, Q.lian, Q.la, Q.tai, Q.huo],
    },
    {
      id: 'g4c3-t3', skill: '形近字與部首', title: '長得很像的字', icon: '👯', blurb: '士和土、未和末，差在哪裡？',
      questions: [Q.readings, Q.w1, Q.w2, Q.w3, Q.w4, Q.w5, Q.w6, Q.radical],
    },
    {
      id: 'g4c3-t4', skill: '語詞的使用', title: '語詞用對了嗎', icon: '🔍', blurb: '熱鬧助人？哪裡怪怪的？',
      questions: [Q.alone, Q.support, Q.kind, Q.future, Q.attitude, Q.build, Q.used],
    },
    {
      id: 'g4c3-t5', skill: '課文理解與造句', title: '五味屋', icon: '🏠', blurb: '酸甜苦辣鹹，人生五味。',
      questions: [Q.wrongFact, Q.notDo, Q.idea, Q.copy1, Q.copy2, Q.same],
    },
  ],
  boss: {
    id: 'g4c3-boss', skill: '整份隨堂卷', title: '第三課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.yu, Q.cun, Q.suan, Q.min, Q.kao, Q.zhi,
      Q.shi, Q.zhu, Q.lian, Q.la, Q.tai, Q.huo,
      Q.readings, Q.w1, Q.w2, Q.w3, Q.w4, Q.w5, Q.w6,
      Q.support, Q.kind, Q.future, Q.attitude, Q.build,
      Q.radical, Q.used, Q.wrongFact, Q.notDo, Q.idea,
      Q.copy1, Q.copy2, Q.same,
    ],
  },
}
