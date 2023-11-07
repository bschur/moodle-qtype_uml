const template = document.createElement('template');

template.innerHTML = `
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

canvas {
    top: 0;
}
</style>

<div class="left">
    <canvas id="canvasTool"></canvas>
</div>
<div class="right">
    <canvas id="canvasEditor"></canvas>
</div>
`

class WebglEditor extends HTMLElement {
    objects = [];

    canvasEditor = null
    ctxEditor = null

    canvasTool = null
    ctxTool = null

    offsetX = 0
    offsetY = 0
    draggedObject = null;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({'mode': 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * Is being called when the web-component is connected
     */
    connectedCallback() {
        const editorInformation = this.getCanvasInformation('canvasEditor');
        this.canvasEditor = editorInformation.element
        this.ctxEditor = editorInformation.context

        const toolInformation = this.getCanvasInformation('canvasTool')
        this.canvasTool = toolInformation.element
        this.ctxTool = toolInformation.context

        this.setupListeners()
        this.drawObjectTool()
    }

    /**
     * Draw all instances in the Editor
     */
    drawObjectEditor() {
        this.ctxEditor.clearRect(0, 0, this.canvasEditor.width, this.canvasEditor.height);
        for (const obj of this.objects) {
            this.ctxEditor.fillStyle = obj.color;
            this.ctxEditor.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
    }

    /**
     * Draw a instance for each object in the Toolbox
     */
    drawObjectTool() {
        this.ctxTool.clearRect(0, 0, this.canvasTool.width, this.canvasTool.height);
        this.ctxTool.fillStyle = "blue";
        this.ctxTool.fillRect(100, 100, 50, 50);
    }

    findTopObject(x, y) {
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            if (
                x >= obj.x &&
                x <= obj.x + obj.width &&
                y >= obj.y &&
                y <= obj.y + obj.height
            ) {
                return obj;
            }
        }
        return null; // No object found
    }

    setupListeners() {
        /**
         * Save dragged object
         */
        this.canvasEditor.addEventListener("mousedown", (event) => {
            const x = event.clientX - this.canvasEditor.getBoundingClientRect().left;
            const y = event.clientY - this.canvasEditor.getBoundingClientRect().top;

            this.draggedObject = this.findTopObject(x, y);

            if (this.draggedObject) {
                this.offsetX = x - this.draggedObject.x;
                this.offsetY = y - this.draggedObject.y;
            }
        });

        /**
         * refresh Editor for every mousemove
         */
        this.canvasEditor.addEventListener("mousemove", (event) => {
            if (this.draggedObject) {
                const x = event.clientX - this.canvasEditor.getBoundingClientRect().left;
                const y = event.clientY - this.canvasEditor.getBoundingClientRect().top;
                this.draggedObject.x = x - this.offsetX;
                this.draggedObject.y = y - this.offsetY;
                this.objects[this.draggedObject.id - 1] = this.draggedObject;
                this.drawObjectEditor();
            }
        });

        /**
         * save location of dragged object
         */
        this.canvasEditor.addEventListener("mouseup", () => {
            this.objects[this.draggedObject.id] = this.draggedObject;
            this.draggedObject = null;
        });

        /**
         * Draw a instance of a clickt object (in Toolbox) on the editor
         */
        this.canvasTool.addEventListener("click", (event) => {
            event.preventDefault();
            const obj = {
                id: this.objects.length + 1,
                x: 100,
                y: 100,
                width: 50,
                height: 50,
                color: "blue",
            };
            this.objects.push(obj);
            this.drawObjectEditor();
        });
    }

    getCanvasInformation(id) {
        const element = this._shadowRoot.getElementById(id);
        const context = element.getContext("2d");

        element.width = element.parentElement.clientWidth;
        element.height = element.parentElement.clientHeight;

        return {
            element,
            context
        }
    }
}

window.customElements.define('webgl-editor', WebglEditor);