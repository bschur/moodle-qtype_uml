import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { ElementRef, Injectable, TemplateRef, ViewContainerRef, inject } from '@angular/core'
import { PropertyEditorComponent } from './property-editor.component'

function isHTMLElementRef(element: ElementRef): element is ElementRef<HTMLElement> {
  return ('nativeElement' satisfies keyof ElementRef<HTMLElement>) in element
}

@Injectable({
  providedIn: 'root',
})
export class PropertyEditorService {
  private readonly overlay = inject(Overlay)

  private overlayRef: OverlayRef | null = null

  show<T>(viewContainerRef: ViewContainerRef, templateRef: TemplateRef<T>) {
    if (this.overlayRef) {
      // Overlay already shown, hiding it first
      this.hide()
    }

    if (!isHTMLElementRef(viewContainerRef.element)) {
      throw new Error('ViewContainerRef element is not an HTMLElement')
    }

    const referenceHeight = viewContainerRef.element.nativeElement.getBoundingClientRect().height

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

    const containerPortal = new ComponentPortal(PropertyEditorComponent, viewContainerRef)
    const componentRef = this.overlayRef.attach(containerPortal)
    componentRef.instance.template = templateRef
  }

  hide() {
    // Hiding overlay
    this.overlayRef?.detach()
    this.overlayRef = null
  }
}
