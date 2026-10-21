import type { ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/09_4上國語隨堂卷_第9課阿白觀察記(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；形近字的注音用連連看、造詞改成選字填空。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const MOTION = ['○ 動態描寫', '✓ 靜態描寫']
const motion = (id: string, sentence: string, moving: boolean, explain: string) =>
  choice(id, `「${sentence}」這句話是動態描寫，還是靜態描寫？`, MOTION, moving ? 0 : 1,
    '有沒有「動作」？跑、跳、飛是動態；穿什麼、長什麼樣子是靜態。', explain)

const Q = {
  // 字音字形
  rao1: choice('g4c9-paper-z1', '夏夜，蚊子不停在耳邊環「ㄖㄠˋ」，令我感到十分困擾。「ㄖㄠˋ」是哪一個字？', ['擾', '繞', '饒', '嬈'], 1,
    '一圈一圈的轉，像線一樣纏，要用糸字旁。', '環繞的「繞」是糸部。'),
  rao2: choice('g4c9-paper-z2', '蚊子不停在耳邊環繞，令我感到十分困「ㄖㄠˇ」。「ㄖㄠˇ」是哪一個字？', ['擾', '繞', '饒', '嬈'], 0,
    '被吵到、被麻煩，叫困什麼？要用手。', '困擾的「擾」是手部。'),
  sui: choice('g4c9-paper-z3', '警方憑著零「ㄙㄨㄟˋ」的線索努力追查。「ㄙㄨㄟˋ」是哪一個字？', ['歲', '穗', '碎', '遂'], 2,
    '一小片一小片、不完整的，叫零什麼？', '零碎的「碎」是石部。'),
  xiong: choice('g4c9-paper-z4', '警方努力追查，最後終於成功抓到「凶」手。「凶」怎麼念？', ['ㄒㄩㄥ', 'ㄒㄩㄣ', 'ㄒㄧㄥ'], 0,
    'ㄩ 加後鼻音、第一聲。', '凶手的「凶」念 ㄒㄩㄥ。'),
  ou: choice('g4c9-paper-z5', '「ㄡˇ」然間的靈感，讓作者寫出這部精采的小說。「ㄡˇ」是哪一個字？', ['偶', '藕', '嘔', '歐'], 0,
    '偶然：剛好、不是故意的，人字旁。', '偶然的「偶」是人部。'),
  zhe: choice('g4c9-paper-z6', '偶然間的靈感，讓作「者」寫出這部精采的小說。「者」怎麼念？', ['ㄓㄜˊ', 'ㄓㄜˇ', 'ㄓㄜˋ'], 1,
    '作者、記者的者，第三聲。', '作者的「者」念 ㄓㄜˇ。'),
  pai: choice('g4c9-paper-z7', '這個品「ㄆㄞˊ」設計的腳踏車既輕巧又耐用。「ㄆㄞˊ」是哪一個字？', ['排', '牌', '徘', '派'], 1,
    '商品的名字叫品牌，片字旁。', '品牌的「牌」是片部。'),
  qiao: choice('g4c9-paper-z8', '這個品牌設計的腳踏車既輕「巧」又耐用。「巧」怎麼念？', ['ㄑㄧㄠˊ', 'ㄑㄧㄠˇ', 'ㄑㄧㄠˋ'], 1,
    '巧克力的巧，第三聲。', '輕巧的「巧」念 ㄑㄧㄠˇ。'),
  chong: choice('g4c9-paper-z9', '趕著上學的弟弟急急忙忙「ㄔㄨㄥ」出家門。「ㄔㄨㄥ」是哪一個字？', ['充', '衝', '沖', '冲'], 1,
    '很快的往前跑，中間是「重」，兩邊是「行」。', '衝出家門的「衝」是行部。'),
  cu: choice('g4c9-paper-z10', '弟弟倉「促」間卻忘了帶水壺。「促」怎麼念？', ['ㄘㄨˋ', 'ㄗㄨˊ', 'ㄘㄨˊ'], 0,
    '和「促進」的促一樣，第四聲。', '倉促的「促」念 ㄘㄨˋ。'),

  // 改錯字
  feng: typo('g4c9-paper-t1', '今年的天候風調雨順，沒有天災，因此農作物都大豔收。', '豔', ['豐', '風', '封'], '豐',
    '收成很多叫做大什麼收？', '豐收的「豐」：多、豐富。'),
  zhen: typo('g4c9-paper-t2', '生意失敗後，叔叔沒有自怨自艾，而是侲作精神，重新開始。', '侲', ['振', '震', '鎮'], '振',
    '打起精神，要用手（扌）。', '振作的「振」是手部。'),
  lei: typo('g4c9-paper-t3', '當大明星一出現，臺下的觀眾一片歡聲電動。', '電', ['雷', '雪', '累'], '雷',
    '歡呼聲像打雷一樣大，叫歡聲什麼動？', '歡聲雷動：歡呼聲像雷聲一樣響。'),
  he: typo('g4c9-paper-t4', '爸爸在大賣場買了一件偈色的長褲。', '偈', ['褐', '喝', '渴'], '褐',
    '咖啡色叫褐色，衣字旁。', '褐色的「褐」是衣部。'),
  su: typo('g4c9-paper-t5', '為了提倡環保，許多店家已經不提供免費的朔膠袋。', '朔', ['塑', '素', '訴'], '塑',
    '塑膠是一種材料，下面是土。', '塑膠的「塑」，下面是土。'),

  // 形近字
  read1: {
    id: 'g4c9-paper-m1', type: 'match', prompt: '這些字長得很像，把字和正確的注音連起來。',
    pairs: [['碎', 'ㄙㄨㄟˋ'], ['翠', 'ㄘㄨㄟˋ'], ['偶', 'ㄡˇ'], ['遇', 'ㄩˋ'], ['衝', 'ㄔㄨㄥ'], ['街', 'ㄐㄧㄝ']],
    hint: '破碎、青翠、木偶、遇到、衝突、街道，念念看。', explain: '碎 ㄙㄨㄟˋ、翠 ㄘㄨㄟˋ、偶 ㄡˇ、遇 ㄩˋ、衝 ㄔㄨㄥ、街 ㄐㄧㄝ。',
  } satisfies MatchQ,
  w1: choice('g4c9-paper-w1', '破（　）', ['碎', '翠'], 0, '打破、碎掉，石字旁。', '破碎的「碎」。'),
  w2: choice('g4c9-paper-w2', '青（　）', ['碎', '翠'], 1, '綠綠的、像翡翠，上面是羽。', '青翠的「翠」。'),
  w3: choice('g4c9-paper-w3', '木（　）', ['偶', '遇'], 0, '木頭做的人偶，人字旁。', '木偶的「偶」。'),
  w4: choice('g4c9-paper-w4', '（　）到', ['偶', '遇'], 1, '在路上碰到，要走路，有辶。', '遇到的「遇」。'),
  w5: choice('g4c9-paper-w5', '（　）突', ['衝', '街'], 0, '衝突：互相碰撞、吵架。', '衝突的「衝」。'),
  w6: choice('g4c9-paper-w6', '（　）道', ['衝', '街'], 1, '城市裡的路，叫什麼道？', '街道的「街」。'),

  // 語詞
  hurry: choice('g4c9-paper-c1', '「剛跑完百米賽跑，安琪的呼吸很□□，不停的大口喘氣。」□□要填哪一個？', ['急忙', '急切', '急促', '催促'], 2,
    '呼吸又短又快，是呼吸很什麼？', '呼吸急促：又短又快。'),
  full: choice('g4c9-paper-c2', '「在鳥媽媽細心的照顧下，小鳥的羽毛漸漸□□，開始學習飛翔。」□□要填哪一個？', ['豐富', '豐盛', '豐收', '豐滿'], 3,
    '羽毛長得又多又厚。', '羽毛豐滿：長得完整、厚實。'),
  end: choice('g4c9-paper-c3', '「暑假已到了□□，媽媽要我們開始收心，準備開學。」□□要填哪一個？', ['尾聲', '結尾', '尾隨', '尾數'], 0,
    '暑假快要結束了，是到了什麼？', '到了尾聲：快要結束。'),
  effort: choice('g4c9-paper-c4', '「藝人□□的演出，博得觀眾如雷的掌聲。」□□要填哪一個？', ['賣弄', '賣力', '賣方', '賣座'], 1,
    '很用心、很努力的表演。', '賣力：用盡力氣、很努力。'),
  have: choice('g4c9-paper-c5', '「奶奶突然生病了，爸爸□□□跟公司請假，在家全心照顧奶奶。」□□□要填哪一個？', ['不可能', '不得了', '不得不', '不見得'], 2,
    '沒有別的辦法，一定要請假。', '不得不：一定要這樣做。'),
  radical: choice('g4c9-paper-x1', '下列哪一個字的部首錯了？', ['者：日部', '衝：行部', '豐：豆部', '促：人部'], 0,
    '「者」的部首在上面，跟「老」有關。', '者是老部，不是日部。'),
  limit: choice('g4c9-paper-x2', '「在我軍堅強的防守下，敵人休想跨越雷池一步。」「雷池」是什麼意思？', ['蓄水的凹地', '儲存電力的裝置', '險惡的地形', '表示某一個範圍、界限'], 3,
    '「不敢跨越雷池一步」是不敢超過某個界線。', '雷池在這裡是範圍、界限。'),

  // 課文與動靜態描寫
  why: choice('g4c9-paper-r1', '課文中，作者因為什麼事件而開始觀察白頭翁阿白？', ['將受傷的阿白帶回家治療', '每天被阿白的叫聲吵醒', '自然科作業要求觀察鳥類', '和爸爸一起去賞鳥'], 1,
    '回想課文開頭，作者為什麼會注意到阿白？', '作者每天被阿白的叫聲吵醒，才開始觀察牠。'),
  bird: choice('g4c9-paper-r2', '依據課文，有關白頭翁的敘述，下列哪一個錯誤？', ['頭頂上的羽毛是白色的', '與綠繡眼、麻雀一同被稱為「都市三俠」', '三到五月是求偶季節', '蛋的外觀有綠色斑點'], 3,
    '回想課文寫白頭翁的蛋是什麼樣子。', '「蛋的外觀有綠色斑點」是錯的。'),
  still: motion('g4c9-paper-d1', '妹妹身穿黃綠色洋裝，頭戴粉紅色髮箍，看起來清新可愛。', false, '寫穿什麼、戴什麼、看起來怎麼樣，沒有動作，是靜態描寫。'),
  move: motion('g4c9-paper-d2', '聽到門把轉動的聲音，弟弟蹦蹦跳跳的跑到玄關，準備給爸爸一個擁抱。', true, '蹦蹦跳跳、跑到，有動作，是動態描寫。'),
  move2: motion('g4c9-v-d1', '小鳥在枝頭上跳來跳去，嘰嘰喳喳的唱個不停。', true, '跳來跳去、唱歌，有動作，是動態描寫。'),
  still2: motion('g4c9-v-d2', '白頭翁的頭頂有一撮白色的羽毛，背上是橄欖綠色。', false, '寫羽毛的顏色、樣子，是靜態描寫。'),
  once: {
    id: 'g4c9-paper-s1', type: 'sort', order: 'steps', prompt: '用「一……立即……」造句：把句子排好。',
    items: ['小峻家的小狗', '一有陌生人靠近，', '立即警戒的大聲吠叫。'], steps: [1, 0, 2],
    hint: '「一」後面是發生的事，「立即」後面是馬上做出的反應。', explain: '一有陌生人靠近，小峻家的小狗立即警戒的大聲吠叫。',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c9: Unit = {
  id: 'g4c9',
  number: 9,
  grade: 4,
  subject: '國語',
  label: '第 9 課',
  title: '阿白觀察記',
  source: '4上國語隨堂卷第 9 課（南一）',
  tasks: [
    {
      id: 'g4c9-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '環繞還是環擾？品牌還是品排？',
      questions: [Q.rao1, Q.rao2, Q.sui, Q.xiong, Q.ou, Q.zhe, Q.pai, Q.qiao, Q.chong, Q.cu],
    },
    {
      id: 'g4c9-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '大豔收？歡聲電動？',
      questions: [Q.feng, Q.zhen, Q.lei, Q.he, Q.su],
    },
    {
      id: 'g4c9-t3', skill: '形近字', title: '長得很像的字', icon: '👯', blurb: '碎和翠、偶和遇、衝和街。',
      questions: [Q.read1, Q.w1, Q.w2, Q.w3, Q.w4, Q.w5, Q.w6],
    },
    {
      id: 'g4c9-t4', skill: '語詞', title: '語詞填空', icon: '🧩', blurb: '急促、豐滿、尾聲、賣力。',
      questions: [Q.hurry, Q.full, Q.end, Q.effort, Q.have, Q.radical, Q.limit],
    },
    {
      id: 'g4c9-t5', skill: '課文與描寫', title: '觀察白頭翁', icon: '🐦', blurb: '動態描寫、靜態描寫，分得出來嗎？',
      questions: [Q.why, Q.bird, Q.still, Q.move, Q.move2, Q.still2, Q.once],
    },
  ],
  boss: {
    id: 'g4c9-boss', skill: '整份隨堂卷', title: '第九課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.rao1, Q.rao2, Q.sui, Q.xiong, Q.ou, Q.zhe, Q.pai, Q.qiao, Q.chong, Q.cu,
      Q.feng, Q.zhen, Q.lei, Q.he, Q.su,
      Q.read1, Q.w1, Q.w2, Q.w3, Q.w4, Q.w5, Q.w6,
      Q.hurry, Q.full, Q.end, Q.effort, Q.have,
      Q.radical, Q.limit, Q.why, Q.bird,
      Q.still, Q.move, Q.once,
    ],
  },
}
