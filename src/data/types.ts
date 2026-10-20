// 題目型別：每一種型別對應一個小遊戲元件（見 src/games）

export type Grade = 1 | 4

interface Base {
  id: string
  /** 題目文字，也是朗讀的內容 */
  prompt: string
  /** 題組共用的情境文字或表格（逐行顯示） */
  context?: string
  /** 題目旁邊的大圖（emoji）。放這裡而不寫進 prompt，朗讀時才不會把 emoji 念出來 */
  picture?: string
  /** 引導重試時顯示的提示 */
  hint: string
  /** 第二次仍答錯時顯示的說明 */
  explain?: string
}

/** 對的畫○，錯的打× */
export interface TrueFalseQ extends Base {
  type: 'trueFalse'
  answer: boolean
}

/** 從幾個按鈕中選一個（位值單位、讀法…） */
export interface ChoiceQ extends Base {
  type: 'choice'
  options: string[]
  answer: number
}

/** 數字天秤：選 >、<、= */
export interface CompareQ extends Base {
  type: 'compare'
  left: string
  right: string
  answer: '>' | '<' | '='
}

/** 用數字鍵盤輸入答案 */
export interface NumberQ extends Base {
  type: 'number'
  /** 可接受的答案（只比對數字，忽略逗號與空白） */
  answers: string[]
  /** 題目要用紙筆算，App 只收答案 */
  paper?: boolean
  unit?: string
  /** 小數題：鍵盤多一個小數點，答案用數值比對（2.7 和 2.70 都算對） */
  decimal?: boolean
}

/** 選出所有符合的數字 0～9 */
export interface DigitsQ extends Base {
  type: 'digits'
  answer: number[]
}

/** 連連看 */
export interface MatchQ extends Base {
  type: 'match'
  pairs: [string, string][]
}

/** 一年級：數一數有幾個，按數字回答 */
export interface CountQ extends Base {
  type: 'count'
  /** 畫面上的物品，可以有好幾種；ask 指定要數哪一種 */
  scene: { emoji: string; n: number; label: string }[]
  ask: string
}

/** 一年級：點選剛好 n 個；cross 時是「把多的畫掉」，點到的打 ✖ */
export interface PickNQ extends Base {
  type: 'pickN'
  emoji: string
  total: number
  n: number
  cross?: boolean
}

/** 一年級：補畫○，補到跟數字一樣多 */
export interface FillToQ extends Base {
  type: 'fillTo'
  emoji: string
  have: number
  target: number
}

/** 一年級：兩邊一樣多嗎？ */
export interface SameQ extends Base {
  type: 'same'
  left: { emoji: string; n: number }
  right: { emoji: string; n: number }
  answer: boolean
}

/** 一年級：直線數字棋盤，轉轉盤後依序點出經過的每一格（Ramani & Siegler） */
export interface BoardQ extends Base {
  type: 'board'
  /** 終點的數字，棋盤是 1～size 從左排到右 */
  size: number
}

/** 四年級：直式除法，在紙上算完後填「商」和「餘數」兩格；答案從被除數、除數算出來 */
export interface DivideQ extends Base {
  type: 'divide'
  dividend: number
  divisor: number
  /** 應用題的答案單位，例如 ['段', '公尺'] 顯示成「（ ）段，剩下（ ）公尺」；沒有就顯示商與餘數 */
  units?: [string, string]
}

/** 一年級：數字分合圖（上面是合起來的數，下面是兩個部分），其中一格空白要填 */
export interface BondQ extends Base {
  type: 'bond'
  whole: number
  parts: [number, number]
  /** 哪一格空白：合起來的數，或第幾個部分 */
  blank: 'whole' | 0 | 1
  /** 有給就把兩堆畫出來，讓孩子數；沒給就只看數字 */
  emoji?: string
}

/** 兩格數字，例如「（ ）公里（ ）公尺」或「（ ）公尺＝（ ）公分」 */
export interface PairQ extends Base {
  type: 'pair'
  answers: [number, number]
  labels: [string, string]
  /** 兩格中間的字，預設不加 */
  joiner?: string
  paper?: boolean
  /** 小數題：鍵盤多一個小數點 */
  decimal?: boolean
}

/** 四年級：直式乘法，答案從兩個乘數算出來 */
export interface MultiplyQ extends Base {
  type: 'multiply'
  a: number
  b: number
}

/** 角度組合圖：從底邊（0°）逆時針畫出幾條射線，弧線標出各部分 */
export interface AngleFigure {
  rays: number[]
  arcs: { from: number; to: number; label: string; level?: number }[]
}

/**
 * 四年級角度：
 * kind 判斷銳角／直角／鈍角／平角；measure 看量角器讀度數；
 * draw 拖曳射線畫出指定角度；compute 看組合圖算出 ∠A（degrees 就是答案）
 */
export interface AngleQ extends Base {
  type: 'angle'
  ask: 'kind' | 'measure' | 'draw' | 'compute'
  degrees: number
  figure?: AngleFigure
  /** 整張圖旋轉幾度，讓角不總是開口朝同一邊（kind 用） */
  tilt?: number
}

/** 一年級：用長條比長短、高矮、厚薄；fair 是判斷起點有沒有對齊 */
export interface LengthQ extends Base {
  type: 'length'
  items: { emoji: string; label: string; size: number; offset?: number }[]
  /** horizontal 比長短；vertical 比高矮或厚薄 */
  direction: 'horizontal' | 'vertical'
  ask: 'max' | 'min' | 'fair'
}

/** 一年級：排排隊。position 第幾個；which 第 n 個是誰；before／after 前面、後面有幾個 */
export interface OrderQ extends Base {
  type: 'order'
  items: { emoji: string; name: string }[]
  /** 從哪一邊開始數；items 的順序固定是左到右、上到下 */
  from: 'left' | 'right' | 'top' | 'bottom'
  ask: 'position' | 'which' | 'before' | 'after'
  /** position／before／after：目標在 items 裡的位置；which：從 from 數來第幾個（1 起算） */
  target: number
}

/** 一年級：數字接龍，依序把空格填上 */
export interface SequenceQ extends Base {
  type: 'sequence'
  values: number[]
  /** 哪幾格是空的（values 的位置） */
  blanks: number[]
}

/**
 * 四年級三角形：依三個角畫出比例正確的三角形。
 * angles 依序是左下、右下、頂點的角。
 * missing 求 unknown 那個角（答案是 180 減另外兩個）；kind 判斷銳角／直角／鈍角三角形；
 * sides 判斷正三角形／等腰三角形／都不是
 */
export interface TriangleQ extends Base {
  type: 'triangle'
  angles: [number, number, number]
  ask: 'missing' | 'kind' | 'sides'
  unknown?: 0 | 1 | 2
}

/** 排排看：依序點出由大到小（或由小到大）的數；答案從數值算出 */
export interface SortQ extends Base {
  type: 'sort'
  items: string[]
  order: 'desc' | 'asc'
}

/**
 * 一年級算式：「（a）＋（b）＝（c）」或減法，blanks 是要填的格子，依序從左到右填。
 * 加法的 a、b 都要填時，順序對調也算對（7＋3 和 3＋7）。有 emoji 就把兩堆畫出來。
 */
export interface EquationQ extends Base {
  type: 'equation'
  a: number
  b: number
  op: '+' | '-'
  blanks: ('a' | 'b' | 'c')[]
  emoji?: string
}

export type Question =
  | TrueFalseQ
  | ChoiceQ
  | CompareQ
  | NumberQ
  | DigitsQ
  | MatchQ
  | CountQ
  | PickNQ
  | FillToQ
  | SameQ
  | BoardQ
  | DivideQ
  | BondQ
  | PairQ
  | MultiplyQ
  | AngleQ
  | LengthQ
  | OrderQ
  | SequenceQ
  | TriangleQ
  | SortQ
  | EquationQ

/** 短任務：約 10～15 分鐘、一小組題目 */
export interface Task {
  id: string
  title: string
  icon: string
  /** 技能地圖上的節點名稱，也是結果畫面說「你在練什麼」的用語 */
  skill: string
  /** 朗讀用的簡短說明 */
  blurb: string
  questions: Question[]
}

/** 一個學習範圍（單元），魔王關是整份單元卷 */
export interface Unit {
  id: string
  grade: Grade
  /** 課本的第幾單元，用來排順序和選「目前單元」 */
  number: number
  subject: '數學'
  title: string
  source: string
  tasks: Task[]
  boss: Task
}
