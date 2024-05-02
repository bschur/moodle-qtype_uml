import { mvc, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock, textBlockMarkup } from './text-block.model'

const initialWidth = 150
const initialHeight = 80
const listItemHeight = 20

const markup = [
  {
    tagName: 'rect',
    selector: 'body',
  },
  ...textBlockMarkup,
]

export class UMLSystem extends shapes.standard.Rectangle {
  override readonly markup = markup

  private _textBlock: TextBlock | undefined

  get textBlock() {
    if (!this._textBlock) {
      this._textBlock = new TextBlock()
    }

    return this._textBlock
  }

  override initialize(
    attributes?: shapes.standard.RectangleAttributes,
    options?: mvc.CombinedModelConstructorOptions<never, this>
  ) {
    super.initialize(attributes, options)

    this.textBlock.setToTitle()
  }

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.System',
      size: {
        width: initialWidth,
        height: initialHeight,
      },
      z: -1,
      attrs: {
        body: {
          rx: 0,
          ry: 0,
          strokeWidth: 4,
          stroke: 'black',
          fillOpacity: 0,
        },
        foreignObject: {
          ref: 'body',
          fill: 'black',
          width: initialWidth, // Assuming you want the label to occupy the entire width of the body
          height: listItemHeight,
          x: 0,
          y: 0,
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  override resize(width: number, height: number) {
    super.resize(width, height)
    this.attr('foreignObject/width', width)
    return this
  }
}
