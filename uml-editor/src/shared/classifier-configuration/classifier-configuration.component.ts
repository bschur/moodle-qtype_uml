import { CommonModule, JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatOption } from '@angular/material/autocomplete'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatSelect } from '@angular/material/select'
import { dia } from '@joint/core'
import { BaseUmlClassifierModel } from '../../models/jointjs/uml-classifier/base-uml-classifier.model'
import { UmlClass } from '../../models/jointjs/uml-classifier/uml-class.model'
import { UmlEnum } from '../../models/jointjs/uml-classifier/uml-enum.model'
import { UmlInterface } from '../../models/jointjs/uml-classifier/uml-interface.model'

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
    MatCheckbox,
  ],
  templateUrl: './classifier-configuration.component.html',
  styleUrl: './classifier-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassifierConfigurationComponent<T extends BaseUmlClassifierModel> {
  @Input({ required: true }) model!: T
  @Input({ required: true }) elementView!: dia.ElementView
  @Input({ required: true }) graph!: dia.Graph
  @Input({ required: true }) paper!: dia.Paper

  readonly lines: ClassifierType[] = ['Class', 'Enum', 'Interface']

  readonly form = new FormGroup({
    classifier: new FormControl<ClassifierType>('Class', { nonNullable: true }),
    abstract: new FormControl<boolean>(false, { nonNullable: true }),
  })

  constructor() {
    this.form.controls.classifier.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.changeClassifierType(value))

    this.form.controls.abstract.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.changeAbsract())
  }

  changeClassifierType(type: ClassifierType) {
    let newModel
    switch (type) {
      case 'Interface':
        newModel = this.model.convertTo(UmlInterface)
        break
      case 'Class':
        newModel = this.model.convertTo(UmlClass)
        break
      case 'Enum':
        newModel = this.model.convertTo(UmlEnum)
        break
    }

    this.graph.addCell(newModel)
    const classifierID = this.model.id
    this.paper.model.getLinks().forEach(function (link) {
      if (link.target().id === classifierID) {
        console.log(link.target())
        link.target(newModel, link.target().anchor)
        //link.prop('target', newModel)
      } else if (link.source().id === classifierID) {
        link.source(newModel, link.target().anchor)
        //link.prop('source', newModel)
      }
    })

    this.graph.removeCells([this.elementView.model])

    this.elementView.model = newModel

    this.elementView.update()
    this.model = newModel as unknown as T

    newModel.getFunctions().forEach(value => {
      this.paper.model.addCell(value)
    })
    this.paper.model.addCell(newModel.getHeader())
  }

  private changeAbsract() {
    this.model.setAbstract()
  }
}
