import type { BinsQ, ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/1上/PDF/06_國小國語1上單課卷_第06課_(教).pdf
// 「paper」開頭的 id 是單課卷原題。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「寫國字」改成國字和注音連連看；「把多餘的字圈起來」用找錯字的刪字模式。

const match = (id: string, pairs: [string, string][], text: string): MatchQ => ({
  id, type: 'match', prompt: '把字和它的注音連起來。', pairs, hint: `念念課文：「${text}」一個字一個字對。`, explain: text,
})

const reading = (id: string, word: string, char: string, options: string[], answer: number): ChoiceQ => ({
  id, type: 'choice', picture: word, prompt: `「${char}」在這個語詞裡怎麼念？`, options, answer,
  hint: `念念看這個語詞，「${char}」有時候念法不一樣，要看是哪一個語詞。`, explain: `${word}的「${char}」念 ${options[answer]}。`,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain: `「${wrongChar}」要改成「${right}」。`,
})

const extra = (id: string, sentence: string, wrongChar: string, fixed: string): TypoQ => ({
  id, type: 'typo', extra: true, prompt: '句子裡多了一個字，把它點掉。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options: [], answer: -1, hint: '一個字一個字慢慢念，哪一個字念起來怪怪的、可以拿掉？', explain: `拿掉「${wrongChar}」：${fixed}`,
})

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const order = (id: string, items: string[], steps: number[], explain: string): SortQ => ({
  id, type: 'sort', order: 'steps', prompt: '把詞語排成通順的句子。', items, steps,
  hint: '先念念看，哪一個放在最前面最通順？', explain,
})

const WOOD = ['有「木」', '沒有']
const MEASURE_HINT = '想一想這個東西要用什麼來數：汽車一輛、彈珠一顆、樹葉一片……'

const Q = {
  // 字和音
  m1: match('g1c11-paper-m1', [['走', 'ㄗㄡˇ'], ['在', 'ㄗㄞˋ'], ['路', 'ㄌㄨˋ'], ['那', 'ㄋㄚˋ'], ['朵', 'ㄉㄨㄛˇ'], ['紅', 'ㄏㄨㄥˊ']], '和你走在路上，那朵紅花。'),
  m2: match('g1c11-paper-m2', [['白', 'ㄅㄞˊ'], ['雲', 'ㄩㄣˊ'], ['從', 'ㄘㄨㄥˊ'], ['頭', 'ㄊㄡˊ'], ['說', 'ㄕㄨㄛ'], ['向', 'ㄒㄧㄤˋ']], '白雲，從頭說起，向前看。'),
  r1: reading('g1c11-paper-r1', '長大', '長', ['ㄓㄤˇ', 'ㄔㄤˊ'], 0),
  r2: reading('g1c11-paper-r2', '頭髮', '頭', ['ㄉㄡˊ', 'ㄊㄡˊ'], 1),
  r3: reading('g1c11-paper-r3', '傳說', '說', ['ㄕㄨㄛ', 'ㄕㄨㄟˋ'], 0),
  r4: reading('g1c11-paper-r4', '從前', '從', ['ㄘㄨㄥˊ', 'ㄘㄨㄥ', 'ㄗㄨㄥˋ'], 0),
  r5: reading('g1c11-paper-r5', '長頸鹿', '長', ['ㄓㄤˇ', 'ㄔㄤˊ'], 1),
  r6: reading('g1c11-paper-r6', '那一頭', '那', ['ㄋㄚˇ', 'ㄋㄚˋ'], 1),

  // 錯字偵探
  t1: typo('g1c11-paper-t1', '百紙上畫了一隻小狗。', '百', ['白', '伯', '拍'], '白', '紙是什麼顏色？'),
  t2: typo('g1c11-paper-t2', '爸爸拿著一垛玫瑰花。', '垛', ['朵', '多', '躲'], '朵', '花要用「朵」來數。'),
  t3: typo('g1c11-paper-t3', '不可以在起廊上奔跑。', '起', ['走', '跑', '超'], '走', '教室外面的那條路叫做「走廊」。'),
  t4: typo('g1c11-paper-t4', '現左外面正下著大雨。', '左', ['在', '右', '再'], '在', '「現在」的在。'),
  t5: typo('g1c11-paper-t5', '新同學正尚大家自我介紹。', '尚', ['向', '上', '想'], '向', '對著大家說話，是「向大家」。'),
  t6: typo('g1c11-paper-t6', '小貓徒這一頭走到那一頭。', '徒', ['從', '走', '徙'], '從', '「從這裡到那裡」的從。'),

  // 藏著「木」的字
  wood1: {
    id: 'g1c11-paper-h1', type: 'bins', picture: '學校教室裡的桌子排整齊。爸爸打算請木工做一個衣櫃。袋子裡有蘋果與李子。',
    prompt: '哪些字裡面藏著「木」？把字放進對的籃子。', bins: WOOD,
    items: [{ label: '校', bin: 0 }, { label: '學', bin: 1 }, { label: '桌', bin: 0 }, { label: '教', bin: 1 }, { label: '木', bin: 0 }, { label: '櫃', bin: 0 }, { label: '袋', bin: 1 }, { label: '果', bin: 0 }, { label: '李', bin: 0 }],
    hint: '「木」可能在左邊（校、櫃），也可能在下面（桌、果）或上面（李）。', explain: '有木：校、桌、木、櫃、果、李。沒有：學、教、袋。',
  } satisfies BinsQ,
  wood2: {
    id: 'g1c11-paper-h2', type: 'bins', picture: '樹上開滿了白色的花朵。走到小路的盡頭，就能看到廣闊的森林。',
    prompt: '哪些字裡面藏著「木」？把字放進對的籃子。', bins: WOOD,
    items: [{ label: '樹', bin: 0 }, { label: '花', bin: 1 }, { label: '朵', bin: 0 }, { label: '路', bin: 1 }, { label: '森', bin: 0 }, { label: '林', bin: 0 }, { label: '看', bin: 1 }],
    hint: '森有三個木，林有兩個木。', explain: '有木：樹、朵、森、林。沒有：花、路、看。',
  } satisfies BinsQ,

  // 多餘的字
  e1: extra('g1c11-paper-e1', '我向爺爺說話早安。', '話', '我向爺爺說早安。'),
  e2: extra('g1c11-paper-e2', '他陪我去了看電影。', '了', '他陪我去看電影。'),
  e3: extra('g1c11-paper-e3', '媽媽慢慢走路在小巷裡。', '路', '媽媽慢慢走在小巷裡。'),
  e4: extra('g1c11-paper-e4', '藍色的大海是在海豚的家。', '在', '藍色的大海是海豚的家。'),
  e5: extra('g1c11-paper-e5', '白白的小花，一朵又那一朵。', '那', '白白的小花，一朵又一朵。'),
  e6: extra('g1c11-paper-e6', '我和哥哥一起從操場這裡一頭跑到那一頭。', '裡', '我和哥哥一起從操場這一頭跑到那一頭。'),

  // 量詞
  again: choice('g1c11-paper-q1', '「一隻（　）一隻蝴蝶。」空格要填哪一個字？', ['有', '又', '加'], 1, '「一隻又一隻」：很多隻。', '一隻又一隻的蝴蝶。'),
  cars: choice('g1c11-paper-q2', '（　）的汽車行駛在馬路上。', ['一輛又一輛', '一條又一條', '一朵又一朵'], 0, MEASURE_HINT, '汽車用「輛」：一輛又一輛的汽車。'),
  marbles: choice('g1c11-paper-q3', '弟弟將（　）的彈珠放進罐子裡。', ['一片又一片', '一顆又一顆', '一杯又一杯'], 1, MEASURE_HINT, '彈珠用「顆」：一顆又一顆的彈珠。'),
  clouds: choice('g1c11-paper-q4', '（　）的白雲從這一頭飄到那一頭。', ['一朵又一朵', '一雙又一雙', '一輛又一輛'], 0, MEASURE_HINT, '白雲用「朵」：一朵又一朵的白雲。'),
  leaves: choice('g1c11-paper-q5', '秋天時，（　）的樹葉掉落在地上。', ['一隻又一隻', '一片又一片', '一條又一條'], 1, MEASURE_HINT, '樹葉用「片」：一片又一片的樹葉。'),
  butterflies: choice('g1c11-paper-q6', '（　）的蝴蝶在花園裡飛舞著。', ['一杯又一杯', '一顆又一顆', '一隻又一隻'], 2, MEASURE_HINT, '蝴蝶用「隻」：一隻又一隻的蝴蝶。'),
  scarves: choice('g1c11-paper-q7', '奶奶準備了（　）的圍巾保暖。', ['一條又一條', '一片又一片', '一朵又一朵'], 0, MEASURE_HINT, '圍巾用「條」：一條又一條的圍巾。'),

  // 課文
  who: choice('g1c11-paper-x4', '〈小路〉這一課裡，誰陪主角一起走在小路上？', ['小魚', '小花', '月亮'], 1, '想一想課文裡，小路旁邊有什麼？', '小花陪主角一起走在小路上。'),
  sides: choice('g1c11-paper-x5', '〈小路〉這一課裡，小路的兩旁長滿了什麼？', ['大樹', '果子', '小花'], 2, '想一想課文裡，小路的兩旁有什麼？', '小路的兩旁長滿了小花。'),
  s1: order('g1c11-paper-s1', ['說', '向', '你好', '小白花'], [1, 3, 0, 2], '向小白花說你好。'),
  s2: order('g1c11-paper-s2', ['一起', '小路上', '陪我', '走在'], [2, 0, 3, 1], '陪我一起走在小路上。'),

  // 句子
  make: choice('g1c11-paper-x2', '下面哪一句說錯了？', ['言＋兌，變成說', '糸＋工，變成紅', '⺌＋同，變成向'], 2,
    '「向」的上面是一撇，不是⺌。', '「⺌＋同」不是「向」，是「尚」。'),
  ends: choice('g1c11-paper-x3', '「從（　）到（　），都是綠油油的稻田。」空格要填哪一組？', ['這一頭／那一頭', '這一本／那一本', '這一棵／那一棵'], 0,
    '稻田從這邊一直到那邊。', '從這一頭到那一頭，都是稻田。'),
  long: choice('g1c11-paper-y1', '照樣寫：長長的小路。下面哪一個也是一樣的寫法？', ['白白的雪花', '白雪花的', '雪花白白'], 0,
    '「長長的小路」：疊字＋的＋東西。', '白白的雪花：疊字＋的＋東西。'),
  sit: choice('g1c11-paper-y2', '照樣寫：走在小路上。（　）在沙發上', ['坐', '花', '紅'], 0, '在沙發上會做什麼動作？', '坐在沙發上。'),
  longer: choice('g1c11-paper-y3', '短語加長：一朵又一朵 → 一朵又一朵的小花。「一個又一個」可以加長成哪一個？', ['一個又一個的小朋友', '一個又一個的牛奶', '一個又一個的跑步'], 0,
    '「個」可以用來數人。', '一個又一個的小朋友。'),
  also: order('g1c11-paper-s3', ['也喜歡跑步。', '哥哥', '喜歡游泳，'], [1, 2, 0], '哥哥喜歡游泳，也喜歡跑步。'),
} satisfies Record<string, Question>

export const g1c11: Unit = {
  id: 'g1c11',
  number: 11,
  grade: 1,
  subject: '國語',
  label: '1上第 6 課',
  title: '小路',
  source: '國語1上單課卷 第 6 課（康軒）',
  tasks: [
    {
      id: 'g1c11-t1', skill: '國字和注音', title: '字和音', icon: '🔤', blurb: '長大和長頸鹿，念法不一樣！',
      questions: [Q.m1, Q.m2, Q.r1, Q.r2, Q.r3, Q.r4, Q.r5, Q.r6],
    },
    {
      id: 'g1c11-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '百紙？起廊？',
      questions: [Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6],
    },
    {
      id: 'g1c11-t3', skill: '字的部件', title: '藏著木的字', icon: '🌳', blurb: '森林裡有幾個木？',
      questions: [Q.wood1, Q.wood2],
    },
    {
      id: 'g1c11-t4', skill: '多餘的字', title: '多了一個字', icon: '✂️', blurb: '一朵又那一朵？',
      questions: [Q.e1, Q.e2, Q.e3, Q.e4, Q.e5, Q.e6],
    },
    {
      id: 'g1c11-t5', skill: '量詞', title: '一朵又一朵', icon: '☁️', blurb: '一輛汽車、一片樹葉。',
      questions: [Q.again, Q.cars, Q.marbles, Q.clouds, Q.leaves, Q.butterflies, Q.scarves],
    },
    {
      id: 'g1c11-t6', skill: '課文', title: '小路', icon: '🛤️', blurb: '誰陪我走在小路上？',
      questions: [Q.who, Q.sides, Q.s1, Q.s2],
    },
    {
      id: 'g1c11-t7', skill: '句子', title: '照樣寫', icon: '✏️', blurb: '長長的小路，白白的雪花。',
      questions: [Q.make, Q.ends, Q.long, Q.sit, Q.longer, Q.also],
    },
  ],
  boss: {
    id: 'g1c11-boss', skill: '整份單課卷', title: '第六課魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.m1, Q.m2,
      Q.r1, Q.r2, Q.r3, Q.r4, Q.r5, Q.r6,
      Q.t1, Q.t2, Q.t3, Q.t4, Q.t5, Q.t6,
      Q.wood1, Q.wood2,
      Q.e1, Q.e2, Q.e3, Q.e4, Q.e5, Q.e6,
      Q.again, Q.make, Q.ends, Q.who, Q.sides,
      Q.butterflies, Q.cars, Q.marbles, Q.clouds, Q.leaves, Q.scarves,
      Q.s1, Q.s2, Q.long, Q.sit, Q.longer, Q.also,
    ],
  },
}
