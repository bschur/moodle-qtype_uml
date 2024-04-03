import { shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from '../custom-jointjs-element.model'
import { UmlClassifierModel } from './IUml-classifier.model'

type UmlClassSectors = 'header' | 'headerlabel' | 'functionsRect'

const initialWidth = 150
const initialHeight = 80
const listItemHeight = 20

export class UmlInterface extends UmlClassifierModel {
  override convertToInterface(): UmlClassifierModel {
    throw new Error('Method not implemented.')
  }
  override convertToEnum(): UmlClassifierModel {
    throw new Error('Method not implemented.')
  }
  override convertToClass(): UmlClassifierModel {
    throw new Error('Method not implemented.')
  }
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
      tagName: 'TextBlock',
      selector: 'header',
    },
    {
      tagName: 'rect',
      selector: 'functionsRect',
    },
  ]

  private get functionsComponentAllHeight(): number {
    return initialHeight - 2 * listItemHeight + (this.functionComponents?.length || 0) * listItemHeight
  }

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
      height: height - 2 * listItemHeight,
      'ref-y': 2 * listItemHeight,
    })

    this.functionComponents.forEach(component => {
      component.resize(super.listItemWidth, listItemHeight)
    })
    return this
  }
}
