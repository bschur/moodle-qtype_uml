import { Type } from '@angular/core'
import { dia } from 'jointjs'
import { CustomJointJSElement, CustomJointJSElementAttributes } from '../models/jointjs/custom-jointjs-element.model'

export function createCustomJointJSElement(
  clazz: Type<dia.Element>,
  name: string,
  inToolbox: boolean
): CustomJointJSElement {
  const instance = new clazz()
  return {
    clazz: clazz,
    defaults: instance.defaults() as CustomJointJSElementAttributes<dia.Element.Attributes>,
    instance,
    name,
    inToolbox,
  }
}
