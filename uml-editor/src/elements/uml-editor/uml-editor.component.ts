import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {encodeDiagram} from "../../utils/uml-editor-compression.utils";
import {dia, elementTools, linkTools, shapes} from "jointjs";
import {initPaper, initToolBoxClasses} from "../../utils/jointjs-drawer.utils";
import {UmlClass} from "../../models/jointjs/uml-class.model";

@Component({
    selector: 'uml-editor',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
    templateUrl: './uml-editor.component.html',
    styleUrl: './uml-editor.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class UmlEditorComponent implements AfterViewInit {
    @Input() inputId: string | null = null;
    @Input() diagram: string | null = null;
    @Input() allowEdit = false;

    @Output() diagramChanged = new EventEmitter<string>();

    @ViewChild('editor', {static: true}) editorRef!: ElementRef<HTMLElement>;
    @ViewChild('toolBox', {static: true}) toolBoxRef!: ElementRef<HTMLElement>;

    ngAfterViewInit() {
        this.setupJointJs();
    }

    private setupJointJs() {
        // Create  instance of  JointJS graph
        const graphEditor = new dia.Graph();
        const graphToolBox = new dia.Graph();

        const paperEditor = initPaper(this.editorRef.nativeElement, graphEditor, true);
        const paperToolbox = initPaper(this.toolBoxRef.nativeElement, graphToolBox, false);

        //const ChildHighlighterView = dia.Highlighter.extend({});

        initToolBoxClasses(graphToolBox);

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
            const tools = new dia.ToolsView({
                tools: [
                    new elementTools.Boundary({
                        padding: 3,
                        rotate: true,
                        useModelGeometry: true,
                    }),
                    new linkTools.Remove({
                        scale: 1.2,
                        distance: 15
                    })
                ]
            });
            cellView.addTools(tools);
        });

        paperEditor.on('element:pointerdblclick', function (elementView, evt) {
            const header = 'headerText';
            const variablesRect = 'variablesRect';
            const functionsRect = 'functionsRect';
            const selectedRect = evt.target.attributes[0].value;
            switch (selectedRect) {
                case header:
                    console.log('Header section double-clicked');
                    break;
                case variablesRect:

                    const variables = ['test'];
                    let rectWidth = 150; // Width of the class
                    let rectHeight = 100; // Height of the class
                    let headerHeight = 20; // Height of the header section
                    let sectionHeight = (rectHeight - headerHeight) / 2; // Height of each section

                    if(!(elementView.model instanceof UmlClass)) {
                        throw new Error('elementView.model is not instanceof UmlClass');
                    }

                    elementView.model.updateView();

                    // Render variables
                    let variableYCounter = 0;
                    const position = elementView.model.position();

                    // Create and position components for each variable entry
                    let variableComponent = new shapes.standard.TextBlock({
                        position: {x: position.x, y: position.y + headerHeight + elementView.model.getcounterVariables()},
                        size: {width: rectWidth, height: 20},
                        text: 'Sample Text', // Text content for the block
                        fill: 'black', // Color of the text
                        fontSize: 10, // Font size of the text
                        fontFamily: 'Arial, helvetica, sans-serif', // Font family
                        'ref-y': headerHeight, // Vertical position within the section
                        'ref-x': 0,
                        ref: 'variablesRect', // Reference to the parent rectangle (change this as needed)
                        'text-anchor': 'middle', // Text alignment
                        'pointer-events': 'none' // To avoid the text block from intercepting events
                    });
                    var currentAttributes = elementView.model.attr();
                    currentAttributes.body2 = variableComponent;
                    elementView.model.embed(variableComponent);

                    // console.log(elementView.model);
                    //elementView.model.embed(r2)
                    graphEditor.addCell(variableComponent);
                    variableYCounter += 20; // Adjust as needed for spacing
                    elementView.model.counterVariablesUp();
                    break;
                case functionsRect:
                    console.log('Functions section double-clicked');
                    break;
                default:
                    console.log('Clicked outside the sections');
                    break;
            }
        });

        paperEditor.on('cell:mouseleave', function (cellView) {
            cellView.removeTools();
        });

        /*paperEditor.on('cell:pointerup', (cellView, evt, x, y) => {
            if (this.from) {
                // If 'from' is set (meaning a previous element was selected), create a link
                const link = new shapes.standard.Link({
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
    }

    private emitDiagramChanged() {
        // TODO read diagram and decode
        const diagram = [{name: 'test'}]
        const encoded = encodeDiagram(diagram);
        this.diagramChanged.emit(encoded)
    }
}
