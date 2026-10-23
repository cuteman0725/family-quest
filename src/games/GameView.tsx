import type { Question } from '../data/types'
import { Board } from './Board'
import { Bond } from './Bond'
import { Divide } from './Divide'
import { DivideWrite } from './DivideWrite'
import { Angle } from './Angle'
import { Length } from './Length'
import { Order } from './Order'
import { Pair } from './Pair'
import { Sequence } from './Sequence'
import { Triangle } from './Triangle'
import { Sort } from './Sort'
import { Equation } from './Equation'
import { Clock } from './Clock'
import { BarBuild } from './Chart'
import { Bins } from './Bins'
import { Typo } from './Typo'
import { FracLine, FractionInput } from './Fraction'
import { Choice, Compare, Same, TrueFalse } from './Buttons'
import { Digits, NumberInput } from './Keypad'
import { Match } from './Match'
import { Count, FillTo, PickN } from './Picture'
import type { GameProps } from './types'

/** 依題型挑對應的小遊戲 */
export function GameView({ q, ...rest }: GameProps<Question>) {
  switch (q.type) {
    case 'trueFalse':
      return <TrueFalse q={q} {...rest} />
    case 'choice':
      return <Choice q={q} {...rest} />
    case 'compare':
      return <Compare q={q} {...rest} />
    case 'number':
      return <NumberInput q={q} {...rest} />
    case 'digits':
      return <Digits q={q} {...rest} />
    case 'match':
      return <Match q={q} {...rest} />
    case 'count':
      return <Count q={q} {...rest} />
    case 'pickN':
      return <PickN q={q} {...rest} />
    case 'fillTo':
      return <FillTo q={q} {...rest} />
    case 'same':
      return <Same q={q} {...rest} />
    case 'board':
      return <Board q={q} {...rest} />
    case 'divide':
      return q.write ? <DivideWrite q={q} {...rest} /> : <Divide q={q} {...rest} />
    case 'bond':
      return <Bond q={q} {...rest} />
    case 'pair':
      return <Pair q={q} {...rest} />
    case 'multiply':
      // 直式乘法：在紙上算，用數字鍵盤填積
      return (
        <NumberInput
          q={{ id: q.id, type: 'number', prompt: q.prompt, hint: q.hint, answers: [String(q.a * q.b)], paper: true }}
          {...rest}
        />
      )
    case 'angle':
      return <Angle q={q} {...rest} />
    case 'length':
      return <Length q={q} {...rest} />
    case 'order':
      return <Order q={q} {...rest} />
    case 'sequence':
      return <Sequence q={q} {...rest} />
    case 'triangle':
      return <Triangle q={q} {...rest} />
    case 'sort':
      return <Sort q={q} {...rest} />
    case 'equation':
      return <Equation q={q} {...rest} />
    case 'fraction':
      return <FractionInput q={q} {...rest} />
    case 'fracLine':
      return <FracLine q={q} {...rest} />
    case 'clock':
      return <Clock q={q} {...rest} />
    case 'barBuild':
      return <BarBuild q={q} {...rest} />
    case 'bins':
      return <Bins q={q} {...rest} />
    case 'typo':
      return <Typo q={q} {...rest} />
  }
}
