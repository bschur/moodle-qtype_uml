import { Type } from '@angular/core'
import { dia } from 'jointjs'

export interface JointJSElementType {
  type: string
}

export type CustomJointJSElementAttributes<T extends dia.Element.Attributes> = JointJSElementType & Partial<T>

export interface CustomJointJSEntity {
  type: 'element' | 'view'
  instance: dia.Element | dia.ElementView
}

export interface CustomJointJSElementView extends CustomJointJSEntity {
  type: 'view'
  instance: dia.ElementView
  elementViewType: string
}

export interface CustomJointJSElement extends CustomJointJSEntity {
  type: 'element'
  clazz: Type<dia.Element>
  instance: dia.Element
  name: string
  inToolbox: boolean
  defaults: CustomJointJSElementAttributes<dia.Element.Attributes>
}
