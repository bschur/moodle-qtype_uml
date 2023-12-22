import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import 'zone.js'
import { ElementsComponent } from './elements/elements.component'

bootstrapApplication(ElementsComponent, {
  providers: [provideAnimations()],
}).catch(err => console.error(err))
