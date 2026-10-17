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
  mode: 'task' | 'boss'
  at: number
  total: number
  /** 第一次就答對的題數（個人進度，獨立保留） */
  firstTry: number
  /** 第一次答錯的題目 id */
  wrongIds: string[]
}

export interface Building {
  tile: number
  kind: string
  by: string
  at: number
}

export interface SaveData {
  version: 1
  profiles: Profile[]
  attempts: Record<string, Attempt[]>
  wood: number
  stone: number
  star: number
  buildings: Building[]
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
