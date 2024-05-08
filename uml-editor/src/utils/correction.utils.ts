import { inject } from '@angular/core'
import { diff } from 'just-diff'
import { AiCorrectionService } from '../core/ai-correction.service'
import { JustDiff, UmlCorrection } from '../models/correction.model'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'
import { cleanupObject, extractPropertyValueByOccurrence, replacePropertyWithValue } from './object.utils'

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
  const answerIdsGrouped = extractPropertyValueByOccurrence(cleanedAnswer, 'id').map(
    ([id, path, count], ix) =>
      ({
        ix,
        id,
        path,
        count,
      }) as const
  )
  const solutionIdsGrouped = extractPropertyValueByOccurrence(cleanedSolution, 'id').map(
    ([id, path, count], ix) =>
      ({
        ix,
        id,
        path,
        count,
      }) as const
  )

  // check for 100% match
  const allIds = [...answerIdsGrouped, ...solutionIdsGrouped]
  const nonOverlappingIds = allIds.filter(entry => {
    const existingInAnswer = answerIdsGrouped.some(a => a.path === entry.path && a.count === entry.count)
    const existingInSolution = solutionIdsGrouped.some(s => s.path === entry.path && s.count === entry.count)
    return !(existingInAnswer && existingInSolution)
  })

  // find overlapping ids (100% match by id)
  const overlappingIds = allIds.filter(entry => !nonOverlappingIds.some(({ id }) => id === entry.id))

  // create map of ids to lookup
  const lookupIdMap = new Map<string, string>(
    overlappingIds
      .map((entry, ix, self) => {
        const existingIndex = self.findIndex(l => l.path === entry.path && l.count === entry.count)
        return existingIndex !== ix ? [entry.id, self[existingIndex].id] : null
      })
      .filter((entry): entry is [string, string] => !!entry)
  )

  // replace ids in answer diagram
  const normalizedAnswer = replacePropertyWithValue(cleanedAnswer, 'id', lookupIdMap)
  const normalizedSolution = replacePropertyWithValue(cleanedSolution, 'id', lookupIdMap)

  return { normalizedAnswer, normalizedSolution }
}

function cleanupAndNormalizeDiagrams(
  answer: JointJSDiagram,
  solution: JointJSDiagram
): { normalizedAnswer: JointJSDiagram; normalizedSolution: JointJSDiagram } {
  // cleanup unnecessary properties (metadata like position, size, etc.)
  const cleanedAnswer = cleanupObject(answer, ignoredProperties)
  const cleanedSolution = cleanupObject(solution, ignoredProperties)

  // normalize diagrams (e.g. order of elements in arrays, ids, etc.)
  return normalizeDiagrams(cleanedAnswer, cleanedSolution)
}

export function evaluateCorrection(answer: JointJSDiagram, solution: JointJSDiagram, maxPoints: number): UmlCorrection {
  // cleanup unnecessary properties (metadata like position, size, etc.)
  // normalize diagrams (e.g. order of elements in arrays, ids, etc.)
  const { normalizedAnswer, normalizedSolution } = cleanupAndNormalizeDiagrams(answer, solution)

  // calculate differences between normalized diagrams
  const differences = diff(normalizedAnswer, normalizedSolution)

  const points = calculatePoints(normalizedSolution, differences, maxPoints)

  // calculate points based on differences
  return {
    differences,
    points,
    normalizedAnswer,
    normalizedSolution,
  }
}

export function injectCreateEvaluateCorrectionFn() {
  const aiCorrectionService = inject(AiCorrectionService)

  return async (
    answer: JointJSDiagram,
    solution: JointJSDiagram,
    maxPoints: number,
    endpoint?: string | null | undefined,
    correctionPrompt?: string | null | undefined
  ): Promise<UmlCorrection> => {
    const correction = evaluateCorrection(answer, solution, maxPoints)

    // if there is an endpoint, use the AI service to calculate the correction
    if (!endpoint) {
      // calculate points based on differences
      return correction
    }

    const summary = await aiCorrectionService.promptForCorrectionSummary(
      correction.normalizedSolution,
      correction.normalizedAnswer,
      maxPoints,
      endpoint,
      correctionPrompt
    )

    return {
      ...correction,
      summary,
    }
  }
}

export function injectCreatePrepareEvaluationPromptFn() {
  const aiCorrectionService = inject(AiCorrectionService)

  return (
    answer: JointJSDiagram,
    solution: JointJSDiagram,
    maxPoints: number,
    correctionPrompt?: string | null | undefined
  ) => {
    const correction = evaluateCorrection(answer, solution, maxPoints)

    return aiCorrectionService.prepareEvaluationPrompt(
      correction.normalizedSolution,
      correction.normalizedAnswer,
      maxPoints,
      correctionPrompt
    )
  }
}
