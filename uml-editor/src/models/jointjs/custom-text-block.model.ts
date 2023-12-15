import { dia, shapes, util } from 'jointjs';
import { CustomElementAttributes } from './custom-element-attributes.type'

export class CustomTextBlock extends dia.Element {
    // Override the defaults if necessary
    override defaults() {
        const elementAttributes: CustomElementAttributes<dia.Element.Attributes> = {
            type: 'uml.Form',
            attrs: {
                foreignObject: {
                    width: 'calc(w)',
                    height: 'calc(h)',
                },
            },
            // Custom markup with input and button elements
            markup: util.svg/* xml */`
                <foreignObject @selector="foreignObject">
                    <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style="background:white;border: 1px solid black;width:calc(100% - 2px);height:calc(100% - 2px);display:flex;flex-direction:column;justify-content:center;align-items:center;"
                    >
                        <input 
                            @selector="name" 
                            type="text" 
                            name="name" 
                            placeholder="Type something"
                            style="border-radius:5px;width:170px;height:30px;margin-bottom:2px;"
                        />
                    </div>
                </foreignObject>
            `
        };
        (shapes as any).uml.FormView = dia.ElementView.extend({
            events: {
                // Name of event + css selector : custom view method name
                'input input': 'onInput'
            },

            onInput: function(evt:any) {
                console.log('Input Value:', evt.target.value);
                this.model.attr('name/props/value', evt.target.value);
            }
        });



        util.defaultsDeep(elementAttributes, super.defaults)
        return elementAttributes
    }

    // Method to create the variable component
    public createVariableComponent(ref: string, x: number, y: number, paper: dia.Paper, rectWidth: number, headerHeight: number) {
        // Define a new custom form element
        // Create an instance of the custom form element
        const form = this;
        form.position(x, y);
        form.resize(rectWidth, headerHeight);

        // Define the handleInput method


        return form;

    }
}
