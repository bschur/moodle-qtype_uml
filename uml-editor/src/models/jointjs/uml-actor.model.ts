import { dia, mvc, shapes, util } from '@joint/core'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { TextBlock } from './text-block.model'

const legsY = 0.7
const bodyY = 0.3
const headY = 0.15

const COLORS = ['#3f84e5', '#49306B', '#fe7f2d', '#ad343e', '#899e8b', '#ede9e9', '#b2a29f', '#392F2D']

export class UmlActor extends dia.Element {
  private textBlockMarkup: dia.MarkupJSON | undefined // Placeholder for TextBlock markup

  override initialize(
    attributes?: shapes.standard.RectangleAttributes,
    options?: mvc.CombinedModelConstructorOptions<never, this>
  ) {
    super.initialize(attributes, options)
    // Initialize textBlockMarkup with TextBlock markup
    this.textBlockMarkup = new TextBlock().markup
    this.markup = [
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
      ...(this.textBlockMarkup || []),
    ]
  }

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
        ['foreignObject']: {
          width: 40,
          height: 20,
          x: 0,
          y: 85,
          //y: 'calc(h + 10)',
          //x: 'calc(0.5 * w)',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }
}
