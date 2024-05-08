import { mvc, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

const initialWidth = 150
const initialHeight = 80
const listItemHeight = 20

const markup = [
  {
    tagName: 'rect',
    selector: 'body',
    children: [
      {
        tagName: 'foreignObject',
        selector: 'foreignObject',
      },
    ],
  },
]

export class UMLSystem extends shapes.standard.Rectangle {
  override readonly markup = [...markup]

  private _textBlock!: TextBlock

  override initialize(
    attributes?: shapes.standard.RectangleAttributes,
    options?: mvc.CombinedModelConstructorOptions<never, this>
  ) {
    super.initialize(attributes, options)

    this._textBlock = new TextBlock()
    this._textBlock.makeBold()
    this._textBlock.attr('ref', 'foreignObject')

    // Use a custom event to add the child to the graph
    this.on('add', () => {
      this.synchronizeTextBlock()

      this.embed(this._textBlock)
      this.graph.addCell(this._textBlock)
    })
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
          fillOpacity: 0,
          strokeWidth: 4,
          stroke: 'black',
        },
        foreignObject: {
          width: initialWidth,
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
    this.synchronizeTextBlock()

    return this
  }

  private synchronizeTextBlock() {
    const parentPosition = this.position()
    const foreignObject = this.attr('foreignObject')

    this._textBlock.position(parentPosition.x + foreignObject.x, parentPosition.y + foreignObject.y)
    this._textBlock.resize(foreignObject.width, foreignObject.height)
  }
}
