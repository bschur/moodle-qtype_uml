import {bootstrapApplication} from "@angular/platform-browser";
import {UmlEditorComponent} from "./elements/uml-editor/uml-editor.component";
import {createCustomElement} from "@angular/elements";

bootstrapApplication(UmlEditorComponent)
    .then((component) => {
        const customElement = createCustomElement(UmlEditorComponent, {injector: component.injector})
        customElements.define('uml-editor', customElement);
    })
    .catch(err => console.error(err));
