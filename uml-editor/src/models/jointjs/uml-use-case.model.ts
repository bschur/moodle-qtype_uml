import { shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

export class UseCase extends shapes.standard.Ellipse {
  override readonly markup = [
    {
      tagName: 'ellipse',
      selector: 'body',
      children: [
        {
          tagName: 'textBox',
          selector: 'textBox',
        },
      ],
    },
  ]

  userInput() {
    const ctb = new TextBlock()

    ctb.position().x = this.position().x
    ctb.position().y = this.position().y + (this.size().width - 5) / 4
    ctb.size().width = this.size().width - 5
    ctb.size().height = this.size().height / 2

    // Alternatively, store the textbox reference for further manipulation
    this.embed(ctb)
    return ctb
  }

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.EllipseAttributes> = {
      type: 'custom.uml.UseCase',
      size: {
        width: 95,
        height: 45,
      },
    }
    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }
}
