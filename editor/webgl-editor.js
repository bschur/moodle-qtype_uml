

const templateCode = `
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
        
    }
    #myholder {
        width: 1000px;
        height: 700px;
       
    
    }
</style>


<div class="left">
    <canvas id="canvasTool"></canvas>
</div>
<div class="right">
<div id="myholder"></div>
    <canvas id="canvasEditor"></canvas>
</div>


`
class WebglEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        // Create the template for the shadow DOM
        this.shadowRoot.innerHTML = templateCode;

        // Initialize properties
        this.objects = [];
        this.canvasEditor = null;
        this.ctxEditor = null;
        this.canvasTool = null;
        this.ctxTool = null;
        this.offsetX = 0;
        this.offsetY = 0;
        this.draggedObject = null;
        this.myholder = null;
    }

    connectedCallback() {
        // Initialize canvas elements and contexts
        this.initCanvas('canvasEditor', 'ctxEditor');
        this.initCanvas('canvasTool', 'ctxTool');

        // Setup event listeners
        this.setupListeners();

        // Initial rendering
        this.drawObjectTool();
    }

    initCanvas(canvasId, contextId) {
        const canvas = this.shadowRoot.getElementById(canvasId);
        const context = canvas.getContext('2d');

        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        this[canvasId] = canvas;
        this[contextId] = context;


        var namespace = joint.shapes;
                
        var graph = new joint.dia.Graph({}, { cellNamespace: namespace });

        var myholder = new joint.dia.Paper({
            el: this.myholder,
            model: graph,
            width: 600,
            height: 100,
            gridSize: 1,
            cellViewNamespace: namespace
        });

        var rect = new joint.shapes.standard.Rectangle();
        rect.position(100, 30);
        rect.resize(100, 40);
        rect.attr({
            body: {
                fill: 'blue'
            },
            label: {
                text: 'Hello',
                fill: 'white'
            }
        });
        rect.addTo(graph);

        var rect2 = rect.clone();
        rect2.translate(300, 0);
        rect2.attr('label/text', 'World!');
        rect2.addTo(graph);

        var link = new joint.shapes.standard.Link();
        link.source(rect);
        link.target(rect2);
        link.addTo(graph);

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

        // Draw a instance of a clickt object (in Toolbox) on the editor
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
            this.drawObjectEditor();
        });
    }
}

customElements.define('webgl-editor', WebglEditor);