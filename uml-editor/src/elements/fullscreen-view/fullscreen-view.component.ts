import { ChangeDetectionStrategy, Component, HostListener, Input, Signal, signal } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { coerceBooleanProperty } from '@angular/cdk/coercion'

@Component({
    selector: 'app-fullscreen-view',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './fullscreen-view.component.html',
    styleUrl: './fullscreen-view.component.scss',
    host: {
        '[class.--fullscreen]': 'inFullScreen()'
    },
    imports: [
        MatButtonModule,
        MatIconModule
    ]
})
export class FullscreenViewComponent {
    readonly inFullScreen: Signal<boolean>

    @Input({ transform: coerceBooleanProperty }) set fullscreen(value: boolean) {
        this._inFullScreen.set(value)
    }

    private readonly _inFullScreen = signal(false)

    constructor() {
        this.inFullScreen = this._inFullScreen.asReadonly()
    }

    toggleFullscreen() {
        this._inFullScreen.set(!this._inFullScreen())
    }

    @HostListener('document:keydown.escape', ['$event'])
    closeFullscreen(event: KeyboardEvent) {
        if (this._inFullScreen()) {
            this._inFullScreen.set(false)
            event.preventDefault()
        }
    }
}
