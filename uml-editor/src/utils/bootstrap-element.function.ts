import { Injector, Type } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { createCustomElement } from '@angular/elements'

export function setupCustomElementWithInjector(elementTag: string, rootComponent: Type<unknown>, injector: Injector) {
    try {
        const customElement = createCustomElement(rootComponent, {injector})
        customElements.define(elementTag, customElement)
    } catch (error) {
        console.error(error)
    }
}

export async function bootstrapCustomElement(elementTag: string, rootComponent: Type<unknown>) {
    try {
        const bootstrappedComponent = await bootstrapApplication(rootComponent)
        setupCustomElementWithInjector(elementTag, rootComponent, bootstrappedComponent.injector)
    } catch (error) {
        console.error(error)
    }
}