import { dia, shapes, util } from 'jointjs'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'

export class CustomTextBlock extends shapes.standard.Rectangle {
    override markup = []

    override defaults() {
        const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
            type: 'custom.uml.CustomTextBlock'
        }

        util.defaultsDeep(elementAttributes, super.defaults)
        return elementAttributes
    }

    public createVariableComponent(ref: string, x: number, y: number, paper: dia.Paper, rectWidth: number, headerHeight: number) {
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
        })

        const form = new Form()
        form.position(x, y)
        form.resize(rectWidth, headerHeight)
        return form
    }
}

