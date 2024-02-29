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

function calculatePoints(referenceDiagram: JointJSDiagram, differences: JustDiff[], maxPoints: number): number {
  const correctProperties = referenceDiagram.cells.length - differences.length
  const correctPropertiesNormalized = correctProperties < 0 ? 0 : correctProperties

  const successRate = correctPropertiesNormalized / referenceDiagram.cells.length
  const receivedPoints = Math.ceil(successRate * maxPoints)
  if (receivedPoints > maxPoints) {
    throw new Error('Received points are greater than the maximum points')
  }

  return receivedPoints < 0 ? 0 : receivedPoints
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JustDiff = { readonly op: Operation; readonly path: readonly (string | number)[]; readonly value: any }

export interface UmlCorrection {
  readonly differences: JustDiff[]
  readonly points: number
}

export function evaluateCorrection(answer: JointJSDiagram, solution: JointJSDiagram, maxPoints: number): UmlCorrection {
  const cleanedAnswer = cleanupDiagram(answer)
  const cleanedSolution = cleanupDiagram(solution)

  const differences = diff(cleanedAnswer, cleanedSolution)

  // TODO do some additional stuff cleanup differences

  return {
    differences,
    points: calculatePoints(cleanedSolution, differences, maxPoints),
  }
}
