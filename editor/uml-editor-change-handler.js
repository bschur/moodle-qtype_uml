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

const eventBuffer = [];
let bufferTimeout = null;

/**
 * Get the target input field.
 *
 * @param {string} inputId
 * @returns {HTMLElement|null}
 */
function getTargetInput(inputId) {
    const targetElem = document.querySelector(`#${inputId}`);
    if (!targetElem) {
        return null;
    }

    if (targetElem.disabled) {
        return null;
    }

    return targetElem;
}

export const diagramChangeEventName = 'diagramChanged';

/**
 * Set the diagram data to the reference input field.
 *
 * @param {Event} event
 */
export function setDiagramToReferenceInputField(event) {
    event.target.value = event.detail.diagram;
}

/**
 * Emit a diagram data changed event.
 *
 * @param {string} inputId
 * @param {string} diagram
 */
export function emitDiagramDataChangedEvent(inputId, diagram) {
    const targetElem = getTargetInput(inputId);
    if (!targetElem) {
        return;
    }

    const event = new CustomEvent(diagramChangeEventName, {
        bubbles: true,
        detail: {
            diagram,
        }
    });

    // Add the event to the buffer
    eventBuffer.push(event);

    // If there's a buffer timeout already set, clear it
    if (bufferTimeout) {
        clearTimeout(bufferTimeout);
    }

    // Set a new buffer timeout to emit the events after 500ms
    bufferTimeout = setTimeout(() => {
        targetElem.dispatchEvent(eventBuffer[eventBuffer.length - 1]);

        // Clear the buffer and the buffer timeout
        eventBuffer.splice(0, eventBuffer.length);
        bufferTimeout = null;
    }, 100);
}
