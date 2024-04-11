import { JointJSDiagram } from '../src/models/jointjs/jointjs-diagram.model'
import { decodeDiagram, encodeDiagram } from '../src/utils/uml-editor-compression.utils'

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
})
