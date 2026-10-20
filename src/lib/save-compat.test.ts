import { afterEach, describe, expect, it, vi } from 'vitest'
import { TASK_REWARD } from '../data/village'

// 孩子的進度存在平板本機。改存檔格式之後，舊平板上的存檔一定要還能讀，不能讓進度消失。
// 每次改 SaveData 的形狀，就在這裡加一份改版前的存檔快照。

const KEY = 'family-quest-v1'

/** 2026/10/17 MVP 版的存檔：還沒有 cards 欄位，mode 只有 task／boss */
const saveBeforeCards = {
  version: 1,
  profiles: [
    { id: 'p4', name: '瑄', grade: 4, avatar: '🦊' },
    { id: 'p1', name: '妹妹', grade: 1, avatar: '🐰' },
  ],
  attempts: {
    p4: [
      { unitId: 'g4u1', taskId: 'g4u1-t1', mode: 'task', at: 1792204836037, total: 8, firstTry: 7, wrongIds: ['g4u1-paper-tf1'] },
      { unitId: 'g4u1', taskId: 'g4u1-boss', mode: 'boss', at: 1792204973774, total: 26, firstTry: 6, wrongIds: ['g4u1-paper-tf3'] },
    ],
  },
  wood: 11,
  stone: 11,
  star: 1,
  buildings: [{ tile: 7, kind: 'tent', by: 'p4', at: 1792204850000 }],
}

/** 用指定的 localStorage 內容重新載入 store（store 在 import 時讀存檔） */
async function loadStoreWith(raw: string | null) {
  const data = new Map<string, string>()
  if (raw !== null) data.set(KEY, raw)
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  })
  vi.resetModules()
  const store = await import('./store')
  return { store, written: () => JSON.parse(data.get(KEY) ?? 'null') }
}

afterEach(() => vi.unstubAllGlobals())

describe('舊存檔相容', () => {
  it('MVP 版存檔（沒有 cards）讀得進來，進度和村莊都還在', async () => {
    const { store } = await loadStoreWith(JSON.stringify(saveBeforeCards))
    const s = store.getSave()
    expect(s.profiles.map((p) => p.name)).toEqual(['瑄', '妹妹'])
    expect(s.attempts.p4).toHaveLength(2)
    expect(s.buildings).toHaveLength(1)
    expect([s.wood, s.stone, s.star]).toEqual([11, 11, 1])
    expect(store.dueCardIds('p4')).toEqual([])
    expect(store.cardsOf('p4')).toEqual({})
  })

  it('舊存檔可以繼續玩：建記憶卡、記錄任務、蓋房子，原本的資料不會被洗掉', async () => {
    const { store, written } = await loadStoreWith(JSON.stringify(saveBeforeCards))
    store.updateCards('p4', [{ id: 'g4u1-paper-tf1', correct: false }])
    store.recordAttempt('p4', { unitId: 'g4u1', taskId: 'g4u1-t2', mode: 'review', at: 1, total: 6, firstTry: 6, wrongIds: [] }, TASK_REWARD)
    expect(store.build('p4', 8, 'tree')).toBe(true)

    const saved = written()
    expect(saved.attempts.p4).toHaveLength(3)
    expect(saved.buildings).toHaveLength(2)
    expect(saved.cards.p4['g4u1-paper-tf1'].box).toBe(0)
    expect(saved.wood).toBe(11 + TASK_REWARD.wood - 2)
    expect(saved.star).toBe(1)
  })

  it('存檔壞掉或是未知的版本：用全新的存檔開始，不會當掉', async () => {
    for (const raw of ['{not json', JSON.stringify({ ...saveBeforeCards, version: 99 }), null]) {
      const { store } = await loadStoreWith(raw)
      expect(store.getSave().attempts).toEqual({})
      expect(store.getSave().profiles).toHaveLength(2)
    }
  })
})

describe('每一科的「學校目前上到」', () => {
  it('舊存檔只有數學的 currentUnit：數學照舊，國語是還沒設定', async () => {
    const { currentUnitIdOf } = await import('./store')
    const old = { id: 'p4', name: '瑄', grade: 4 as const, avatar: '🦊', currentUnit: 'g4u5' }
    expect(currentUnitIdOf(old, '數學')).toBe('g4u5')
    expect(currentUnitIdOf(old, '國語')).toBeUndefined()
    const both = { ...old, currentUnits: { 國語: 'g4c1' } }
    expect(currentUnitIdOf(both, '數學')).toBe('g4u5')
    expect(currentUnitIdOf(both, '國語')).toBe('g4c1')
  })
})
