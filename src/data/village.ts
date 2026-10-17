// 共同冒險：兩個孩子一起蓋的村莊

export interface Cost {
  wood?: number
  stone?: number
  star?: number
}

export interface BuildingKind {
  id: string
  name: string
  emoji: string
  cost: Cost
}

export const buildingKinds: BuildingKind[] = [
  { id: 'tree', name: '大樹', emoji: '🌳', cost: { wood: 2 } },
  { id: 'flowers', name: '花圃', emoji: '🌷', cost: { wood: 1, stone: 1 } },
  { id: 'tent', name: '帳篷', emoji: '⛺', cost: { wood: 3 } },
  { id: 'farm', name: '麥田', emoji: '🌾', cost: { wood: 4, stone: 1 } },
  { id: 'house', name: '小木屋', emoji: '🏠', cost: { wood: 5, stone: 2 } },
  { id: 'fountain', name: '噴水池', emoji: '⛲', cost: { stone: 5 } },
  { id: 'bakery', name: '麵包店', emoji: '🥐', cost: { wood: 6, stone: 4 } },
  { id: 'school', name: '學校', emoji: '🏫', cost: { wood: 8, stone: 6 } },
  { id: 'tower', name: '瞭望塔', emoji: '🗼', cost: { stone: 8, star: 1 } },
  { id: 'castle', name: '城堡', emoji: '🏰', cost: { wood: 10, stone: 10, star: 2 } },
]

export const VILLAGE_TILES = 20

/** 完成一個短任務（含訂正）得到的建材，不看分數或年級 */
export const TASK_REWARD: Required<Cost> = { wood: 3, stone: 2, star: 0 }
/** 打倒魔王（交卷並訂正完）得到的獎勵 */
export const BOSS_REWARD: Required<Cost> = { wood: 5, stone: 5, star: 1 }

export const costText = (c: Cost) =>
  [c.wood && `🪵${c.wood}`, c.stone && `🪨${c.stone}`, c.star && `⭐${c.star}`].filter(Boolean).join(' ')
