import { dia } from '@joint/core'

export interface JointJSDiagram {
  readonly cells: dia.Cell[]
}

export const EMPTY_DIAGRAM_OBJECT: JointJSDiagram = { cells: [] }
export const EMPTY_DIAGRAM = JSON.stringify(EMPTY_DIAGRAM_OBJECT)
