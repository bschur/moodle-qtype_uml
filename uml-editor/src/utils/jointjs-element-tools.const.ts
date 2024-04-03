import { connectionStrategies, dia, elementTools, shapes } from '@joint/core'
import { TextBlock } from '../models/jointjs/text-block.model'
import { BaseUmlClassifierModel } from '../models/jointjs/uml-classifier/base-uml-classifier.model'

const ResizeTool = elementTools.Control.extend({
  children: [
    {
      tagName: 'image',
      selector: 'handle',
      attributes: {
        cursor: 'pointer',
        width: 20,
        height: 20,
        'xlink:href': 'https://assets.codepen.io/7589991/8725981_image_resize_square_icon.svg',
      },
    },
    {
      tagName: 'rect',
      selector: 'extras',
      attributes: {
        'pointer-events': 'none',
        fill: 'none',
        stroke: '#33334F',
        'stroke-dasharray': '2,4',
        rx: 2,
        ry: 2,
      },
    },
  ],
  getPosition: (view: dia.ElementView) => {
    const model = view.model
    const { width, height } = model.size()
    return { x: width, y: height }
  },
  setPosition: (view: dia.ElementView, coordinates: dia.Point) => {
    const model = view.model
    model.resize(Math.max(coordinates.x - 10, 1), Math.max(coordinates.y - 10, 1))
  },
})

export const paperHoverConnectToolOptions: dia.Paper.Options = {
  defaultLink: () => new shapes.standard.Link(),
  validateConnection: (cellViewS, _, cellViewT) => {
    const src = cellViewS.model
    const tgt = cellViewT.model
    if (src.isLink() || tgt.isLink()) return false
    return src !== tgt
  },
  defaultConnectionPoint: { name: 'anchor' },
  connectionStrategy: (endDefinition, endView, endMagnet, coords, link, endType) => {
    const bbox = endView.getNodeUnrotatedBBox(endMagnet)
    const p = bbox.pointNearestToPoint(coords)
    return connectionStrategies.pinRelative(endDefinition, endView, endMagnet, p, link, endType)
  },
  snapLinks: { radius: 10 },
  linkPinning: false,
}

export const globalElementToolsView = new dia.ToolsView({
  tools: [
    new ResizeTool(),
    new elementTools.HoverConnect(),
    new elementTools.Remove({
      scale: 1.2,
      action: (_, elementView) => {
        const target = elementView.model
        const parent = target.getParentCell()
        if (parent instanceof BaseUmlClassifierModel && target instanceof TextBlock) {
          const ref = elementView.model.attr('ref')
          const posY = elementView.model.position().y

          parent.adjustByDelete(ref, posY)
        }
        target.remove({ ui: true, tool: true })
      },
    }),
    new elementTools.Boundary({
      rotate: false,
      useModelGeometry: true,
    }),
  ],
})

export const internalElementToolsView = new dia.ToolsView({
  tools: [
    new elementTools.Remove({
      scale: 1.2,
      action: (_, elementView) => {
        const target = elementView.model
        const parent = target.getParentCell()
        if (parent instanceof BaseUmlClassifierModel && target instanceof TextBlock) {
          const ref = elementView.model.attr('ref')
          const posY = elementView.model.position().y

          parent.adjustByDelete(ref, posY)
        }
        target.remove({ ui: true, tool: true })
      },
    }),
  ],
})
