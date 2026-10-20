// 長度字串的換算：「45 公里 67 公尺」「8km」「12 km 30 m」都換成毫米，方便比大小

const UNIT_MM: Record<string, number> = {
  公里: 1_000_000,
  km: 1_000_000,
  公尺: 1000,
  m: 1000,
  公分: 10,
  cm: 10,
  毫米: 1,
  mm: 1,
}

/** 解析長度字串，回傳毫米；不是長度格式就回傳 null */
export function lengthInMm(s: string): number | null {
  const parts = [...s.matchAll(/(\d+)\s*(公里|公尺|公分|毫米|km|cm|mm|m)/g)]
  if (parts.length === 0) return null
  const rest = s.replace(/(\d+)\s*(公里|公尺|公分|毫米|km|cm|mm|m)/g, '').trim()
  if (rest !== '') return null
  return parts.reduce((sum, [, n, unit]) => sum + Number(n) * UNIT_MM[unit], 0)
}

/** 公尺數寫成「a 公里 b 公尺」（b 是 0 就只寫公里） */
export const kmText = (meters: number) => {
  const km = Math.floor(meters / 1000)
  const m = meters % 1000
  return km === 0 ? `${m} 公尺` : m === 0 ? `${km} 公里` : `${km} 公里 ${m} 公尺`
}
