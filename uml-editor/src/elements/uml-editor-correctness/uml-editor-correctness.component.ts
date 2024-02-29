import { JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { EMPTY_DIAGRAM } from '../../models/jointjs/jointjs-diagram.model'
import { evaluateCorrection, UmlCorrection } from '../../utils/correction.utils'
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
  @Input({ required: true }) maxPoints!: number

  @Output() readonly correctionChanged = new EventEmitter<{ inputId: string; correction: string }>()

  private readonly differences = signal<UmlCorrection>({ differences: [], points: 0 })
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
      // TODO human readable correction
      this.correctionChanged.emit({ inputId: this.inputId, correction: JSON.stringify(differences) })
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      ('diagram' satisfies keyof this) in changes ||
      ('correctAnswer' satisfies keyof this) in changes ||
      ('maxPoints' satisfies keyof this) in changes
    ) {
      const decodedDiagram = decodeDiagram(this.diagram || JSON.parse(EMPTY_DIAGRAM))
      const decodedCorrectAnswerDiagram = decodeDiagram(this.correctAnswer || JSON.parse(EMPTY_DIAGRAM))

      this.differences.set(evaluateCorrection(decodedDiagram, decodedCorrectAnswerDiagram, this.maxPoints))
    }
  }
}
