import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatOption } from '@angular/material/autocomplete'
import { MatButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatSelect } from '@angular/material/select'
import { dia } from '@joint/core'
import {
  BaseUmlClassifierModel,
  ClassifierType,
  classifierTypes,
} from '../../models/jointjs/uml-classifier/base-uml-classifier.model'
import { UmlClass } from '../../models/jointjs/uml-classifier/uml-class.model'
import { UmlEnum } from '../../models/jointjs/uml-classifier/uml-enum.model'
import { UmlInterface } from '../../models/jointjs/uml-classifier/uml-interface.model'

@Component({
  standalone: true,
  imports: [
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
export class ClassifierConfigurationComponent<T extends BaseUmlClassifierModel> implements OnInit {
  @Input({ required: true }) model!: T
  @Input({ required: true }) elementView!: dia.ElementView

  protected readonly lines = classifierTypes

  protected readonly form = new FormGroup({
    classifier: new FormControl<ClassifierType>('Class', { nonNullable: true }),
    abstract: new FormControl<boolean>(false, { nonNullable: true }),
    static: new FormControl<boolean>(false, { nonNullable: true }),
  })

  constructor() {
    this.form.controls.classifier.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => this.changeClassifierType(value))

    this.form.controls.abstract.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.toggleAbstract())
    this.form.controls.static.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.toggleStatic())
  }

  ngOnInit() {
    const a: any = 0

    this.form.setValue(
      {
        classifier: this.model.type,
        abstract: this.model.isAbstract,
        static: this.model instanceof UmlClass ? this.model.isStatic : false,
      },
      { emitEvent: false }
    )
  }

  private changeClassifierType(type: ClassifierType) {
    if (type != this.model.type) {
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

      this.model.graph.addCell(newModel)
      const classifierID = this.model.id
      this.model.graph.getLinks().forEach(link => {
        if (link.target().id === classifierID) {
          const anchor = link.target().anchor
          link.target(newModel, { anchor })
        } else if (link.source().id === classifierID) {
          const anchor = link.source().anchor
          link.source(newModel, { anchor })
        }
      })

      this.model.graph.removeCells([this.elementView.model])
      this.elementView.model = newModel
      this.elementView.update()
      this.model = newModel as unknown as T
      newModel.functionComponents.forEach(value => {
        this.model.graph.addCell(value)
      })
      if (newModel.headerComponent.position().x != 0) {
        this.model.graph.addCell(newModel.headerComponent)
      }
    }
  }

  private toggleAbstract() {
    this.model.toggleAbstract()
  }

  private toggleStatic() {
    if (this.model instanceof UmlClass) {
      this.model.toggleStatic()
    }
  }
}
