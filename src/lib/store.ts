import { useSyncExternalStore } from 'react'
import type { Grade } from '../data/types'
import { buildingKinds, type Cost } from '../data/village'

// 所有資料都存在這台平板的 localStorage（第一版不做跨裝置同步）

export interface Profile {
  id: string
  name: string
  grade: Grade
  avatar: string
}

export interface Attempt {
  unitId: string
  taskId: string
  mode: 'task' | 'boss' | 'review'
  at: number
  total: number
  /** 第一次就答對的題數（個人進度，獨立保留） */
  firstTry: number
  /** 第一次答錯的題目 id */
  wrongIds: string[]
  /** 這次做了哪些題目（記憶卡複習每次不同；舊存檔沒有，從任務定義推回來） */
  questionIds?: string[]
}

export interface Building {
  tile: number
  kind: string
  by: string
  at: number
}

/** 記憶卡：答錯的題目，依萊特納盒子排下次複習的時間 */
export interface Card {
  /** 0～3 是複習中的盒子；等於 CARD_INTERVALS.length 代表已經記住 */
  box: number
  /** 下次到期的時間（毫秒） */
  due: number
}

export interface SaveData {
  version: 1
  profiles: Profile[]
  attempts: Record<string, Attempt[]>
  wood: number
  stone: number
  star: number
  buildings: Building[]
  /** 每個孩子的記憶卡，key 是題目 id（舊存檔沒有這個欄位） */
  cards?: Record<string, Record<string, Card>>
}

const KEY = 'family-quest-v1'

const initial = (): SaveData => ({
  version: 1,
  profiles: [
    { id: 'p4', name: '瑄', grade: 4, avatar: '🦊' },
    { id: 'p1', name: '妹妹', grade: 1, avatar: '🐰' },
  ],
  attempts: {},
  wood: 0,
  stone: 0,
  star: 0,
  buildings: [],
})

function load(): SaveData {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData
      if (parsed.version === 1) return parsed
    }
  } catch {
    // 私密瀏覽或儲存被封鎖：用全新的資料
  }
  return initial()
}

let state: SaveData = load()
const listeners = new Set<() => void>()

function commit(next: SaveData) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // 存不進去也讓遊戲繼續
  }
  listeners.forEach((l) => l())
}

export function useSave(): SaveData {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state,
  )
}

export const getSave = () => state

export function recordAttempt(profileId: string, attempt: Attempt, reward: Required<Cost>) {
  const list = state.attempts[profileId] ?? []
  commit({
    ...state,
    attempts: { ...state.attempts, [profileId]: [...list, attempt] },
    wood: state.wood + reward.wood,
    stone: state.stone + reward.stone,
    star: state.star + reward.star,
  })
}

/** 每個盒子到下次複習相隔幾天：答錯隔天，之後 3、7、14 天 */
export const CARD_INTERVALS = [1, 3, 7, 14]
const DAY = 24 * 60 * 60 * 1000

/** 今天 0 點加上 days 天（用平板的本地時間） */
function dayFromToday(days: number, now = Date.now()) {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime() + days * DAY
}

export const cardsOf = (profileId: string, s: SaveData = state) => s.cards?.[profileId] ?? {}

export function dueCardIds(profileId: string, s: SaveData = state, now = Date.now()) {
  return Object.entries(cardsOf(profileId, s))
    .filter(([, c]) => c.box < CARD_INTERVALS.length && c.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id)
}

/**
 * 更新記憶卡。results 裡每題的 correct 是「第一次就答對」。
 * 新答錯的題目建卡（隔天複習）；複習時答對升一盒，答錯回到第一盒。
 */
export function updateCards(profileId: string, results: { id: string; correct: boolean }[]) {
  const mine = { ...cardsOf(profileId) }
  for (const { id, correct } of results) {
    const card = mine[id]
    if (!correct) mine[id] = { box: 0, due: dayFromToday(CARD_INTERVALS[0]) }
    else if (card && card.box < CARD_INTERVALS.length && card.due <= Date.now()) {
      // 只有到期的卡答對才升盒，同一天重玩任務不會一直往上跳
      const box = card.box + 1
      mine[id] = { box, due: box < CARD_INTERVALS.length ? dayFromToday(CARD_INTERVALS[box]) : 0 }
    }
  }
  commit({ ...state, cards: { ...state.cards, [profileId]: mine } })
}

export function canAfford(c: Cost, s: SaveData = state) {
  return (c.wood ?? 0) <= s.wood && (c.stone ?? 0) <= s.stone && (c.star ?? 0) <= s.star
}

export function build(profileId: string, tile: number, kindId: string) {
  const kind = buildingKinds.find((k) => k.id === kindId)
  if (!kind || !canAfford(kind.cost) || state.buildings.some((b) => b.tile === tile)) return false
  commit({
    ...state,
    wood: state.wood - (kind.cost.wood ?? 0),
    stone: state.stone - (kind.cost.stone ?? 0),
    star: state.star - (kind.cost.star ?? 0),
    buildings: [...state.buildings, { tile, kind: kindId, by: profileId, at: Date.now() }],
  })
  return true
}

export function renameProfile(profileId: string, name: string) {
  commit({
    ...state,
    profiles: state.profiles.map((p) => (p.id === profileId ? { ...p, name } : p)),
  })
}

export function resetAll() {
  commit(initial())
}
