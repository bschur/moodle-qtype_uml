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

const markup = [
  {
    tagName: 'foreignObject',
    selector: 'foreignObject',
    children: [
      {
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        tagName: 'div',
        selector: 'div',
        children: [
          {
            namespaceURI: 'http://www.w3.org/1999/xhtml',
            tagName: 'input',
            selector: 'text',
          },
        ],
      },
    ],
  },
]

const defaultAttrs = {
  foreignObject: {
    width: 'calc(w-6)',
    height: 'calc(h)',
    style: {
      position: 'relative',
    },
  },
  div: {
    style: {
      height: '100%',
      width: '100%',
      left: '4px',
      position: 'absolute',
    },
  },
  text: {
    type: 'text',
    name: 'text',
    placeholder: 'Type something',
    style: {
      height: '100%',
      width: '100%',
      border: 'none',
      outline: 'none',
      background: 'none',
      'font-size': '14px',
      'font-family': 'sans-serif',
      'text-align': 'left',
      'font-weight': 'normal',
    },
  },
}

export class TextBlock extends dia.Element {
  override readonly markup = [...markup]

  get inputElement() {
    return this.attr('text') as (typeof defaultAttrs)['text']
  }

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'custom.uml.TextBlock',
      resizeable: false,
      attrs: { ...defaultAttrs },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  makeBold() {
    this.inputElement.style['font-weight'] = 'bold'
    this.inputElement.style['text-align'] = 'center'
    this.inputElement.style['font-size'] = '16px'
  }
}
