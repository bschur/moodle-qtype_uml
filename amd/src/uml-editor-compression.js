// This file is part of Moodle - https://moodle.org
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Compress string to be used in Editor
 *
 * @param {String} input String to compress
 * @returns {String} Compressed string
 */
function compressString(input) {
    return encodeURIComponent(input)
        .replace(/%20/g, ' ') // Replace %20 with space
        .replace(/%21/g, '!') // Replace %21 with !
        .replace(/%23/g, '#') // Replace %23 with #
        .replace(/%24/g, '$') // Replace %24 with $
        // Add more replacements as needed
        .replace(/%25/g, '%'); // Replace %25 with %
}

/**
 * Decompress string encoded by Editor
 *
 * @param {String} input String to decompress
 * @returns {String} Decompressed string
 */
function decompressString(input) {
    return decodeURIComponent(input)
        .replace(/ /g, '%20') // Replace space with %20
        .replace(/!/g, '%21') // Replace ! with %21
        .replace(/#/g, '%23') // Replace # with %23
        .replace(/\$/g, '%24') // Replace $ with %24
        // Add more replacements as needed
        .replace(/%/g, '%25'); // Replace % with %25
}

/**
 * Decode diagram string encoded by Editor
 *
 * @param {String} diagram Diagram string
 * @returns {Array} Array of objects
 */
export function decodeDiagram(diagram) {
    const diagramContent = decodeURIComponent(diagram);
    const diagramJson = decompressString(diagramContent);
    return JSON.parse(diagramJson);
}

/**
 * Encode diagram to be used in Editor
 *
 * @param {Array} diagramObjects Array of objects
 * @returns {String} Encoded diagram
 */
export function encodeDiagram(diagramObjects) {
    const diagramContent = JSON.stringify(diagramObjects);
    const diagramEscaped = encodeURIComponent(diagramContent);
    return compressString(diagramEscaped);
}