import { shapes } from '@joint/core'
import { TextBlock } from '../text-block.model'
import { UmlClass } from './uml-class.model'
import { UmlInterface } from './uml-interface.model'

export interface IUmlClassifierModel {
  convertToClass(): UmlClass
  convertToInterface(): UmlInterface
  userInput(): TextBlock
}

const initialWidth = 150
const listItemHeight = 20

export class UmlClassifierModel extends shapes.standard.Rectangle {
  protected readonly functionComponents: shapes.standard.TextBlock[] = []
  protected headerComponent: TextBlock | null = null

  protected get listItemWidth(): number {
    let width = initialWidth
    try {
      width = this.size().width
    } catch (e) {
      console.debug(e)
    }
    return width - 1
  }

  shrinkFuncY(indexOfComponentToRemove: number) {
    this.functionComponents.forEach((component, index) => {
      if (index >= indexOfComponentToRemove) {
        const p = component.position()
        component.position(p.x, p.y - listItemHeight)
      }
    })
  }
}
