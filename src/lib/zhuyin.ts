// 注音、國字的判斷：一年級國語題的選項、連連看要放大才看得清楚；大圖區的句子要縮小才放得下

/** 只有注音符號、聲調和空白 */
export const ZHUYIN_ONLY = /^[ㄅ-ㄯ˙ˊˇˋ\s]+$/

/** 注音或國字組成的句子（不是一兩個大符號、大字）：大圖區的字要小一點才放得下 */
export const isZhuyinLine = (s: string) => /[ㄅ-ㄯ一-鿿]/.test(s) && s.replace(/\s/g, '').length > 2

/** 只有一個國字或標點（看字形、選標點的題目，要放大才看得出差別） */
export const SINGLE_CHAR = /^[一-鿿，。？！：]$/
