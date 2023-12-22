import { coerceBooleanProperty } from '@angular/cdk/coercion'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { dia, elementTools, linkTools } from 'jointjs'
import { debounceTime, map } from 'rxjs'
import { CustomTextBlock } from '../../models/jointjs/custom-text-block.model'
import { UmlClass } from '../../models/jointjs/uml-class.model'
import { initCustomNamespaceGraph, initCustomPaper, jointJsCustomUmlItems } from '../../utils/jointjs-drawer.utils'
import { decodeDiagram, encodeDiagram } from '../../utils/uml-editor-compression.utils'

@Component({
  selector: 'app-uml-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uml-editor.component.html',
  styleUrl: './uml-editor.component.scss',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UmlEditorComponent implements AfterViewInit {
  readonly diagramControl = new FormControl<{ cells: dia.Cell[] }>({ cells: [] }, { nonNullable: true })
  readonly isDirty = toSignal(this.diagramControl.valueChanges.pipe(map(() => this.diagramControl.dirty)))
  @Input({ transform: coerceBooleanProperty }) allowEdit = false
  @ViewChild('editor', { static: true }) editorRef!: ElementRef<HTMLDivElement>
  @ViewChild('toolbox', { static: true })
  toolboxRef!: ElementRef<HTMLDivElement>
  @Output() readonly diagramChanged = new EventEmitter<{
    inputId: string
    diagram: string
  }>()
  private readonly destroyRef = inject(DestroyRef)
  private readonly _inputId = signal<string | null>(null)
  private readonly _inputDiagram = signal<string | null>(null)
  private readonly _paperEditor = signal<dia.Paper | null>(null)

  constructor() {
    // listen to diagram input and draw it on editor
    effect(() => {
      const diagram = this._inputDiagram()
      this.setDiagramToEditor(diagram, { emitEvent: false })
    })

    // listen to diagram changes and emit value
    this.diagramControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(200))
      .subscribe(this.encodeAndEmitDiagram)
  }

  @Input() set inputId(value: string | null) {
    this._inputId.set(value)
  }

  @Input() set diagram(value: string | null) {
    this._inputDiagram.set(value)
  }

  ngAfterViewInit() {
    const paperEditor = initCustomPaper(this.editorRef.nativeElement, initCustomNamespaceGraph(), true)

    this.subscribeToEvents(paperEditor)

    this._paperEditor.set(paperEditor)

    this.toolboxRef.nativeElement.addEventListener('itemSelected', <EventListenerOrEventListenerObject>(
      ((event: CustomEvent) => this.addItemFromToolboxToEditor(event.detail))
    ))
  }

  addItemFromToolboxToEditor(itemType: string) {
    const clickedClass = jointJsCustomUmlItems.find(item => item.defaults.type === itemType)?.instance.clone()
    if (!clickedClass) {
      throw new Error(`itemType ${itemType} not found`)
    }

    const tmpX = Math.floor(Math.random() * (500 - 20 + 1)) + 20
    const tmpY = Math.floor(Math.random() * (500 - 20 + 1)) + 20
    clickedClass.position(tmpX, tmpY)

    this._paperEditor()?.model.addCell(clickedClass)
  }

  resetDiagram() {
    const resetValue = this._inputDiagram()
    this.setDiagramToEditor(resetValue)
  }

  private subscribeToEvents(paperEditor: dia.Paper) {
    paperEditor.model.on('change', () => {
      this.diagramControl.setValue(paperEditor.model.toJSON())
      this.diagramControl.markAsDirty()
    })

    // Assuming paper is your JointJS paper

    paperEditor.on('cell:mouseenter', function (cellView) {
      const ResizeTool = elementTools.Control.extend({
        getPosition: function (view: any) {
          const model = view.model
          const { width, height } = model.size()
          return { x: width, y: height }
        },
        setPosition: function (view: any, coordinates: any) {
          const model = view.model
          if (model instanceof UmlClass) {
            model.resizeOnPaper(view, coordinates)
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
            action: function (evt, elementView, toolView) {
              const parent = elementView.model.getParentCell()
              if (elementView.model instanceof CustomTextBlock && parent) {
                let ref = elementView.model.attr('ref')
                let posY = elementView.model.position().y
                console.log(parent)
                // @ts-ignore
                parent.adjustByDelete(ref, posY)
              }
              elementView.model.remove({ ui: true, tool: toolView.cid })
            },
          }),
          new ResizeTool({
            handleAttributes: {
              fill: '#4666E5',
            },
          }),
        ],
      })
      cellView.addTools(tools)
    })

    paperEditor.on('element:pointerdblclick', function (elementView, evt) {
      if (elementView.model instanceof UmlClass) {
        const class1 = elementView.model
        const x = class1.userInput(evt, paperEditor)
        if (x != null) {
          paperEditor.model.addCell(x)
        }
      } else if (elementView.model instanceof CustomTextBlock) {
        /*const customTextBlock = elementView.model
                const cell = elementView.model

                // customTextBlock.createVariableComponent();
                const element = elementView.el*/
      } else {
        throw new Error('elementView.model is not instanceof UmlClass')
      }
    })

    paperEditor.on('cell:mouseleave', function (cellView) {
      cellView.removeTools()
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

  private readonly encodeAndEmitDiagram = (diagram: { cells: dia.Cell[] }) => {
    // the value was changed
    const inputId = this._inputId()
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
