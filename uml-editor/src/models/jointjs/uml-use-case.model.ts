import { dia, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

export class UseCase extends dia.Element {
  override markup = [
    ...util.svg`
            <ellipse @selector="ellipse" />
        `,
    {
      tagName: 'textBox',
      selector: 'textBox',
    },
  ]

  userInput() {
    const ctb = new TextBlock()

    const variableComponent = ctb.createVariableComponent(
      'textBox',
      this.position().x,
      this.position().y + (this.size().width - 5) / 4,
      {
        width: this.size().width - 5,
        height: this.size().height / 2,
      }
    )

    // Alternatively, store the textbox reference for further manipulation
    this.embed(variableComponent)
    return variableComponent
  }

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'UseCase',

      size: {
        width: 60,
        height: 50,
      },
      attrs: {
        root: {
          highlighterSelector: 'body',
        },
        ellipse: {
          cx: 30,
          cy: 25,
          rx: 50,
          ry: 30,
          stroke: '#000000',
          strokeWidth: 2,
          fill: '#ffffff',
        },
      },
    }
    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }
  resizeOnPaper(coordinates: { x: number; y: number }) {
    const diffY = this.size().height - Math.max(coordinates.y, 1)
    const diffX = this.size().width - Math.max(coordinates.x, 1)

    this.scale(this.size().width / diffX, this.size().height / diffY)
    //this.body.cy = ...ö
  }
}
