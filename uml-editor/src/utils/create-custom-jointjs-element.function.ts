import { Type } from '@angular/core'
import { dia } from 'jointjs'
import {
  CustomJointJSElement,
  CustomJointJSElementAttributes,
  CustomJointJSElementView,
} from '../models/jointjs/custom-jointjs-element.model'

export function createCustomJointJSElement(
  clazz: Type<dia.Element>,
  name: string,
  inToolbox: boolean
): CustomJointJSElement {
  const instance = new clazz()
  return {
    type: 'element',
    clazz: clazz,
    defaults: instance.defaults() as CustomJointJSElementAttributes<dia.Element.Attributes>,
    instance,
    name,
    inToolbox,
  }
}

export function createCustomJointJSElementView(
  elementView: dia.ElementView,
  elementViewType: string
): CustomJointJSElementView {
  return {
    type: 'view',
    instance: elementView,
    elementViewType,
  }
}
