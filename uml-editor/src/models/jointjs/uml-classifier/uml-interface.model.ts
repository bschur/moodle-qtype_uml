import { dia, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from '../custom-jointjs-element.model'
import { TextBlock } from '../text-block.model'
import { IUmlClassifierModel } from './IUml-classifier.model'
import { UmlClass } from './uml-class.model'

type UmlClassSectors = 'header' | 'headerlabel' | 'functionsRect'

const initialWidth = 150
const initialHeight = 80
const listItemHeight = 20

export class UmlInterface extends shapes.standard.Rectangle implements IUmlClassifierModel {
  override readonly markup = [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'headerlabel',
    },
    {
      tagName: 'rect',
      selector: 'header',
    },
    {
      tagName: 'rect',
      selector: 'functionsRect',
    },
  ]

  constructor(coordinates: { x: number; y: number }) {
    super()
    this.position(coordinates)
  }

  private get functionsComponentAllHeight(): number {
    return initialHeight - 2 * listItemHeight + (this.functionComponents?.length || 0) * listItemHeight
  }

  private readonly functionComponents: shapes.standard.TextBlock[] = []

  private headerComponent: TextBlock | null = null

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.Interface',
      size: {
        width: initialWidth,
        height: initialHeight,
      },
      attrs: {
        body: {
          rx: 0,
          ry: 0,
          strokeWidth: 4,
          stroke: 'black',
        },
        ['headerlabel' satisfies UmlClassSectors]: {
          text: '<<Interface>>',
          width: '100%', // Assuming you want the label to occupy the entire width of the body
          height: listItemHeight,
          'ref-y': 0,
          'ref-x': 0.5, // Adjust reference to center horizontally
          'text-anchor': 'middle', // Center align text horizontally
          ref: 'body',
          fill: 'black',
        },
        ['header' satisfies UmlClassSectors]: {
          width: initialWidth - 8,
          height: listItemHeight,
          'ref-y': listItemHeight,

          'text-anchor': 'middle',
          ref: 'body',
          fill: 'white',
        },
        ['functionsRect' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: this.functionsComponentAllHeight,
          stroke: 'black',
          strokeWidth: 3,
          'ref-y': 2 * listItemHeight,
          'ref-x': 0,
          ref: 'body',
          fill: 'white',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  resizeInlineContainer(direction: number, container: UmlClassSectors) {
    const bodyheigth = (this.size().height += listItemHeight * direction)
    this.resize(this.size().width, bodyheigth)
    this.attr(container + '/height', bodyheigth - 2 * listItemHeight)
  }

  // @ts-ignore
  userInput(evt: dia.Event) {
    const selectedRect = evt.target.attributes[0].value as UmlClassSectors | string

    const newTextBlockElement = new TextBlock()

    let positionY = 0
    switch (selectedRect) {
      case 'header':
        newTextBlockElement.position(this.position().x, this.position().y + listItemHeight)
        newTextBlockElement.resize(this.size().width, listItemHeight)

        this.headerComponent = newTextBlockElement
        break
      case 'functionsRect':
        positionY = this.position().y + 2 * listItemHeight + this.functionComponents.length * listItemHeight
        newTextBlockElement.position(this.position().x, positionY)
        newTextBlockElement.resize(this.size().width, listItemHeight)
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

  shrinkFuncY(indexOfComponentToRemove: number) {
    this.functionComponents.forEach((component, index) => {
      if (index >= indexOfComponentToRemove) {
        const p = component.position()
        component.position(p.x, p.y - listItemHeight)
      }
    })
  }

  private get listItemWidth(): number {
    let width = initialWidth
    try {
      width = this.size().width
    } catch (e) {
      console.debug(e)
    }
    return width - 1
  }

  override resize(width: number, height: number) {
    width = Math.max(width, initialWidth)
    const minHeigth = this.functionComponents.length * 30 + 2 * listItemHeight
    if (height < minHeigth) {
      height = minHeigth
    }

    super.resize(width, height)

    // Update subelements
    this.attr('header/width', width)

    this.attr('functionsRect' satisfies UmlClassSectors, {
      width: width,
      height: this.functionsComponentAllHeight,
      'ref-y': 2 * listItemHeight,
    })

    this.functionComponents.forEach(component => {
      component.resize(this.listItemWidth, listItemHeight)
    })
    return this
  }

  convertToClass(): UmlClass {
    return new UmlClass(/* Pass necessary parameters */)
  }

  convertToInterface(): UmlInterface {
    return this // Already an interface
  }
}
