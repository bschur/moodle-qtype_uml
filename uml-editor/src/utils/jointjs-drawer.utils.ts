import { dia, shapes } from 'jointjs'
import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { CustomTextBlock } from '../models/jointjs/custom-text-block.model'
import { CustomElement } from '../models/jointjs/custom-element.model'

const resizePaperObserver = (paper: dia.Paper) => new ResizeObserver(() => {
    paper.transformToFitContent({
        padding: 10,
        minScale: 0.1,
        maxScale: 1,
        horizontalAlign: 'middle',
        verticalAlign: 'middle'
    })
})

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

export const jointJsCustomUmlItems: CustomElement[] = [
    {
        clazz: UmlActor,
        defaults: new UmlActor().defaults(),
        name: 'Actor',
        inToolbox: true,
        createEmpty: () => new UmlActor()
    },
    {
        clazz: UmlClass,
        defaults: new UmlClass().defaults(),
        name: 'Classifier',
        inToolbox: true,
        createEmpty: () => new UmlClass()
    },
    {
        clazz: CustomTextBlock,
        defaults: new CustomTextBlock().defaults(),
        name: 'Textblock',
        inToolbox: false,
        createEmpty: () => new CustomTextBlock()
    }
]

const jointjsCustomNamespace: any = {
    ...shapes,
    ...jointJsCustomUmlItems.reduce((acc, item) => {
        assignValueToObject(acc, item.defaults.type, item.clazz)
        return acc
    }, {})
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
        cellViewNamespace: jointjsCustomNamespace
    })

    resizePaperObserver(paper).observe(el)

    return paper
}