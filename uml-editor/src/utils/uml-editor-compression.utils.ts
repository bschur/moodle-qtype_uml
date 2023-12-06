/**
 * Compress string to be used in Editor
 *
 * @param input String to compress
 * @returns Compressed string
 */
function compressString(input: string): string {
    return encodeURIComponent(input)
        .replace(/%20/g, ' ') // Replace %20 with space
        .replace(/%21/g, '!') // Replace %21 with !
        .replace(/%23/g, '#') // Replace %23 with #
        .replace(/%24/g, '$') // Replace %24 with $
        // Add more replacements as needed
        .replace(/%25/g, '%') // Replace %25 with %
}

/**
 * Decompress string encoded by Editor
 *
 * @param input String to decompress
 * @returns Decompressed string
 */
function decompressString(input: string): string {
    return decodeURIComponent(input)
        .replace(/ /g, '%20') // Replace space with %20
        .replace(/!/g, '%21') // Replace ! with %21
        .replace(/#/g, '%23') // Replace # with %23
        .replace(/\$/g, '%24') // Replace $ with %24
        // Add more replacements as needed
        .replace(/%/g, '%25') // Replace % with %25
}

/**
 * Decode diagram string encoded by Editor
 *
 * @param diagram Diagram string
 * @returns diagram as object
 */
export function decodeDiagram(diagram: string): any {
    const diagramContent = decodeURIComponent(diagram)
    const diagramJson = decompressString(diagramContent)
    return JSON.parse(diagramJson)
}

/**
 * Encode diagram to be used in Editor
 *
 * @param diagram The diagram object
 * @returns Encoded diagram
 */
export function encodeDiagram(diagram: any): string {
    const diagramContent = JSON.stringify(diagram)
    const diagramEscaped = encodeURIComponent(diagramContent)
    return compressString(diagramEscaped)
}
