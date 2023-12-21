import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, Injector } from '@angular/core'
import { setupCustomElementWithInjector } from '../utils/bootstrap-element.function'
import { UmlEditorComponent } from '../elements/uml-editor/uml-editor.component'
import { FullscreenViewComponent } from '../elements/fullscreen-view/fullscreen-view.component'
import { UmlEditorToolboxComponent } from '../elements/uml-editor-toolbox/uml-editor-toolbox.component'

/**
 * This component is used to bootstrap all the custom elements
 * that are used in the application.
 *
 * It has a template, since we want to render all the custom elements.
 * This component is only used for local development when using the `ng serve` command.
 */
@Component({
  selector: 'uml-elements',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  private readonly injector = inject(Injector)

  constructor() {
    setupCustomElementWithInjector('fullscreen-view', FullscreenViewComponent, this.injector)
    setupCustomElementWithInjector('uml-editor-toolbox', UmlEditorToolboxComponent, this.injector)
    setupCustomElementWithInjector('uml-editor', UmlEditorComponent, this.injector)
  }
}
