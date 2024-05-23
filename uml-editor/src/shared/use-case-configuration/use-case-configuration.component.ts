import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UseCase } from '../../models/jointjs/uml-use-case.model'

@Component({
  standalone: true,
  templateUrl: './use-case-configuration.component.html',
  styleUrl: './use-case-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCaseConfigurationComponent {
  @Input({ required: true }) model!: UseCase
}
