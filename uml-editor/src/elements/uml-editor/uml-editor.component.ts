import {
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { FormControl } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTooltip } from '@angular/material/tooltip'
import { dia } from '@joint/core'
import { debounceTime, map, scan } from 'rxjs'
import { CustomJointJSElementAttributes } from '../../models/jointjs/custom-jointjs-element.model'
import { EMPTY_DIAGRAM_ENCODED, EMPTY_DIAGRAM_OBJECT, JointJSDiagram } from '../../models/jointjs/jointjs-diagram.model'
import { LinkConfigurationComponent } from '../../shared/link-configuration/link-configuration.component'
import { PropertyEditorService } from '../../shared/property-editor/property-editor.service'
import { UmlEditorToolboxComponent } from '../../shared/uml-editor-toolbox/uml-editor-toolbox.component'
import { initCustomNamespaceGraph, initCustomPaper } from '../../utils/jointjs-drawer.utils'
import { jointJSCustomUmlElements } from '../../utils/jointjs-extension.const'
import { decodeDiagram, encodeDiagram } from '../../utils/uml-editor-compression.utils'

@Component({
  selector: 'app-uml-editor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uml-editor.component.html',
  styleUrl: './uml-editor.component.scss',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, UmlEditorToolboxComponent, MatTooltip],
})
export class UmlEditorComponent implements OnChanges, AfterViewInit {
  @Input({ transform: booleanAttribute }) allowEdit = false
  @Input() inputId: string | null = null
  @Input() diagram: string | null = null

  @ViewChild('editor', { static: true }) protected editorRef!: ElementRef<HTMLDivElement>

  @Output() protected readonly diagramChanged = new EventEmitter<{
    inputId: string
    diagram: string
  }>()

  protected readonly diagramControl = new FormControl<JointJSDiagram>(EMPTY_DIAGRAM_OBJECT, { nonNullable: true })
  protected readonly diagramChanges$ = this.diagramControl.valueChanges.pipe(takeUntilDestroyed(), debounceTime(200))
  protected readonly isDirty = toSignal(this.diagramChanges$.pipe(map(() => this.diagramControl.dirty)), {
    initialValue: false,
  })

  private readonly viewContainerRef = inject(ViewContainerRef)
  private readonly propertyEditorService = inject(PropertyEditorService)
  private readonly snackbar = inject(MatSnackBar)

  private readonly _paperEditor = signal<dia.Paper | null>(null)
  private readonly _history = toSignal(
    this.diagramChanges$.pipe(
      scan((acc, value) => {
        const encoded = encodeDiagram(value)
        if (encoded !== this.diagram || EMPTY_DIAGRAM_ENCODED) {
          acc.add(encodeDiagram(value))
        }
        return acc
      }, new Set<string>())
    ),
    { initialValue: new Set<string>() }
  )

  constructor() {
    // listen to diagram changes and emit value
    this.diagramChanges$.subscribe(this.encodeAndEmitDiagram.bind(this))

    // listen to property editor hide event and unhighlight the cell
    this.propertyEditorService.hidePropertyEditor.pipe(takeUntilDestroyed()).subscribe(propertyEditorComponent => {
      const model = Object.values(propertyEditorComponent?.initProperties || {}).find(
        (value): value is dia.Cell => value instanceof dia.Cell
      )
      if (model) {
        this._paperEditor()?.findViewByModel(model)?.unhighlight()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('diagram' satisfies keyof this) in changes) {
      this.setDiagramToEditor(this.diagram, { emitEvent: false })
    }
  }

  ngAfterViewInit() {
    const graph = initCustomNamespaceGraph()

    const paperEditor = initCustomPaper(this.editorRef.nativeElement, graph)

    graph.on('change', () => {
      this.diagramControl.markAsDirty()
      this.diagramControl.setValue(graph.toJSON())
    })

    graph.on('add', () => {
      this.diagramControl.markAsDirty()
      this.diagramControl.setValue(graph.toJSON())
    })

    graph.on('remove', cell => {
      const containsModel = Object.values(this.propertyEditorService.openPropertyEditor?.initProperties || {}).includes(
        cell
      )
      if (containsModel) {
        this.propertyEditorService.hide()
      }
    })

    paperEditor.on('cell:pointerdown', cellView => {
      // highlight the cell when clicked
      if (cellView instanceof dia.ElementView) {
        const propertyKey = 'propertyView' satisfies keyof CustomJointJSElementAttributes<dia.Element.Attributes>
        if (propertyKey in cellView.model.attributes && cellView.model.attributes[propertyKey]) {
          this.highlightTarget(paperEditor, cellView)
        }
      }
    })

    paperEditor.on('cell:pointerdblclick', cellView => {
      // highlight the cell when clicked
      if (cellView instanceof dia.LinkView) {
        this.highlightTarget(paperEditor, cellView)
      }
    })

    paperEditor.on('cell:unhighlight', () => {
      this.propertyEditorService.hide()
    })

    paperEditor.on('cell:highlight', cellView => {
      // handle generic link from jointjs
      if (cellView instanceof dia.LinkView) {
        this.propertyEditorService.show(this.viewContainerRef, LinkConfigurationComponent, {
          model: cellView.model,
        })
        return
      }

      // handle custom elements
      if (cellView instanceof dia.ElementView) {
        const propertyKey = 'propertyView' satisfies keyof CustomJointJSElementAttributes<dia.Element.Attributes>
        if (propertyKey in cellView.model.attributes && cellView.model.attributes[propertyKey]) {
          this.propertyEditorService.show(this.viewContainerRef, cellView.model.attributes[propertyKey], {
            model: cellView.model,
            elementView: cellView,
          })
        }
      }
    })

    this._paperEditor.set(paperEditor)

    this.setDiagramToEditor(this.diagram, { emitEvent: false })
  }

  protected addItemFromToolboxToEditor(itemType: string) {
    const clickedClass = jointJSCustomUmlElements.find(item => item.defaults.type === itemType)?.instance.clone()
    if (!clickedClass) {
      throw new Error(`itemType ${itemType} not found`)
    }

    const paperEditor = this._paperEditor()
    if (!paperEditor) {
      console.debug('no paper editor found')
      return
    }

    const paperArea = paperEditor.getArea()
    const contentArea = paperEditor.getContentArea()
    clickedClass.position((paperArea.width - contentArea.width) / 2, (paperArea.height - contentArea.height) / 2)

    paperEditor.model.addCell(clickedClass)
  }

  protected resetDiagram() {
    this.setDiagramToEditor(this.diagram || EMPTY_DIAGRAM_ENCODED)
  }

  protected copyDiagramToClipboard(event: ClipboardEvent) {
    event.preventDefault()
    event.stopPropagation()

    const encodedDiagram = encodeDiagram(this.diagramControl.value)
    event.clipboardData?.setData('text/plain', encodedDiagram)

    this.snackbar.open('Diagram copied to clipboard', 'Dismiss', {
      duration: 2000,
    })
  }

  protected pasteDiagramFromClipboard(event: ClipboardEvent) {
    event.preventDefault()
    event.stopPropagation()

    try {
      const clipboardValue = event.clipboardData?.getData('text') || null
      this.setDiagramToEditor(clipboardValue)

      this.snackbar.open('Diagram pasted from clipboard', 'Dismiss', {
        duration: 2000,
      })
    } catch {
      this.snackbar.open('Error while pasting diagram from clipboard', 'Dismiss', {
        duration: 2000,
      })
    }
  }

  protected undo(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.restoreFromHistory(-1)
  }

  protected redo(event: Event) {
    event.preventDefault()
    event.stopPropagation()
    this.restoreFromHistory(1)
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

  private encodeAndEmitDiagram(diagram: JointJSDiagram) {
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

  private restoreFromHistory(cursorMove: number) {
    const paperEditor = this._paperEditor()
    if (!paperEditor) {
      console.debug('no paper editor found')
      return
    }

    const history = Array.from(this._history())
    const currentValue = encodeDiagram(this.diagramControl.value)
    const currentValueIndex = history.findIndex(value => value === currentValue)
    const newStep = currentValueIndex + cursorMove

    if (newStep > history.length - 1 || newStep < -1) {
      console.debug('no possible history step found')
      return
    }

    const initialDiagram = this.diagram || EMPTY_DIAGRAM_ENCODED
    const newValue = history[newStep] || initialDiagram
    const fallbackToInitial = newValue === initialDiagram

    console.debug('restoring diagram from history', newStep)

    const decodedValue = decodeDiagram(newValue)
    paperEditor.model.fromJSON(decodedValue)

    this.diagramControl.setValue(decodedValue)
    if (fallbackToInitial) {
      this.diagramControl.markAsPristine()
    } else {
      this.diagramControl.markAsDirty()
    }
  }

  private highlightTarget(paperEditor: dia.Paper, targetView: dia.CellView | dia.ElementView | dia.LinkView) {
    // un-highlight all other views
    const elements = [...paperEditor.model.getCells(), ...paperEditor.model.getLinks()]
    elements.forEach(loopElement => {
      const loopView = paperEditor.findView(loopElement)
      if (!loopView || loopView === targetView) {
        return
      }

      loopView.unhighlight()
    })

    // highlight the target view
    targetView.highlight()
  }
}
