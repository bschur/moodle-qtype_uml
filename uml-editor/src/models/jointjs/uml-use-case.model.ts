import { dia, util } from 'jointjs'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

export class UseCase extends dia.Element {
  override markup = [
    ...util.svg`
            <ellipse @selector="body" />
        `,
    {
      tagName: 'textBox',
      selector: 'textBox',
    },
  ]

  userInput() {
    const ctb = new TextBlock()

    const variableComponent = ctb.createVariableComponent('textBox', this.position().x, this.position().y, {
      width: 100,
      height: 30,
    })

    // Alternatively, store the textbox reference for further manipulation
    this.embed(variableComponent)
    return variableComponent
  }

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'UseCase',

      attrs: {
        root: {
          highlighterSelector: 'body',
        },
        body: {
          cx: 'calc(1 * w)',
          cy: 'calc(1 * h)',
          rx: 'calc(60 * w)',
          ry: 'calc(30 * h)',
          stroke: '#000000',
          strokeWidth: 2,
          fill: '#ffffff',
        },
        textBox: {
          width: 20,
          height: 20,
          stroke: 'black',
          strokeWidth: 3,
          fill: 'white',
        },
      },
    }
    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }
}
