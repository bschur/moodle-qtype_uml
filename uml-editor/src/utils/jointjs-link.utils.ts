import { dia } from '@joint/core'

/**
 * Utils for configuring link properties.
 * Since we do not provide a custom link and instead use the links from jointjs, we need to store the configuration in the link attributes.
 * For configurations possible with jointjs links ee: https://resources.jointjs.com/tutorial/links
 */

type LinkTargets = 'source' | 'target'
type LinkMarker = 'sourceMarker' | 'targetMarker'

export type JointJSLinkArrowType = 'normal' | 'outlined'
export type JointJSLinkLineType = 'normal' | 'dotted'

// @ts-ignore
export const jointJSArrows: JointJSLinkArrowType[] = ['normal', 'outlined'] as const
// @ts-ignore
export const jointJSLinks: JointJSLinkLineType[] = ['normal', 'dotted'] as const

export function swapDirection(link: dia.Link) {
  const source = link.prop('source' satisfies LinkTargets)
  link.prop('source' satisfies LinkTargets, link.prop('target' satisfies LinkTargets))
  link.prop('target' satisfies LinkTargets, source)
}

// region lines config

const lines: Record<JointJSLinkLineType, { strokeDasharray: string; strokeDashoffset: string | number }> = {
  normal: {
    strokeDasharray: 'none',
    strokeDashoffset: 'none',
  },
  dotted: {
    strokeDasharray: '5 5',
    strokeDashoffset: 7.5,
  },
}

export function readLinkLineType(link: dia.Link): JointJSLinkLineType {
  const linkType = link.attr('line/type')
  if (!linkType) {
    return 'normal'
  }

  return linkType as JointJSLinkLineType
}

export function changeLinkLineType(link: dia.Link, type: JointJSLinkLineType) {
  const config = lines[type]
  link.attr('line/type', type)
  link.attr('line/strokeDasharray', config.strokeDasharray)
  link.attr('line/strokeDashoffset', config.strokeDashoffset)
}

// endregion

// region arrows config

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const arrows: Record<JointJSLinkArrowType, { arrowType: JointJSLinkArrowType } & any> = {
  normal: {
    arrowType: 'normal',
    type: 'path',
    fill: 'black',
    d: 'M 10 -5 0 0 10 5 z',
  },
  outlined: {
    arrowType: 'outlined',
    type: 'path',
    'stroke-width': 2,
    fill: 'none',
    d: 'M 20 -10 0 0 20 10 Z',
  },
}

export function readLinkArrowType(link: dia.Link, target: LinkTargets): JointJSLinkArrowType {
  const markerTarget: LinkMarker = target === 'target' ? 'targetMarker' : 'sourceMarker'
  const markerType = link.attr(`line/${markerTarget}/arrowType`)
  if (!markerType) {
    return 'normal'
  }

  return markerType as JointJSLinkArrowType
}

export function changeLinkArrowType(link: dia.Link, type: JointJSLinkArrowType, target: LinkTargets) {
  const markerTarget: LinkMarker = target === 'target' ? 'targetMarker' : 'sourceMarker'
  const config = arrows[type]
  link.attr(`line/${markerTarget}`, config)
}

// endregion
