import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay'
import { provideHttpClient } from '@angular/common/http'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import 'zone.js'
import { ElementsComponent } from './elements/elements.component'

const node = document.createElement('uml-elements')
document.body.appendChild(node)

bootstrapApplication(ElementsComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
}).catch(err => console.error(err))
