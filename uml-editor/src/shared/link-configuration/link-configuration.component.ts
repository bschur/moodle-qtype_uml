import { ChangeDetectionStrategy, Component, computed, Input, OnInit } from '@angular/core'
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { MatButton } from '@angular/material/button'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatInput } from '@angular/material/input'
import { MatOption, MatSelect } from '@angular/material/select'
import { dia } from '@joint/core'
import {
  jointJSArrows,
  JointJSLinkArrowType,
  JointJSLinkLineType,
  JointJSLinkMultiplicity,
  jointJSLinks,
  jointJSSuggestedLinkMultiplicities,
} from '../../models/jointjs/jointjs-link.model'
import {
  changeLinkArrowType,
  changeLinkLabelText,
  changeLinkLineType,
  readLinkArrowType,
  readLinkLabelText,
  readLinkLineType,
  swapDirection,
} from '../../utils/jointjs-link.utils'

@Component({
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatLabel,
    MatFormField,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
  ],
  templateUrl: './link-configuration.component.html',
  styleUrl: './link-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkConfigurationComponent implements OnInit {
  @Input({ required: true }) model!: dia.Link

  protected readonly arrows = jointJSArrows
  protected readonly lines = jointJSLinks

  protected readonly form = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    arrowTarget: new FormControl<JointJSLinkArrowType>('none', { nonNullable: true }),
    arrowSource: new FormControl<JointJSLinkArrowType>('none', { nonNullable: true }),
    line: new FormControl<JointJSLinkLineType>('normal', { nonNullable: true }),
    multiplicityTarget: new FormControl<JointJSLinkMultiplicity>('', { nonNullable: true }),
    multiplicitySource: new FormControl<JointJSLinkMultiplicity>('', { nonNullable: true }),
  })

  protected readonly suggestedTargetLinkMultiplicities = computed(() => {
    const value = this.multiplicityTargetValue()
    return jointJSSuggestedLinkMultiplicities.filter(multiplicity => multiplicity.includes(value))
  })

  protected readonly suggestedSourceLinkMultiplicities = computed(() => {
    const value = this.multiplicitySourceValue()
    return jointJSSuggestedLinkMultiplicities.filter(multiplicity => multiplicity.includes(value))
  })

  private readonly multiplicityTargetValue = toSignal(this.form.controls.multiplicityTarget.valueChanges, {
    initialValue: '',
  })
  private readonly multiplicitySourceValue = toSignal(this.form.controls.multiplicitySource.valueChanges, {
    initialValue: '',
  })

  constructor() {
    this.form.controls.name.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkLabelText(this.model, value, 'name'))

    this.form.controls.arrowTarget.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkArrowType(this.model, value, 'target'))

    this.form.controls.arrowSource.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkArrowType(this.model, value, 'source'))

    this.form.controls.line.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkLineType(this.model, value))

    this.form.controls.multiplicityTarget.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkLabelText(this.model, value, 'multiplicityTarget'))

    this.form.controls.multiplicitySource.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => changeLinkLabelText(this.model, value, 'multiplicitySource'))
  }

  ngOnInit() {
    this.form.setValue({
      name: readLinkLabelText(this.model, 'name') || '',
      arrowTarget: readLinkArrowType(this.model, 'target'),
      arrowSource: readLinkArrowType(this.model, 'source'),
      line: readLinkLineType(this.model),
      multiplicityTarget: readLinkLabelText(this.model, 'multiplicityTarget') || '',
      multiplicitySource: readLinkLabelText(this.model, 'multiplicitySource') || '',
    })
  }

  protected readonly swapDirection = () => swapDirection(this.model)
}
