import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core'
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
  @HostBinding('class') readonly hostClasses = 'mat-drawer-side mat-drawer-end'

  readonly propertyEditorService = inject(PropertyEditorService)
}
