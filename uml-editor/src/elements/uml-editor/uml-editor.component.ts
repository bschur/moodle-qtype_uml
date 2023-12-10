import { AfterViewInit, Component, effect, ElementRef, EventEmitter, Input, Output, signal, ViewChild, ViewEncapsulation } from '@angular/core'
import { decodeDiagram, encodeDiagram } from '../../utils/uml-editor-compression.utils'
import { dia, elementTools, linkTools } from 'jointjs'
import { initEditorGraph, initPaper, initToolBoxGraph } from '../../utils/jointjs-drawer.utils'
import { UmlClass } from '../../models/jointjs/uml-class.model'
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { NgIf } from '@angular/common'

@Component({
    selector: 'uml-editor',
    standalone: true,
    templateUrl: './uml-editor.component.html',
    styleUrl: './uml-editor.component.scss',
    imports: [
        NgIf
    ],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class UmlEditorComponent implements AfterViewInit {
    @Input() set inputId(value: string | null) {
        this._inputId.set(value)
    }

    @Input() set allowEdit(value: BooleanInput) {
        this._allowEdit = coerceBooleanProperty(value)
    }

    get allowEdit(): boolean {
        return this._allowEdit
    }

    @Input() set diagram(value: string | null) {
        this._inputDiagram.set(value)
    }

    @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>
    @ViewChild('toolbox') toolBoxRef?: ElementRef<HTMLDivElement>

    @Output() readonly diagramChanged = new EventEmitter<{ inputId: string, diagram: string }>()

    private readonly _inputId = signal<string | null>(null)
    private readonly _inputDiagram = signal<string | null>(null)
    private readonly _diagram = signal<any>(null)

    private readonly graphEditor = initEditorGraph()
    private readonly graphToolBox = initToolBoxGraph()
    private readonly _jointJsPapers = signal<{ paperEditor: dia.Paper, paperToolbox: dia.Paper | null } | null>(null)

    private _allowEdit = false

    constructor() {
        // listen to diagram input and draw it on editor
        effect(() => {
            const inputDiagram = this._inputDiagram()
            if (!inputDiagram) {
                return
            }

            const decoded = decodeDiagram(inputDiagram)
            this.graphEditor.fromJSON(decoded)
        })

        // listen to diagram changes and emit value
        effect(() => {
            const diagram = this._diagram()
            const inputId = this._inputId()
            if (!inputId || !diagram) {
                console.warn('inputId or diagram not set')
                return
            }

            const encodedDiagram = encodeDiagram(diagram)
            if (encodedDiagram === this._inputDiagram()) {
                console.warn('diagram not changed')
                return
            }

            this.diagramChanged.emit({
                inputId,
                diagram
            })
        })
    }

    ngAfterViewInit() {
        const paperEditor = initPaper(this.editorRef.nativeElement, this.graphEditor, true)

        let paperToolbox: dia.Paper | null = null
        if (this.toolBoxRef) {
            paperToolbox = initPaper(this.toolBoxRef.nativeElement, this.graphToolBox, false)
        }

        this.subscribeToEvents(paperEditor, paperToolbox, this.graphEditor)

        this._jointJsPapers.set({
            paperEditor,
            paperToolbox
        })
    }

    private subscribeToEvents(paperEditor: dia.Paper, paperToolbox: dia.Paper | null, graphEditor: dia.Graph) {
        graphEditor.on('change', () => this._diagram.set(graphEditor.toJSON()))

        /** Events */
        paperToolbox?.on('element:pointerup', (cellView, evt, x, y) => {
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
            if (!(elementView.model instanceof UmlClass)) {
                throw new Error('elementView.model is not instanceof UmlClass')
            }
            const class1 = elementView.model
            const x = class1.userInput(evt)
            if (x != null) {
                graphEditor.addCell(x)
            }
        })

        paperEditor.on('cell:mouseleave', function (cellView) {
            cellView.removeTools()
        })
    }
}
