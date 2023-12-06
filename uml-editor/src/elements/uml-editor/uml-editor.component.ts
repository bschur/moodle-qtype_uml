import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild, ViewEncapsulation } from '@angular/core'
import { decodeDiagram, encodeDiagram } from '../../utils/uml-editor-compression.utils'
import { dia, elementTools, linkTools } from 'jointjs'
import { initPaper, initToolBoxClasses } from '../../utils/jointjs-drawer.utils'
import { UmlClass } from '../../models/jointjs/uml-class.model'
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { toObservable } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
    selector: 'uml-editor',
    standalone: true,
    templateUrl: './uml-editor.component.html',
    styleUrl: './uml-editor.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class UmlEditorComponent implements AfterViewInit {
    @Input() inputid: string | null = null
    @Input() diagram: string | null = null

    @Input() set allowedit(value: BooleanInput) {
        this._allowEdit = coerceBooleanProperty(value)
    }

    get allowedit(): boolean {
        return this._allowEdit
    }

    @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>
    @ViewChild('toolbox', { static: true }) toolBoxRef!: ElementRef<HTMLDivElement>

    @Output() readonly diagramchanged = new EventEmitter<{ inputid: string, diagram: string }>()

    private readonly currentDiagram = signal<any>(null)
    private readonly graphEditor = new dia.Graph()
    private readonly graphToolBox = new dia.Graph()

    private paperEditor: dia.Paper | null = null
    private paperToolbox: dia.Paper | null = null

    private _allowEdit = false

    constructor() {
        // listen for changes and emit diagram-changed event
        toObservable(this.currentDiagram)
            .pipe(
                distinctUntilChanged(),
                debounceTime(200),
                distinctUntilChanged()
            ).subscribe(this.emitDiagramChanged.bind(this))
    }

    ngAfterViewInit() {
        this.setupJointJs()
    }

    private setupJointJs() {
        this.paperEditor = initPaper(this.editorRef.nativeElement, this.graphEditor, true)
        if (this.allowedit) {
            this.paperToolbox = initPaper(this.toolBoxRef.nativeElement, this.graphToolBox, false)
        } else {
            this.toolBoxRef.nativeElement.style.display = 'none'
        }

        initToolBoxClasses(this.graphToolBox)

        // load existing diagram if present
        if (this.diagram) {
            const decoded = decodeDiagram(this.diagram)
            this.graphEditor.fromJSON(decoded)
        }

        this.subscribeToEvents(this.paperEditor, this.paperToolbox, this.graphEditor)
    }

    private subscribeToEvents(paperEditor: dia.Paper, paperToolbox: dia.Paper | null, graphEditor: dia.Graph) {
        graphEditor.on('change', () => this.currentDiagram.set(graphEditor.toJSON()))

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

    private emitDiagramChanged() {
        if (!this.inputid) {
            console.warn('inputid is not set')
            return
        }

        const diagramJson = this.graphEditor.toJSON()
        const encoded = encodeDiagram(diagramJson)

        if (encoded === this.diagram) {
            console.debug('diagram not changed')
            return
        }

        console.debug('diagram changed', encoded)
        this.diagramchanged.emit({
            inputid: this.inputid,
            diagram: encoded
        })
    }
}
