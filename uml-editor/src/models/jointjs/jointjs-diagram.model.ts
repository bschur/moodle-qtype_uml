import { dia } from '@joint/core'

export interface JointJSDiagram {
  readonly cells: dia.Cell[]
}

export const EMPTY_DIAGRAM = JSON.stringify({ cells: [] } satisfies JointJSDiagram)
