import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  numberAttribute,
  Output,
  signal,
} from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { MatFabButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { skip } from 'rxjs'
import { UmlCorrection } from '../../models/correction.model'
import { EMPTY_DIAGRAM, EMPTY_DIAGRAM_OBJECT } from '../../models/jointjs/jointjs-diagram.model'
import { injectEvaluateCorrectionFn } from '../../utils/correction.utils'
import { decodeDiagram } from '../../utils/uml-editor-compression.utils'

@Component({
  selector: 'app-uml-editor-correctness',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './uml-editor-correctness.component.html',
  styleUrl: './uml-editor-correctness.component.scss',
  imports: [MatListModule, MatFabButton, MatIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UmlEditorCorrectnessComponent {
  @Input({ required: true }) inputId!: string
  @Input({ required: true }) diagram!: string
  @Input({ required: true }) correctAnswer!: string
  @Input({ required: true, transform: numberAttribute }) maxPoints!: number
  @Input() promptEndpoint?: string
  @Input() additionalCorrectionPrompt?: string

  @Output() readonly correctionChanged = new EventEmitter<{
    inputId: string
    maxPoints: number
    comment: string
    points: number
    summary?: string
  }>()

  private readonly correction = signal<UmlCorrection>({
    differences: [],
    points: 0,
    normalizedAnswer: EMPTY_DIAGRAM_OBJECT,
    normalizedSolution: EMPTY_DIAGRAM_OBJECT,
  })

  private readonly evaluateCorrection = injectEvaluateCorrectionFn()

  constructor() {
    toObservable(this.correction)
      .pipe(skip(1), takeUntilDestroyed())
      .subscribe(correction => {
        const emittedCorrection = {
          inputId: this.inputId,
          maxPoints: this.maxPoints,
          comment: JSON.stringify(correction.differences),
          points: correction.points,
          summary: correction.summary,
        }

        console.debug('correction changed', correction, 'emitting', emittedCorrection)
        this.correctionChanged.emit(emittedCorrection)
      })
  }

  async correctDiagram() {
    const decodedDiagram = decodeDiagram(this.diagram || JSON.parse(EMPTY_DIAGRAM))
    const decodedCorrectAnswerDiagram = decodeDiagram(this.correctAnswer || JSON.parse(EMPTY_DIAGRAM))

    const correction = await this.evaluateCorrection(
      decodedDiagram,
      decodedCorrectAnswerDiagram,
      this.maxPoints,
      this.promptEndpoint,
      this.additionalCorrectionPrompt
    )
    this.correction.set(correction)
  }
}
