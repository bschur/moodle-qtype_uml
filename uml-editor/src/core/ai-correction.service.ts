import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

@Injectable({
  providedIn: 'root',
})
export class AiCorrectionService {
  private readonly httpClient = inject(HttpClient)

  promptForCorrectionSummary(
    cleanedAnswer: JointJSDiagram,
    cleanedSolution: JointJSDiagram,
    maxPoints: number,
    endpoint: string,
    additionalCorrectionPrompt?: string | null | undefined
  ): Promise<string> {
    const prompt = `
You get two diagrams represented as JSON. The first one is the solution the second one the answer someone has given.

This is the given solution:
${JSON.stringify(cleanedSolution)}

This is the given answer:
${JSON.stringify(cleanedAnswer)}

You are now the lecturer and your goal is to give the student a grade.
First write a short summary and list the most important difference(s) between the answer and the solution
Then grade the answer by giving it points. The minimum points is 0 and the maximum points is "${maxPoints}".

Ignore the formatting of the JSON and focus on the content. Also ignore ordering of the JSON.
${additionalCorrectionPrompt ? additionalCorrectionPrompt : ''}

Use the following template as the output:

Differences:
  - <list the differences here>
  - <list the differences here>
  - <list the differences here>

Grade: <grade here>
`

    return firstValueFrom(this.httpClient.post<string>(endpoint, prompt))
  }
}
