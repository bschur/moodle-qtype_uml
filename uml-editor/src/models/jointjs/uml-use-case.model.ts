import { shapes, util } from '@joint/core'
import { UseCaseConfigurationComponent } from '../../shared/use-case-configuration/use-case-configuration.component'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

const initialWidth = 150
const initialHeight = 120

const markup = [
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

type MarkupTags = (typeof markup)[number]['selector']

export class UseCase extends shapes.standard.Rectangle {
  override readonly markup = markup

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.UseCase',
      propertyView: UseCaseConfigurationComponent,
      size: {
        width: initialWidth,
        height: initialHeight,
      },
      isTextBox: false,
      attrs: {
        body: {
          opacity: 0,
        },
        ['ellipse' satisfies MarkupTags]: {
          width: '100%',
          height: '100%',
          stroke: 'black',
          strokeWidth: 3,
          rx: initialWidth / 2,
          ry: initialHeight / 2,
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
    if (!this.attr('isTextBox')) {
      const ctb = new TextBlock()

      ctb.size(this.size().width - 5, this.size().height / 2)
      const tbWidth = this.position().x + this.size().width / 2 - ctb.size().width / 2
      const tbHeight = this.position().y + this.size().height / 2 - ctb.size().height / 2
      ctb.position(tbWidth, tbHeight)

      ctb.attr('ref', 'ellipse' satisfies MarkupTags)

      this.set('isTextBox', true)
      this.embed(ctb)
      return ctb
    }
    return null
  }

  override resize(widthNew: number, heightNew: number) {
    super.resize(widthNew, heightNew)

    this.attr('ellipse' satisfies MarkupTags, {
      rx: widthNew / 2,
      ry: heightNew / 2,
    })

    return this
  }
}
