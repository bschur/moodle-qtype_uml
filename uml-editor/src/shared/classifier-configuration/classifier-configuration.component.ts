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
import { BaseUmlClassifierModel } from '../../models/jointjs/uml-classifier/base-uml-classifier.model'
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
  @Input({ required: true }) model!: BaseUmlClassifierModel
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
    let newModel
    switch (type) {
      case 'Interface': {
        newModel = this.model.convertToInterface()
        break
      }
      case 'Class': {
        newModel = this.model.convertToClass()
        break
      }
      case 'Enum': {
        newModel = this.model.convertToEnum()
        break
      }
    }

    this.graph.removeCells([this.elementView.model])
    this.graph.addCell(newModel)
    this.elementView.model = newModel
    this.elementView.update()
    this.model = newModel
  }
}
