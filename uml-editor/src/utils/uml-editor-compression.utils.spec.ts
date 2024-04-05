import { diff } from 'just-diff'
import { decodeDiagram, encodeDiagram } from './uml-editor-compression.utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const diagram: any = {
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

    expect(diff(decoded, diagram)).toEqual([])
  })
})
