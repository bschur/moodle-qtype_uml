import { TextBlock } from '../text-block.model'
import { UmlClass } from './uml-class.model'
import { UmlInterface } from './uml-interface.model'

export interface IUmlClassifierModel {
  convertToClass(): UmlClass
  convertToInterface(): UmlInterface
  userInput(): TextBlock
}
