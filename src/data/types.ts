// 題目型別：每一種型別對應一個小遊戲元件（見 src/games）

export type Grade = 1 | 4

interface Base {
  id: string
  /** 題目文字，也是朗讀的內容 */
  prompt: string
  /** 題組共用的情境文字或表格（逐行顯示） */
  context?: string
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

/** 一年級：點選剛好 n 個 */
export interface PickNQ extends Base {
  type: 'pickN'
  emoji: string
  total: number
  n: number
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
