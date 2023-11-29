import UMLActor from './Elements/UMLActor.js';
import UMLClass from './Elements/UMLClass.js';

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

            // Create the JointJS diagram
            const editorDiv = this.shadowRoot.querySelector('#editor');
            const toolBoxDiv = this.shadowRoot.querySelector('#toolBox');

            // Create  instance of  JointJS graph
            const graphEditor = new joint.dia.Graph();
            const graphToolBox = new joint.dia.Graph();

            const paperEditor = initPaper(editorDiv, graphEditor, true);
            const paperToolbox = initPaper(toolBoxDiv, graphToolBox, false);

            //const ChildHighlighterView = joint.dia.Highlighter.extend({});

            initToolBoxClasses();


                /** Events */
            paperToolbox.on('element:pointerup', (cellView, evt, x, y) => {
                const clickedClass = cellView.model.clone();
                let tmpX = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
                let tmpY = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
                clickedClass.position(tmpX, tmpY);
                graphEditor.addCell(clickedClass);
            });

                // Assuming paper is your JointJS paper

                paperEditor.on('cell:mouseenter', function (cellView) {
                    const tools = new joint.dia.ToolsView({
                        tools: [
                            new joint.elementTools.Boundary({
                                padding: 3,
                                rotate: true,
                                useModelGeometry: true,
                            }),
                            new joint.linkTools.Remove({
                                scale: 1.2,
                                distance: 15
                            })
                        ]
                    });
                    cellView.addTools(tools);
                });






                paperEditor.on('element:pointerdblclick', function(elementView, evt) {
                    const target = elementView.model;
                    const eventType = elementView.el.querySelector('rect').getAttribute('selector');
                    console.log(eventType);
                });

                paperEditor.on('cell:mouseleave', function(cellView) {
                    cellView.removeTools();
                });

                /*paperEditor.on('cell:pointerup', (cellView, evt, x, y) => {

                if (this.from) {
                    // If 'from' is set (meaning a previous element was selected), create a link
                    const link = new joint.shapes.standard.Link({
                        source: { id: this.from.id },
                        target: { id: cellView.model.id },
                        attrs: {
                            // Define link styles here if needed
                        }
                    });
                    graphEditor.addCell(link);
                    this.from = null; // Reset 'from' to enable selecting a new 'from' element
                } else {
                    // Set the 'from' element upon the first click
                    this.from = cellView.model;

                }
            });*/

            function initToolBoxClasses () {
                const customActor = new UMLActor();
              const class1 = new UMLClass();
                customActor.position(20, 120);
                class1.position(20, 20);

              graphToolBox.addCell(customActor);
                graphToolBox.addCell(class1);

            }


        function initPaper(el, model, isInteractive) {
            return new joint.dia.Paper({
                el: el,
                model: model,
                width: '100%',
                height: '100%',
                gridSize: 10,
                drawGrid: true,
                interactive: isInteractive
            });
        }


    }}

    customElements.define('webgl-editor', WebglEditor);
