import { ChangeDetectionStrategy, Component, HostListener, Signal, signal, ViewEncapsulation } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
    selector: 'app-fullscreen-view',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fullscreen-view.component.html',
    styleUrl: './fullscreen-view.component.scss',
    host: {
        '[class.--open]': 'isOpen()'
    },
    imports: [
        MatButtonModule,
        MatIconModule
    ]
})
export class FullscreenViewComponent {
    readonly isOpen: Signal<boolean>

    private readonly _isOpen = signal(false)

    constructor() {
        this.isOpen = this._isOpen.asReadonly()
    }

    toggleFullscreen() {
        this._isOpen.set(!this._isOpen())
    }

    @HostListener('document:keydown.escape', ['$event'])
    closeFullscreen(event: KeyboardEvent) {
        if (this._isOpen()) {
            this._isOpen.set(false)
            event.preventDefault()
        }
    }
}
