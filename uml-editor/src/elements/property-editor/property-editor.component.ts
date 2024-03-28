import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButton } from '@angular/material/button'
import { PropertyEditorService } from './property-editor.service'

@Component({
  selector: 'app-property-editor',
  standalone: true,
  imports: [MatButton],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyEditorComponent {
  readonly propertyEditorService = inject(PropertyEditorService)
}
