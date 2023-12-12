import { dia, layout, shapes, util } from 'jointjs'
import TextBlock = shapes.standard.TextBlock
import Paper = dia.Paper


export class CustomTextBlock extends shapes.basic.Rect {

    public createVariableComponent(ref: string, x: number, y: number, paper: Paper, rectWidth: number, headerHeight: number) {
        // Create the CustomTextBlock instance


        const Form = dia.Element.define('example.Form', {
            attrs: {
                foreignObject: {
                    width: 'calc(w)',
                    height: 'calc(h)'
                }
            }
        }, {
            markup: util.svg/* xml */`
        <foreignObject @selector="foreignObject" height="70" width="70">
            <div
                xmlns="http://www.w3.org/1999/xhtml"
                class="outer"
            >
                <div class="inner">
                    <form class="form">
                        <input @selector="name" type="text" name="name" autocomplete="off" placeholder="Your diagram name"/>
                    </form>
                </div>
            </div>
        </foreignObject>
    `
        });

        const form = new Form();
        form.position(x, y);
        form.resize(rectWidth, headerHeight);
        return form;


    }
}

