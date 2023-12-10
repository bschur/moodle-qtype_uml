import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { dia } from 'jointjs'

export function initEditorGraph(): dia.Graph {
    return new dia.Graph({})
}

export function initToolBoxGraph(): dia.Graph {
    const graphToolBox = new dia.Graph({})

    const customActor = new UmlActor()
    const class1 = new UmlClass()
    customActor.position(20, 150)
    class1.position(20, 20)

    graphToolBox.addCell(customActor)
    graphToolBox.addCell(class1)

    return graphToolBox
}

export function initPaper(el: HTMLElement, graph: dia.Graph, isInteractive: boolean): dia.Paper {
    return new dia.Paper({
        el: el,
        model: graph,
        width: '100%',
        height: '100%',
        gridSize: 10,
        drawGrid: true,
        interactive: isInteractive
    })
}