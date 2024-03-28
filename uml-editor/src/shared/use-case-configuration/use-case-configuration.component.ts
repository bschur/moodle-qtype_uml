import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  standalone: true,
  imports: [],
  templateUrl: './use-case-configuration.component.html',
  styleUrl: './use-case-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCaseConfigurationComponent {}
