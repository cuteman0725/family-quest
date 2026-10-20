import { useState } from 'react'
import { activityFor, PARENT_PRAISE } from '../data/coaching'
import type { Subject } from '../data/types'
import { defaultCurrentUnit, SUBJECTS, unitLabel, unitsFor, unitsForGrade } from '../data/units'
import { questionStates, skillMap } from '../lib/mastery'
import { currentUnitOf, taskStatuses } from '../lib/recommend'
import { findQuestion } from '../lib/review'
import { CARD_INTERVALS, cardsOf, currentUnitIdOf, dueCardIds, renameProfile, resetAll, setCurrentUnit, useSave } from '../lib/store'
import { SkillMap } from './SkillMap'
import { Rich } from '../games/Rich'

/**
 * 家長頁：一次只看一個孩子（不把姊妹的分數並排，避免比較）。
 * 先看「記得住」和技能地圖，再看卡關點與可以一起做的小活動；練習當下的正確率放最後並附說明。
 */
export function Parent({ onBack }: { onBack: () => void }) {
  const save = useSave()
  const [pid, setPid] = useState(save.profiles[0]?.id)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const [subject, setSubject] = useState<Subject>('數學')
  // 每天換一句，打開頁面時決定，重繪時不跟著變
  const [praiseIndex] = useState(() => new Date().getDate() % PARENT_PRAISE.length)

  const p = save.profiles.find((x) => x.id === pid) ?? save.profiles[0]
  const attempts = save.attempts[p.id] ?? []
  // 記憶卡和「記得住」看全部科目；技能地圖、單元選擇、任務紀錄看選到的科目
  const units = unitsFor(p.grade, subject)
  const current = currentUnitOf(units, currentUnitIdOf(p, subject), defaultCurrentUnit(p.grade, subject))
  const cards = cardsOf(p.id, save)
  const states = questionStates(unitsForGrade(p.grade), attempts, cards)
  const strong = [...states.values()].filter((s) => s === 'strong').length
  const cardList = Object.values(cards)
  const learning = cardList.filter((c) => c.box < CARD_INTERVALS.length).length
  const learned = cardList.length - learning
  const dueNow = dueCardIds(p.id, save).length

  // 卡關點：還在複習中的記憶卡，依答錯次數排序
  const missCount = new Map<string, number>()
  attempts.forEach((a) => a.wrongIds.forEach((id) => missCount.set(id, (missCount.get(id) ?? 0) + 1)))
  const stuck = Object.entries(cards)
    .filter(([, c]) => c.box < CARD_INTERVALS.length)
    .map(([id]) => ({ id, q: findQuestion(id), misses: missCount.get(id) ?? 1 }))
    .filter((x) => x.q)
    .sort((a, b) => b.misses - a.misses)
    .slice(0, 3)

  const praise = PARENT_PRAISE[praiseIndex]
  const statuses = taskStatuses(units, attempts)
  const bosses = attempts.filter((a) => a.mode === 'boss' && units.some((u) => u.id === a.unitId))

  return (
    <div className="screen parent">
      <header className="top-bar">
        <button className="icon-btn" aria-label="返回" onClick={onBack}>
          ←
        </button>
        <div className="who">👪 家長</div>
      </header>

      <div className="kid-tabs" role="tablist">
        {save.profiles.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === p.id}
            className={`kid-tab ${x.id === p.id ? 'active' : ''}`}
            onClick={() => {
              setPid(x.id)
              setEditing(false)
            }}
          >
            {x.avatar} {x.name}
          </button>
        ))}
      </div>

      <section className="parent-card">
        <h2>
          {p.avatar}{' '}
          {editing ? (
            <>
              <input id="rename" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={8} />
              <button
                className="small-btn"
                onClick={() => {
                  if (draft.trim()) renameProfile(p.id, draft.trim())
                  setEditing(false)
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
                  setEditing(true)
                }}
              >
                改名字
              </button>
            </>
          )}
        </h2>
        <div className="subject-tabs" role="tablist">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === subject}
              className={`subject-tab ${s.id === subject ? 'active' : ''}`}
              onClick={() => setSubject(s.id)}
            >
              {s.icon} {s.id}
            </button>
          ))}
        </div>
        <div className="unit-picker">
          <span>學校目前上到：</span>
          {units.map((u) => (
            <button
              key={u.id}
              className={`small-btn ${u.id === current?.id ? 'active' : ''}`}
              aria-pressed={u.id === current?.id}
              onClick={() => setCurrentUnit(p.id, u.id, subject)}
            >
              {unitLabel(u)} {u.title}
            </button>
          ))}
        </div>
        <p className="note">任務推薦會先排這個單元，練熟之後再穿插前面單元的複習。</p>
        <div className="memory-stats">
          <div>
            <strong>{strong}</strong>
            <span>題記得住</span>
          </div>
          <div>
            <strong>{learning}</strong>
            <span>張記憶卡複習中（今天到期 {dueNow}）</span>
          </div>
          <div>
            <strong>{learned}</strong>
            <span>張記憶卡已記住</span>
          </div>
        </div>
      </section>

      {units.map((u) => (
        <SkillMap key={u.id} title={`技能地圖：${u.title}`} nodes={skillMap(u, states)} autoRead={false} />
      ))}

      <section className="parent-card">
        <h3>🧩 卡關點與兩分鐘小活動</h3>
        {stuck.length === 0 ? (
          <p>目前沒有卡住的題目。</p>
        ) : (
          <ul className="stuck-list">
            {stuck.map(({ id, q, misses }) => (
              <li key={id}>
                <p className="stuck-q">
                  錯 {misses} 次：<Rich text={q!.prompt} />
                </p>
                <p className="stuck-act">👉 {activityFor(q!)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="parent-card praise-card">
        <h3>💬 今天可以對 {p.name} 說的一句話</h3>
        <p>「{praise}」</p>
        <p className="note">稱讚方法和努力，不說「你好聰明」。</p>
      </section>

      <section className="parent-card">
        <h3>任務紀錄</h3>
        <p className="note">
          「第一次就答對」是練習當下的表現。混題和複習本來就會比較難，這個數字低一點是正常的；看上面的「記得住」比較準。
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>技能</th>
                <th>完成次數</th>
                <th>上次第一次就答對</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((s) => (
                <tr key={s.task.id}>
                  <td>
                    {s.task.icon} {s.task.skill}
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
        </div>
      </section>

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
