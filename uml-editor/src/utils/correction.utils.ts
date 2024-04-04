import { diff } from 'just-diff'
import { JustDiff, UmlCorrection } from '../models/correction.model'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

const ignoredProperties = [
  'id',
  'position',
  'size',
  'angle',
  'args',
  'z',
  'dx',
  'dy',
  'rotated',
  'd',
  'fill',
  'anchor',
  'strokeDasharray',
  'strokeDashoffset',
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanupObjectProperties = (acc: any, [key, value]: [string, any]): any => {
  if (value === null || value === undefined || ignoredProperties.includes(key)) {
    return acc
  }

  if (typeof value === 'object') {
    const cleaned = Object.entries(value).reduce(cleanupObjectProperties, {})
    if (Object.keys(cleaned).length > 0) {
      acc[key] = cleaned
    }
    return acc
  }

  if (Array.isArray(value)) {
    acc[key] = Array.from(value).reduce(cleanupObjectProperties)
    return acc
  }

  acc[key] = value
  return acc
}

function cleanupDiagram(diagram: JointJSDiagram): JointJSDiagram {
  // remove metadata on diagram level by just returning the cells
  return Object.entries(diagram).reduce(cleanupObjectProperties, {})
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

export function evaluateCorrection(answer: JointJSDiagram, solution: JointJSDiagram, maxPoints: number): UmlCorrection {
  const cleanedAnswer = cleanupDiagram(answer)
  const cleanedSolution = cleanupDiagram(solution)

  const differences = diff(cleanedAnswer, cleanedSolution)

  // TODO do some additional stuff cleanup differences

  return {
    differences,
    points: calculatePoints(cleanedSolution, differences, maxPoints),
    answer: cleanedAnswer,
    solution: cleanedSolution,
  }
}
