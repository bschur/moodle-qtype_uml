import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay'
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import 'zone.js'
import { ElementsComponent } from './elements/elements.component'

bootstrapApplication(ElementsComponent, {
  providers: [
    provideAnimations(),
    { provide: OverlayContainer, useClass: FullscreenOverlayContainer },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
}).catch(err => console.error(err))
