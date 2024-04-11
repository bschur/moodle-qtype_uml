import { evaluateCorrection } from '../src/utils/correction.utils'
import answerJson from './resources/answer-decoded.json'
import correctionJson from './resources/output-correction.json'
import solutionJson from './resources/solution-decoded.json'

const answer = JSON.parse(JSON.stringify(answerJson))
const solution = JSON.parse(JSON.stringify(solutionJson))
const correction = JSON.parse(JSON.stringify(correctionJson))
const maxPoints = 3

describe('correction.utils', () => {
  it('check if test files are present', () => {
    expect(answer).toBeTruthy()
    expect(solution).toBeTruthy()
    expect(correction).toBeTruthy()
  })
  it('check if matching output', () => {
    const evaluatedCorrection = evaluateCorrection(answer, solution, maxPoints)
    expect(evaluatedCorrection).toBeTruthy()
    expect(evaluatedCorrection).toEqual(correction)
  })
})
