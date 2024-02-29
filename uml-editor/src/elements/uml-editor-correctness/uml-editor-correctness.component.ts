import { JsonPipe } from '@angular/common'
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  effect,
  signal,
} from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { EMPTY_DIAGRAM } from '../../models/jointjs/jointjs-diagram.model'
import { JustDiff, evaluationCorrection } from '../../utils/correction.utils'
import { decodeDiagram } from '../../utils/uml-editor-compression.utils'

@Component({
  selector: 'app-uml-editor-correctness',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uml-editor-correctness.component.html',
  styleUrl: './uml-editor-correctness.component.scss',
  imports: [MatListModule, JsonPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UmlEditorCorrectnessComponent implements OnChanges {
  @Input({ required: true }) inputId!: string
  @Input({ required: true }) diagram!: string
  @Input({ required: true }) correctAnswer!: string

  @Output() readonly correctionChanged = new EventEmitter<{ inputId: string; correction: string }>()

  private readonly differences = signal<JustDiff[]>([])
  private readonly domReady = signal(false)

  constructor() {
    addEventListener('load', () => this.domReady.set(true))

    effect(() => {
      const domReady = this.domReady()
      if (!domReady) {
        return
      }

      const differences = this.differences()
      console.log('correction changed', this.inputId, differences)
      this.correctionChanged.emit({
        inputId: this.inputId,
        correction: JSON.stringify(differences),
      })
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (('diagram' satisfies keyof this) in changes || ('correctAnswer' satisfies keyof this) in changes) {
      const decodedDiagram = decodeDiagram(this.diagram || JSON.parse(EMPTY_DIAGRAM))
      const decodedCorrectAnswerDiagram = decodeDiagram(this.correctAnswer || JSON.parse(EMPTY_DIAGRAM))

      this.differences.set(evaluationCorrection(decodedDiagram, decodedCorrectAnswerDiagram))
    }
  }
}
