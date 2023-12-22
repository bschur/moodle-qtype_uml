import { DOCUMENT } from '@angular/common'
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-fullscreen-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './fullscreen-view.component.html',
  styleUrl: './fullscreen-view.component.scss',
  imports: [MatButtonModule, MatIconModule],
})
export class FullscreenViewComponent {
  readonly inFullScreen = signal(false)
  readonly document = inject(DOCUMENT)

  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef)

  toggleFullscreen(fullscreen?: boolean) {
    if (!this.document.fullscreenElement || fullscreen) {
      void this.elementRef.nativeElement.requestFullscreen()
    } else if (this.document.exitFullscreen) {
      void this.document.exitFullscreen()
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  fullscreenChangeHandler() {
    this.inFullScreen.set(!!this.document.fullscreenElement)
  }
}
