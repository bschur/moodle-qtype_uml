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

import {UmlEditor} from './uml-editor.js';
import {diagramChangeEventName, setDiagramToReferenceInputField} from './utils/uml-editor-change-handler.js';

// Setup web-component
customElements.define('uml-editor', UmlEditor);

// Listen for diagram changes (globally)
document.addEventListener(diagramChangeEventName, setDiagramToReferenceInputField.bind(null));
