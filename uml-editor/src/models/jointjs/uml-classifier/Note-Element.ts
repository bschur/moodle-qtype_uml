import { dia, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from '../custom-jointjs-element.model'
export const NoteElementView = dia.ElementView.extend({
  events: {
    'input input': 'onInput',
  },
  onInput: function (event: dia.Event) {
    this.model.attr('text/props/value', event.target.value)
  },
})

const initialWidth = 150
const initialHeight = 80
export class NoteElement extends shapes.standard.Rectangle {
  private backgroundColor = '#f5e487'
  override readonly markup = [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'header',
    },
    {
      tagName: 'text',
      selector: 'title',
    },
    {
      tagName: 'foreignObject',
      selector: 'foreignObject',
      children: [
        {
          tagName: 'div',
          namespaceURI: 'http://www.w3.org/1999/xhtml',
          selector: 'background',
          style: {
            width: '100%', // Adjust the width as needed
            height: '100%', // Adjust the height as needed
          },
          children: [
            {
              tagName: 'textarea',
              selector: 'input',
              style: {
                ['backgroundColor']: this.backgroundColor,
                font: '14px sans-serif',
                padding: '2px',
                margin: 0,
                resize: 'none', // Prevent resizing if desired
                width: '100%', // Adjust the width as needed
                height: '100%', // Adjust the height as needed
                //border: '1px solid black', // Optional border styling
              },
            },
          ],
        },
      ],
    },
  ]

  // Override the defaults if necessary
  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'custom.uml.NoteElement',
      size: {
        width: initialWidth,
        height: initialHeight,
      },
      attrs: {
        body: {
          rx: 0,
          ry: 0,
          strokeWidth: 4,
          stroke: 'black',
          fill: this.backgroundColor,
        },
        header: {
          ref: 'body',
          x: 0,
          y: 0,
          width: initialWidth,
          height: 20,
          fill: '#f5e487',
        },
        ['title']: {
          text: 'Note',
          width: '100%',
          height: 20,
          fontWeight: 'bold',
          'ref-y': 0,
          'ref-x': 0.5, // Adjust reference to center horizontally
          'text-anchor': 'middle', // Center align text horizontally
          ref: 'body',
        },
        foreignObject: {
          width: initialWidth,
          height: initialHeight - 20,
          x: 0,
          y: 20,
          ref: 'body',
        },
      },
      text: '',
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  override resize(width: number, height: number) {
    this.attr('body/width', width)
    this.attr('header/width', width)
    this.attr('foreignObject/width', width)
    this.attr('foreignObject/height', height - 20)
    super.resize(width, height)
    return this
  }
}
