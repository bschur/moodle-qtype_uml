const template = document.createElement('template');

template.innerHTML = `
<style>
/* Split the screen in half */
.split {
    display: flex;
    flex-direction: row;
    gap: 2px;
    height: 100%;
    width: 100%;
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

<div class="split">
    <div class=" left">
        <canvas id="canvasTool"></canvas>
    </div>
    <div class=" right">
        <canvas id="canvasEditor"></canvas>
    </div>
</div>
`

class WebglEditor extends HTMLElement {
    objects = [];

    canvas = null
    canvasTool = null
    ctx = null
    ctxTool = null

    offsetX = 0
    offsetY = 0
    draggedObject = null;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({'mode': 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.canvas = this._shadowRoot.getElementById('canvasEditor');
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;

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
        this.ctx.clearRect(0, 0, this.canvasTool.width, this.canvasTool.height);
        for (const obj of this.objects) {
            this.ctx.fillStyle = obj.color;
            this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        }
    }

    /**
     * Draw a instance for each object in the Toolbox
     */
    drawObjectTool() {
        this.ctxTool.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
        this.canvas.addEventListener("mousedown", (event) => {
            const x = event.clientX - this.canvas.getBoundingClientRect().left;
            const y = event.clientY - this.canvas.getBoundingClientRect().top;

            this.draggedObject = this.findTopObject(x, y);

            if (this.draggedObject) {
                this.offsetX = x - this.draggedObject.x;
                this.offsetY = y - this.draggedObject.y;
            }
        });

        /**
         * refresh Editor for every mousemove
         */
        this.canvas.addEventListener("mousemove", (event) => {
            if (this.draggedObject) {
                const x = event.clientX - this.canvas.getBoundingClientRect().left;
                const y = event.clientY - this.canvas.getBoundingClientRect().top;
                this.draggedObject.x = x - this.offsetX;
                this.draggedObject.y = y - this.offsetY;
                this.objects[this.draggedObject.id - 1] = this.draggedObject;
                this.drawObject();
            }
        });

        /**
         * save location of dragged object
         */
        this.canvas.addEventListener("mouseup", () => {
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