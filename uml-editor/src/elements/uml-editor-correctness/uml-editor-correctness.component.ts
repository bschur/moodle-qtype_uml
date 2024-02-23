import { JsonPipe } from '@angular/common'
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core'
import { MatListModule } from '@angular/material/list'
import { Operation, diff } from 'just-diff'
import { EMPTY_DIAGRAM } from '../../models/jointjs/jointjs-diagram.model'
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
  @Input({ required: true }) inputId: string | null = null
  @Input({ required: true }) diagram: string | null = null
  @Input({ required: true }) correctAnswer: string | null = null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly differences = signal<{ op: Operation; path: Array<string | number>; value: any }[]>([])

  ngOnChanges(changes: SimpleChanges) {
    if (('diagram' satisfies keyof this) in changes || ('correctAnswer' satisfies keyof this) in changes) {
      const decodedDiagram = decodeDiagram(this.diagram || JSON.parse(EMPTY_DIAGRAM))
      const decodedCorrectAnswerDiagram = decodeDiagram(this.correctAnswer || JSON.parse(EMPTY_DIAGRAM))

      this.differences.set(diff(decodedDiagram, decodedCorrectAnswerDiagram))
    }
  }
}
