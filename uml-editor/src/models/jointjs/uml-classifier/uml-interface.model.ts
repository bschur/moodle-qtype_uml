import { dia, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from '../custom-jointjs-element.model'
import { IUmlClassifierModel } from './IUml-classifier.model'
import { UmlClass } from './uml-class.model'

type UmlClassSectors = 'header' | 'variablesRect' | 'functionsRect'

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
        ['functionsRect' satisfies UmlClassSectors]: {
          width: initialWidth,
          height: initialHeight - listItemHeight,
          stroke: 'black',
          strokeWidth: 3,
          'ref-y': listItemHeight,
          'ref-x': 0,
          ref: 'body',
          fill: 'white',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  // @ts-ignore
  userInput(evt: dia.Event) {
    return null
  }

  convertToClass(): UmlClass {
    return new UmlClass(/* Pass necessary parameters */)
  }

  convertToInterface(): UmlInterface {
    return this // Already an interface
  }
}
