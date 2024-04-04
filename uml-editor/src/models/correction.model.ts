import { Operation } from 'just-diff'
import { JointJSDiagram } from './jointjs/jointjs-diagram.model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JustDiff = { readonly op: Operation; readonly path: readonly (string | number)[]; readonly value: any }

export interface UmlCorrection {
  readonly differences: JustDiff[]
  readonly points: number
  readonly answer: JointJSDiagram
  readonly solution: JointJSDiagram
}
