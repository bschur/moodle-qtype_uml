import { dia, shapes } from '@joint/core'
import { TextBlockView } from '../models/jointjs/text-block.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { UseCase } from '../models/jointjs/uml-use-case.model'
import {
  globalElementToolsView,
  internalElementToolsView,
  paperHoverConnectToolOptions,
} from './jointjs-element-tools.const'
import { jointJSCustomUmlElementViews, jointJSCustomUmlElements } from './jointjs-extension.const'
import { globalLinkToolsView } from './jointjs-link-tools.const'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jointjsCustomNamespace: any = {
  ...shapes,
  ...[...jointJSCustomUmlElements, ...jointJSCustomUmlElementViews].reduce((acc, item) => {
    if (item.type === 'element') {
      assignValueToObject(acc, item.defaults.type, item.clazz)
    } else {
      assignValueToObject(acc, item.elementViewType, item.instance)
    }
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
    ...paperHoverConnectToolOptions,
  })

  resizePaperObserver(paper).observe(el)

  // register tools for links and elements
  paper.on('link:mouseenter', linkView => {
    linkView.addTools(globalLinkToolsView)
  })

  paper.on('element:mouseenter', elementView => {
    if (elementView instanceof TextBlockView) {
      elementView.addTools(internalElementToolsView)
      return
    }

    elementView.addTools(globalElementToolsView)
  })

  paper.on('blank:mouseover', () => {
    paper.removeTools()
  })

  paper.on('element:pointerdblclick', (elementView, evt) => {
    const target = elementView.model
    if (target instanceof UmlClass || target instanceof UseCase) {
      const textBlock = target.userInput(evt)
      if (textBlock) {
        paper.model.addCell(textBlock)
      }
    } else {
      throw new Error('elementView.model is not instanceof UmlClass')
    }
  })

  return paper
}
