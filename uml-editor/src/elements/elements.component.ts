import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core'
import { setupCustomElementWithInjector } from '../utils/bootstrap-element.function'
import { FullscreenViewComponent } from './fullscreen-view/fullscreen-view.component'
import { UmlEditorToolboxComponent } from './uml-editor-toolbox/uml-editor-toolbox.component'
import { UmlEditorComponent } from './uml-editor/uml-editor.component'

/**
 * This component is used to bootstrap all the custom elements
 * that are used in the application.
 *
 * It has no template, since we don't automatically want to render all the custom elements.
 */
@Component({
  selector: 'uml-elements',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class ElementsComponent {
  private readonly injector = inject(Injector)

  constructor() {
    setupCustomElementWithInjector('fullscreen-view', FullscreenViewComponent, this.injector)
    setupCustomElementWithInjector('uml-editor-toolbox', UmlEditorToolboxComponent, this.injector)
    setupCustomElementWithInjector('uml-editor', UmlEditorComponent, this.injector)
  }
}
