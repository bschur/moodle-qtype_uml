import { shapes, util } from '@joint/core'
import { UseCaseConfigurationComponent } from '../../shared/use-case-configuration/use-case-configuration.component'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

let width = 150
let heigth = 100
let isTextBox = false
export class UseCase extends shapes.standard.Rectangle {
  override readonly markup = [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'ellipse',
      selector: 'ellipse',
      children: [
        {
          tagName: 'textBox',
          selector: 'textBox',
        },
      ],
    },
  ]

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.UseCase',
      propertyView: UseCaseConfigurationComponent,
      size: {
        width: width,
        height: heigth,
      },
      attrs: {
        body: {
          opacity: 0,
        },
        ['ellipse']: {
          width: '100%',
          height: '100%',
          stroke: 'black',
          strokeWidth: 3,
          rx: width / 2,
          ry: heigth / 2,
          'ref-y': 0.5,
          'ref-x': 0.5,
          'ref-Cy': 0.5,
          'ref-Cx': 0.5,
          ref: 'body',
          fill: 'white',
        },
      },
    }
    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  userInput() {
    if (!isTextBox) {
      const ctb = new TextBlock()

      ctb.size(this.size().width - 5, this.size().height / 2)
      const tbWidth = this.position().x + width / 2 - ctb.size().width / 2
      const tbHeight = this.position().y + heigth / 2 - ctb.size().height / 2
      ctb.position(tbWidth, tbHeight)

      ctb.attr('ref', 'ellipse')

      isTextBox = true
      this.embed(ctb)
      return ctb
    }
    return null
  }

  override resize(widthNew: number, heightNew: number) {
    super.resize(widthNew, heightNew)
    heigth = heightNew
    width = widthNew

    this.attr('ellipse', {
      rx: width / 2,
      ry: heigth / 2,
    })

    return this
  }
}
