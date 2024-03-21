import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ElementsComponent } from '../elements/elements.component'

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
export class AppComponent extends ElementsComponent {}
