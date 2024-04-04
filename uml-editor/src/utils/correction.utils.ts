import { diff } from 'just-diff'
import { JustDiff, UmlCorrection } from '../models/correction.model'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

const ignoredProperties: string[] = [
  'size',
  'position',
  'angle',
  'z',
  'anchor',
  'd',
  'fill',
  'strokeDasharray',
  'strokeDashoffset',
]

const ignoredPropertiesForPoints: (string | number)[] = [...ignoredProperties]

type PropertyValueType =
  | string
  | number
  | boolean
  | null
  | undefined
  | PropertyValueType[]
  | { [key: string]: PropertyValueType }

const cleanupProperty = ([key, value]: [string, PropertyValueType]): [string, PropertyValueType] | null => {
  if (value === null || value === undefined || ignoredProperties.includes(key)) {
    return null
  }

  // if the value is not an object, we can return the key value pair
  if (typeof value !== 'object') {
    return [key, value]
  }

  // handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return null
    }

    return [key, value.map((value, ix) => cleanupProperty([ix.toString(), value])?.[1] || null).filter(val => !!val)]
  }

  // otherwise we have an object
  if (Object.keys(value).length === 0) {
    // if the object is empty, we can remove it
    return null
  }

  const cleaned = Object.fromEntries(
    Object.entries(value)
      .map(cleanupProperty)
      .filter((entry): entry is [string, PropertyValueType] => !!entry)
  )
  if (Object.keys(cleaned).length > 0) {
    return [key, cleaned]
  }
  return null
}

function cleanupDiagram(diagram: JointJSDiagram): JointJSDiagram {
  // remove metadata on diagram level by just returning the cells
  return Object.fromEntries(
    Object.entries(diagram)
      .map(cleanupProperty)
      .filter((entry): entry is [string, PropertyValueType] => !!entry)
  ) as unknown as JointJSDiagram
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

  const differences = diff(cleanedAnswer, cleanedSolution).filter(
    diff => !ignoredPropertiesForPoints.includes(diff.path[diff.path.length - 1])
  )

  return {
    differences,
    points: calculatePoints(cleanedSolution, differences, maxPoints),
    answer: cleanedAnswer,
    solution: cleanedSolution,
  }
}
