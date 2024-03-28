import { dia } from '@joint/core'

export function convertToNormalLine(link: dia.Link) {
  link.attr('line/strokeDasharray', 'none')
  link.attr('line/strokeDashoffset', 'none')
}

export function convertToDottedLine(link: dia.Link) {
  link.attr('line/strokeDasharray', '5 5')
  link.attr('line/strokeDashoffset', 7.5)
}

/**
 * For JointJS it's necessary to define markers before using them.
 * See: https://resources.jointjs.com/docs/jointjs/v4.0/joint.html#dia.Paper.prototype.defineMarker
 * @param paper
 */
export function defineMarkers(paper: dia.Paper) {
  paper.defineMarker({
    id: 'outlined',
    markup: [
      {
        tagName: 'circle',
        attributes: {
          cx: '6',
          cy: '0',
          r: '12',
          fill: '#7b5cce',
        },
      },
      {
        tagName: 'polygon',
        attributes: {
          points: '0,0 6,6 12,0 6,-6',
          fill: '#d63865',
          stroke: '#fff',
        },
      },
    ],
  })
}
