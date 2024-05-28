import { ComponentType, Overlay, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import { ElementRef, Injectable, ViewContainerRef, inject } from '@angular/core'
import { dia } from '@joint/core'
import { PropsOfType } from '../../models/property-of.type'
import { PropertyEditorComponent } from './property-editor.component'
import CellView = dia.CellView

function isHTMLElementRef(element: ElementRef): element is ElementRef<HTMLElement> {
  return ('nativeElement' satisfies keyof ElementRef<HTMLElement>) in element
}

@Injectable({
  providedIn: 'root',
})
export class PropertyEditorService {
  private readonly overlay = inject(Overlay)

  private overlayRef: OverlayRef | null = null

  show<T>(
    viewContainerRef: ViewContainerRef,
    componentType: ComponentType<T>,
    initProperties?: Partial<PropsOfType<T>>,
    elementView?: CellView
  ) {
    if (this.overlayRef) {
      // Overlay already shown, hiding it first
      //todo how????????????????
      //this.hide(initProperties<ElementView>.elementView)
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
      maxHeight: referenceHeight,
    })

    const containerPortal = new ComponentPortal(PropertyEditorComponent, viewContainerRef)
    const componentRef = this.overlayRef.attach(containerPortal)
    componentRef.instance.type = componentType
    componentRef.instance.initProperties = initProperties

    return componentRef
  }

  hide(cellView?: CellView) {
    // Hiding overlay
    this.overlayRef?.detach()
    this.overlayRef = null

    if (cellView != undefined) {
      dia.HighlighterView.remove(cellView)
    }
  }
}
