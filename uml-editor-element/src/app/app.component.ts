import {ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Injector} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {createCustomElement} from "@angular/elements";
import {UmlEditorElementComponent} from "./uml-editor-element/uml-editor-element.component";

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, UmlEditorElementComponent],
  templateUrl: './app.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  constructor(injector: Injector) {
    const umlEditorElementComponent = createCustomElement(UmlEditorElementComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('uml-editor', umlEditorElementComponent);
  }
}
