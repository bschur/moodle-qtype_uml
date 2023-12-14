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
 * Set the diagram to the reference input field.
 *
 * @param {Event} event the custom event (fired by the editor)
 */
function setDiagramToReferenceInputField(event) {
    const element = document.getElementById(event.detail?.inputId);
    if (element) {
        element.value = event.detail.diagram;
    }
}

/**
 * Initialize the uml editor elements.
 *
 * @param {String} basePath path to the dist folder of the uml-element
 */
// Eslint-disable-next-line no-unused-vars
export const init = (basePath) => {
    // create script and style tag for custom elements
    const mainScript = document.createElement('script');
    mainScript.src = `${basePath}/main.js`;
    mainScript.type = 'module';
    mainScript.defer = true;

    const mainStyle = document.createElement('link');
    mainStyle.href = `${basePath}/styles.css`;
    mainStyle.rel = 'stylesheet';

    // used for angular initialization
    const umlEditorLoader = document.createElement('uml-elements');
    document.body.appendChild(umlEditorLoader);

    // load script and style tag for custom elements
    document.head.appendChild(mainScript);
    document.head.appendChild(mainStyle);

    // listen for dom changes to detect when the editor is loaded
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'UML-EDITOR') {
                    node.addEventListener('diagramChanged', setDiagramToReferenceInputField);
                }
            });
        });
    });

    observer.observe(document.body, {childList: true, subtree: true});
};