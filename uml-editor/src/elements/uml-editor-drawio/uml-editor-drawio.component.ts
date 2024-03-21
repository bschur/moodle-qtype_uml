import { coerceBooleanProperty } from '@angular/cdk/coercion'
import { DOCUMENT } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import { GraphEditor, GraphInitConfig, GraphXmlData, OptIn, OptOut } from 'draw.io-angular-new'
import { encodeDiagram } from '../../utils/uml-editor-compression.utils'

export const graphEditorLibraryImportFinishEvent: OptOut = graphData => {
  console.debug('graphEditorLibraryImportFinishEvent', graphData)
  return Promise.resolve({
    status: 'Import App Library Implementation required',
    graphData: { xml: graphData?.xml || '', name: graphData?.name || '' },
  })
}

export const graphEditorLibraryImportEvent: OptIn = () => {
  console.debug('graphEditorLibraryImportEvent')
  return Promise.resolve({
    status: 'Import App Library Implementation required',
  })
}

export const graphEditorActionsErrorEvent: OptOut = graphData => {
  console.debug('graphEditorActionsErrorEvent', graphData)
  return Promise.resolve({
    status: 'Export App Library Implementation required',
    graphData: { xml: graphData?.xml || '', name: graphData?.name || '' },
  })
}

export const graphEditorLibraryExportEvent: OptOut = graphData => {
  console.debug('graphEditorLibraryExportEvent', graphData)
  return Promise.resolve({
    status: 'TS Export App Library Implementation required',
    graphData: { xml: graphData?.xml || '', name: graphData?.name || '' },
  })
}

export const saveDiagram: OptOut = graphData => {
  console.debug('saveDiagram', graphData)
  return Promise.resolve({
    status: 'Data Saved',
    graphData: { xml: graphData?.xml || '', name: graphData?.name || '' },
  })
}

export const graphXML =
  '<mxGraphModel dx="1038" dy="381" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1"><root></root></mxGraphModel>'

export const graphInitConfig: GraphInitConfig = {
  actionsButtons: {},
  extraActions: {},
  actions: {},
}

const injectOverrideGetComputedStyle = () => {
  const window = inject(DOCUMENT).defaultView!
  const targetElement = inject(ElementRef).nativeElement

  const shadowRoot = targetElement.shadowRoot!

  const oldGetComputedStyle = window.getComputedStyle.bind(window)
  window.getComputedStyle = (elt, pseudoElt) => {
    if (elt === shadowRoot) {
      return oldGetComputedStyle(targetElement, pseudoElt)
    }

    return oldGetComputedStyle(elt, pseudoElt)
  }
}

@Component({
  standalone: true,
  imports: [],
  templateUrl: './uml-editor-drawio.component.html',
  styleUrl: './uml-editor-drawio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UmlEditorDrawioComponent implements AfterViewInit {
  @Input({ transform: coerceBooleanProperty }) allowEdit = false
  @Input({ required: true }) inputId: string | null = null
  @Input({ required: true }) diagram: string | null = null

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLElement>
  @ViewChild('mxgraphScriptsContainer', { static: true }) mxgraphScriptsContainer!: ElementRef<HTMLElement>

  @Output() readonly diagramChanged = new EventEmitter<{
    inputId: string
    diagram: string
  }>()

  private readonly graphEditor = new GraphEditor()

  constructor() {
    injectOverrideGetComputedStyle()
  }

  async ngAfterViewInit() {
    try {
      await this.graphEditor.initialized(this.container.nativeElement, this.mxgraphScriptsContainer.nativeElement, {
        ...graphInitConfig,
        actions: {
          subMenu: {
            save: this.save,
          },
        },
      })

      await this.graphEditor.setGrapheditorData({ name: 'UML Editor Diagram', xml: graphXML })
    } catch (e) {
      console.error('Error initializing graph editor', e)
    }
  }

  private readonly save: OptOut = xml => {
    const newValue = encodeDiagram(xml)
    console.debug('save diagram', this.graphEditor.editorUiObj)

    this.diagramChanged.emit({
      inputId: this.inputId!,
      diagram: newValue,
    })

    return Promise.resolve({
      status: 'Data Saved',
      graphData: xml as GraphXmlData,
    })
  }
}
