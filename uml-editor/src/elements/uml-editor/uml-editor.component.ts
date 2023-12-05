import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core'
import { encodeDiagram } from '../../utils/uml-editor-compression.utils'
import { dia, elementTools, linkTools, shapes } from 'jointjs'
import { initPaper, initToolBoxClasses } from '../../utils/jointjs-drawer.utils'
import { UmlClass } from '../../models/jointjs/uml-class.model'

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
    @Input() inputId: string | null = null
    @Input() diagram: string | null = null
    @Input() allowEdit = false

    @ViewChild('editor', {static: true}) editorRef!: ElementRef<HTMLElement>
    @ViewChild('toolBox', {static: true}) toolBoxRef!: ElementRef<HTMLElement>

    @Output() diagramChanged = new EventEmitter<string>()

    ngAfterViewInit() {
        this.setupJointJs()
    }

    private setupJointJs() {
        // Create  instance of  JointJS graph
        const graphEditor = new dia.Graph()
        const graphToolBox = new dia.Graph()

        const paperEditor = initPaper(this.editorRef.nativeElement, graphEditor, true)
        const paperToolbox = initPaper(this.toolBoxRef.nativeElement, graphToolBox, false)

        //const ChildHighlighterView = dia.Highlighter.extend({});

        initToolBoxClasses(graphToolBox)

        /** Events */
        paperToolbox.on('element:pointerup', (cellView, evt, x, y) => {
            const clickedClass = cellView.model.clone()
            let tmpX = Math.floor(Math.random() * (500 - 20 + 1)) + 20
            let tmpY = Math.floor(Math.random() * (500 - 20 + 1)) + 20
            clickedClass.position(tmpX, tmpY)
            graphEditor.addCell(clickedClass)
        })

        // Assuming paper is your JointJS paper

        paperEditor.on('cell:mouseenter', function (cellView) {
            const tools = new dia.ToolsView({
                tools: [
                    new elementTools.Boundary({
                        padding: 3,
                        rotate: true,
                        useModelGeometry: true
                    }),
                    new linkTools.Remove({
                        scale: 1.2,
                        distance: 15
                    })
                ]
            })
            cellView.addTools(tools)
        })

        paperEditor.on('element:pointerdblclick', function (elementView, evt) {

            if(!(elementView.model instanceof UmlClass)) {
                throw new Error('elementView.model is not instanceof UmlClass');
            }
            const class1 = elementView.model;
            const x = class1.userInput(evt);
           if (x != null) {
               graphEditor.addCell(x);
           }


        });

        paperEditor.on('cell:mouseleave', function (cellView) {
            cellView.removeTools()
        })

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
        const encoded = encodeDiagram(diagram)
        this.diagramChanged.emit(encoded)
    }
}
