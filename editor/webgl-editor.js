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

    #diagram {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
    }
</style>

<div class="left">
    <!-- Your left section content -->
</div>
<div class="right">
    <div id="diagram"></div>
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
        const diagramDiv = this.shadowRoot.querySelector('#diagram');

        // Create an instance of JointJS graph
        const graph = new joint.dia.Graph;

        // Create a paper where the diagram will be rendered
        const paper = new joint.dia.Paper({
            el: diagramDiv,
            model: graph,
            width: '100%',
            height: '100%',
            gridSize: 10,
            drawGrid: true,
            background: {
                color: 'rgba(0, 255, 0, 0.3)'
            }
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

        // Create classes
        const class1 = new Class({
            position: { x: 50, y: 50 },
            attrs: {
                label: { text: 'ClassA' }
            }
        });

        const class2 = new Class({
            position: { x: 300, y: 50 },
            attrs: {
                label: { text: 'ClassB' }
            }
        });

        // Add classes to the graph
        graph.addCell(class1);
        graph.addCell(class2);

        // Create an arrow
        const link = new joint.shapes.standard.Link();
        link.source(class1);
        link.target(class2);
        graph.addCell(link);
    }
}

customElements.define('webgl-editor', WebglEditor);
