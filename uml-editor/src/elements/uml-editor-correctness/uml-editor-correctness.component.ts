import { JsonPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core'
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop'
import { MatListModule } from '@angular/material/list'
import { combineLatest, delay } from 'rxjs'
import { UmlCorrection } from '../../models/correction.model'
import { EMPTY_DIAGRAM, EMPTY_DIAGRAM_OBJECT } from '../../models/jointjs/jointjs-diagram.model'
import { evaluateCorrection } from '../../utils/correction.utils'
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

  private readonly correction = signal<UmlCorrection>({
    differences: [],
    points: 0,
    answer: EMPTY_DIAGRAM_OBJECT,
    solution: EMPTY_DIAGRAM_OBJECT,
  })
  private readonly readyState = signal<typeof document.readyState>('loading')

  constructor() {
    combineLatest([toObservable(this.readyState), toObservable(this.correction)])
      .pipe(takeUntilDestroyed(), delay(0))
      .subscribe(([, correction]) => {
        if (document.readyState !== 'complete') {
          console.warn(`Document is not ready yet. It's in state '${document.readyState}'`)
          return
        }

        console.log('cleaned correction', JSON.stringify(correction.answer))
        console.log('cleaned solution', JSON.stringify(correction.solution))

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

    document.addEventListener('readystatechange', event =>
      this.readyState.set((<Document>event.target)?.readyState || 'loading')
    )
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
