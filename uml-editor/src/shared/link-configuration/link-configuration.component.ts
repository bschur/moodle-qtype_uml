import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatButton } from '@angular/material/button'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatOption, MatSelect } from '@angular/material/select'
import { dia } from '@joint/core'
import {
  JointJSLinkArrowType,
  JointJSLinkLineType,
  changeLinkArrowType,
  changeLinkLineType,
  jointJSArrows,
  jointJSLinks,
  readLinkArrowType,
  readLinkLineType,
  swapDirection,
} from '../../utils/jointjs-link.utils'

@Component({
  standalone: true,
  imports: [MatButton, MatIcon, MatLabel, MatFormField, MatSelect, MatOption, ReactiveFormsModule],
  templateUrl: './link-configuration.component.html',
  styleUrl: './link-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkConfigurationComponent implements OnInit {
  @Input({ required: true }) model!: dia.Link

  readonly arrows = jointJSArrows
  readonly lines = jointJSLinks

  readonly swapDirection = () => swapDirection(this.model)

  readonly form = new FormGroup({
    arrowTarget: new FormControl<JointJSLinkArrowType>('none', { nonNullable: true }),
    arrowSource: new FormControl<JointJSLinkArrowType>('none', { nonNullable: true }),
    line: new FormControl<JointJSLinkLineType>('normal', { nonNullable: true }),
  })

  constructor() {
    this.form.controls.arrowTarget.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkArrowType(this.model, value, 'target'))

    this.form.controls.arrowSource.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkArrowType(this.model, value, 'source'))

    this.form.controls.line.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkLineType(this.model, value))
  }

  ngOnInit() {
    this.form.setValue({
      arrowTarget: readLinkArrowType(this.model, 'target'),
      arrowSource: readLinkArrowType(this.model, 'source'),
      line: readLinkLineType(this.model),
    })
  }
}
