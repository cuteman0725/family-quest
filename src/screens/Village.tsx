import { useState } from 'react'
import { buildingKinds, costText, VILLAGE_TILES } from '../data/village'
import { sfx } from '../lib/sfx'
import { build, canAfford, useSave, type Building, type Profile } from '../lib/store'

export function VillageGrid({
  buildings,
  profiles,
  small,
  onTile,
}: {
  buildings: Building[]
  profiles: Profile[]
  small?: boolean
  onTile?: (tile: number) => void
}) {
  return (
    <div className={`village-grid ${small ? 'small' : ''}`}>
      {Array.from({ length: VILLAGE_TILES }, (_, tile) => {
        const b = buildings.find((x) => x.tile === tile)
        const kind = b && buildingKinds.find((k) => k.id === b.kind)
        const by = b && profiles.find((p) => p.id === b.by)
        return (
          <button key={tile} className={`tile ${b ? 'built' : ''}`} disabled={!onTile || !!b} onClick={() => onTile?.(tile)}>
            {kind ? (
              <>
                <span className="b-emoji">{kind.emoji}</span>
                {!small && by && <span className="b-by">{by.avatar}</span>}
              </>
            ) : (
              !small && onTile && <span className="plus">＋</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

interface Props {
  profileId: string
  onBack: () => void
}

/** 共同冒險：兩個孩子的建材放在一起，誰都可以蓋；每棟建築記下是誰蓋的 */
export function Village({ profileId, onBack }: Props) {
  const save = useSave()
  const [tile, setTile] = useState<number | null>(null)
  const me = save.profiles.find((p) => p.id === profileId)!

  return (
    <div className="screen village">
      <header className="top-bar">
        <button className="icon-btn" aria-label="返回" onClick={onBack}>
          ←
        </button>
        <div className="who">🏡 我們的村莊</div>
        <div className="res">
          🪵{save.wood} 🪨{save.stone} ⭐{save.star}
        </div>
      </header>
      <p className="subtitle">點空地蓋新建築。{save.profiles.map((p) => `${p.avatar} ${p.name}`).join('、')} 一起蓋！</p>

      <VillageGrid buildings={save.buildings} profiles={save.profiles} onTile={setTile} />

      {tile !== null && (
        <div className="sheet build-sheet">
          <p className="sheet-title">要蓋什麼呢？</p>
          <div className="build-list">
            {buildingKinds.map((k) => {
              const ok = canAfford(k.cost, save)
              return (
                <button
                  key={k.id}
                  className="build-item"
                  disabled={!ok}
                  onClick={() => {
                    if (build(me.id, tile, k.id)) {
                      sfx.build()
                      setTile(null)
                    }
                  }}
                >
                  <span className="b-emoji">{k.emoji}</span>
                  <span>{k.name}</span>
                  <span className="cost">{costText(k.cost)}</span>
                </button>
              )
            })}
          </div>
          <button className="big-btn" onClick={() => setTile(null)}>
            先不要
          </button>
        </div>
      )}
    </div>
  )
}
