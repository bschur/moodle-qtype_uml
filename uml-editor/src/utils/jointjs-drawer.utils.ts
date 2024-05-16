import { dia, shapes } from '@joint/core'
import { TextBlockView } from '../models/jointjs/text-block.model'
import { BaseUmlClassifierModel } from '../models/jointjs/uml-classifier/base-uml-classifier.model'
import { UseCase } from '../models/jointjs/uml-use-case.model'
import {
  globalElementToolsView,
  internalElementToolsView,
  paperHoverConnectToolOptions,
} from './jointjs-element-tools.const'
import { jointJSCustomUmlElementViews, jointJSCustomUmlElements } from './jointjs-extension.const'
import { globalLinkToolsView } from './jointjs-link-tools.const'
import { assignValueToObject } from './object.utils'

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

const jointjsCustomNamespace: unknown = {
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

export const initCustomPaper = (el: HTMLElement, graph: dia.Graph, options?: dia.Paper.Options): dia.Paper => {
  const paper = new dia.Paper({
    el: el,
    model: graph,
    width: '100%',
    height: '100%',
    drawGrid: false,
    interactive: true,
    cellViewNamespace: jointjsCustomNamespace,
    ...options,
    ...paperHoverConnectToolOptions,
  })

  resizePaperObserver(paper).observe(el)

  // register tools for links and elements
  paper.on('link:mouseenter', linkView => linkView.addTools(globalLinkToolsView))

  paper.on('element:mouseenter', elementView => {
    if (elementView instanceof TextBlockView) {
      elementView.addTools(internalElementToolsView)
      return
    }

    elementView.addTools(globalElementToolsView)
  })

  paper.on('blank:mouseover', () => paper.removeTools())

  paper.on('element:pointerdblclick', (elementView, evt) => {
    const target = elementView.model
    if (target instanceof BaseUmlClassifierModel || target instanceof UseCase) {
      target.userInput(evt)
    } else {
      throw new Error('elementView.model is not instanceof UmlClass')
    }
  })

  return paper
}
