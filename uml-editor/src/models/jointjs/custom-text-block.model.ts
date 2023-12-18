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
                        
                        >
                        <input 
                            @selector="name" 
                            type="text" 
                            name="name" 
                            placeholder="Type something"
                            
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
    public createVariableComponent(ref: string, x: number, y: number, rectWidth: number, headerHeight: number) {
        // Define a new custom form element
        // Create an instance of the custom form element
        const form = this;
        form.position(x + 2, y + 1);
        form.resize(rectWidth - 4, headerHeight - 1);
        form.attr('ref', ref);

        // Define the handleInput method


        return form;

    }
}
