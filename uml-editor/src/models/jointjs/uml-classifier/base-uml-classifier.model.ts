import { dia, mvc, shapes } from '@joint/core'
import { TextBlock } from '../text-block.model'
import Size = dia.Size

export type UmlClassSectors = 'header' | 'headerlabel' | 'variablesRect' | 'functionsRect'

export abstract class BaseUmlClassifierModel extends shapes.standard.Rectangle {
  protected functionComponents: TextBlock[] = []
  headerComponent: TextBlock | null = null

  protected abstract initialWidth: number

  protected abstract listItemHeight: number

  protected get listItemWidth(): number {
    let width = this.initialWidth
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
        component.position(p.x, p.y - this.listItemHeight)
      }
    })
  }

  userInput(evt: dia.Event) {
    const selectedRect = evt.target.attributes[0].value as UmlClassSectors | string

    const newTextBlockElement = new TextBlock()

    let positionY = 0
    switch (selectedRect) {
      case 'header':
        newTextBlockElement.position(this.position().x, this.position().y + this.listItemHeight)
        //newTextBlockElement.size(20, listItemHeight)

        this.headerComponent = newTextBlockElement
        break
      case 'functionsRect':
        positionY = this.position().y + 2 * this.listItemHeight + this.functionComponents.length * this.listItemHeight
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

  resizeInlineContainer(direction: number, container: UmlClassSectors) {
    const bodyheigth = (this.size().height += this.listItemHeight * direction)
    this.resize(this.size().width, bodyheigth)
    this.attr(container + '/height', bodyheigth - 2 * this.listItemHeight)
  }

  adjustByDelete(selectedRect: UmlClassSectors, posY: number) {
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

  public abstract convertToInterface(): BaseUmlClassifierModel

  public abstract convertToEnum(): BaseUmlClassifierModel

  public abstract convertToClass(): BaseUmlClassifierModel

  public override initialize(
    attributes?: shapes.standard.RectangleAttributes,
    options?: mvc.CombinedModelConstructorOptions<never, this>,
    position?: { x: number; y: number },
    size?: Size,
    functionComponents?: TextBlock[]
  ) {
    super.initialize(attributes, options)
    if (position != undefined) this.position(position.x, position.y)
    if (size != undefined) this.resize(size.width, size.height)
    if (functionComponents != undefined) this.functionComponents = functionComponents
  }

  setAbstract() {
    this.headerComponent?.changeAbstract()
  }
}
