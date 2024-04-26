import { dia, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'

const legsY = 0.7
const bodyY = 0.3
const headY = 0.15

const COLORS = ['#3f84e5', '#49306B', '#fe7f2d', '#ad343e', '#899e8b', '#ede9e9', '#b2a29f', '#392F2D']

const markup = [
  {
    tagName: 'rect',
    selector: 'background',
  },
  {
    tagName: 'path',
    selector: 'body',
  },
  {
    tagName: 'circle',
    selector: 'head',
  },
  {
    tagName: 'text',
    selector: 'label',
  },
]

export class UmlActor extends dia.Element {
  override readonly markup = markup

  override defaults() {
    const elementAttributes: CustomJointJSElementAttributes<dia.Element.Attributes> = {
      type: 'custom.uml.Actor',
      size: {
        width: 40,
        height: 80,
      },
      attrs: {
        background: {
          width: 'calc(w)',
          height: 'calc(h)',
          fill: 'transparent',
        },
        body: {
          d: `M 0 calc(0.4 * h) h calc(w) M 0 calc(h) calc(0.5 * w) calc(${legsY} * h) calc(w) calc(h) M calc(0.5 * w) calc(${legsY} * h) V calc(${bodyY} * h)`,
          fill: 'none',
          stroke: COLORS[7],
          strokeWidth: 2,
        },
        head: {
          cx: 'calc(0.5 * w)',
          cy: `calc(${headY} * h)`,
          r: `calc(${headY} * h)`,
          stroke: COLORS[7],
          strokeWidth: 2,
          fill: '#ffffff',
        },
        label: {
          y: 'calc(h + 10)',
          x: 'calc(0.5 * w)',
          textAnchor: 'middle',
          textVerticalAnchor: 'top',
          fontSize: 14,
          fontFamily: 'sans-serif',
          fill: COLORS[7],
          textWrap: {
            width: 'calc(3 * w)',
            height: null,
          },
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }
}
