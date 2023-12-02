import { UmlEditorComponent } from './elements/uml-editor/uml-editor.component'
import { bootstrapElement } from './utils/bootstrap-element.function'
import 'zone.js' // include polyfills for zone.js (not in angular.json since we want a single bundle)

// See for further instructions https://blog.bitsrc.io/diving-deep-into-angular-elements-c17a868d6894

bootstrapElement('uml-editor', UmlEditorComponent).then(() => console.debug('UmlEditorComponent loaded'))
