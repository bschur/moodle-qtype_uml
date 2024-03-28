import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay'
import { bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { AppComponent } from './app/app.component'

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), { provide: OverlayContainer, useClass: FullscreenOverlayContainer }],
}).catch(err => console.error(err))
