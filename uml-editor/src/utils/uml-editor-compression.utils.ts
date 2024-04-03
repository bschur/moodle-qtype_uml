import { JointJSDiagram } from '../models/jointjs/jointjs-diagram.model'

/**
 * Compress string to be used in Editor
 *
 * @param input String to compress
 * @returns Compressed string
 */
function compressString(input: string): string {
  const escapedString = input
    .replace(/ /g, '%20') // Replace space with %20
    .replace(/!/g, '%21') // Replace ! with %21
    .replace(/#/g, '%23') // Replace # with %23
    .replace(/\$/g, '%24') // Replace $ with %24
    .replace(/%/g, '%25') // Replace % with %25
  return encodeURIComponent(escapedString)
}

/**
 * Decompress string encoded by Editor
 *
 * @param input String to decompress
 * @returns Decompressed string
 */
function decompressString(input: string): string {
  const backEscaped = input
    .replace(/%20/g, ' ') // Replace %20 with space
    .replace(/%21/g, '!') // Replace %21 with !
    .replace(/%23/g, '#') // Replace %23 with #
    .replace(/%24/g, '$') // Replace %24 with $
    .replace(/%25/g, '%') // Replace %25 with %
  return decodeURIComponent(backEscaped)
}

/**
 * Decode diagram string encoded by Editor
 *
 * @param diagram Diagram string
 * @returns diagram as object
 */
export function decodeDiagram(diagram: string): JointJSDiagram {
  const diagramJson = decompressString(diagram)
  return JSON.parse(diagramJson)
}

/**
 * Encode diagram to be used in Editor
 *
 * @param diagram The diagram object
 * @returns Encoded diagram
 */
export function encodeDiagram(diagram: JointJSDiagram): string {
  const diagramContent = JSON.stringify(diagram)
  return compressString(diagramContent)
}
