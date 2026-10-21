import type { BinsQ, ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/10_4上國語隨堂卷_第10課老鼠嫁女兒(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；多音字「強」用分類籃子；部首用連連看（造詞要自己想，沒有放）。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const IDIOMS = ['招架不住', '煙消雲散', '捨近求遠', '兩情相悅']
const IDIOM_MEANING = '招架不住：擋不住、應付不了。煙消雲散：像煙和雲一樣散掉、不見了。捨近求遠：放著近的不要，去找遠的。兩情相悅：兩個人互相喜歡。'
const idiom = (id: string, sentence: string, answer: string, explain: string) =>
  choice(id, `${sentence}（　）裡要填哪一個語詞？`, IDIOMS, IDIOMS.indexOf(answer), IDIOM_MEANING, explain)

const MARKS = ['，', '：', '……', '！']
const PASSAGE = '面對朋友的苦苦哀求（甲）小珍面有難色的說（乙）「我實在（丙）我實在很想幫助你，但我心有餘而力不足啊（丁）」'
const mark = (id: string, slot: string, answer: string, explain: string) =>
  choice(id, `${PASSAGE}（${slot}）要填哪一個標點符號？`, MARKS, MARKS.indexOf(answer),
    '逗號：話還沒說完；冒號：後面要接說的話；刪節號：話說到一半停住；驚嘆號：語氣很強。', explain)

const COPY1 = '照樣寫：「轉」了好幾「圈」。'

const Q = {
  // 字音字形
  zhong: choice('g4c10-paper-z1', '活動中心擠滿了來參加活動的民「ㄓㄨㄥˋ」。「ㄓㄨㄥˋ」是哪一個字？', ['種', '眾', '重', '中'], 1,
    '很多很多人，三個人疊在一起。', '民眾的「眾」，下面是三個人。'),
  hong: choice('g4c10-paper-z2', '會場裡一片鬧「哄哄」的。「哄」怎麼念？', ['ㄏㄨㄥˇ', 'ㄏㄨㄥ', 'ㄏㄨㄥˋ'], 1,
    '鬧哄哄：很吵鬧的樣子，念第一聲。', '鬧哄哄的「哄」念 ㄏㄨㄥ。'),
  lang: choice('g4c10-paper-z3', '新「ㄌㄤˊ」手挽著新娘，緩緩步上紅毯。「ㄌㄤˊ」是哪一個字？', ['狼', '郎', '朗', '廊'], 1,
    '結婚的男生叫新郎，右邊是阝。', '新郎的「郎」。'),
  jia1: choice('g4c10-paper-z4', '新郎手挽著新「ㄐㄧㄚˋ」娘，緩緩步上紅毯。「ㄐㄧㄚˋ」是哪一個字？', ['架', '價', '嫁', '駕'], 2,
    '女生結婚叫出嫁，女字旁。', '新嫁娘的「嫁」是女部。'),
  jia2: choice('g4c10-paper-z5', '書「ㄐㄧㄚˋ」上擺放著好看又有趣的小說。「ㄐㄧㄚˋ」是哪一個字？', ['架', '價', '嫁', '駕'], 0,
    '放書的木頭架子，下面是木。', '書架的「架」是木部。'),
  ji: choice('g4c10-paper-z6', '書架上擺放著「ㄐㄧˋ」好看又有趣的小說。「ㄐㄧˋ」是哪一個字？', ['記', '既', '季', '技'], 1,
    '「既……又……」：兩個都有。', '既好看又有趣的「既」。'),

  // 改錯字
  jiao: typo('g4c10-paper-t1', '爸爸在出發之前，把驕車擦拭得閃閃發亮。', '驕', ['轎', '嬌', '橋'], '轎',
    '車子要用車字旁。', '轎車的「轎」是車部。'),
  zhang: typo('g4c10-paper-t2', '受疫情影響，小吃店的生意一落千仗。', '仗', ['丈', '帳', '杖'], '丈',
    '「一落千丈」：一下子掉得很深，丈是長度單位。', '一落千丈的「丈」。'),
  xiu: typo('g4c10-paper-t3', '面對大家的指責，小妍惱差成怒，大發脾氣。', '差', ['羞', '休', '修'], '羞',
    '覺得不好意思、丟臉，叫做害羞。', '惱羞成怒：因為丟臉而生氣，是「羞」。'),
  diu: typo('g4c10-paper-t4', '那位小哥哥不小心弄去了錢包，正焦急的四處尋找。', '去', ['丟', '丘', '兵'], '丟',
    '東西不見了，叫弄丟。', '弄丟的「丟」。'),

  // 多音字與部首
  qiang: {
    id: 'g4c10-paper-b1', type: 'bins', prompt: '「強」有三個讀音。把語詞放進對的讀音籃子。', bins: ['ㄐㄧㄤˋ', 'ㄑㄧㄤˊ', 'ㄑㄧㄤˇ'],
    items: [{ label: '個性倔強', bin: 0 }, { label: '身體強壯', bin: 1 }, { label: '勉強吃下', bin: 2 }, { label: '強烈的顏色', bin: 1 }],
    hint: '倔強是脾氣硬（第四聲）；強壯、強烈是力量大（第二聲）；勉強是不太願意還是做（第三聲）。',
    explain: 'ㄐㄧㄤˋ：個性倔強。ㄑㄧㄤˊ：身體強壯、強烈的顏色。ㄑㄧㄤˇ：勉強吃下。',
  } satisfies BinsQ,
  radicals: {
    id: 'g4c10-paper-m1', type: 'match', prompt: '把字和它的部首連起來。',
    pairs: [['伍', '人部'], ['隊', '阜部'], ['眾', '目部'], ['初', '衣部'], ['丟', '一部']],
    hint: '左邊是阝的是阜部；「初」的左邊是衣（衤）；「眾」的部首在上面。',
  } satisfies MatchQ,
  soup: choice('g4c10-paper-x1', '「計畫許久的環島旅行，卻因為碰上強烈颱風而泡湯了。」「泡湯」可以用哪一個語詞代替？', ['落空', '失敗', '失手', '落幕'], 0,
    '泡湯就是計畫沒辦成、什麼都沒有了。', '泡湯：希望落空。'),

  // 成語填空
  i1: idiom('g4c10-paper-c1', '他們兩人彼此（　），已經交往多年了。', '兩情相悅', '兩個人互相喜歡：兩情相悅。'),
  i2: idiom('g4c10-paper-c2', '小琪看見小狗開心的表情，身上所有的疲憊都（　）了。', '煙消雲散', '疲憊不見了：煙消雲散。'),
  i3: idiom('g4c10-paper-c3', '巷口就有一間雜貨店，哥哥卻跑到車站附近的大賣場買醬油，真是（　）。', '捨近求遠', '近的不去，跑去遠的：捨近求遠。'),
  i4: idiom('g4c10-paper-c4', '在辯論比賽上，對方的論點說得振振有辭，讓阿齊（　），不知如何回應。', '招架不住', '應付不了：招架不住。'),

  // 標點與照樣寫
  p1: mark('g4c10-paper-p1', '甲', '，', '甲：句子還沒說完，用逗號。'),
  p2: mark('g4c10-paper-p2', '乙', '：', '乙：後面接著說的話，用冒號。'),
  p3: mark('g4c10-paper-p3', '丙', '……', '丙：話說到一半說不下去，用刪節號。'),
  p4: mark('g4c10-paper-p4', '丁', '！', '丁：語氣很強烈，用驚嘆號。'),
  copy1: choice('g4c10-paper-y1', `${COPY1}寫了好幾（　）`, ['本', '次', '圈'], 0, '寫字寫在本子上，寫了好幾什麼？', '寫了好幾本。'),
  copy2: choice('g4c10-paper-y2', `${COPY1}聽了好幾（　）`, ['本', '次', '圈'], 1, '聽歌、聽故事，聽了好幾什麼？', '聽了好幾次。'),
  copy3: choice('g4c10-paper-y3', '照樣寫：「隨」著「花轎隊伍」「出嫁」去。照著（　）出遊去', ['旅遊指南', '出嫁', '花轎'], 0,
    '出去玩的時候，要照著什麼走？', '照著旅遊指南出遊去。'),

  // 課文理解與造句
  wall: choice('g4c10-paper-r1', '課文中，風只要遇到誰就哪裡都去不了？', ['太陽', '烏雲', '牆壁', '鼠郎'], 2,
    '風吹到什麼東西就被擋住了？', '風遇到牆壁就被擋住，哪裡都去不了。'),
  marry: choice('g4c10-paper-r2', '依據課文，鼠妞最後嫁給誰？', ['風', '太陽', '烏雲', '鼠郎'], 3,
    '繞了一大圈，最後嫁給誰？', '鼠妞最後嫁給鼠郎。'),
  lesson: choice('g4c10-paper-r3', '統整課文，下面哪一個選項最接近故事帶來的啟發？', ['團結合作力量大', '心存善念有好報', '天生我才必有用', '自信是成功的秘訣'], 2,
    '每個角色都有自己厲害的地方，也有怕的東西。', '每個人都有自己的長處：天生我才必有用。'),
  since: {
    id: 'g4c10-paper-s1', type: 'sort', order: 'steps', prompt: '用「既然……就……」造句：把句子排好。',
    items: ['我們就一起去球場打球吧！', '既然', '大家下午都有空，'], steps: [1, 2, 0],
    hint: '「既然」後面接已經知道的事，「就」後面接決定要做的事。', explain: '既然大家下午都有空，我們就一起去球場打球吧！',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c10: Unit = {
  id: 'g4c10',
  number: 10,
  grade: 4,
  subject: '國語',
  label: '第 10 課',
  title: '老鼠嫁女兒',
  source: '4上國語隨堂卷第 10 課（南一）',
  tasks: [
    {
      id: 'g4c10-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '嫁和架、新郎和新狼？',
      questions: [Q.zhong, Q.hong, Q.lang, Q.jia1, Q.jia2, Q.ji],
    },
    {
      id: 'g4c10-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '驕車？惱差成怒？',
      questions: [Q.jiao, Q.zhang, Q.xiu, Q.diu],
    },
    {
      id: 'g4c10-t3', skill: '多音字與部首', title: '強有三個音', icon: '💪', blurb: '倔強、強壯、勉強，念法都不一樣。',
      questions: [Q.qiang, Q.radicals, Q.soup],
    },
    {
      id: 'g4c10-t4', skill: '成語填空', title: '成語填空', icon: '🧩', blurb: '煙消雲散、捨近求遠。',
      questions: [Q.i1, Q.i2, Q.i3, Q.i4],
    },
    {
      id: 'g4c10-t5', skill: '標點與句型', title: '標點符號', icon: '❗', blurb: '冒號、刪節號、驚嘆號怎麼用？',
      questions: [Q.p1, Q.p2, Q.p3, Q.p4, Q.copy1, Q.copy2, Q.copy3],
    },
    {
      id: 'g4c10-t6', skill: '課文理解與造句', title: '老鼠嫁女兒', icon: '🐭', blurb: '鼠妞最後嫁給誰？',
      questions: [Q.wall, Q.marry, Q.lesson, Q.since],
    },
  ],
  boss: {
    id: 'g4c10-boss', skill: '整份隨堂卷', title: '第十課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.zhong, Q.hong, Q.lang, Q.jia1, Q.jia2, Q.ji,
      Q.jiao, Q.zhang, Q.xiu, Q.diu,
      Q.qiang, Q.i1, Q.i2, Q.i3, Q.i4,
      Q.radicals, Q.soup, Q.wall, Q.marry, Q.lesson,
      Q.p1, Q.p2, Q.p3, Q.p4,
      Q.copy1, Q.copy2, Q.copy3, Q.since,
    ],
  },
}
