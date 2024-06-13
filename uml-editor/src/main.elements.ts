import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from './app/app.config'
import { ElementsComponent } from './elements/elements.component'

const node = document.createElement('uml-elements')
document.body.appendChild(node)

bootstrapApplication(ElementsComponent, appConfig).catch(err => console.error(err))
