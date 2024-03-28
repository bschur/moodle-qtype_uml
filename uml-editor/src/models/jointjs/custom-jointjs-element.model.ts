import { ComponentType } from '@angular/cdk/overlay'
import { Type } from '@angular/core'
import { dia } from '@joint/core'

interface CustomJointJSEntity {
  type: 'element' | 'view' | 'link' | 'linkView'
  instance: dia.Element | dia.ElementView | dia.Link | dia.LinkView
}

export interface JointJSElementType {
  type: string
  propertyView?: ComponentType<unknown>
}

export type CustomJointJSElementAttributes<T extends dia.Element.Attributes> = JointJSElementType & Partial<T>

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
