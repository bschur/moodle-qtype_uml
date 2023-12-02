import { UmlEditorComponent } from './elements/uml-editor/uml-editor.component'
import { bootstrapElement } from './utils/bootstrap-element.function'

bootstrapElement('uml-editor', UmlEditorComponent).then(() => console.debug('UmlEditorComponent loaded'))