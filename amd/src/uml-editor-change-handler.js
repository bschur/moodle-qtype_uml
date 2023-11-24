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

/* eslint-disable no-console */

/**
 * Set the diagram data to the reference input field.
 *
 * @param {Event} event
 */
export function setDiagramToReferenceInputField(event) {
    const targetElem = document.querySelector(`#${event.detail.inputId}`);
    if (!targetElem) {
        console.error('Could not find target element', targetElem.id);
        return;
    }

    if (targetElem.disabled) {
        console.debug('target element is disabled', targetElem.id);
        return;
    }

    targetElem.value = event.detail.diagram;
    console.debug('diagram data changed', targetElem.id, targetElem.value);
}
