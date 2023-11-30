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

import { decodeDiagram, encodeDiagram } from 'qtype_uml/uml-editor-compression';
import { emitDiagramDataChangedEvent } from 'qtype_uml/uml-editor-change-handler';

const templateHTML = `
<style>
    :host {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        gap: 2px;
        padding: 4px;
    }
    
    .left {
        width: 30%;
        background-color: grey;
    }
    
    .right {
        width: 100%;
        background-color: grey;
    }
</style>
    
<div class="left">
    <canvas id="canvasTool"></canvas>
</div>
<div class="right">
    <canvas id="canvasEditor"></canvas>
</div>
`;

export class UmlEditor extends HTMLElement {
    canvasEditor = null;
    ctxEditor = null;

    canvasTool = null;
    ctxTool = null;

    offsetX = 0;
    offsetY = 0;
    draggedObject = null;

    objects = [];

    get attributeInputId() {
        return this.getAttribute('inputId');
    }

    get attributeDiagram() {
        const diagram = this.getAttribute('diagram');
        if (!diagram) {
            return null;
        }

        return decodeDiagram(diagram);
    }

    get attributeAllowEdit() {
        return this.getAttribute('allowEdit') === '1';
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Create the template for the shadow DOM
        this.shadowRoot.innerHTML = templateHTML;
    }

    connectedCallback() {
        // Initialize canvas elements and contexts
        this.initCanvas('canvasEditor', 'ctxEditor');
        this.initCanvas('canvasTool', 'ctxTool');

        if (this.attributeAllowEdit) {
            // Initial rendering
            this.drawObjectTool();

            // Setup event listeners
            this.setupListeners();
        } else {
            // Hide toolbox (left part)
            this.shadowRoot.querySelector('.left').style.display = 'none';
        }

        const diagramFromAttribute = this.attributeDiagram;
        if (diagramFromAttribute) {
            this.displayDiagramSchema(diagramFromAttribute);
        }
    }

    detachedCallback() {
        this.emitDiagramChanged();
    }

    initCanvas(canvasId, contextId) {
        const canvas = this.shadowRoot.getElementById(canvasId);
        const context = canvas.getContext('2d');

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        this[canvasId] = canvas;
        this[contextId] = context;
    }

    displayDiagramSchema(diagramObjects) {
        if (diagramObjects) {
            this.objects = diagramObjects;
            this.drawObjectEditor();
        }
    }

    drawObjectEditor() {
        // Clear the editor canvas and draw objects
        this.ctxEditor.clearRect(0, 0, this.canvasEditor.width, this.canvasEditor.height);
        for (const obj of this.objects) {
            this.ctxEditor.fillStyle = obj.color;
            this.ctxEditor.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
    }

    drawObjectTool() {
        // Clear the tool canvas and draw a sample object
        this.ctxTool.clearRect(0, 0, this.canvasTool.width, this.canvasTool.height);
        this.ctxTool.fillStyle = 'blue';
        this.ctxTool.fillRect(100, 100, 50, 50);
    }

    findTopObject(x, y) {
        // Find the top object at the given coordinates
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (x >= obj.x && x <= obj.x + obj.width && y >= obj.y && y <= obj.y + obj.height) {
                return obj;
            }
        }
        return null; // No object found
    }

    setupListeners() {
        // Save dragged object
        this.canvasEditor.addEventListener('mousedown', (event) => {
            const x = event.clientX - this.canvasEditor.getBoundingClientRect().left;
            const y = event.clientY - this.canvasEditor.getBoundingClientRect().top;

            this.draggedObject = this.findTopObject(x, y);

            if (this.draggedObject) {
                this.offsetX = x - this.draggedObject.x;
                this.offsetY = y - this.draggedObject.y;
            }
        });

        // Refresh Editor for every mousemove
        this.canvasEditor.addEventListener('mousemove', (event) => {
            if (this.draggedObject) {
                const x = event.clientX - this.canvasEditor.getBoundingClientRect().left;
                const y = event.clientY - this.canvasEditor.getBoundingClientRect().top;
                this.draggedObject.x = x - this.offsetX;
                this.draggedObject.y = y - this.offsetY;
                this.objects[this.draggedObject.id - 1] = this.draggedObject;

                this.emitDiagramChanged();
                this.drawObjectEditor();
            }
        });

        // Save location of dragged object
        this.canvasEditor.addEventListener('mouseup', () => {
            if (this.draggedObject) {
                this.objects[this.draggedObject.id - 1] = this.draggedObject;
                this.draggedObject = null;
            }
        });

        // Draw an instance of a click object (in Toolbox) on the editor
        this.canvasTool.addEventListener('click', (event) => {
            event.preventDefault();
            const obj = {
                id: this.objects.length + 1,
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: 'blue',
            };
            this.objects.push(obj);

            this.emitDiagramChanged();
            this.drawObjectEditor();
        });
    }

    emitDiagramChanged() {
        const diagram = encodeDiagram(this.objects);
        emitDiagramDataChangedEvent(this.attributeInputId, diagram);
    }
}
