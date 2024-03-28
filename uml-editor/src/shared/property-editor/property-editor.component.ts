import { ComponentType } from '@angular/cdk/overlay'
import { NgComponentOutlet } from '@angular/common'
import { ChangeDetectionStrategy, Component, HostBinding, inject, OnInit } from '@angular/core'
import { MatButton, MatIconButton } from '@angular/material/button'
import { MatIcon } from '@angular/material/icon'
import { PropertyEditorService } from './property-editor.service'

@Component({
  standalone: true,
  imports: [MatButton, MatIcon, MatIconButton, NgComponentOutlet],
  templateUrl: './property-editor.component.html',
  styleUrl: './property-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyEditorComponent<T> implements OnInit {
  @HostBinding('class') readonly hostClasses = 'mat-drawer-side mat-drawer-end'

  readonly propertyEditorService = inject(PropertyEditorService)

  type: ComponentType<T> | null = null

  ngOnInit() {
    if (!this.type) {
      throw new Error('Template is not defined')
    }
  }
}
