import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { ElementRef, Injectable, ViewContainerRef, inject } from '@angular/core'
import { Subscription, first } from 'rxjs'
import { PropertyEditorComponent } from './property-editor.component'

function isHTMLElementRef(element: ElementRef): element is ElementRef<HTMLElement> {
  return ('getBoundingClientRect' satisfies keyof HTMLElement) in element
}

@Injectable({
  providedIn: 'root',
})
export class PropertyEditorService {
  private readonly overlay = inject(Overlay)

  private overlayRef: OverlayRef | null = null
  private backdropSubscription: Subscription | null = null

  show(viewContainerRef: ViewContainerRef) {
    if (this.overlayRef) {
      // Overlay already shown, hiding it first
      this.hide()
    }

    const referenceHeight = isHTMLElementRef(viewContainerRef.element)
      ? `${viewContainerRef.element.nativeElement.getBoundingClientRect().height}px`
      : '100%'

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(viewContainerRef.element)
        .setOrigin(viewContainerRef.element)
        .withPositions([{ originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'top' }]),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      disposeOnNavigation: true,
      height: referenceHeight,
    })

    this.backdropSubscription = this.overlayRef
      .backdropClick()
      .pipe(first())
      .subscribe(() => this.hide())

    const containerPortal = new ComponentPortal(PropertyEditorComponent, viewContainerRef)
    return this.overlayRef.attach(containerPortal)
  }

  hide() {
    // Hiding overlay
    this.overlayRef?.detach()
    this.backdropSubscription?.unsubscribe()
    this.overlayRef = null
    this.backdropSubscription = null
  }
}
