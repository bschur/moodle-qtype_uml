import { dia } from '@joint/core'

export type JointJSLinkLabel = dia.Link.Label & {
  attrs: dia.Cell.Selectors & {
    text: {
      type: JointJSLinkLabelType
      text: string
    }
  }
}
export type JointJSLinkTargets = 'source' | 'target'
export type JointJSLinkMarker = 'sourceMarker' | 'targetMarker'

export const jointJSSuggestedLinkMultiplicities = ['1', 'n', '0..0', '0..1', '1..1', '0..*', '1..*', 'm..n'] as const
export const jointJSArrows = ['none', 'normal', 'aggregation', 'composition', 'outlined'] as const
export const jointJSLinks = ['normal', 'dotted'] as const
export const jointJSLinkLabels = ['name', 'multiplicitySource', 'multiplicityTarget'] as const

export type JointJSLinkMultiplicity = (typeof jointJSSuggestedLinkMultiplicities)[number] | string
export type JointJSLinkArrowType = (typeof jointJSArrows)[number]
export type JointJSLinkLineType = (typeof jointJSLinks)[number]
export type JointJSLinkLabelType = (typeof jointJSLinkLabels)[number]
