// 注音符號的判斷：一年級國語題的選項、連連看都是注音，要放大才看得清楚

/** 只有注音符號、聲調和空白 */
export const ZHUYIN_ONLY = /^[\u3105-\u312F˙ˊˇˋ\s]+$/

/** 有注音、而且不只一個符號（音節或句子）：大圖區的字要小一點才放得下 */
export const isZhuyinLine = (s: string) => /[\u3105-\u312F]/.test(s) && s.replace(/\s/g, '').length > 2
