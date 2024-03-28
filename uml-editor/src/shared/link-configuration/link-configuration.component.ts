import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { MatFormField, MatLabel } from '@angular/material/form-field'
import { MatIcon } from '@angular/material/icon'
import { MatOption, MatSelect } from '@angular/material/select'
import { dia } from '@joint/core'

/**
 * Component for configuring link properties.
 * For configuring link see the documentation of JointJS.
 * See: https://resources.jointjs.com/tutorial/links
 */
@Component({
  standalone: true,
  imports: [MatButton, MatIcon, MatLabel, MatFormField, MatSelect, MatOption],
  templateUrl: './link-configuration.component.html',
  styleUrl: './link-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkConfigurationComponent {
  @Input({ required: true }) model!: dia.Link

  readonly arrows = ['normal', 'outlined'] as const
  readonly lines = ['normal', 'dotted'] as const

  swapDirection() {
    const source = this.model.prop('source')
    this.model.prop('source', this.model.prop('target'))
    this.model.prop('target', source)
  }
}
