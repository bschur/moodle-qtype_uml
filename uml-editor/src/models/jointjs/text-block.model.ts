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

export const textBlockMarkup = [
  {
    tagName: 'foreignObject',
    selector: 'foreignObject',
    attributes: {
      style: 'position: relative;',
    },
    style: {
      position: 'relative',
    },
    children: [
      {
        namespaceURI: 'http://www.w3.org/1999/xhtml',
        tagName: 'div',
        selector: 'div',
        attributes: {
          xmlns: 'http://www.w3.org/1999/xhtml',
        },
        style: {
          height: '100%',
          width: '100%',
          left: '4px',
          position: 'absolute',
        },
        children: [
          {
            namespaceURI: 'http://www.w3.org/1999/xhtml',
            tagName: 'input',
            selector: 'text',
            attributes: {
              type: 'text',
              name: 'text',
              placeholder: 'Type something',
            },
            style: {
              height: '100%',
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'none',
              'font-size': '14px',
              'font-family': 'sans-serif',
            },
          },
        ],
      },
    ],
  },
]

export class TextBlock extends dia.Element {
  override readonly markup = textBlockMarkup

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
      text: '',
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  changeAbstract() {
    const markup = this.markup
    const parsedMarkup = typeof markup === 'string' ? JSON.parse(markup) : markup
    const elem = parsedMarkup[0].children[0].children[0]
    const actualValue = elem.style.fontFamily || 'sans-serif'
    elem.style.fontFamily = actualValue === 'sans-serif' ? 'cursive' : 'sans-serif'
    this.prop('markup', parsedMarkup)
  }

  setToTitle() {
    const markup = this.markup
    const parsedMarkup = typeof markup === 'string' ? JSON.parse(markup) : markup
    const elem = parsedMarkup[0].children[0].children[0]
    elem.style['font-weight'] = 'bold'
    elem.style['text-align'] = 'center'
    elem.style['font-size'] = '16px'
    this.prop('markup', parsedMarkup)
  }

  setPlaceholder(text: string) {
    const markup = this.markup
    const parsedMarkup = typeof markup === 'string' ? JSON.parse(markup) : markup
    const elem = parsedMarkup[0].children[0].children[0]
    elem.attributes.placeholder = text
    this.prop('markup', parsedMarkup)
  }

  centerText() {
    const markup = this.markup
    const parsedMarkup = typeof markup === 'string' ? JSON.parse(markup) : markup
    const elem = parsedMarkup[0].children[0].children[0]
    elem.style['text-align'] = 'center'
    this.prop('markup', parsedMarkup)
  }
}
