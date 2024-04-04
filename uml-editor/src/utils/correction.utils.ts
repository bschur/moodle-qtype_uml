import { diff } from 'just-diff'
import { JustDiff, UmlCorrection } from '../models/correction.model'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'
import { cleanupProperty } from './object.utils'

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

function cleanupDiagram(diagram: JointJSDiagram): JointJSDiagram {
  // remove metadata on diagram level by just returning the cells
  return Object.fromEntries(
    Object.entries(diagram).map(entry => cleanupProperty(entry, ignoredProperties))
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

function normalizeDiagrams(
  cleanedAnswer: JointJSDiagram,
  cleanedSolution: JointJSDiagram
): { normalizedAnswer: JointJSDiagram; normalizedSolution: JointJSDiagram } {
  return { normalizedAnswer: cleanedAnswer, normalizedSolution: cleanedSolution }
}

export function evaluateCorrection(answer: JointJSDiagram, solution: JointJSDiagram, maxPoints: number): UmlCorrection {
  // cleanup unnecessary properties (metadata like position, size, etc.)
  const cleanedAnswer = cleanupDiagram(answer)
  const cleanedSolution = cleanupDiagram(solution)

  console.log(JSON.stringify(cleanedAnswer))

  // normalize diagrams (e.g. order of elements in arrays, ids, etc.)
  const { normalizedAnswer, normalizedSolution } = normalizeDiagrams(cleanedAnswer, cleanedSolution)

  // calculate differences between normalized diagrams
  const differences = diff(normalizedAnswer, normalizedSolution)

  // TODO: potentially LLM normalize by ignoring other languages

  // calculate points based on differences
  return {
    differences,
    points: calculatePoints(cleanedSolution, differences, maxPoints),
    answer: cleanedAnswer,
    solution: cleanedSolution,
  }
}
