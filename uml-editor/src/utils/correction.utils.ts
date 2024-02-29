import { dia } from 'jointjs'
import { diff, Operation } from 'just-diff'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

function cleanupCell(cell: dia.Cell): dia.Cell {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cleanedCell: any = {
    ...cell,
  }

  // remove metadata on cell level
  delete cleanedCell.angle
  delete cleanedCell.id
  delete cleanedCell.position
  delete cleanedCell.size
  delete cleanedCell.z

  return cleanedCell
}

function cleanupDiagram(diagram: JointJSDiagram): JointJSDiagram {
  // remove metadata on diagram level by just returning the cells
  return { cells: diagram.cells.map(cleanupCell) }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JustDiff = { readonly op: Operation; readonly path: readonly (string | number)[]; readonly value: any }

export function evaluationCorrection(answer: JointJSDiagram, solution: JointJSDiagram): JustDiff[] {
  const cleanedAnswer = cleanupDiagram(answer)
  const cleanedSolution = cleanupDiagram(solution)

  const differences = diff(cleanedAnswer, cleanedSolution)

  // TODO do some additional stuff cleanup differences

  return differences
}
