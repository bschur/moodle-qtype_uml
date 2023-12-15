import { AppComponent } from './app/app.component'
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'

bootstrapApplication(AppComponent, {
    providers: [provideAnimations()]
}).catch(err => console.error(err))