import { Type } from '@angular/core'
import { bootstrapApplication } from '@angular/platform-browser'
import { createCustomElement } from '@angular/elements'

export async function bootstrapElement(elementTag: string, rootComponent: Type<unknown>) {
    try {
        const bootstrappedComponent = await bootstrapApplication(rootComponent)
        const customElement = createCustomElement(rootComponent, {injector: bootstrappedComponent.injector})
        customElements.define(elementTag, customElement)
    } catch (error) {
        console.error(error)
    }
}