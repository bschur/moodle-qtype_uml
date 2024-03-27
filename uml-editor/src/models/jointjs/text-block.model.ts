import { dia, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'

export const TextBlockView = dia.ElementView.extend({
  events: {
    'input input': 'onInput',
  },
  onInput: function (event: dia.Event) {
    this.model.attr('text/props/value', event.target.value)
  },
})

export class TextBlock extends dia.Element {
  override readonly markup = util.svg`
    <foreignObject @selector="foreignObject" style=" position: relative;">
      <div xmlns="http://www.w3.org/1999/xhtml" style="position: absolute;  left: 4px; width: 100%; height: 100%;">
        <input 
            @selector="text" 
            type="text" 
            name="text" 
            placeholder="Type something"
            style="width: 100%; height: 100%;  border: none;
            outline: none;
            background: none;"
        />
      </div>
    </foreignObject>
`

  // Override the defaults if necessary
  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'custom.uml.TextBlock',
      resizeable: false,
      attrs: {
        foreignObject: {
          width: 'calc(w-6)',
          height: 'calc(h)',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }
}
