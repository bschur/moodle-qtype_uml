import { dia, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

type UmlClassSectors = 'header' | 'variablesRect' | 'functionsRect'

const initialWidth = 150
const initialHeight = 100

const listItemHeight = 20

export class UmlClass extends shapes.standard.Rectangle {
  override readonly markup = [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'header',
    },
    {
      tagName: 'rect',
      selector: 'variablesRect',
    },
    {
      tagName: 'rect',
      selector: 'functionsRect',
    },
  ]

  private get variablesComponentAllHeight(): number {
    return (this.variableComponents?.length || 0) * listItemHeight
  }

  private get functionsComponentAllHeight(): number {
    return (this.functionComponents?.length || 0) * listItemHeight
  }

  private inlineContainerHeight(container: UmlClassSectors): number {
    const initialHeightPerContainer = (initialHeight - listItemHeight) / 2

    try {
      const amountInputs = this.variablesComponentAllHeight + this.functionsComponentAllHeight
      const heigthBothContainer = this.size().height - listItemHeight - amountInputs
      const heigthWithoutInputs = this.size().height - listItemHeight

      if (amountInputs == 0) {
        return heigthBothContainer / 2
      }
      /*
      let rationVariable = (heigthWithoutInputs / amountInputs) * Math.max(this.variablesComponentAllHeight, 1)
      let rationFunc = (heigthWithoutInputs / amountInputs) * Math.max(this.functionsComponentAllHeight, 1)

      if (container === 'variablesRect') {
        if (rationVariable == heigthWithoutInputs) {
          rationVariable -= heigthBothContainer / 2
        } else if (this.variablesComponentAllHeight == 0) {
          return heigthBothContainer / 2
        }
        return rationVariable
      } else {
        console.log('wtgf')
        if (rationFunc == heigthWithoutInputs) {
          rationFunc -= heigthBothContainer / 2
        } else if (this.functionsComponentAllHeight == 0) {
          return heigthBothContainer / 2
        }

        return rationFunc*/
      if (container === 'variablesRect') {
        return this.variablesComponentAllHeight + heigthBothContainer / 2
      } else {
        return this.functionsComponentAllHeight + heigthBothContainer / 2
      }
    } catch (e) {
      if (container === 'variablesRect') {
        return initialHeightPerContainer
      } else {
        return initialHeightPerContainer
      }
    }
  }

  private get listItemWidth(): number {
    let width = initialWidth
    try {
      width = this.size().width
    } catch (e) {
      console.debug(e)
    }
    return width - 5
  }

  private readonly functionComponents: shapes.standard.TextBlock[] = []
  private readonly variableComponents: shapes.standard.TextBlock[] = []

  private headerComponent: TextBlock | null = null

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.Classifier',
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
        ['header' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: listItemHeight,
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'Arial, helvetica, sans-serif',
          'ref-y': 0,
          'ref-x': 0,
          ref: 'body',
          'text-anchor': 'middle',
          stroke: 'black',
          strokeWidth: 3,
          fill: 'white',
        },
        ['variablesRect' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: this.inlineContainerHeight('functionsRect'),
          stroke: 'black',
          strokeWidth: 3,
          'ref-y': listItemHeight,
          'ref-x': 0,
          ref: 'body',
          fill: 'blue',
        },
        ['functionsRect' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: this.inlineContainerHeight('functionsRect'),
          stroke: 'black',
          strokeWidth: 3,
          'ref-dy': -this.inlineContainerHeight('variablesRect'),
          'ref-x': 0,
          ref: 'body',
          fill: 'red',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  userInput(evt: dia.Event) {
    const selectedRect = evt.target.attributes[0].value as UmlClassSectors | string

    const newTextBlockElement = new TextBlock()
    newTextBlockElement.attr('ref', selectedRect)

    let positionY = 0
    switch (selectedRect) {
      case 'header':
        newTextBlockElement.position(this.position().x, this.position().y)
        newTextBlockElement.resize(this.size().width, this.size().height)

        this.headerComponent = newTextBlockElement
        break
      case 'variablesRect':
        positionY = this.position().y + listItemHeight + this.variablesComponentAllHeight
        newTextBlockElement.position(this.position().x, positionY)
        newTextBlockElement.resize(this.listItemWidth, listItemHeight)
        this.variableComponents.push(newTextBlockElement)
        this.resizeInlineContainer(1, 'variablesRect')
        this.functionComponents.forEach(component => {
          const p = component.position()
          component.position(p.x, p.y + listItemHeight)
        })
        break
      case 'functionsRect':
        positionY =
          this.position().y +
          listItemHeight +
          this.inlineContainerHeight('variablesRect') +
          this.functionsComponentAllHeight

        newTextBlockElement.position(this.position().x, positionY)
        newTextBlockElement.resize(this.listItemWidth, listItemHeight)
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
    this.resize(this.size().width, (this.size().height += listItemHeight * direction))
    this.attr(container + '/height', this.inlineContainerHeight(container))
  }

  adjustByDelete(selectedRect: UmlClassSectors, posY: number) {
    let indexOfComponentToRemove = -1

    switch (selectedRect) {
      case 'variablesRect':
        indexOfComponentToRemove = this.variableComponents.findIndex(component => component.position().y === posY)

        if (indexOfComponentToRemove !== -1) {
          // Remove the component from the array
          this.variableComponents.splice(indexOfComponentToRemove, 1)

          // Adjust the position of subsequent components
          this.variableComponents.forEach((component, index) => {
            if (index >= indexOfComponentToRemove) {
              const p = component.position()
              component.position(p.x, p.y - listItemHeight)
            }
          })
          this.shrinkFuncY(0)
        } else {
          console.log('Component not found')
        }

        this.resizeInlineContainer(-1, 'variablesRect')

        break
      case 'functionsRect':
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
        break
    }
  }

  shrinkFuncY(indexOfComponentToRemove: number) {
    this.functionComponents.forEach((component, index) => {
      if (index >= indexOfComponentToRemove) {
        const p = component.position()
        component.position(p.x, p.y - listItemHeight)
      }
    })
  }

  override resize(width: number, height: number) {
    width = Math.max(width, initialWidth)
    /*const minHeigth =
      this.inlineContainerHeight('variablesRect') + this.inlineContainerHeight('functionsRect') + listItemHeight
    if (height < minHeigth) {
      height = minHeigth
    }*/

    super.resize(width, height)

    // Update subelements
    this.attr('header/width', width)

    this.attr('variablesRect' satisfies UmlClassSectors, {
      width: width,
      height: this.inlineContainerHeight('variablesRect'),
      'ref-y': listItemHeight,
    })
    this.attr('functionsRect' satisfies UmlClassSectors, {
      width: width,
      height: this.inlineContainerHeight('functionsRect'),
      'ref-dy': -this.inlineContainerHeight('functionsRect'),
    })

    this.variableComponents.forEach(component => {
      component.resize(this.listItemWidth, listItemHeight)
    })

    this.functionComponents.forEach(component => {
      component.resize(this.listItemWidth, listItemHeight)
      //component.position(component.position().x, component.position().y - diffY / 2)
    })

    this.headerComponent?.resize(width, height)

    return this
  }
}
