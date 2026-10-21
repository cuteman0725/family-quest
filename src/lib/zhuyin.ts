// 注音符號的判斷：一年級國語題的選項、連連看都是注音，要放大才看得清楚

/** 只有注音符號、聲調和空白 */
export const ZHUYIN_ONLY = /^[\u3105-\u312F˙ˊˇˋ\s]+$/

/** 有注音、而且不只一個符號（音節或句子）：大圖區的字要小一點才放得下 */
export const isZhuyinLine = (s: string) => /[\u3105-\u312F]/.test(s) && s.replace(/\s/g, '').length > 2

/** 只有一個國字或標點（看字形、選標點的題目，要放大才看得出差別） */
export const SINGLE_CHAR = /^[\u4e00-\u9fff\uff0c\u3002\uff1f\uff01]$/
