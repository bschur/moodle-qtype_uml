import {createCustomElement} from '@angular/elements';
import {createApplication} from '@angular/platform-browser';
import {UmlEditorComponent} from "./elements/uml-editor/uml-editor.component";
import {NgZone} from "@angular/core";

(async () => {
    const app = await createApplication({
        providers: [
            /* your global providers here */
        ],
    });

    const umlEditorElement = createCustomElement(UmlEditorComponent, {
        injector: app.injector,
    });

    app.injector.get(NgZone).run(() => {
        app.bootstrap(umlEditorElement, 'uml-editor');
        // app.bootstrap(ToggleComponent, 'my-b');
    });
})();
