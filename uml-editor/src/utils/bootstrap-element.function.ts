import { Injector, Type } from '@angular/core'
import { createCustomElement } from '@angular/elements'

export function setupCustomElementWithInjector(elementTag: string, rootComponent: Type<unknown>, injector: Injector) {
  try {
    const customElement = createCustomElement(rootComponent, { injector })
    customElements.define(elementTag, customElement)
  } catch (error) {
    console.error(error)
  }
}
