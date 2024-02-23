import { coerceBooleanProperty } from '@angular/cdk/coercion'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { dia, elementTools, linkTools } from 'jointjs'
import { debounceTime, map } from 'rxjs'
import { JointJSDiagram } from '../../models/jointjs/jointjs-diagram.model'
import { TextBlock } from '../../models/jointjs/text-block.model'
import { UmlClass } from '../../models/jointjs/uml-class.model'
import { initCustomNamespaceGraph, initCustomPaper, jointJsCustomUmlElements } from '../../utils/jointjs-drawer.utils'
import { decodeDiagram, encodeDiagram } from '../../utils/uml-editor-compression.utils'
import ElementView = dia.ElementView

@Component({
  selector: 'app-uml-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uml-editor.component.html',
  styleUrl: './uml-editor.component.scss',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UmlEditorComponent implements OnChanges, AfterViewInit {
  readonly diagramControl = new FormControl<JointJSDiagram>({ cells: [] }, { nonNullable: true })
  readonly isDirty = toSignal(this.diagramControl.valueChanges.pipe(map(() => this.diagramControl.dirty)))

  @Input({ transform: coerceBooleanProperty }) allowEdit = false
  @Input({ required: true }) inputId: string | null = null
  @Input({ required: true }) diagram: string | null = null

  @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>
  @ViewChild('toolbox', { static: true }) toolboxRef!: ElementRef<HTMLDivElement>

  @Output() readonly diagramChanged = new EventEmitter<{
    inputId: string
    diagram: string
  }>()

  private readonly destroyRef = inject(DestroyRef)
  private readonly _paperEditor = signal<dia.Paper | null>(null)

  constructor() {
    // listen to diagram changes and emit value
    this.diagramControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe(this.encodeAndEmitDiagram)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('diagram' satisfies keyof this) in changes) {
      this.setDiagramToEditor(this.diagram, { emitEvent: false })
    }
  }

  ngAfterViewInit() {
    const paperEditor = initCustomPaper(this.editorRef.nativeElement, initCustomNamespaceGraph(), true)

    this.subscribeToEvents(paperEditor)

    this._paperEditor.set(paperEditor)

    this.setDiagramToEditor(this.diagram, { emitEvent: false })

    this.toolboxRef.nativeElement.addEventListener('itemSelected', <EventListenerOrEventListenerObject>(
      ((event: CustomEvent) => this.addItemFromToolboxToEditor(event.detail))
    ))
  }

  addItemFromToolboxToEditor(itemType: string) {
    const clickedClass = jointJsCustomUmlElements.find(item => item.defaults.type === itemType)?.instance.clone()
    if (!clickedClass) {
      throw new Error(`itemType ${itemType} not found`)
    }

    const tmpX = Math.floor(Math.random() * (500 - 20 + 1)) + 20
    const tmpY = Math.floor(Math.random() * (500 - 20 + 1)) + 20
    clickedClass.position(tmpX, tmpY)

    this._paperEditor()?.model.addCell(clickedClass)
  }

  resetDiagram() {
    this.setDiagramToEditor(this.diagram)
  }

  private subscribeToEvents(paperEditor: dia.Paper) {
    paperEditor.model.on('change', () => {
      this.diagramControl.setValue(paperEditor.model.toJSON())
      this.diagramControl.markAsDirty()
    })

    // Assuming paper is your JointJS paper

    paperEditor.on('cell:mouseenter', cellView => {
      const resizeTool = elementTools.Control.extend({
        getPosition: (view: ElementView) => {
          const model = view.model
          const { width, height } = model.size()
          return { x: width, y: height }
        },
        setPosition: (view: ElementView, coordinates: { x: number; y: number }) => {
          const model = view.model
          if (model instanceof UmlClass) {
            model.resizeOnPaper(coordinates)
          }
        },
      })

      const tools = new dia.ToolsView({
        tools: [
          new elementTools.Boundary({
            padding: 3,
            rotate: true,
            useModelGeometry: true,
          }),
          new linkTools.Remove({
            scale: 1.2,
            distance: 15,
            action: (_, elementView, toolView) => {
              const target = elementView.model
              const parent = elementView.model.getParentCell()
              if (parent instanceof UmlClass && target instanceof TextBlock) {
                const ref = elementView.model.attr('ref')
                const posY = elementView.model.position().y
                parent.adjustByDelete(ref, posY)
              }
              target.remove({ ui: true, tool: toolView.cid })
            },
          }),
          new resizeTool({
            handleAttributes: {
              fill: '#4666E5',
            },
          }),
        ],
      })
      cellView.addTools(tools)
    })

    paperEditor.on('cell:mouseleave', cellView => {
      cellView.removeTools()
    })

    paperEditor.on('element:pointerdblclick', (elementView, evt) => {
      const target = elementView.model
      if (target instanceof UmlClass) {
        const textBlock = target.userInput(evt)
        if (textBlock) {
          paperEditor.model.addCell(textBlock)
        }
      } else if (elementView.model instanceof TextBlock) {
        /*const customTextBlock = elementView.model
                const cell = elementView.model

                // customTextBlock.createVariableComponent();
                const element = elementView.el*/
      } else {
        throw new Error('elementView.model is not instanceof UmlClass')
      }
    })

    paperEditor.on('element:pointerclick', elementView => {
      const target = elementView.model
      if (target instanceof UmlClass) {
        target.handleLink(paperEditor.model)
      }
    })
  }

  private readonly setDiagramToEditor = (
    diagramValue: string | null,
    options?: {
      onlySelf?: boolean
      emitEvent?: boolean
    }
  ) => {
    const paperEditor = this._paperEditor()
    if (!diagramValue || !paperEditor) {
      return
    }

    const decoded = decodeDiagram(diagramValue)
    try {
      paperEditor.model.fromJSON(decoded)
      this.diagramControl.reset(decoded, options)
    } catch (err) {
      console.error('error while decoding diagram', err, diagramValue)
      paperEditor.model.clear()
    }
  }

  private readonly encodeAndEmitDiagram = (diagram: JointJSDiagram) => {
    // the value was changed
    const inputId = this.inputId
    if (!inputId || !diagram) {
      console.warn('inputId or diagram not set')
      return
    }

    const encodedDiagram = encodeDiagram(diagram)
    console.debug('diagram changed', inputId, encodedDiagram)

    this.diagramChanged.emit({
      inputId,
      diagram: encodedDiagram,
    })
  }
}
