import { useMemo, useState } from 'react'
import type { DivideQ } from '../data/types'
import { fillHint, longDivisionSteps, type LDStep } from '../lib/longDivision'
import { sfx } from '../lib/sfx'
import { LDBoardView, type LDSlot } from './LongDivision'
import type { GameProps } from './types'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✔']
/** 同一格錯幾次就先幫他寫上（不要卡在一格太久） */
const MAX_TRIES = 2

/** 這一步要填的格子放在直式的哪裡：乘積和相減的格子跟被減的數一樣寬，不洩漏答案有幾位 */
function slotOf(step: LDStep, text: string): LDSlot {
  const f = step.fill!
  if (f.kind === 'quotient') return { q: step.mark.q!, text }
  const row = step.mark.row!
  const endCol = step.board.rows[row].endCol
  const from = f.kind === 'bringDown' ? endCol : Math.max(0, endCol - String(f.cur).length + 1)
  return { row, from, to: endCol, text }
}

/**
 * 跟著寫直式：照課本的順序一格一格填（估商 → 乘回去 → 相減 → 移下來），
 * 填錯當格告訴他錯在哪裡；同一格錯兩次就先幫他寫上，最後再整題重來。
 */
export function DivideWrite({ q, onAnswer, locked }: GameProps<DivideQ>) {
  const steps = useMemo(() => longDivisionSteps(q.dividend, q.divisor), [q.dividend, q.divisor])
  const [k, setK] = useState(1)
  const [input, setInput] = useState('')
  const [tries, setTries] = useState(0)
  const [msg, setMsg] = useState<{ text: string; kind: 'hint' | 'auto' | 'good' } | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [helped, setHelped] = useState(0)
  const [shake, setShake] = useState(0)

  const done = k === steps.length - 1
  const step = steps[k]
  const f = step.fill

  const advance = () => {
    setK(k + 1)
    setInput('')
    setTries(0)
  }

  const press = (key: string) => {
    if (locked || done || !f) return
    if (key === '⌫') {
      sfx.tap()
      setInput((v) => v.slice(0, -1))
      return
    }
    if (key !== '✔') {
      sfx.tap()
      setInput((v) => (v.length < 6 ? v + key : v))
      return
    }
    if (!input) return
    if (Number(input) === Number(f.answer)) {
      sfx.correct()
      setMsg(tries > 0 ? { text: '改對了！', kind: 'good' } : null)
      advance()
      return
    }
    sfx.wrong()
    setMistakes((m) => m + 1)
    setShake((s) => s + 1)
    if (tries + 1 >= MAX_TRIES) {
      setHelped((h) => h + 1)
      setMsg({ text: `${fillHint(f, input)} 這一格是 ${f.answer}，先幫你寫上，看清楚再往下做。`, kind: 'auto' })
      advance()
    } else {
      setTries(tries + 1)
      setInput('')
      setMsg({ text: fillHint(f, input), kind: 'hint' })
    }
  }

  const finish = () => {
    if (locked) return
    if (helped > 0) onAnswer(false)
    else onAnswer(mistakes === 0, { selfCorrected: mistakes > 0 })
  }

  const shown = done ? step : steps[k - 1]

  return (
    <div className="ldw">
      <div className="paper-badge">✏️ 跟著寫直式：一格一格填，填錯會告訴你哪裡要改</div>
      <div className="ldw-main">
        <div className={`ldw-board ${shake ? 'shake' : ''}`} key={shake}>
          <LDBoardView
            dividend={q.dividend}
            divisor={q.divisor}
            board={shown.board}
            mark={done ? { row: step.mark.row } : step.mark}
            slot={done ? undefined : slotOf(step, input)}
          />
        </div>
        <div className="ldw-side">
          {done ? (
            <>
              <p className="ldw-ask">🎉 {step.say}</p>
              <button className="big-btn primary" disabled={locked} onClick={finish}>
                完成 ✔
              </button>
            </>
          ) : (
            <>
              <p className="ldw-ask">{f!.ask}</p>
              {msg && <p className={`ldw-msg ${msg.kind}`}>{msg.text}</p>}
              <div className="keypad">
                {KEYS.map((key) => (
                  <button
                    key={key}
                    className={`key ${key === '✔' ? 'enter' : ''}`}
                    disabled={locked || (key === '✔' && !input)}
                    onClick={() => press(key)}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
