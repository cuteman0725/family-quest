import { useEffect, useState } from 'react'
import type { Grade, Question, Task } from '../data/types'
import { GameView } from '../games/GameView'
import { answerText } from '../lib/answer'
import { sfx } from '../lib/sfx'
import { speak, stopSpeaking } from '../lib/speech'
import { Rich } from '../games/Rich'
import { Chart } from '../games/Chart'

export interface PlayResult {
  total: number
  firstTry: number
  /** 第一次就答錯的題目 id（記憶卡依這個建卡） */
  wrongIds: string[]
  /** 回想時間出了幾題、自己想起幾題（給結果畫面的資訊性回饋） */
  recallTotal: number
  recallCorrect: number
}

export type PlayMode = 'task' | 'boss' | 'review'

type Feedback =
  | { kind: 'none' }
  | { kind: 'correct' }
  | { kind: 'hint' }
  | { kind: 'reveal' }

/**
 * exam：考試模式，不給回饋
 * guided：引導重試，答錯先給提示再試一次
 * recall：回想時間，不給提示，答錯直接看答案
 */
type RunnerStyle = 'exam' | 'guided' | 'recall'

interface Props {
  task: Task
  mode: PlayMode
  grade: Grade
  onExit: () => void
  onFinish: (r: PlayResult) => void
}

/**
 * 短任務、記憶卡複習：引導重試做完一輪 → 回想時間（第一次答錯的題目不看提示再答一次）。
 * 魔王關：作答中不給回饋，交卷後看錯題，再用引導重試訂正（交卷檢討）。
 */
export function Play({ task, mode, grade, onExit, onFinish }: Props) {
  const [stage, setStage] = useState<'exam' | 'examReview' | 'fix' | 'main' | 'recallIntro' | 'recall'>(
    mode === 'boss' ? 'exam' : 'main',
  )
  const [missed, setMissed] = useState<Question[]>([])
  const pick = (ids: string[]) => task.questions.filter((q) => ids.includes(q.id))
  const result = (recallCorrect = 0, recallTotal = 0): PlayResult => ({
    total: task.questions.length,
    firstTry: task.questions.length - missed.length,
    wrongIds: missed.map((q) => q.id),
    recallTotal,
    recallCorrect,
  })

  if (stage === 'exam') {
    return (
      <Runner
        key="exam"
        title={task.title}
        questions={task.questions}
        style="exam"
        grade={grade}
        onExit={onExit}
        onDone={(wrong) => {
          setMissed(pick(wrong))
          setStage('examReview')
        }}
      />
    )
  }

  if (stage === 'examReview') {
    const total = task.questions.length
    return (
      <div className="screen review">
        <h1>交卷囉！</h1>
        <div className="big-score">
          {total - missed.length} / {total}
        </div>
        <ul className="review-list">
          {task.questions.map((q, i) => {
            const wrong = missed.includes(q)
            return (
              <li key={q.id} className={wrong ? 'wrong' : 'right'}>
                <span className="mark">{wrong ? '✘' : '✔'}</span>
                <span className="num">{i + 1}.</span>
                <span className="text"><Rich text={q.prompt} /></span>
              </li>
            )
          })}
        </ul>
        {missed.length > 0 ? (
          <button className="big-btn primary" onClick={() => setStage('fix')}>
            開始訂正 {missed.length} 題 ✏️
          </button>
        ) : (
          <button className="big-btn primary" onClick={() => onFinish(result())}>
            全對！領獎勵 🎉
          </button>
        )}
      </div>
    )
  }

  if (stage === 'fix') {
    return (
      <Runner
        key="fix"
        title={`${task.title}・訂正`}
        questions={missed}
        style="guided"
        grade={grade}
        onExit={onExit}
        onDone={() => onFinish(result())}
      />
    )
  }

  if (stage === 'recallIntro') {
    return <RecallIntro count={missed.length} autoRead={grade === 1} onStart={() => setStage('recall')} />
  }

  if (stage === 'recall') {
    return (
      <Runner
        key="recall"
        title="🧠 回想時間"
        questions={missed}
        style="recall"
        grade={grade}
        onExit={onExit}
        onDone={(wrong) => onFinish(result(missed.length - wrong.length, missed.length))}
      />
    )
  }

  // main：短任務或記憶卡複習的第一輪
  return (
    <Runner
      key="main"
      title={task.title}
      questions={task.questions}
      style="guided"
      grade={grade}
      onExit={onExit}
      onDone={(wrong) => {
        const m = pick(wrong)
        setMissed(m)
        if (m.length > 0) setStage('recallIntro')
        else
          onFinish({ total: task.questions.length, firstTry: task.questions.length, wrongIds: [], recallTotal: 0, recallCorrect: 0 })
      }}
    />
  )
}

function RecallIntro({ count, autoRead, onStart }: { count: number; autoRead: boolean; onStart: () => void }) {
  useEffect(() => {
    if (autoRead) speak(`回想時間！剛剛有 ${count} 題第一次答錯，這次沒有提示，自己想想看。`)
    return () => stopSpeaking()
  }, [count, autoRead])

  return (
    <div className="screen recall-intro">
      <div className="recall-icon">🧠</div>
      <h1>回想時間</h1>
      <p>
        剛剛有 <strong>{count}</strong> 題第一次答錯。
        <br />
        這次沒有提示，自己想想看！
      </p>
      <p className="recall-note">答錯的題目會變成記憶卡，過幾天再出現，幫你記得更牢。</p>
      <button className="big-btn primary" onClick={onStart}>
        開始回想
      </button>
    </div>
  )
}

interface RunnerProps {
  title: string
  questions: Question[]
  style: RunnerStyle
  grade: Grade
  onExit: () => void
  /** 回傳第一次就答錯的題目 id */
  onDone: (wrongIds: string[]) => void
}

function Runner({ title, questions, style, grade, onExit, onDone }: RunnerProps) {
  const [index, setIndex] = useState(0)
  const [tries, setTries] = useState(1)
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'none' })
  const [wrong, setWrong] = useState<string[]>([])
  const [askExit, setAskExit] = useState(false)
  const q = questions[index]
  const autoRead = grade === 1

  const fullPrompt = (q.context ? q.context + '\n' : '') + q.prompt

  useEffect(() => {
    if (autoRead) speak(q.prompt)
    return () => stopSpeaking()
  }, [q, autoRead])

  const next = (wrongNow: string[]) => {
    setFeedback({ kind: 'none' })
    setTries(1)
    if (index + 1 >= questions.length) onDone(wrongNow)
    else setIndex(index + 1)
  }

  const onAnswer = (correct: boolean, opts?: { selfCorrected?: boolean }) => {
    const firstMiss = !correct && tries === 1
    const wrongNow = firstMiss ? [...wrong, q.id] : wrong
    if (firstMiss) setWrong(wrongNow)

    if (style === 'exam') {
      sfx.tap()
      next(wrongNow)
      return
    }
    if (correct || opts?.selfCorrected) {
      sfx.correct()
      setFeedback({ kind: 'correct' })
      setTimeout(() => next(wrongNow), 900)
      return
    }
    sfx.wrong()
    if (style === 'guided' && tries === 1) {
      setFeedback({ kind: 'hint' })
      if (autoRead) speak('再想想看。' + q.hint)
    } else {
      setFeedback({ kind: 'reveal' })
      if (autoRead) speak('答案是' + answerText(q))
    }
  }

  const retry = () => {
    setTries(2)
    setFeedback({ kind: 'none' })
  }

  return (
    <div className="screen play">
      <header className="play-top">
        <button className="icon-btn" aria-label="離開" onClick={() => setAskExit(true)}>
          ✕
        </button>
        <div className="play-title">{title}</div>
        <div className="progress">
          {questions.map((x, i) => (
            <span key={x.id} className={`dot ${i < index ? 'done' : i === index ? 'now' : ''}`} />
          ))}
        </div>
      </header>

      <section className="question">
        {q.context && <pre className="context"><Rich text={q.context} /></pre>}
        {q.chart && <Chart spec={q.chart} />}
        {q.picture && (
          <div className={`q-picture ${q.picture.includes('\n') ? 'multi' : ''}`} aria-hidden>
            {q.picture}
          </div>
        )}
        <div className="prompt-row">
          <p className="prompt"><Rich text={q.prompt} /></p>
          <button className="icon-btn speak" aria-label="唸題目" onClick={() => speak(fullPrompt)}>
            🔊
          </button>
        </div>
      </section>

      <section className="game">
        <GameView key={`${q.id}-${tries}`} q={q} onAnswer={onAnswer} locked={feedback.kind !== 'none'} />
      </section>

      {feedback.kind === 'correct' && (
        <div className="toast good">{style === 'recall' ? '🧠 想起來了！' : '✨ 答對了！'}</div>
      )}

      {feedback.kind === 'hint' && (
        <div className="sheet">
          <p className="sheet-title">😮 差一點點！</p>
          <p>💡 <Rich text={q.hint} /></p>
          <button className="big-btn primary" onClick={retry}>
            再試一次
          </button>
        </div>
      )}

      {feedback.kind === 'reveal' && (
        <div className="sheet">
          <p className="sheet-title">一起來看答案</p>
          <pre className="answer"><Rich text={answerText(q)} /></pre>
          {q.explain && <p><Rich text={q.explain} /></p>}
          <button className="big-btn primary" onClick={() => next(wrong)}>
            知道了 👍
          </button>
        </div>
      )}

      {askExit && (
        <div className="sheet">
          <p className="sheet-title">要先離開嗎？</p>
          <p>這次的進度不會保存喔。</p>
          <div className="row-buttons">
            <button className="big-btn primary" onClick={() => setAskExit(false)}>
              繼續玩
            </button>
            <button className="big-btn" onClick={onExit}>
              離開
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
