import { CustomJointJSElement, CustomJointJSElementView } from '../models/jointjs/custom-jointjs-element.model'
import { TextBlock, TextBlockView } from '../models/jointjs/text-block.model'
import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { UseCase } from '../models/jointjs/uml-use-case.model'
import { createCustomJointJSElement, createCustomJointJSElementView } from './create-custom-jointjs-element.function'

export const jointJSCustomUmlElements: CustomJointJSElement[] = [
  createCustomJointJSElement(UmlActor, 'Actor', true),
  createCustomJointJSElement(UmlClass, 'Classifier', true),
  createCustomJointJSElement(TextBlock, 'Text-block', false),
  createCustomJointJSElement(UseCase, 'UseCase', true),
]

export const jointJSCustomUmlElementViews: CustomJointJSElementView[] = [
  createCustomJointJSElementView(TextBlockView, 'custom.uml.TextBlockView'),
]
