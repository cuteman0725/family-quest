export interface GameProps<Q> {
  q: Q
  /** 孩子送出答案。selfCorrected：孩子在遊戲中已經自己改正（例如連連看），不需要再重試 */
  onAnswer: (correct: boolean, opts?: { selfCorrected?: boolean }) => void
  /** 等待回饋時鎖住，不能再按 */
  locked: boolean
}
