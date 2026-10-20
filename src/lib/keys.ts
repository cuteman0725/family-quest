/** 小數題的鍵盤：多一個小數點，✔ 放在最下面一整排 */
export const DECIMAL_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫', '✔']

/** 按一個鍵後的新字串：小數點最多一個、開頭沒有數字時補 0 */
export function typeKey(value: string, k: string, maxLength = 10) {
  if (k === '⌫') return value.slice(0, -1)
  if (k === '.') return value.includes('.') ? value : (value || '0') + '.'
  return value.length < maxLength ? value + k : value
}
