import type { SkillNode } from '../lib/mastery'
import { speak } from '../lib/speech'

/**
 * 技能地圖：每個孩子各自一張，只跟自己比。
 * 進度用「記得住」的題數（第一次就對、而且沒有還在複習的記憶卡），全部學會就點亮。
 */
export function SkillMap({ title, nodes, autoRead }: { title: string; nodes: SkillNode[]; autoRead: boolean }) {
  return (
    <section className="skill-map">
      <h3>🗺️ {title}</h3>
      <div className="skill-nodes">
        {nodes.map((n) => {
          const state = n.lit ? 'lit' : n.strong + n.learning > 0 ? 'started' : 'new'
          const label = n.lit ? '學會了' : `${n.strong} / ${n.total}`
          return (
            <button
              key={n.task.id}
              className={`skill-node ${state}`}
              onClick={() =>
                autoRead &&
                speak(n.lit ? `「${n.task.skill}」學會了！` : `「${n.task.skill}」，已經記住 ${n.strong} 題，還有 ${n.total - n.strong} 題。`)
              }
            >
              <span className="sn-icon">{n.lit ? '🌟' : n.task.icon}</span>
              <span className="sn-name">{n.task.skill}</span>
              <span className="sn-bar" aria-hidden>
                <span style={{ width: `${(n.strong / Math.max(1, n.total)) * 100}%` }} />
              </span>
              <span className="sn-label">{label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
