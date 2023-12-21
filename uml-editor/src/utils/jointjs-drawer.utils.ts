import { dia, shapes } from 'jointjs'
import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { CustomTextBlock } from '../models/jointjs/custom-text-block.model'
import { CustomJointJSElement } from '../models/jointjs/custom-jointjs-element.model'
import { createCustomJointJSElement } from './create-custom-jointjs-element.function'

const resizePaperObserver = (paper: dia.Paper) =>
  new ResizeObserver(() => {
    paper.transformToFitContent({
      padding: 10,
      minScale: 0.1,
      maxScale: 1,
      horizontalAlign: 'middle',
      verticalAlign: 'middle',
    })
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignValueToObject(existingObject: any, inputString: string, value: any) {
  const parts = inputString.split('.')
  let currentObject = existingObject

  for (const part of parts.slice(0, -1)) {
    currentObject[part] = currentObject[part] || {}
    currentObject = currentObject[part]
  }

  // Assign the value to the last part in the path
  currentObject[parts[parts.length - 1]] = value

  return existingObject
}

export const jointJsCustomUmlItems: CustomJointJSElement[] = [
  createCustomJointJSElement(UmlActor, 'Actor', true),
  createCustomJointJSElement(UmlClass, 'Classifier', true),
  createCustomJointJSElement(CustomTextBlock, 'Text-block', false),
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jointjsCustomNamespace: any = {
  ...shapes,
  ...jointJsCustomUmlItems.reduce((acc, item) => {
    assignValueToObject(acc, item.defaults.type, item.clazz)
    return acc
  }, {}),
}

export const initCustomNamespaceGraph = (): dia.Graph => {
  return new dia.Graph({}, { cellNamespace: jointjsCustomNamespace })
}

export const initCustomPaper = (el: HTMLElement, graph: dia.Graph, isInteractive: boolean): dia.Paper => {
  const paper = new dia.Paper({
    el: el,
    model: graph,
    width: '100%',
    height: '100%',
    gridSize: 10,
    drawGrid: true,
    interactive: isInteractive,
    cellViewNamespace: jointjsCustomNamespace,
  })

  resizePaperObserver(paper).observe(el)

  return paper
}
