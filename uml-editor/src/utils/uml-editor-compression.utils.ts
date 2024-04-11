import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

/**
 * Decode diagram string encoded by Editor
 *
 * @param diagram Diagram string
 * @returns diagram as object
 */
export function decodeDiagram(diagram: string): JointJSDiagram {
  const diagramJson = decodeURIComponent(diagram)
  return JSON.parse(diagramJson)
}

/**
 * Encode diagram to for export
 *
 * @param diagram The diagram object
 * @returns Encoded diagram
 */
export function encodeDiagram(diagram: JointJSDiagram): string {
  const diagramContent = JSON.stringify(diagram)
  return encodeURIComponent(diagramContent)
}
