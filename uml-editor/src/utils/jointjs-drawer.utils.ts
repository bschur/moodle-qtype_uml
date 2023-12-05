import { UmlActor } from '../models/jointjs/uml-actor.model'
import { UmlClass } from '../models/jointjs/uml-class.model'
import { dia } from 'jointjs'

export function initToolBoxClasses(graphToolBox: dia.Graph): void {
    const customActor = new UmlActor()
    const class1 = new UmlClass()
    customActor.position(20, 150)
    class1.position(20, 20)

    graphToolBox.addCell(customActor)
    graphToolBox.addCell(class1)
}

export function initPaper(el: HTMLElement, graphEditor: dia.Graph, isInteractive: boolean): dia.Paper {
    return new dia.Paper({
        el: el,
        model: graphEditor,
        width: '100%',
        height: '100%',
        gridSize: 10,
        drawGrid: true,
        interactive: isInteractive
    })
}