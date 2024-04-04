import { diff } from 'just-diff'
import { JustDiff, UmlCorrection } from '../models/correction.model'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'
import { cleanupObject, extractPropertyWithPathOccurrences } from './object.utils'

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
  const answerIdsGrouped = extractPropertyWithPathOccurrences(cleanedAnswer, 'id').map(
    ([id, path, count], ix) =>
      ({
        ix,
        id,
        path,
        count,
      }) as const
  )
  const solutionIdsGrouped = extractPropertyWithPathOccurrences(cleanedSolution, 'id').map(
    ([id, path, count], ix) =>
      ({
        ix,
        id,
        path,
        count,
      }) as const
  )

  // FIXME remove test
  answerIdsGrouped.push({ ix: 0, id: 'test', path: 'test.1', count: 1 })
  solutionIdsGrouped.push({ ix: 0, id: 'test', path: 'test.2', count: 1 })

  // check for 100% match
  const allIds = [...answerIdsGrouped, ...solutionIdsGrouped]
  const nonOverlappingIds = allIds.filter(entry => {
    const existingInAnswer = answerIdsGrouped.some(a => a.path === entry.path && a.count === entry.count)
    const existingInSolution = solutionIdsGrouped.some(s => s.path === entry.path && s.count === entry.count)
    return !(existingInAnswer && existingInSolution)
  })

  const lookupMap = new Map<string, string>(
    allIds
      // ignore non-overlapping ids
      .filter(entry => !nonOverlappingIds.includes(entry))
      .map((entry, ix, self) => {
        const existingIndex = self.findIndex(l => l.path === entry.path && l.count === entry.count)
        return existingIndex !== ix ? [entry.id, self[existingIndex].id] : null
      })
      .filter((entry): entry is [string, string] => !!entry)
  )

  console.debug('nonExisting', nonOverlappingIds, 'lookupIds', lookupMap)

  return { normalizedAnswer: cleanedAnswer, normalizedSolution: cleanedSolution }
}

export function evaluateCorrection(answer: JointJSDiagram, solution: JointJSDiagram, maxPoints: number): UmlCorrection {
  // cleanup unnecessary properties (metadata like position, size, etc.)
  const cleanedAnswer = cleanupObject(answer, ignoredProperties)
  const cleanedSolution = cleanupObject(solution, ignoredProperties)

  // normalize diagrams (e.g. order of elements in arrays, ids, etc.)
  const { normalizedAnswer, normalizedSolution } = normalizeDiagrams(cleanedAnswer, cleanedSolution)

  console.debug(JSON.stringify(normalizedAnswer))
  console.debug(JSON.stringify(normalizedSolution))

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
