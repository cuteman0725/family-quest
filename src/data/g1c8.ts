import type { BinsQ, ChoiceQ, MatchQ, NumberQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：115上康軒/單元卷/05國語單課卷/1上/PDF/03_國小國語1上單課卷_第03課_(教).pdf
// 「paper」開頭的 id 是單課卷原題。
// 一年級會自動朗讀題目和提示，所以注音符號不放進 prompt、hint，放在大圖和選項裡。
// 「寫國字」改成國字和注音連連看；「把多餘的字圈起來」用找錯字的刪字模式。

const match = (id: string, prompt: string, pairs: [string, string][], hint: string, explain: string): MatchQ => ({
  id, type: 'match', prompt, pairs, hint, explain,
})

/** 部件組字：兩個部件合起來是哪一個字 */
const combine = (id: string, a: string, b: string, options: string[], answer: string): ChoiceQ => ({
  id, type: 'choice', picture: `${a} ＋ ${b}`, prompt: '兩個部件合起來，變成哪一個字？', options, answer: options.indexOf(answer),
  hint: '找一個字，裡面同時有這兩個部件。', explain: `合起來是「${answer}」。`,
})

const strokes = (id: string, char: string, n: number): NumberQ => ({
  id, type: 'number', picture: char, prompt: '這個字一共有幾畫？', answers: [String(n)], unit: '畫',
  hint: '用手指在桌上一筆一筆寫，邊寫邊數。', explain: `「${char}」一共 ${n} 畫。`,
})

const UPDOWN = ['上', '下']
const updown = (id: string, sentence: string, answer: string): ChoiceQ => ({
  id, type: 'choice', prompt: `${sentence}空格要填哪一個字？`, options: UPDOWN, answer: UPDOWN.indexOf(answer),
  hint: '想一想那個東西在上面還是下面？', explain: `填「${answer}」：${sentence.replace('（　）', answer)}`,
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

const MOUNTAIN = ['有「山」', '沒有']

const Q = {
  // 字和音
  m1: match('g1c8-paper-m1', '把字和它的注音連起來。', [['和', 'ㄏㄢˋ'], ['起', 'ㄑㄧˇ'], ['玩', 'ㄨㄢˊ'], ['朋', 'ㄆㄥˊ'], ['友', 'ㄧㄡˇ']],
    '念念課文：「他和我一起玩，好朋友。」', '他和我一起玩，好朋友。'),
  m2: match('g1c8-paper-m2', '把字和它的注音連起來。', [['秋', 'ㄑㄧㄡ'], ['千', 'ㄑㄧㄢ'], ['陪', 'ㄆㄟˊ'], ['高', 'ㄍㄠ'], ['山', 'ㄕㄢ'], ['海', 'ㄏㄞˇ']],
    '念念課文：「秋千陪我，上高山，到大海。」', '秋千陪我，上高山，到大海。'),

  // 部件組字
  c1: combine('g1c8-paper-c1', '月', '月', ['明', '朋', '服'], '朋'),
  c2: combine('g1c8-paper-c2', '阝', '音', ['陪', '培', '倍'], '陪'),
  c3: combine('g1c8-paper-c3', '至', '刂', ['侄', '倒', '到'], '到'),
  c4: combine('g1c8-paper-c4', '禾', '火', ['秋', '秀', '伙'], '秋'),
  c5: combine('g1c8-paper-c5', '氵', '每', ['莓', '海', '消'], '海'),
  c6: combine('g1c8-paper-c6', '亻', '門', ['開', '門', '們'], '們'),

  // 筆畫
  n1: strokes('g1c8-paper-n1', '友', 4),
  n2: strokes('g1c8-paper-n2', '陪', 11),
  n3: strokes('g1c8-paper-n3', '高', 10),
  n4: strokes('g1c8-paper-n4', '山', 3),
  n5: strokes('g1c8-paper-n5', '到', 8),
  n6: strokes('g1c8-paper-n6', '秋', 9),
  sameStrokes: match('g1c8-paper-m3', '筆畫一樣多的兩個字，把它們連起來。', [['友', '分'], ['陪', '這'], ['高', '起'], ['山', '千'], ['到', '朋'], ['秋', '是']],
    '先數左邊的字有幾畫，再找右邊一樣多畫的字。', '友、分 4 畫；陪、這 11 畫；高、起 10 畫；山、千 3 畫；到、朋 8 畫；秋、是 9 畫。'),

  // 找出有「山」的字
  mt1: {
    id: 'g1c8-paper-h1', type: 'bins', picture: '山峰聳立在小島中央　前方岔路請小心', prompt: '哪些字裡面藏著「山」？把字放進對的籃子。', bins: MOUNTAIN,
    items: [{ label: '峰', bin: 0 }, { label: '立', bin: 1 }, { label: '島', bin: 0 }, { label: '中', bin: 1 }, { label: '岔', bin: 0 }, { label: '路', bin: 1 }],
    hint: '找找看，字的上面、下面或旁邊，有沒有「山」。', explain: '有山：峰、島、岔。沒有：立、中、路。',
  } satisfies BinsQ,
  mt2: {
    id: 'g1c8-paper-h2', type: 'bins', picture: '釣客站在岸邊的岩石旁　崎嶇的懸崖邊', prompt: '哪些字裡面藏著「山」？把字放進對的籃子。', bins: MOUNTAIN,
    items: [{ label: '岸', bin: 0 }, { label: '站', bin: 1 }, { label: '岩', bin: 0 }, { label: '石', bin: 1 }, { label: '崎', bin: 0 }, { label: '嶇', bin: 0 }, { label: '崖', bin: 0 }, { label: '邊', bin: 1 }],
    hint: '「山」可能在上面（岸、岩、崖），也可能在左邊（崎、嶇）。', explain: '有山：岸、岩、崎、嶇、崖。沒有：站、石、邊。',
  } satisfies BinsQ,

  // 上或下、多餘的字
  u1: updown('g1c8-paper-u1', '月亮高高的掛在天（　）。', '上'),
  u2: updown('g1c8-paper-u2', '放假的時候，爺爺經常和朋友在公園裡（　）棋。', '下'),
  u3: updown('g1c8-paper-u3', '小朋友們在大樹（　）玩扮家家酒遊戲。', '下'),
  u4: updown('g1c8-paper-u4', '今天早上，爸爸開車送我和妹妹一起去（　）學。', '上'),
  e1: extra('g1c8-paper-e1', '我最喜歡盪秋天千。', '天', '我最喜歡盪秋千。'),
  e2: extra('g1c8-paper-e2', '他是我的的好朋友。', '的', '他是我的好朋友。'),
  e3: extra('g1c8-paper-e3', '大小海裡有好多魚。', '小', '大海裡有好多魚。'),
  e4: extra('g1c8-paper-e4', '我陪奶奶到看市場買菜。', '看', '我陪奶奶到市場買菜。'),
  e5: extra('g1c8-paper-e5', '我和你一起到盪秋千。', '到', '我和你一起盪秋千。'),

  // 選出正確的答案
  sound: choice('g1c8-paper-x1', '下面哪一句說錯了？', ['「大」和「他」都有 ㄚ 的音', '「山」和「上」都有 ㄤ 的音', '「高」和「到」都有 ㄠ 的音'], 1,
    '一個一個念念看：山、上，聲音的尾巴一樣嗎？', '「山」念 ㄕㄢ，沒有 ㄤ；「上」念 ㄕㄤˋ。'),
  split: choice('g1c8-paper-x2', '下面哪一個字，不能分成左邊和右邊？', ['和', '高', '陪'], 1,
    '和是禾和口，陪是阝和音，高呢？', '「高」是上下排的，不能分成左右。'),
  together: choice('g1c8-paper-x3', '「每到星期六晚上，哥哥便會和我（　）看書。」空格要填哪一個？', ['一起', '一下', '一次'], 0,
    '兩個人一同做事，叫做「一起」。', '哥哥和我一起看書。'),
  doing: choice('g1c8-paper-x4', '〈秋千〉這一課裡，主角正在做什麼？', ['溜滑梯', '跳房子', '盪秋千'], 2, '想想課文的名字。', '主角在盪秋千。'),
  how: choice('g1c8-paper-x5', '〈秋千〉這一課裡，主角是怎麼盪秋千的？', ['左左右右盪著', '上上下下盪著', '秋千都沒有移動'], 1,
    '秋千會往上，再往下。', '秋千上上下下盪著。'),
  really: choice('g1c8-paper-x6', '主角真的去到高山和大海了嗎？', ['沒有，因為秋千壞掉了', '有，主角盪著秋千到高山上，也到大海邊', '沒有，是說盪秋千時好像到了高山和大海一樣'], 2,
    '秋千可以真的飛到大海嗎？還是想像出來的？', '是想像：盪秋千時好像到了高山和大海。'),
  wrong: choice('g1c8-paper-x7', '根據〈秋千〉這一課，下面哪一句說錯了？', ['小朋友坐著紙飛機飛上天', '小朋友想像著秋千把自己帶上高山', '內容是描寫盪秋千的趣味和想像'], 0,
    '課文裡有紙飛機嗎？', '課文裡沒有紙飛機。'),

  // 句子
  s1: order('g1c8-paper-s1', ['大海', '陪我', '秋千', '到'], [2, 1, 3, 0], '秋千陪我到大海。'),
  s2: order('g1c8-paper-s2', ['秋千是', '好朋友', '我的'], [0, 2, 1], '秋千是我的好朋友。'),
  s3: order('g1c8-paper-s3', ['去打球。', '我們', '一起'], [1, 2, 0], '我們一起去打球。'),
  good: choice('g1c8-paper-y1', '照樣寫：好朋友。下面哪一個也可以接在「好」的後面？', ['鄰居', '跑步', '很快'], 0,
    '要接一種「人」，像朋友一樣。', '好鄰居、好學生，都是一種人。'),
} satisfies Record<string, Question>

export const g1c8: Unit = {
  id: 'g1c8',
  number: 8,
  grade: 1,
  subject: '國語',
  label: '1上第 3 課',
  title: '秋千',
  source: '國語1上單課卷 第 3 課（康軒）',
  tasks: [
    {
      id: 'g1c8-t1', skill: '國字和注音', title: '字和音', icon: '🔤', blurb: '秋千陪我，上高山，到大海。',
      questions: [Q.m1, Q.m2],
    },
    {
      id: 'g1c8-t2', skill: '部件組字', title: '組合字', icon: '🧩', blurb: '月加月，變成什麼字？',
      questions: [Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6],
    },
    {
      id: 'g1c8-t3', skill: '筆畫與部件', title: '數一數筆畫', icon: '⛰️', blurb: '哪些字裡藏著山？',
      questions: [Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.n6, Q.sameStrokes, Q.mt1, Q.mt2],
    },
    {
      id: 'g1c8-t4', skill: '用字與多餘的字', title: '多了一個字', icon: '✂️', blurb: '他是我的的好朋友？',
      questions: [Q.u1, Q.u2, Q.u3, Q.u4, Q.e1, Q.e2, Q.e3, Q.e4, Q.e5],
    },
    {
      id: 'g1c8-t5', skill: '字音與句子', title: '排句子', icon: '💬', blurb: '秋千是我的好朋友。',
      questions: [Q.sound, Q.split, Q.together, Q.s1, Q.s2, Q.s3, Q.good],
    },
    {
      id: 'g1c8-t6', skill: '課文', title: '盪秋千', icon: '🎠', blurb: '秋千真的到大海了嗎？',
      questions: [Q.doing, Q.how, Q.really, Q.wrong],
    },
  ],
  boss: {
    id: 'g1c8-boss', skill: '整份單課卷', title: '第三課魔王', icon: '🐲', blurb: '整份單課卷，做完才看答案！',
    questions: [
      Q.m1, Q.m2,
      Q.c1, Q.c2, Q.c3, Q.c4, Q.c5, Q.c6,
      Q.n1, Q.n2, Q.n3, Q.n4, Q.n5, Q.n6, Q.sameStrokes,
      Q.mt1, Q.mt2,
      Q.u1, Q.u2, Q.u3, Q.u4,
      Q.e1, Q.e2, Q.e3, Q.e4, Q.e5,
      Q.sound, Q.split, Q.together, Q.doing, Q.how, Q.really, Q.wrong,
      Q.s1, Q.s2, Q.good, Q.s3,
    ],
  },
}
