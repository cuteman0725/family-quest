import { useState } from 'react'
import { units, unitsForGrade } from '../data/units'
import { taskStatuses } from '../lib/recommend'
import { renameProfile, resetAll, useSave } from '../lib/store'

/** 家長頁：看每個孩子的個人進度（首次正確率、常錯的題目），改名字 */
export function Parent({ onBack }: { onBack: () => void }) {
  const save = useSave()
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  const allQuestions = new Map(units.flatMap((u) => [...u.tasks, u.boss]).flatMap((t) => t.questions).map((q) => [q.id, q]))

  return (
    <div className="screen parent">
      <header className="top-bar">
        <button className="icon-btn" aria-label="返回" onClick={onBack}>
          ←
        </button>
        <div className="who">👪 家長</div>
        <div />
      </header>

      {save.profiles.map((p) => {
        const attempts = save.attempts[p.id] ?? []
        const statuses = taskStatuses(unitsForGrade(p.grade), attempts)
        const missCount = new Map<string, number>()
        attempts.forEach((a) => a.wrongIds.forEach((id) => missCount.set(id, (missCount.get(id) ?? 0) + 1)))
        const topMiss = [...missCount].sort((a, b) => b[1] - a[1]).slice(0, 5)
        const bosses = attempts.filter((a) => a.mode === 'boss')

        return (
          <section key={p.id} className="parent-card">
            <h2>
              {p.avatar}{' '}
              {editing === p.id ? (
                <>
                  <input value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={8} />
                  <button
                    className="small-btn"
                    onClick={() => {
                      if (draft.trim()) renameProfile(p.id, draft.trim())
                      setEditing(null)
                    }}
                  >
                    儲存
                  </button>
                </>
              ) : (
                <>
                  {p.name}（{p.grade} 年級）
                  <button
                    className="small-btn"
                    onClick={() => {
                      setDraft(p.name)
                      setEditing(p.id)
                    }}
                  >
                    改名字
                  </button>
                </>
              )}
            </h2>
            <table>
              <thead>
                <tr>
                  <th>任務</th>
                  <th>完成次數</th>
                  <th>上次首次正確率</th>
                </tr>
              </thead>
              <tbody>
                {statuses.map((s) => (
                  <tr key={s.task.id}>
                    <td>
                      {s.task.icon} {s.task.title}
                    </td>
                    <td>{s.doneCount}</td>
                    <td>{s.lastRate === undefined ? '—' : `${Math.round(s.lastRate * 100)}%`}</td>
                  </tr>
                ))}
                {bosses.map((b) => (
                  <tr key={b.at}>
                    <td>🐉 魔王關（{new Date(b.at).toLocaleDateString('zh-TW')}）</td>
                    <td>—</td>
                    <td>
                      {b.firstTry}/{b.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topMiss.length > 0 && (
              <>
                <h3>常錯的題目</h3>
                <ul className="miss-list">
                  {topMiss.map(([id, n]) => (
                    <li key={id}>
                      錯 {n} 次：{allQuestions.get(id)?.prompt ?? id}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )
      })}

      {confirmReset ? (
        <div className="parent-card">
          <p>確定要清除這台平板上所有的進度和村莊嗎？清除後無法復原。</p>
          <div className="row-buttons">
            <button className="big-btn" onClick={() => setConfirmReset(false)}>
              取消
            </button>
            <button
              className="big-btn danger"
              onClick={() => {
                resetAll()
                setConfirmReset(false)
              }}
            >
              確定清除
            </button>
          </div>
        </div>
      ) : (
        <button className="link-btn danger" onClick={() => setConfirmReset(true)}>
          清除所有資料
        </button>
      )}
    </div>
  )
}
