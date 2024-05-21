import { Type } from '@angular/core'
import { dia, mvc, shapes } from '@joint/core'
import { TextBlock } from '../text-block.model'
import Size = dia.Size

export const classSectors = ['header', 'headerlabel', 'variablesRect', 'functionsRect'] as const
export type UmlClassSectors = (typeof classSectors)[number]

export const classifierTypes = ['Class', 'Enum', 'Interface'] as const
export type ClassifierType = (typeof classifierTypes)[number]

export function convertTo<T extends BaseUmlClassifierModel>(clazz: Type<T>, model: BaseUmlClassifierModel): T {
  const element = new clazz()
  element.position(model.position().x, model.position().y)
  return element
}

export abstract class BaseUmlClassifierModel extends shapes.standard.Rectangle {
  protected abstract initialWidth: number
  protected abstract listItemHeight: number
  abstract readonly type: ClassifierType

  protected get listItemWidth(): number {
    let width = this.initialWidth
    try {
      width = this.size().width
    } catch (e) {
      console.debug(e)
    }
    return width - 1
  }

  get functionComponents(): TextBlock[] {
    if (!this._functionComponents) {
      this._functionComponents = []
    }

    return this._functionComponents
  }

  get headerComponent(): TextBlock {
    if (!this._headerComponent) {
      this._headerComponent = new TextBlock()
    }

    return this._headerComponent
  }

  set headerComponent(header: TextBlock) {
    if (!header) {
      return
    }

    if (this._headerComponent) {
      this._headerComponent.remove()
    }

    this._headerComponent = header
    this.graph.addCell(header)
  }

  get isAbstract() {
    return this.headerComponent.inputElement.style['font-family'] === 'cursive'
  }

  private _functionComponents?: TextBlock[]
  private _headerComponent?: TextBlock

  shrinkFuncY(indexOfComponentToRemove: number) {
    this.functionComponents.forEach((component, index) => {
      if (index >= indexOfComponentToRemove) {
        const p = component.position()
        component.position(p.x, p.y - this.listItemHeight)
      }
    })
  }

  convertTo<T extends BaseUmlClassifierModel>(clazz: Type<T>) {
    const newObj = convertTo(clazz, this)
    newObj.initialize(
      this.attributes,
      undefined,
      this.position(),
      this.size(),
      this.functionComponents,
      this.headerComponent
    )
    return newObj
  }

  userInput(evt: dia.Event) {
    const selectedRect = evt.target.attributes[0].value as UmlClassSectors

    const newTextBlockElement = new TextBlock()
    let positionY = 0
    switch (selectedRect) {
      case 'header':
        newTextBlockElement.position(this.position().x, this.position().y + this.listItemHeight)
        newTextBlockElement.resize(this.size().width - 10, this.listItemHeight)
        newTextBlockElement.makeBold()
        this.headerComponent = newTextBlockElement
        break
      case 'functionsRect':
        positionY = this.position().y + 2 * this.listItemHeight + this.functionComponents.length * this.listItemHeight
        newTextBlockElement.position(this.position().x, positionY)
        this.functionComponents.push(newTextBlockElement)
        this.resizeInlineContainer(1, 'functionsRect')
        break
      default:
        console.log('Clicked outside the sections')
        return
    }

    this.embed(newTextBlockElement)
    this.graph.addCell(newTextBlockElement)
  }

  resizeInlineContainer(direction: number, container: UmlClassSectors) {
    const bodyHeight = (this.size().height += this.listItemHeight * direction)
    this.resize(this.size().width, bodyHeight)
    this.attr(container + '/height', bodyHeight - 2 * this.listItemHeight)
  }

  adjustByDelete(_: UmlClassSectors, posY: number) {
    const indexOfComponentToRemove = this.functionComponents.findIndex(component => component.position().y === posY)

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

  override initialize(
    attributes?: shapes.standard.RectangleAttributes,
    options?: mvc.CombinedModelConstructorOptions<never, this>,
    position?: { x: number; y: number },
    size?: Size,
    functionComponents?: TextBlock[],
    headerComponent?: TextBlock
  ) {
    super.initialize(attributes, options)
    if (position) {
      this.position(position.x, position.y)
    }
    if (size) {
      this.resize(size.width, size.height)
    }
    if (functionComponents) {
      this.addFunction(functionComponents)
    }
    if (headerComponent) {
      this.addHeader(headerComponent)
    }
  }

  addFunction(functionComponents: TextBlock[]) {
    functionComponents.forEach(value => {
      const newTextBlockElement = new TextBlock()
      const positionY =
        this.position().y + 2 * this.listItemHeight + this.functionComponents.length * this.listItemHeight
      newTextBlockElement.position(this.position().x, positionY)
      newTextBlockElement.attr('text/props/value', value.attr('text/props/value'))
      this.functionComponents.push(newTextBlockElement)
      this.resizeInlineContainer(1, 'functionsRect')
      this.embed(newTextBlockElement)
    })
  }

  addHeader(header: TextBlock) {
    //const hc = new TextBlock()
    this.headerComponent.position(header.position().x, header.position().y)
    this.headerComponent.resize(this.initialWidth, this.listItemHeight)

    this.headerComponent.prop('markup', header.markup)
    this.headerComponent.attr('text/props/value', header.attr('text/props/value'))
    // this.headerComponent = hc

    this.embed(this.headerComponent)
  }

  toggleAbstract() {
    this.headerComponent.inputElement.style['font-family'] = this.isAbstract ? 'sans-serif' : '"system-ui", cursive'
    this.headerComponent.remove()
    this.graph.addCell(this.headerComponent)
  }
}
