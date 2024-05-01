import { dia, mvc, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'
const initialWidth = 150
const initialHeight = 80
const listItemHeight = 20

export class UMLSystem extends shapes.standard.Rectangle {
  private textBlockMarkup: dia.MarkupJSON | undefined // Placeholder for TextBlock markup

  override initialize(
    attributes?: shapes.standard.RectangleAttributes,
    options?: mvc.CombinedModelConstructorOptions<never, this>
  ) {
    super.initialize(attributes, options)
    // Initialize textBlockMarkup with TextBlock markup
    const tb = new TextBlock()
    tb.setToTitle()
    this.textBlockMarkup = tb.markup
    this.markup = [
      {
        tagName: 'rect',
        selector: 'body',
      },
      ...(this.textBlockMarkup || []),
    ]
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
        ['foreignObject']: {
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
