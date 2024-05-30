import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

const sourcePrompt = `
You have two diagrams in JSON format. The first diagram is the correct solution, and the second diagram is an answer provided by a student.

Given Solution (JSON):
{0}

Student's Answer (JSON):
{1}

Your task as the lecturer is to evaluate the student's answer against the given solution.

Write a short summary highlighting the most significant differences between the solution and the student's answer.
For all text values, ignore language differences or different naming. Also ignore case sensitivity and white spaces.
Ignore errors based on Ids or other unique identifiers. Try to see whether there are similar linings and relations.
Grade the student's answer with a score from 0 to {2}.
For each correct value give points. Use the following criteria to grade the student's answer:
{3}

The JSON formatting and ordering don't matter; focus on the content.

Use this template for your output do not change the format:

Differences:
  - <list the differences here>

Grade: <grade here (numeric)>
`

export const prepareCorrectionSummaryPrompt = (
  cleanedSolution: JointJSDiagram,
  cleanedAnswer: JointJSDiagram,
  maxPoints: number,
  additionalCorrectionPrompt?: string | null | undefined
) =>
  sourcePrompt
    .replaceAll('{0}', JSON.stringify(cleanedSolution, null, 2))
    .replaceAll('{1}', JSON.stringify(cleanedAnswer, null, 2))
    .replaceAll('{2}', maxPoints.toString())
    .replaceAll('{3}', additionalCorrectionPrompt || '')

@Injectable({
  providedIn: 'root',
})
export class AiCorrectionService {
  private readonly httpClient = inject(HttpClient)

  promptForCorrectionSummary(
    cleanedSolution: JointJSDiagram,
    cleanedAnswer: JointJSDiagram,
    maxPoints: number,
    endpoint: string,
    additionalCorrectionPrompt?: string | null | undefined
  ): Promise<string> {
    const formattedPrompt = prepareCorrectionSummaryPrompt(
      cleanedSolution,
      cleanedAnswer,
      maxPoints,
      additionalCorrectionPrompt
    )

    return firstValueFrom(this.httpClient.post<string>(endpoint, formattedPrompt))
  }
}
