import { JointJSDiagram } from '../src/models/jointjs/jointjs-diagram.model'
import { decodeDiagram, encodeDiagram } from '../src/utils/uml-editor-compression.utils'
import answerJson from './resources/answer-decoded.json'
import answerTextJson from './resources/answer-encoded.json'
import solutionJson from './resources/solution-decoded.json'
import solutionTextJson from './resources/solution-encoded.json'

const answer = JSON.parse(JSON.stringify(answerJson))
const answerString = answerTextJson.text
const solution = JSON.parse(JSON.stringify(solutionJson))
const solutionString = solutionTextJson.text

const diagram = <JointJSDiagram>{
  cells: [
    {
      id: '1',
      markup: ['rect'],
    },
    {
      id: '2',
      markup: ['circle'],
    },
  ],
}

describe('uml-editor-compression.utils', () => {
  it('check encode and decode', () => {
    const encoded = encodeDiagram(diagram)
    const decoded = decodeDiagram(encoded)

    expect(decoded).toEqual(diagram)
  })
  it('check encode on existing data', () => {
    const encodedAnswer = encodeDiagram(answer)
    const encodedSolution = encodeDiagram(solution)
    expect(encodedAnswer).toEqual(answerString)
    expect(encodedSolution).toEqual(solutionString)
  })
  it('check decode on existing data', () => {
    const decodedAnswer = decodeDiagram(answerString)
    const decodedSolution = decodeDiagram(solutionString)
    expect(decodedAnswer).toEqual(answer)
    expect(decodedSolution).toEqual(solution)
  })
})
