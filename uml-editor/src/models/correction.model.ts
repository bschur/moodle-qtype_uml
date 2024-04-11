import { Operation } from 'just-diff'

export type JustDiff = { readonly op: Operation; readonly path: readonly (string | number)[]; readonly value: unknown }

export interface UmlCorrection {
  readonly differences: JustDiff[]
  readonly points: number
}
