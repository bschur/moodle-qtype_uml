import { attributes, dia } from '@joint/core'
import SVGAttributes = attributes.SVGAttributes

/**
 * Utils for configuring link properties.
 * Since we do not provide a custom link and instead use the links from jointjs, we need to store the configuration in the link attributes.
 * For configurations possible with jointjs links ee: https://resources.jointjs.com/tutorial/links
 */

type Label = dia.Link.Label & {
  attrs: dia.Cell.Selectors & {
    text: {
      id: LinkLabelType
      text: string
    }
  }
}
type LinkTargets = 'source' | 'target'
type LinkMarker = 'sourceMarker' | 'targetMarker'
type LinkLabelType = 'name' | 'multiplicitySource' | 'multiplicityTarget'

export const suggestedLinkMultiplicities = ['1', 'n', '0..0', '0..1', '1..1', '0..*', '1..*', 'm..n'] as const
export const jointJSArrows = ['none', 'normal', 'aggregation', 'composition', 'outlined'] as const
export const jointJSLinks = ['normal', 'dotted'] as const

export type JointJSLinkMultiplicity = (typeof suggestedLinkMultiplicities)[number] | string
export type JointJSLinkArrowType = (typeof jointJSArrows)[number]
export type JointJSLinkLineType = (typeof jointJSLinks)[number]

export function swapDirection(link: dia.Link) {
  const source = link.prop('source' satisfies LinkTargets)
  link.prop('source' satisfies LinkTargets, link.prop('target' satisfies LinkTargets))
  link.prop('target' satisfies LinkTargets, source)
}

// region Label config

const labels: Record<LinkLabelType, dia.ModelSetOptions> = {
  name: {},
  multiplicityTarget: {
    position: { distance: 0.9 },
  },
  multiplicitySource: {
    position: { distance: 0.1 },
  },
}

function getTargetLabel(link: dia.Link, type: LinkLabelType): Label | null {
  return (
    link
      .labels()
      .filter((label): label is Label => !!label)
      .find(label => label.attrs.text.id === type) || null
  )
}

export function readLinkLabelText(link: dia.Link, type: LinkLabelType): string | null {
  const label = getTargetLabel(link, type)
  if (!label) {
    return null
  }

  return label.attrs.text.text
}

export function changeLinkLabelText(link: dia.Link, text: string | null, type: LinkLabelType) {
  const label = getTargetLabel(link, type)

  // always remove the existing label
  if (label) {
    const index = link.labels().indexOf(label)
    link.removeLabel(index)
  }

  const config = labels[type]
  if (text) {
    link.appendLabel({
      attrs: {
        text: {
          id: type,
          text,
        },
      },
      ...config,
    } satisfies Label)
  }
}

// endregion

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

const arrows: Record<JointJSLinkArrowType, ({ arrowType: JointJSLinkArrowType } & SVGAttributes) | null> = {
  normal: {
    arrowType: 'normal',
    type: 'path',
    fill: 'black',
    d: 'M 10 -5 0 0 10 5 z',
  },
  outlined: {
    arrowType: 'outlined',
    type: 'path',
    fill: 'white',
    d: 'M14-9 0 0 14 9Z',
  },
  aggregation: {
    arrowType: 'aggregation',
    type: 'path',
    fill: 'white',
    d: 'M0 0 10 6 20 0 10-6Z',
  },
  composition: {
    arrowType: 'composition',
    type: 'path',
    fill: 'black',
    d: 'M0 0 10 6 20 0 10-6Z',
  },
  none: null,
}

export function readLinkArrowType(link: dia.Link, target: LinkTargets): JointJSLinkArrowType {
  const markerTarget: LinkMarker = target === 'target' ? 'targetMarker' : 'sourceMarker'

  // check if there is even a marker present
  const marker = link.attr(`line/${markerTarget}`)
  if (!marker) {
    return 'none'
  }

  // if a marker is present, check the type
  // for freshly initialized links, the type is not set yet so we need to return 'normal' as default
  const markerType: JointJSLinkArrowType | undefined = marker.arrowType
  if (!markerType) {
    return 'normal'
  }

  return markerType
}

export function changeLinkArrowType(link: dia.Link, type: JointJSLinkArrowType, target: LinkTargets) {
  const markerTarget: LinkMarker = target === 'target' ? 'targetMarker' : 'sourceMarker'

  // special case none, we need to remove the marker
  if (type === 'none') {
    link.removeAttr(`line/${markerTarget}`)
    return
  }

  // otherwise set the config to the target marker
  const config = arrows[type]
  link.attr(`line/${markerTarget}`, config)
}

// endregion
