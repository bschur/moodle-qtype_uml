import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import 'zone.js'
import { ElementsComponent } from './elements/elements.component'

bootstrapApplication(ElementsComponent, {
  providers: [provideAnimations(), { provide: OverlayContainer, useClass: FullscreenOverlayContainer }],
}).catch(err => console.error(err))
