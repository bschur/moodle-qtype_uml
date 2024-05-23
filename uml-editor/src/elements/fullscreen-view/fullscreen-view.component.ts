import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltip } from '@angular/material/tooltip'
import { PropertyEditorService } from '../../shared/property-editor/property-editor.service'

@Component({
  selector: 'app-fullscreen-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fullscreen-view.component.html',
  styleUrl: './fullscreen-view.component.scss',
  imports: [MatButtonModule, MatIconModule, MatTooltip],
})
export class FullscreenViewComponent {
  protected readonly inFullScreen = signal(false)
  protected readonly document = inject(DOCUMENT)

  private readonly propertyEditorService = inject(PropertyEditorService)
  private readonly elementRef = inject(ElementRef)

  protected toggleFullscreen(fullscreen?: boolean) {
    if (!this.document.fullscreenElement || fullscreen) {
      void this.elementRef.nativeElement.requestFullscreen()
    } else if (this.document.exitFullscreen) {
      void this.document.exitFullscreen()
    }
  }

  @HostListener('fullscreenchange')
  protected fullscreenChangeHandler() {
    this.propertyEditorService.hide()
    this.inFullScreen.set(!!this.document.fullscreenElement)
  }

  @HostListener('keydown.enter', ['$event'])
  protected preventFromClosing(event: KeyboardEvent) {
    event.preventDefault()
    event.stopPropagation()
  }
}
