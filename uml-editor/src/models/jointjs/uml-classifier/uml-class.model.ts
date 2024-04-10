import { dia, shapes, util } from '@joint/core'
import { ClassifierConfigurationComponent } from '../../../shared/classifier-configuration/classifier-configuration.component'
import { CustomJointJSElementAttributes } from '../custom-jointjs-element.model'
import { TextBlock } from '../text-block.model'
import { BaseUmlClassifierModel, UmlClassSectors } from './base-uml-classifier.model'

const initialWidth = 150
const initialHeight = 120
const listItemHeight = 20
const headerHeigth = 40

export class UmlClass extends BaseUmlClassifierModel {
  override readonly initialWidth = initialWidth
  override readonly listItemHeight = listItemHeight

  private readonly variableComponents: TextBlock[] = []

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
    const initialHeightPerContainer = (initialHeight - headerHeigth) / 2

    try {
      const amountInputs = this.variablesComponentAllHeight + this.functionsComponentAllHeight
      const heigthBothContainer = this.size().height - headerHeigth - amountInputs

      if (amountInputs == 0) {
        return heigthBothContainer / 2
      }

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

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.Classifier',
      propertyView: ClassifierConfigurationComponent,
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
          text: '<<Static>>',
          width: '100%', // Assuming you want the label to occupy the entire width of the body
          height: listItemHeight,
          'ref-y': 0,
          'ref-x': 0.5, // Adjust reference to center horizontally
          'text-anchor': 'middle', // Center align text horizontally
          ref: 'body',
          fill: 'black',
        },
        ['header' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: listItemHeight,
          'ref-y': listItemHeight,
          'ref-x': 0,
          'text-anchor': 'middle',
          ref: 'body',
          fillOpacity: 0,
        },
        ['variablesRect' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: this.inlineContainerHeight('functionsRect'),
          stroke: 'black',
          strokeWidth: 3,
          'ref-y': headerHeigth,
          'ref-x': 0,
          ref: 'body',
          fill: 'white',
        },
        ['functionsRect' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: this.inlineContainerHeight('functionsRect'),
          stroke: 'black',
          strokeWidth: 3,
          'ref-dy': -this.inlineContainerHeight('variablesRect'),
          'ref-x': 0,
          ref: 'body',
          fill: 'white',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  override userInput(evt: dia.Event, rect?: string) {
    const selectedRect = rect || (evt.target.attributes[0].value as UmlClassSectors | string)

    const newTextBlockElement = new TextBlock()
    newTextBlockElement.attr('ref', selectedRect)

    let positionY = 0
    switch (selectedRect) {
      case 'header':
        newTextBlockElement.position(this.position().x, this.position().y + listItemHeight)
        newTextBlockElement.resize(this.size().width - 10, listItemHeight)

        this.headerComponent = newTextBlockElement
        break
      case 'variablesRect':
        positionY = this.position().y + headerHeigth + this.variablesComponentAllHeight
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
          headerHeigth +
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

  override resizeInlineContainer(direction: number, container: UmlClassSectors) {
    this.resize(this.size().width, (this.size().height += listItemHeight * direction))
    this.attr(container + '/height', this.inlineContainerHeight(container))
  }

  override adjustByDelete(selectedRect: UmlClassSectors, posY: number) {
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

  override resize(width: number, height: number) {
    width = Math.max(width, initialWidth)
    const minHeigth = this.variablesComponentAllHeight + this.functionsComponentAllHeight + 1.5 * headerHeigth
    if (height < minHeigth) {
      height = minHeigth
    }

    console.log(height)
    super.resize(width, height)

    // Update subelements
    this.attr('header/width', width)

    this.attr('variablesRect' satisfies UmlClassSectors, {
      width: width,
      height: this.inlineContainerHeight('variablesRect'),
      'ref-y': headerHeigth,
    })
    this.attr('functionsRect' satisfies UmlClassSectors, {
      width: width,
      height: this.inlineContainerHeight('functionsRect'),
      'ref-dy': -this.inlineContainerHeight('functionsRect'),
    })

    this.variableComponents.forEach(component => {
      component.resize(this.listItemWidth, listItemHeight)
    })

    let counter = 0
    this.functionComponents.forEach(component => {
      component.resize(this.listItemWidth, listItemHeight)

      let y = this.position().y + headerHeigth + this.inlineContainerHeight('variablesRect') + counter

      //dont know why this works
      if (y - component.position().y == listItemHeight) {
        y -= listItemHeight
      }
      component.position(component.position().x, y)

      counter += listItemHeight
    })

    return this
  }
}
