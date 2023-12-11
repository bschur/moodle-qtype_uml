import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild, ViewEncapsulation } from '@angular/core'
import { decodeDiagram, encodeDiagram } from '../../utils/uml-editor-compression.utils'
import { dia, elementTools, highlighters, linkTools } from 'jointjs'
import { initPaper, initToolBoxClasses } from '../../utils/jointjs-drawer.utils'
import { UmlClass } from '../../models/jointjs/uml-class.model'
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion'
import { toObservable } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { CustomTextBlock } from '../../models/jointjs/custom-TextBlock'

@Component({
    selector: 'uml-editor',
    standalone: true,
    templateUrl: './uml-editor.component.html',
    styleUrl: './uml-editor.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom
})
export class UmlEditorComponent implements AfterViewInit, AfterViewChecked {
    @Input() inputId: string | null = null
    @Input() diagram: string | null = null

    @Input() set allowEdit(value: BooleanInput) {
        this._allowEdit = coerceBooleanProperty(value)
    }

    get allowEdit(): boolean {
        return this._allowEdit
    }

    @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>
    @ViewChild('toolbox', { static: true }) toolBoxRef!: ElementRef<HTMLDivElement>

    @Output() readonly diagramChanged = new EventEmitter<{ inputid: string, diagram: string }>()

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
        this.paperEditor = initPaper(this.editorRef.nativeElement, this.graphEditor, true)
        if (this.allowEdit) {
            this.paperToolbox = initPaper(this.toolBoxRef.nativeElement, this.graphToolBox, false)
        } else {
            this.toolBoxRef.nativeElement.style.display = 'none'
        }

        initToolBoxClasses(this.graphToolBox)

        this.subscribeToEvents(this.paperEditor, this.paperToolbox, this.graphEditor)
    }

    ngAfterViewChecked() {
        // load existing diagram if present
        if (this.diagram) {
            const decoded = decodeDiagram(this.diagram)
            this.graphEditor.fromJSON(decoded)
        }
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
            if (elementView.model instanceof UmlClass) {
                const class1 = elementView.model
                const x = class1.userInput(evt, paperEditor)
                if (x != null) {
                    graphEditor.addCell(x)
                }
            }
            else if (elementView.model instanceof CustomTextBlock) {
                //const customTextBlock = elementView.model;
                const cell = elementView.model;
                const textarea = document.createElement('textarea');
                textarea.style.position = 'absolute';
                textarea.style.width ='200px';
                textarea.style.height = '100px';
                textarea.style.left = '50%';
                // @ts-ignore
                textarea.style.top = `${paperEditor.options.height / 2}px`;
                textarea.style.transform = 'translate(-50%, -50%)';
                textarea.style.padding = '5px';
                textarea.style.resize = 'none';
                textarea.style.boxShadow = '10px 10px 5px rgba(0, 0, 0, 0.5)';
                //textarea.value = cell.prop(textPath) || '';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.setSelectionRange(0, textarea.value.length);

                //elementView.model.paper.el.style.filter = 'blur(0.5px) grayscale(1)';
                //elementView.model.paper.el.style.pointerEvents = 'none';

                const highlighter = highlighters.mask.add(elementView, 'root', 'selection', {
                    layer: dia.Paper.Layers.FRONT,
                    deep: true
                });



               // console.log(customTextBlock)
               // const x = customTextBlock.createVariableComponent();
            } else {
                throw new Error('elementView.model is not instanceof UmlClass')
            }

        })

        paperEditor.on('cell:mouseleave', function (cellView) {
            cellView.removeTools()
        })
    }

    private emitDiagramChanged() {
        if (!this.inputId) {
            console.warn('inputid is not set')
            return
        }

        const diagramJson = this.graphEditor.toJSON()
        const encoded = encodeDiagram(diagramJson)

        if (encoded === this.diagram) {
            console.warn('diagram not changed')
            return
        }

        this.diagramChanged.emit({
            inputid: this.inputId,
            diagram: encoded
        })
    }
}
