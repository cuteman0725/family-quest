import type { Question } from '../data/types'
import { Board } from './Board'
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
  }
}
