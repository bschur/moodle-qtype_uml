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
    endpoint: string
  ): Promise<string> {
    const prompt = `
This is the given solution:
${JSON.stringify(cleanedSolution)}

This is the given answer:
${JSON.stringify(cleanedAnswer)}

Above are two diagrams represented as JSON. The first one is the solution the second one the answer someone has given.
You are now the lecturer and your goal is to give the student an grade.

Write a short summary by first listing the difference(s) between the answer and the solution
Then grade the answer by giving it points. The minimum points is 0 and the maximum points is "${maxPoints}".
`

    return firstValueFrom(this.httpClient.post<string>(endpoint, prompt))
  }
}
