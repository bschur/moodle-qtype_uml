import { dia, shapes, util } from 'jointjs'
import { CustomTextBlock } from './custom-text-block.model'
import { CustomElementAttributes } from './custom-element-attributes.type'
import Paper = dia.Paper

export class UmlClass extends shapes.standard.Rectangle {
    private variablesCounter = 0
    private funcCounter = 0
    private rectWidth = 150 // Width of the class
    private rectHeight = 100;
    private headerHeight = 20 // Height of the header section
    private rectVariablesHeight = (this.rectHeight - this.headerHeight) / 2  // Height of each section
    private rectFunctionsHeight = (this.rectHeight - this.headerHeight) / 2  // Height of each section
    private functionComponents: shapes.standard.TextBlock[] = [];
    private variableComponents: shapes.standard.TextBlock[] = [];

    private header = 'header'
    private variablesRect = 'variablesRect'
    private functionsRect = 'functionsRect'

    override markup = [
        {
            tagName: 'rect',
            selector: 'body'
        },
        {
            tagName: 'rect',
            selector: 'header'
        },
        {
            tagName: 'rect',
            selector: 'variablesRect'
        },
        {
            tagName: 'rect',
            selector: 'functionsRect'
        }
    ]

    override defaults() {
        //todo check how to initialize
        this.rectWidth = 150 // Width of the class
        this.rectHeight = 100 // Height of the class
        this.headerHeight = 20 // Height of the header section
        this.rectVariablesHeight = (this.rectHeight - this.headerHeight) / 2  // Height of each section
        this.rectFunctionsHeight = (this.rectHeight - this.headerHeight) / 2  // Height of each section
        this.header = 'header'
        this.variablesRect = 'variablesRect'
        this.functionsRect = 'functionsRect'

        const elementAttributes: CustomElementAttributes<shapes.standard.RectangleAttributes> = {
            type: 'custom.uml.Classifier',
            size: {
                width: this.rectWidth,
                height: this.rectHeight
            },
            attrs: {
                body: {
                    rx: 0,
                    ry: 0,
                    strokeWidth: 4,
                    stroke: 'black'

                },
                header: {
                    width: this.rectWidth,
                    height: this.headerHeight,
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, helvetica, sans-serif',
                    'ref-y': 0,
                    'ref-x': 0,
                    ref: 'body',
                    'text-anchor': 'middle',
                    stroke: 'black',
                    strokeWidth: 3,
                    fill: 'white'
                },
                variablesRect: {
                    width: this.rectWidth,
                    height: this.rectVariablesHeight,
                    stroke: 'black',
                    strokeWidth: 3,
                    'ref-y': this.headerHeight,
                    'ref-x': 0,
                    ref: 'body',
                    fill: 'white'

                },
                functionsRect: {
                    width: this.rectWidth,
                    height: this.rectFunctionsHeight,
                    stroke: 'black',
                    strokeWidth: 3,
                    'ref-dy': -this.rectFunctionsHeight,
                    'ref-x': 0,
                    ref: 'body',
                    fill: 'white'
                }
            }
        }

        util.defaultsDeep(elementAttributes, super.defaults)
        return elementAttributes
    }

    userInput(evt: dia.Event, paper: Paper) {

        const selectedRect = evt.target.attributes[0].value
        console.log(selectedRect)
        let ctb = new CustomTextBlock()
        let currentAttributes

        let variableComponent
        let positionY

        switch (selectedRect) {
            case this.header:
                variableComponent = ctb.createVariableComponent('header', this.position().x, this.position().y, this.rectWidth, this.headerHeight)
                currentAttributes = this.attr()
                currentAttributes.body2 = variableComponent
                this.embed(variableComponent)
                return variableComponent
            case this.variablesRect:
                positionY = this.position().y + this.headerHeight + this.variablesCounter;
                variableComponent = ctb.createVariableComponent('variablesRect', this.position().x, positionY, this.rectWidth, this.headerHeight)
                this.variableComponents.push(variableComponent);
                this.adjustVariableSize(1);
                this.functionComponents.forEach(component => {
                    let p = component.position()
                    component.position(p.x, p.y + 20)
                })
                currentAttributes = this.attr()
                currentAttributes.body2 = variableComponent
                this.embed(variableComponent)
                return variableComponent
            case this.functionsRect:
                positionY = this.position().y + this.size().height - this.rectFunctionsHeight + this.funcCounter
                variableComponent = ctb.createVariableComponent('functionsRect', this.position().x, positionY, this.rectWidth, this.headerHeight)
                this.functionComponents.push(variableComponent)

                this.adjustFuncSize(1)
                currentAttributes = this.attr()
                currentAttributes.body2 = variableComponent
                this.embed(variableComponent)
                return variableComponent
            default:
                console.log('Clicked outside the sections')
                break
        }
        return null
    }

    adjustFuncSize(direction: number) {
        this.resize(this.size().width, this.size().height += 20 * direction);
        this.size().height += 20 * direction;
        this.rectFunctionsHeight += 20 * direction;
        this.funcCounter += 20 * direction;
    }

    adjustVariableSize(direction: number) {
        this.resize(this.size().width, this.size().height += 20 * direction);
        this.rectVariablesHeight += 20 * direction;
        this.variablesCounter += 20 * direction;
        this.attr(this.variablesRect + "/height", this.rectVariablesHeight)
    }

    adjustByDelete(selectedRect:string, posY:number) {
        let indexOfComponentToRemove:any;

        switch (selectedRect) {
            case this.variablesRect:
                indexOfComponentToRemove = this.variableComponents.findIndex(component => component.position().y === posY);

                if (indexOfComponentToRemove !== -1) {
                    // Remove the component from the array
                    this.variableComponents.splice(indexOfComponentToRemove, 1);

                    // Adjust the position of subsequent components
                    this.variableComponents.forEach((component, index) => {
                        if (index >= indexOfComponentToRemove) {
                            let p = component.position();
                            component.position(p.x, p.y - 20);
                        }
                    });
                    this.shrinkFuncY(0);
                } else {
                    console.log('Component not found');
                }

                this.adjustVariableSize(-1);

                break;
            case this.functionsRect:

                indexOfComponentToRemove = this.functionComponents.findIndex(component => component.position().y === posY);

                if (indexOfComponentToRemove !== -1) {
                    // Remove the component from the array
                    this.functionComponents.splice(indexOfComponentToRemove, 1);

                    // Adjust the position of subsequent components
                    this.shrinkFuncY(indexOfComponentToRemove);
                } else {
                    console.log('Component not found');
                }

                this.adjustFuncSize(-1)
                break;
        }

    }

    shrinkFuncY(indexOfComponentToRemove:number) {
        this.functionComponents.forEach((component, index) => {
            if (index >= indexOfComponentToRemove) {
                let p = component.position();
                component.position(p.x, p.y - 20);
            }
        });
    }


}