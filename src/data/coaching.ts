import type { Question } from './types'

// 讚美方法、努力和進步，不說「聰明」「天才」（Mueller & Dweck 1998）。
// 家長頁的「可以照唸的一句話」也從這裡挑。

export const PARENT_PRAISE = [
  '我看到你答錯以後先看提示、再想一次，這就是學習的方法。',
  '你今天自己打開來練，沒有人提醒，很有責任感。',
  '上次不會的題目，這次你自己想起來了，進步看得見。',
  '你遇到難的題目沒有放棄，一格一格慢慢想，很棒。',
  '你先數清楚再回答，這個方法很穩。',
]

/** 卡關題目對應的兩分鐘親子活動（離開螢幕，用實物做） */
export function activityFor(q: Question): string {
  switch (q.type) {
    case 'trueFalse':
    case 'match':
      return '你唸一個大數字請她寫下來，再換她唸、你來寫，互相檢查哪裡不一樣。'
    case 'choice':
    case 'digits':
      return '用撲克牌排一個大數字，請她說出每張牌在哪一位、代表多少。'
    case 'compare':
      return '寫兩個很接近的大數字，請她當裁判：哪一個大？從哪一位看出來的？'
    case 'number':
      return q.paper
        ? '請她把題目講給你聽：知道什麼、要求什麼，再決定用加還是減。'
        : '用撲克牌或積木排出這個數，請她一位一位唸出來。'
    case 'count':
    case 'pickN':
      return '拿 10 顆豆子或積木，請她數出指定的數量，一邊點一邊唸。'
    case 'fillTo':
      return '先擺幾顆，問她「還要幾顆才會有 7 顆？」讓她一顆一顆補上。'
    case 'same':
      return '兩手各抓幾顆糖，請她一顆對一顆排排看，判斷是不是一樣多。'
    case 'board':
      return '在地上畫 1 到 10 的格子，丟骰子一起走，邊走邊唸數字。'
    case 'divide':
      return '拿一把硬幣或積木實際分分看，每份放一樣多，再數剩下幾個，對照直式的商和餘數。'
    case 'bond':
      return '拿幾顆豆子分成兩堆，請她說「7 可以分成 3 和 4」，再換一種分法。'
    case 'pair':
      return '用捲尺量家裡走廊有幾公尺，再一起想：走幾趟會有 1 公里（1000 公尺）？'
  }
}
