import { JsonPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { UmlClass } from '../../models/jointjs/uml-classifier/uml-class.model'

@Component({
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './classifier-configuration.component.html',
  styleUrl: './classifier-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassifierConfigurationComponent {
  @Input({ required: true }) model!: UmlClass
}
