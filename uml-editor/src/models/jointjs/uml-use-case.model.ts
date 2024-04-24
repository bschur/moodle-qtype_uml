import { shapes, util } from '@joint/core'
import { UseCaseConfigurationComponent } from '../../shared/use-case-configuration/use-case-configuration.component'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

let width = 150
let heigth = 100
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
          //opacity: '100%',
          strokeWidth: 4,
          stroke: 'black',
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
          fill: 'red',
        },
      },
    }
    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

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
