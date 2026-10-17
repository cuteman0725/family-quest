import { useSave } from '../lib/store'
import { VillageGrid } from './Village'

interface Props {
  onPick: (profileId: string) => void
  onParent: () => void
}

export function Profiles({ onPick, onParent }: Props) {
  const save = useSave()
  return (
    <div className="screen profiles">
      <h1 className="app-title">🏡 家庭闖關村</h1>
      <p className="subtitle">今天誰要來冒險？</p>
      <div className="profile-cards">
        {save.profiles.map((p) => (
          <button key={p.id} className="profile-card" onClick={() => onPick(p.id)}>
            <span className="avatar">{p.avatar}</span>
            <span className="name">{p.name}</span>
            <span className="grade">{p.grade} 年級</span>
          </button>
        ))}
      </div>
      <div className="village-preview">
        <VillageGrid buildings={save.buildings} profiles={save.profiles} small />
        <p>我們的村莊已經有 {save.buildings.length} 棟建築</p>
      </div>
      <button className="link-btn" onClick={onParent}>
        👪 家長
      </button>
    </div>
  )
}
