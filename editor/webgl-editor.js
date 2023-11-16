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

    #editor {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }
</style>

<div class="left">
    <div id="toolBox"></div>
</div>
<div class="right">
    <div id="editor"></div>
</div>
`;

class WebglEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Create the template for the shadow DOM
        this.shadowRoot.innerHTML = templateCode;

        // Initialize properties
        this.objects = [];
        this.myholder = null;

        // Create the JointJS diagram
        const editorDiv = this.shadowRoot.querySelector('#editor');
        const toolBoxDiv = this.shadowRoot.querySelector('#toolBox');

        // Create an instance of JointJS graph for the editor and toolbox
        const graphEditor = new joint.dia.Graph();
        const graphToolBox = new joint.dia.Graph();

        // Create a paper where the diagram will be rendered for the editor and toolbox
        const paperEditor = new joint.dia.Paper({
            el: editorDiv,
            model: graphEditor,
            width: '100%',
            height: '100%',
            gridSize: 10,
            drawGrid: true,
            background: {
                color: 'rgba(0, 255, 255, 0.3)'
            }
        });

        const paperToolbox = new joint.dia.Paper({
            el: toolBoxDiv,
            model: graphToolBox,
            width: '100%',
            height: '100%',
            gridSize: 10,
            drawGrid: true,
            interactive: false 
        });

        // Define class shapes
        const rectWidth = 100;
        const rectHeight = 60;

        const Class = joint.shapes.standard.Rectangle.define('examples.Class', {
            size: { width: rectWidth, height: rectHeight },
            attrs: {
                body: {
                    fill: '#2ECC71',
                    rx: 5,
                    ry: 5,
                    strokeWidth: 2,
                    stroke: 'black'
                },
                label: {
                    text: 'ClassName',
                    fill: 'black',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, helvetica, sans-serif'
                }
            }
        });

        // Create classes for the toolbox
        const class1 = new Class({
            position: { x: 50, y: 50 },
            attrs: {
                label: { text: 'ClassA' }
            },
            draggable: false
        });

        const class2 = new Class({
            position: { x: 50, y: 150 },
            attrs: {
                label: { text: 'ClassB' }
            }
        });

        // Add classes to the toolbox graph
        graphToolBox.addCell(class1);
        graphToolBox.addCell(class2);

        paperToolbox.on('element:pointerup', (cellView, evt, x, y) => {
            const clickedClass = cellView.model.clone();
            clickedClass.position(x, y);
            graphEditor.addCell(clickedClass);
        });

    }
}

customElements.define('webgl-editor', WebglEditor);
