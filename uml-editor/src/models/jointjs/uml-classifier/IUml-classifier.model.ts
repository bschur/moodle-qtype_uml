import { dia, shapes } from '@joint/core'
import { TextBlock } from '../text-block.model'

const initialWidth = 150
const listItemHeight = 20

export abstract class UmlClassifierModel extends shapes.standard.Rectangle {
  protected functionComponents: TextBlock[] = []
  protected headerComponent: TextBlock | null = null
  UmlClassSectors!: 'header' | 'headerlabel' | 'variablesRect' | 'functionsRect'

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

  userInput(evt: dia.Event) {
    const selectedRect = evt.target.attributes[0].value as this['UmlClassSectors'] | string

    const newTextBlockElement = new TextBlock()

    let positionY = 0
    switch (selectedRect) {
      case 'header':
        newTextBlockElement.position(this.position().x, this.position().y + listItemHeight)
        //newTextBlockElement.size(20, listItemHeight)

        this.headerComponent = newTextBlockElement
        break
      case 'functionsRect':
        positionY = this.position().y + 2 * listItemHeight + this.functionComponents.length * listItemHeight
        newTextBlockElement.position(this.position().x, positionY)
        //newTextBlockElement.resize(this.size().width, listItemHeight)
        this.functionComponents.push(newTextBlockElement)
        this.resizeInlineContainer(1, 'functionsRect')
        break
      default:
        console.log('Clicked outside the sections')
        return null
    }

    this.embed(newTextBlockElement)
    return newTextBlockElement
  }

  resizeInlineContainer(direction: number, container: this['UmlClassSectors']) {
    const bodyheigth = (this.size().height += listItemHeight * direction)
    this.resize(this.size().width, bodyheigth)
    this.attr(container + '/height', bodyheigth - 2 * listItemHeight)
  }

  adjustByDelete(selectedRect: this['UmlClassSectors'], posY: number) {
    let indexOfComponentToRemove = -1

    indexOfComponentToRemove = this.functionComponents.findIndex(component => component.position().y === posY)

    if (indexOfComponentToRemove !== -1) {
      // Remove the component from the array
      this.functionComponents.splice(indexOfComponentToRemove, 1)

      // Adjust the position of subsequent components
      this.shrinkFuncY(indexOfComponentToRemove)
    } else {
      console.log('Component not found')
    }

    this.resizeInlineContainer(-1, 'functionsRect')
  }

  public abstract convertToInterface(): UmlClassifierModel
  public abstract convertToEnum(): UmlClassifierModel
  public abstract convertToClass(): UmlClassifierModel
}
