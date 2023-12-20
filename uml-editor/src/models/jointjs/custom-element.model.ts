import { dia } from 'jointjs'
import { Type } from '@angular/core'

export interface JointJSElementType {
    type: string
}

export type CustomElementAttributes<T extends dia.Element.Attributes> = JointJSElementType & Partial<T>

export interface CustomElement {
    clazz: Type<dia.Element>,
    defaults: CustomElementAttributes<dia.Element.Attributes>,
    name: string,
    inToolbox: boolean,
    createEmpty: () => dia.Element
}