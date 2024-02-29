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
  @Input({ required: true, transform: parseInt }) maxPoints!: number

  @Output() readonly correctionChanged = new EventEmitter<{
    inputId: string
    comment: string
    points: number
    maxPoints: number
  }>()

  private readonly correction = signal<UmlCorrection>({ differences: [], points: 0 })
  private readonly domReady = signal(false)

  constructor() {
    addEventListener('load', () => this.domReady.set(true))

    effect(() => {
      const domReady = this.domReady()
      if (!domReady) {
        return
      }

      const correction = this.correction()
      const emittedCorrection = {
        inputId: this.inputId,
        // TODO human readable comment
        comment: JSON.stringify(correction.differences),
        points: correction.points,
        maxPoints: this.maxPoints,
      }

      console.debug('correction changed', emittedCorrection)
      this.correctionChanged.emit(emittedCorrection)
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

      this.correction.set(evaluateCorrection(decodedDiagram, decodedCorrectAnswerDiagram, this.maxPoints))
    }
  }
}
