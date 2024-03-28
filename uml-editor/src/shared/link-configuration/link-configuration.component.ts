import { JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { dia } from '@joint/core'

@Component({
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './link-configuration.component.html',
  styleUrl: './link-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkConfigurationComponent {
  @Input({ required: true }) model!: dia.Link
}
