import { CustomJointJSElement, CustomJointJSElementView } from '../models/jointjs/custom-jointjs-element.model'
import { NoteElement, NoteElementView } from '../models/jointjs/note-element'
import { TextBlock, TextBlockView } from '../models/jointjs/text-block.model'
import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-classifier/uml-class.model'
import { UmlEnum } from '../models/jointjs/uml-classifier/uml-enum.model'
import { UmlInterface } from '../models/jointjs/uml-classifier/uml-interface.model'
import { UseCase } from '../models/jointjs/uml-use-case.model'
import { createCustomJointJSElement, createCustomJointJSElementView } from './create-custom-jointjs-element.function'

export const jointJSCustomUmlElements: CustomJointJSElement[] = [
  createCustomJointJSElement(UmlActor, 'Actor', true),
  createCustomJointJSElement(UmlClass, 'Classifier', true),
  createCustomJointJSElement(TextBlock, 'Text-block', false),
  createCustomJointJSElement(UseCase, 'UseCase', true),
  createCustomJointJSElement(UmlInterface, 'Interface', false),
  createCustomJointJSElement(UmlEnum, 'Enum', false),
  createCustomJointJSElement(NoteElement, 'NoteElement', true),
]

export const jointJSCustomUmlElementViews: CustomJointJSElementView[] = [
  createCustomJointJSElementView(TextBlockView, 'custom.uml.TextBlockView'),
  createCustomJointJSElementView(NoteElementView, 'custom.uml.NoteElementView'),
]
