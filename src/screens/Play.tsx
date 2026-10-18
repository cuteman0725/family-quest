import { useEffect, useState } from 'react'
import type { Grade, Question, Task } from '../data/types'
import { GameView } from '../games/GameView'
import { answerText } from '../lib/answer'
import { sfx } from '../lib/sfx'
import { speak, stopSpeaking } from '../lib/speech'

export interface PlayResult {
  total: number
  firstTry: number
  wrongIds: string[]
}

type Feedback =
  | { kind: 'none' }
  | { kind: 'correct' }
  | { kind: 'hint' }
  | { kind: 'reveal' }

interface Props {
  task: Task
  mode: 'task' | 'boss'
  grade: Grade
  onExit: () => void
  onFinish: (r: PlayResult) => void
}

/**
 * 短任務：答錯 → 提示 → 再試一次（引導重試）；再錯就看答案和說明。全部做完才算完整訂正。
 * 魔王關：作答中不給回饋，交卷後看錯題，再用引導重試訂正（交卷檢討）。
 */
export function Play({ task, mode, grade, onExit, onFinish }: Props) {
  const [stage, setStage] = useState<'exam' | 'review' | 'fix'>(mode === 'boss' ? 'exam' : 'fix')
  const [examWrong, setExamWrong] = useState<Question[]>([])

  if (stage === 'exam') {
    return (
      <Runner
        key="exam"
        title={task.title}
        questions={task.questions}
        guided={false}
        grade={grade}
        onExit={onExit}
        onDone={(wrong) => {
          setExamWrong(task.questions.filter((q) => wrong.includes(q.id)))
          setStage('review')
        }}
      />
    )
  }

  if (stage === 'review') {
    const total = task.questions.length
    const right = total - examWrong.length
    const finish = () => onFinish({ total, firstTry: right, wrongIds: examWrong.map((q) => q.id) })
    return (
      <div className="screen review">
        <h1>交卷囉！</h1>
        <div className="big-score">
          {right} / {total}
        </div>
        <ul className="review-list">
          {task.questions.map((q, i) => {
            const wrong = examWrong.includes(q)
            return (
              <li key={q.id} className={wrong ? 'wrong' : 'right'}>
                <span className="mark">{wrong ? '✘' : '✔'}</span>
                <span className="num">{i + 1}.</span>
                <span className="text">{q.prompt}</span>
              </li>
            )
          })}
        </ul>
        {examWrong.length > 0 ? (
          <button className="big-btn primary" onClick={() => setStage('fix')}>
            開始訂正 {examWrong.length} 題 ✏️
          </button>
        ) : (
          <button className="big-btn primary" onClick={finish}>
            全對！領獎勵 🎉
          </button>
        )}
      </div>
    )
  }

  // fix：短任務本身，或魔王關的錯題訂正
  const isBossFix = mode === 'boss'
  return (
    <Runner
      key="fix"
      title={isBossFix ? `${task.title}・訂正` : task.title}
      questions={isBossFix ? examWrong : task.questions}
      guided
      grade={grade}
      onExit={onExit}
      onDone={(wrong) => {
        if (isBossFix) {
          const total = task.questions.length
          onFinish({ total, firstTry: total - examWrong.length, wrongIds: examWrong.map((q) => q.id) })
        } else {
          onFinish({ total: task.questions.length, firstTry: task.questions.length - wrong.length, wrongIds: wrong })
        }
      }}
    />
  )
}

interface RunnerProps {
  title: string
  questions: Question[]
  /** true：引導重試；false：考試模式，不給回饋 */
  guided: boolean
  grade: Grade
  onExit: () => void
  /** 回傳第一次就答錯的題目 id */
  onDone: (wrongIds: string[]) => void
}

function Runner({ title, questions, guided, grade, onExit, onDone }: RunnerProps) {
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

    if (!guided) {
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
    if (tries === 1) {
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
        {q.context && <pre className="context">{q.context}</pre>}
        <div className="prompt-row">
          <p className="prompt">{q.prompt}</p>
          <button className="icon-btn speak" aria-label="唸題目" onClick={() => speak(fullPrompt)}>
            🔊
          </button>
        </div>
      </section>

      <section className="game">
        <GameView key={`${q.id}-${tries}`} q={q} onAnswer={onAnswer} locked={feedback.kind !== 'none'} />
      </section>

      {feedback.kind === 'correct' && <div className="toast good">✨ 答對了！</div>}

      {feedback.kind === 'hint' && (
        <div className="sheet">
          <p className="sheet-title">😮 差一點點！</p>
          <p>💡 {q.hint}</p>
          <button className="big-btn primary" onClick={retry}>
            再試一次
          </button>
        </div>
      )}

      {feedback.kind === 'reveal' && (
        <div className="sheet">
          <p className="sheet-title">一起來看答案</p>
          <pre className="answer">{answerText(q)}</pre>
          {q.explain && <p>{q.explain}</p>}
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
