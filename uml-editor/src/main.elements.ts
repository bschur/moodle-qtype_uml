import 'zone.js' // include polyfills for zone.js (not in angular.json since we want a single bundle)
import { ElementsComponent } from './elements/elements.component'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'

bootstrapApplication(ElementsComponent, {
    providers: [provideAnimations()]
}).catch(err => console.error(err))
