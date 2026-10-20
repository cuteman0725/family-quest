import type { BinsQ, ChoiceQ, MatchQ, Question, SortQ, TypoQ, Unit } from './types'

// 來源：瑄_4上國語/4上國語_隨堂卷/05_4上國語隨堂卷_第5課高舉臺灣之光(教用).pdf（南一）
// 「paper」開頭的 id 是隨堂卷原題；「v」開頭的是練習變化題。
// 寫國字改成從同音字裡選；改錯字用找錯字；多音字「挑」用分類籃子；部首用連連看（造詞要自己想，沒有放）。

const choice = (id: string, prompt: string, options: string[], answer: number, hint: string, explain: string): ChoiceQ => ({
  id, type: 'choice', prompt, options, answer, hint, explain,
})

const typo = (id: string, sentence: string, wrongChar: string, options: string[], right: string, hint: string, explain: string): TypoQ => ({
  id, type: 'typo', prompt: '找出句子裡的錯字，再把它改正。', sentence, wrong: [...sentence].indexOf(wrongChar),
  options, answer: options.indexOf(right), hint, explain,
})

const S1 = '大力士用力舉起一百多公斤重的槓鈴，打破了歷年的比賽紀錄。'
const S2 = '記者詳細報導了這個國家惡意發動戰爭的過程，引起眾人討論。'
const S3 = '凱西為了夢想，竭盡全力克服任何阻礙，不放棄的精神令人敬佩。'
/** 把句子裡的一個字換成注音 */
const blank = (s: string, char: string, zhuyin: string) => s.replace(char, `「${zhuyin}」`)

const Q = {
  // 字音字形
  ju: choice('g4c5-paper-z1', `${blank(S1, '舉', 'ㄐㄩˇ')}「ㄐㄩˇ」是哪一個字？`, ['舉', '矩', '聚', '具'], 0,
    '把東西往上抬，是「舉手」的舉。', '舉起的「舉」，下面有一隻手。'),
  jin: choice('g4c5-paper-z2', '大力士舉起一百多公「斤」重的槓鈴。「斤」怎麼念？', ['ㄐㄧㄥ', 'ㄐㄧㄣ', 'ㄐㄧㄣˇ'], 1,
    '公斤的「斤」是前鼻音、第一聲。', '公斤的「斤」念 ㄐㄧㄣ。'),
  ji: choice('g4c5-paper-z3', `${blank(S1, '紀', 'ㄐㄧˋ')}「ㄐㄧˋ」是哪一個字？`, ['記', '紀', '技', '季'], 1,
    '「紀錄」是成績、數字的紀錄，用糸字旁。', '比賽紀錄的「紀」是糸部。'),
  zhan: choice('g4c5-paper-z4', `${blank(S2, '戰', 'ㄓㄢˋ')}「ㄓㄢˋ」是哪一個字？`, ['站', '戰', '佔', '展'], 1,
    '兩個國家打仗，是什麼爭？', '戰爭的「戰」，右邊是戈（武器）。'),
  zheng: choice('g4c5-paper-z5', '記者報導了這個國家惡意發動戰「爭」的過程。「爭」怎麼念？', ['ㄓㄥ', 'ㄓㄣ', 'ㄗㄥ'], 0,
    '翹舌音、後鼻音、第一聲。', '戰爭的「爭」念 ㄓㄥ。'),
  cheng: choice('g4c5-paper-z6', `${blank(S2, '程', 'ㄔㄥˊ')}「ㄔㄥˊ」是哪一個字？`, ['成', '城', '程', '誠'], 2,
    '事情從開始到結束的經過，叫過什麼？', '過程的「程」是禾部。'),
  jie: choice('g4c5-paper-z7', `${blank(S3, '竭', 'ㄐㄧㄝˊ')}「ㄐㄧㄝˊ」是哪一個字？`, ['節', '潔', '竭', '傑'], 2,
    '竭盡全力：用盡所有的力氣。', '竭盡全力的「竭」，是用盡的意思。'),
  qi: choice('g4c5-paper-z8', `${blank(S3, '棄', 'ㄑㄧˋ')}「ㄑㄧˋ」是哪一個字？`, ['棄', '器', '汽', '氣'], 0,
    '不放手、不丟掉，是不放什麼？', '放棄的「棄」：丟掉不要。'),
  pei: choice('g4c5-paper-z9', `${blank(S3, '佩', 'ㄆㄟˋ')}「ㄆㄟˋ」是哪一個字？`, ['配', '佩', '沛', '培'], 1,
    '敬佩：尊敬又欣賞一個人，人字旁。', '敬佩的「佩」是人字旁。'),

  // 改錯字
  zhen: typo('g4c5-paper-t1', '深夜裡，一場突如其來的大地振，把大家都嚇醒了。', '振', ['震', '鎮', '陣'], '震',
    '地在搖動，跟打雷一樣用雨字頭。', '地震的「震」是雨部；「振」是振作的振。'),
  jiao: typo('g4c5-paper-t2', '教練希望球員們抱持著「勝不嬌、敗不餒」的態度參賽。', '嬌', ['驕', '交', '轎'], '驕',
    '贏了不要自以為了不起，是「驕傲」的驕。', '勝不驕：贏了也不驕傲。驕是馬部。'),
  juan: typo('g4c5-paper-t3', '妹妹將自己的零用錢絹出來，希望能幫助社會的弱勢族群。', '絹', ['捐', '娟', '圈'], '捐',
    '把錢拿出來送給別人，是用手做的事。', '捐錢的「捐」是手部。'),
  ao: typo('g4c5-paper-t4', '那位顧客敖慢無禮的態度，引起周圍民眾的反感。', '敖', ['熬', '傲', '遨'], '傲',
    '看不起別人的態度，是人字旁的「傲」。', '傲慢的「傲」是人部。'),

  // 多音字與部首
  tiao: {
    id: 'g4c5-paper-b1', type: 'bins', prompt: '「挑」有兩個讀音。把語詞放進對的讀音籃子。', bins: ['ㄊㄧㄠ', 'ㄊㄧㄠˇ'],
    items: [{ label: '挑選名著', bin: 0 }, { label: '無從挑剔', bin: 0 }, { label: '挑釁', bin: 1 }, { label: '挑戰上一屆的冠軍', bin: 1 }],
    hint: '選東西、找毛病念第一聲；故意惹人、要跟人比賽念第三聲。',
    explain: 'ㄊㄧㄠ：挑選名著、無從挑剔。ㄊㄧㄠˇ：挑釁、挑戰上一屆的冠軍。',
  } satisfies BinsQ,
  radicals: {
    id: 'g4c5-paper-m1', type: 'match', prompt: '把字和它的部首連起來。',
    pairs: [['捐', '手部'], ['驕', '馬部'], ['困', '口部'], ['爭', '爪部'], ['棄', '木部']],
    hint: '找字裡跟意思有關的那一部分：捐要用手、驕跟馬有關、困是被框住。',
  } satisfies MatchQ,

  // 語詞
  process: choice('g4c5-paper-c1', '「準備園遊會的□□雖然辛苦，但我們也從中學到許多事情。」□□要填哪一個？', ['過程', '路程', '前程', '里程'], 0,
    '準備的時候「經過」的事情。', '過程：事情進行的經過。路程、里程是路的長短。'),
  glory: choice('g4c5-paper-c2', '「選手們在操場上大展身手，希望能奪下冠軍，為國□□。」□□要填哪一個？', ['爭取', '爭執', '爭鬥', '爭光'], 3,
    '讓國家有光榮，是為國什麼？', '為國爭光：讓國家得到光榮。'),
  achieve: choice('g4c5-paper-c3', '「看到學生們在不同領域各有□□，張教授感到非常欣慰。」□□要填哪一個？', ['成分', '成名', '成就', '成見'], 2,
    '學生做出很好的成果，叫做有什麼？', '成就：努力以後得到的好成果。'),
  shock: choice('g4c5-paper-c4', '「聽到表姐要出國留學的消息，大家都非常□□。」□□要填哪一個？', ['震央', '震驚', '震盪', '震耳'], 1,
    '突然聽到意外的消息，心裡嚇一跳。', '震驚：非常驚訝。震央是地震發生的地方。'),
  allout: choice('g4c5-paper-c5', '「運動場上，選手們□□□□為班級爭取榮譽。」□□□□要填哪一個？', ['用之不竭', '不自量力', '有氣無力', '竭盡全力'], 3,
    '為了榮譽，要用盡所有力氣。', '竭盡全力：把力氣都用出來。'),
  pattern: choice('g4c5-paper-y1', '照樣寫：「保持」「樂觀正面」的「想法」。寫下（　）的故事', ['驚心動魄', '保持', '舉重'], 0,
    '中間要填形容「故事」的詞。', '寫下驚心動魄的故事：驚心動魄形容很刺激、很緊張。'),
  pattern2: choice('g4c5-v-y1', '照樣寫：「保持」「樂觀正面」的「想法」。分享（　）的心情', ['興奮快樂', '舉起', '槓鈴'], 0,
    '中間要填形容「心情」的詞。', '分享興奮快樂的心情。'),

  // 課文理解與造句
  poster: choice('g4c5-paper-r1', '阿奇打算製作郭婞淳的介紹海報，下列哪一項內容不符合課文？', ['奧運國手', '能夠舉起一百四十公斤的重量', '曾打破舉重世界比賽紀錄', '認為有成就才能幫助別人'], 3,
    '郭婞淳幫助別人，是等有成就以後才做的嗎？', '「認為有成就才能幫助別人」不符合課文。'),
  success: choice('g4c5-paper-r2', '下列哪一個選項，不是作者認為郭婞淳會成功的因素？', ['努力不懈', '樂觀積極', '天賦異稟', '勇於挑戰'], 2,
    '作者想說成功是靠自己做到的，哪一個是天生的？', '天賦異稟是天生就很厲害，不是作者說的成功原因。'),
  same: choice('g4c5-paper-r3', '作者和郭婞淳，有什麼共同之處？', ['都有家人和老師的支持', '都把比賽獎金捐給醫院', '都是臺灣之光', '都曾在比賽中打破世界紀錄'], 0,
    '想一想作者自己身邊有誰在幫忙。', '作者和郭婞淳都有家人和老師的支持。'),
  however: {
    id: 'g4c5-paper-s1', type: 'sort', order: 'steps', prompt: '用「……然而……」造句：把句子排好。',
    items: ['然而天公不作美，', '大家準備出門野餐，', '外面突然下起了大雨。'], steps: [1, 0, 2],
    hint: '「然而」後面接「跟想的不一樣」的事。', explain: '大家準備出門野餐，然而天公不作美，外面突然下起了大雨。',
  } satisfies SortQ,
} satisfies Record<string, Question>

export const g4c5: Unit = {
  id: 'g4c5',
  number: 5,
  grade: 4,
  subject: '國語',
  label: '第 5 課',
  title: '高舉臺灣之光',
  source: '4上國語隨堂卷第 5 課（南一）',
  tasks: [
    {
      id: 'g4c5-t1', skill: '字音字形', title: '同音字大考驗', icon: '🔤', blurb: '紀錄還是記錄？竭盡還是潔盡？',
      questions: [Q.ju, Q.jin, Q.ji, Q.zhan, Q.zheng, Q.cheng, Q.jie, Q.qi, Q.pei],
    },
    {
      id: 'g4c5-t2', skill: '改錯字', title: '錯字偵探', icon: '🕵️', blurb: '大地振？勝不嬌？把錯字抓出來！',
      questions: [Q.zhen, Q.jiao, Q.juan, Q.ao],
    },
    {
      id: 'g4c5-t3', skill: '多音字與部首', title: '挑有兩個音', icon: '🏋️', blurb: '挑選和挑戰，念法不一樣。',
      questions: [Q.tiao, Q.radicals],
    },
    {
      id: 'g4c5-t4', skill: '語詞與句型', title: '語詞填空', icon: '🧩', blurb: '過程、成就、竭盡全力。',
      questions: [Q.process, Q.glory, Q.achieve, Q.shock, Q.allout, Q.pattern, Q.pattern2],
    },
    {
      id: 'g4c5-t5', skill: '課文理解與造句', title: '臺灣之光', icon: '🥇', blurb: '郭婞淳為什麼會成功？',
      questions: [Q.poster, Q.success, Q.same, Q.however],
    },
  ],
  boss: {
    id: 'g4c5-boss', skill: '整份隨堂卷', title: '第五課魔王', icon: '🐉', blurb: '整份隨堂卷，交卷後才知道答案！',
    questions: [
      Q.ju, Q.jin, Q.ji, Q.zhan, Q.zheng, Q.cheng, Q.jie, Q.qi, Q.pei,
      Q.zhen, Q.jiao, Q.juan, Q.ao,
      Q.tiao, Q.radicals,
      Q.process, Q.glory, Q.achieve, Q.shock, Q.allout,
      Q.poster, Q.success, Q.same,
      Q.pattern, Q.however,
    ],
  },
}
