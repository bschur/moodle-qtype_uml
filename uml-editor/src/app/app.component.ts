import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, Injector } from '@angular/core'
import { setupCustomElementWithInjector } from '../utils/bootstrap-element.function'
import { UmlEditorComponent } from '../elements/uml-editor/uml-editor.component'

@Component({
    selector: 'app-root',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
    private readonly injector = inject(Injector)

    constructor() {
        setupCustomElementWithInjector('uml-editor', UmlEditorComponent, this.injector)
    }
}
