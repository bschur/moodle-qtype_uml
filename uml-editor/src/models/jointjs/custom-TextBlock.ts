import { dia, layout, shapes } from 'jointjs'
import TextBlock = shapes.standard.TextBlock
import Paper = dia.Paper

export class CustomTextBlock extends TextBlock {
    public createVariableComponent(ref:string, x:number, y:number, paper:Paper, rectWidth:number, headerHeight:number) {
        let variableComponent = new CustomTextBlock( {
            position: {x: x, y: y},
            size: {width: rectWidth, height: 20},
            'ref-y': headerHeight,
            'ref-x': 0,
            ref: ref,
          //  content: `<input type="text" id="customInput" placeholder="Type here" style="width: 100%; height: 100%; box-sizing: border-box; padding: 5px;">`
        })

       return variableComponent;
    }
}
