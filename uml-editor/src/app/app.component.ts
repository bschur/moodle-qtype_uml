import {ChangeDetectionStrategy, Component, Injector} from '@angular/core';
import {createCustomElement} from "@angular/elements";
import {UmlEditorComponent} from "../elements/uml-editor/uml-editor.component";

@Component({
    selector: 'app-root',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UmlEditorComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(injector: Injector) {
        const umlEditorElementComponent = createCustomElement(UmlEditorComponent, {injector});
        // Register the custom element with the browser.
        customElements.define('uml-editor', umlEditorElementComponent);
    }
}
