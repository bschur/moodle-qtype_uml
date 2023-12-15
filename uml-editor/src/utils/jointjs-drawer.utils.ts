import { dia, shapes } from 'jointjs'
import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { CustomTextBlock } from '../models/jointjs/custom-text-block.model'

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

export const jointJSCustomNameSpace = (): object => {
    const defaultNameSpace = { ...shapes, ...dia }

    assignValueToObject(defaultNameSpace, new UmlActor().defaults().type, UmlActor)
    assignValueToObject(defaultNameSpace, new UmlClass().defaults().type, UmlClass)
    assignValueToObject(defaultNameSpace, new CustomTextBlock().defaults().type, CustomTextBlock)
    return defaultNameSpace
}

export const initEditorGraph = (customNameSpace: object): dia.Graph => {
    return new dia.Graph({}, { cellNamespace: customNameSpace })
}

export const initToolBoxGraph = (customNameSpace: object): dia.Graph => {
    const graphToolBox = new dia.Graph({}, { cellNamespace: customNameSpace })

    let initialY = 100
    const addToToolBox = (cell: dia.Cell.JSON | dia.Cell) => {
        initialY += 150
        cell.position(50, initialY)
        graphToolBox.addCell(cell)
    }

    addToToolBox(new UmlActor())
    addToToolBox(new UmlClass())

    return graphToolBox
}

export const initPaper = (el: HTMLElement, customNameSpace: object, createGraph: (customNameSpace: object) => dia.Graph, isInteractive: boolean): dia.Paper => {
    return new dia.Paper({
        el: el,
        model: createGraph(customNameSpace),
        width: '100%',
        height: '100%',
        gridSize: 10,
        drawGrid: true,
        interactive: isInteractive,
        cellViewNamespace: customNameSpace
    })
}