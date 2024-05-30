import { dia } from '@joint/core'
import { encodeDiagram } from '../../utils/uml-editor-compression.utils'

export interface JointJSDiagram {
  readonly cells: dia.Cell[]
}

export const EMPTY_DIAGRAM_OBJECT: JointJSDiagram = { cells: [] }
export const EMPTY_DIAGRAM_ENCODED = encodeDiagram(EMPTY_DIAGRAM_OBJECT)
