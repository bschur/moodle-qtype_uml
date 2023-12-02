import { ChangeDetectionStrategy, Component } from '@angular/core'
import { UmlEditorComponent } from '../elements/uml-editor/uml-editor.component'

@Component({
    selector: 'app-root',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [UmlEditorComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
}
