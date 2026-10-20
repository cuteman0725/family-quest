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
    case 'multiply':
      return '去超市時讓她算：一盒 35 元，買 12 盒要多少錢？先估一估，再用紙筆算。'
    case 'angle':
      return '用兩枝筷子在桌上比出角：比一個比直角小的、一個剛好直角、一個比直角大的，請她說出名字。'
    case 'length':
      return '拿兩枝筆，請她先把一頭對齊，再比哪一枝比較長。'
    case 'order':
      return '排幾個玩偶，問她：從左邊數第 3 個是誰？小熊前面有幾個？'
    case 'sequence':
      return '一起從 1 數到 10，再從 10 倒數回 1；你停在哪裡，就請她接著數。'
    case 'sort':
      return '拿幾張價錢標籤（例如 12.5 元、12.05 元），請她排出哪個最貴、哪個最便宜，並說出先比哪一位。'
    case 'equation':
      return '拿糖果編故事：「你有 3 顆，我再給你 4 顆」，請她先說算式，再數一數答案。'
    case 'fraction':
      return '切一個披薩或蛋糕成 8 等份，拿走幾塊，請她說出「拿走 8 分之幾、還剩 8 分之幾」；超過一個時說成幾又幾分之幾。'
    case 'fracLine':
      return '拿一條繩子當數線，標 0、1、2，請她把繩子摺成一樣長的幾段，找出指定的分數在哪裡。'
    case 'clock':
      return '看家裡的時鐘，請她說現在是幾點；約好「7 點半洗澡」，時間到了請她自己看時鐘提醒你。'
    case 'barBuild':
      return '一起記錄一週每天喝幾杯水，用方格紙畫成長條圖，再問她：哪一天最多？比最少的多幾杯？'
    case 'triangle':
      return '剪一個紙三角形，把三個角撕下來拼在一起，看看會不會剛好拼成一直線（180 度）。'
    case 'pair':
      return '用捲尺量家裡走廊有幾公尺，再一起想：走幾趟會有 1 公里（1000 公尺）？'
  }
}
