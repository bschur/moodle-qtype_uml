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

    Write a brief summary highlighting the most significant differences between the solution and the student's answer.
    Grade the student's answer with a score from 0 to {2}. The grading criteria weights are as follows:
    {3}

The JSON formatting and ordering don't matter; focus on the content.

Use this template for your output:

Differences:
  - <list the differences here>

Grade: <grade here>
`

@Injectable({
  providedIn: 'root',
})
export class AiCorrectionService {
  private readonly httpClient = inject(HttpClient)

  prepareEvaluationPrompt(
    cleanedSolution: JointJSDiagram,
    cleanedAnswer: JointJSDiagram,
    maxPoints: number,
    additionalCorrectionPrompt?: string | null | undefined
  ): string {
    return sourcePrompt
      .replaceAll('{0}', JSON.stringify(cleanedSolution, null, 2))
      .replaceAll('{1}', JSON.stringify(cleanedAnswer, null, 2))
      .replaceAll('{2}', maxPoints.toString())
      .replaceAll('{3}', additionalCorrectionPrompt || '')
  }

  promptForCorrectionSummary(
    cleanedSolution: JointJSDiagram,
    cleanedAnswer: JointJSDiagram,
    maxPoints: number,
    endpoint: string,
    additionalCorrectionPrompt?: string | null | undefined
  ): Promise<string> {
    const formattedPrompt = this.prepareEvaluationPrompt(
      cleanedSolution,
      cleanedAnswer,
      maxPoints,
      additionalCorrectionPrompt
    )

    return firstValueFrom(this.httpClient.post<string>(endpoint, formattedPrompt))
  }
}
