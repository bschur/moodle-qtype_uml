import { dia, util } from 'jointjs'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'

export const TextBlockView = dia.ElementView.extend({
  markup: [],

  events: {
    'input input': 'onInput',
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onInput(event: any) {
    console.log('Input Value:', event.target.value)
    this.model.attr('name/props/value', event.target.value)
  },
})

export class TextBlock extends dia.Element {
  // Override the defaults if necessary
  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'custom.uml.TextBlock',
      attrs: {
        foreignObject: {
          width: 'calc(w)',
          height: 'calc(h)',
        },
      },
      // Custom markup with input and button elements
      markup: util.svg/* xml */ `
                <foreignObject @selector="foreignObject">
                    <div
                           xmlns="http://www.w3.org/1999/xhtml"
                        style="width: 100%; height: 100%;"
                        >
                        <input 
                            @selector="name" 
                            type="text" 
                            name="name" 
                            placeholder="Type something"
                            style="width: 100%; height: 100%;"
                        />
                    </div>
                </foreignObject>
            `,
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  // Method to create the variable component
  public createVariableComponent(ref: string, x: number, y: number, textBlockSize: any) {
    // Define a new custom form element
    // Create an instance of the custom form element
    console.log(textBlockSize)
    const form = this
    form.position(x, y)
    form.resize(textBlockSize.width, textBlockSize.height)
    form.attr('ref', ref)

    // Define the handleInput method

    return form
  }
}
