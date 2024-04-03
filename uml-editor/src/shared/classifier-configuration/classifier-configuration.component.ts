import { CommonModule, JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatOption } from '@angular/material/autocomplete'
import { MatButton } from '@angular/material/button'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatSelect } from '@angular/material/select'
import { dia } from '@joint/core'
import { UmlClassifierModel } from '../../models/jointjs/uml-classifier/IUml-classifier.model'
import { UmlClass } from '../../models/jointjs/uml-classifier/uml-class.model'
import ElementView = dia.ElementView
import Graph = dia.Graph

type ClassifierType = 'Class' | 'Enum' | 'Interface'

@Component({
  standalone: true,
  imports: [
    JsonPipe,
    CommonModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './classifier-configuration.component.html',
  styleUrl: './classifier-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassifierConfigurationComponent {
  @Input({ required: true }) model!: UmlClassifierModel
  @Input({ required: true }) elementView!: ElementView
  @Input({ required: true }) graph!: Graph

  readonly lines: ClassifierType[] = ['Class', 'Enum', 'Interface']

  readonly form = new FormGroup({
    classifier: new FormControl<ClassifierType>('Class', { nonNullable: true }),
  })

  constructor() {
    this.form.controls.classifier.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.changeClassifierType(value))
  }

  changeClassifierType(type: ClassifierType) {
    if (this.model instanceof UmlClass && type === 'Interface') {
      const newModel = this.model.convertToInterface()
      this.graph.removeCells([this.elementView.model])
      this.graph.addCell(newModel)
      this.elementView.model = newModel
      this.elementView.update()
      this.model = newModel
    }
  }
}
