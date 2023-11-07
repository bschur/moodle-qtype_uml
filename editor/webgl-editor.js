const template = document.createElement('template');

template.innerHTML = `
<style>
:host {   
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    gap: 2px;
    padding: 4px;
}

.left {
    flex: 0 0 min(10%, 150px);
    background-color: grey;
}

.right {
    flex: 0 0 100%;
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
        this.canvasEditor = this._shadowRoot.getElementById('canvasEditor');
        this.ctxEditor = this.canvasEditor.getContext("2d");
        this.canvasEditor.width = this.canvasEditor.parentElement.clientWidth;
        this.canvasEditor.height = this.canvasEditor.parentElement.clientHeight;

        this.canvasTool = this._shadowRoot.getElementById('canvasTool');
        this.ctxTool = this.canvasTool.getContext("2d");
        this.canvasTool.width = this.canvasTool.parentElement.clientWidth;
        this.canvasTool.height = this.canvasTool.parentElement.clientHeight;

        this.postSetup();
    }

    /**
     * Draw all instances in the Editor
     */
    drawObject() {
        this.ctxEditor.clearRect(0, 0, this.canvasTool.width, this.canvasTool.height);
        for (const obj of this.objects) {
            this.ctxEditor.fillStyle = obj.color;
            this.ctxEditor.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
    }

    /**
     * Draw a instance for each object in the Toolbox
     */
    drawObjectTool() {
        this.ctxTool.clearRect(0, 0, this.canvasEditor.width, this.canvasEditor.height);
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

    postSetup() {
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
                this.drawObject();
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
            this.drawObject();
        });

        this.drawObjectTool();
    }
}

window.customElements.define('webgl-editor', WebglEditor);