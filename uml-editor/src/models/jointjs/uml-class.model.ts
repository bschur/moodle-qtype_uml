import { dia, shapes, util } from 'jointjs'

export class UmlClass extends shapes.standard.Rectangle {
    private variablesCounter = 0;
    private funcCounter = 0;
    private rectWidth:number; // Width of the class
    private rectHeight; // Height of the class
    private headerHeight; // Height of the header section
    private rectVariablesHeight;
    private rectFunctionsHeight;
    private functionComponents: shapes.standard.TextBlock[] = [];

    constructor() {
       super({
            markup: [
                {
                    tagName: 'rect',
                    selector: 'body'
                },
                {
                    tagName: 'rect',
                    selector: 'headerText'
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

        });
        this.rectWidth = 150; // Width of the class
        this.rectHeight = 100; // Height of the class
        this.headerHeight = 20; // Height of the header section
        this.rectVariablesHeight= (this.rectHeight - this.headerHeight) / 2;  // Height of each section
        this.rectFunctionsHeight = (this.rectHeight - this.headerHeight) / 2;  // Height of each section
    }

    override defaults() {
        //todo check how to initialize
        this.rectWidth = 150; // Width of the class
        this.rectHeight = 100; // Height of the class
        this.headerHeight = 20; // Height of the header section
        this.rectVariablesHeight= (this.rectHeight - this.headerHeight) / 2;  // Height of each section
        this.rectFunctionsHeight = (this.rectHeight - this.headerHeight) / 2;  // Height of each section

        return util.defaultsDeep({
            type: 'UmlClassModel.Class',
            size: {
                width: this.rectWidth,
                height: this.rectHeight
            },
            attrs: {
                body: {
                    rx: 0,
                    ry: 0,
                    strokeWidth: 2,
                    stroke: 'black'
                },
                headerText: {
                    width: this.rectWidth,
                    height: this.headerHeight,
                    //fill: 'black',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, helvetica, sans-serif',
                    'ref-y': 0,
                    'ref-x': 0,
                    ref: 'body',
                    'text-anchor': 'middle'
                },
                variablesRect: {
                    width: this.rectWidth,
                    height: this.rectVariablesHeight,
                    fill: '#3498db',
                    stroke: 'black',
                    'ref-y': this.headerHeight,
                    'ref-x': 0,
                    ref: 'body'

                },
                functionsRect: {
                    width: this.rectWidth,
                    height: this.rectFunctionsHeight,
                    fill: '#9b59b6',
                    stroke: 'black',
                    'ref-dy': -this.rectFunctionsHeight,
                    'ref-x': 0,
                    ref: 'body',
                }
            }
        }, shapes.standard.Rectangle.prototype.defaults)
    }

    // Update the view with the rendered variables and functions
    updateView() {
        const attributes = this.attributes

        // @ts-ignore
        attributes.attrs.variablesRect.height = parseInt(attributes.attrs?.["variablesRect"]?.height?.toString() || '0') + 20;
        //attributes.attrs.functionsRect.height = parseInt(attributes.attrs?.["functionsRect"]?.height?.toString() || '0');

        // @ts-ignore
        this.attr(attributes.attrs)
        this.resize(this.attributes.size?.width || 0, (this.attributes.size?.height || 0) + 20)
    }

createVariableComponent(ref:string, positionY:number) {
        let variableComponent = new shapes.standard.TextBlock({
            position: {x: this.position().x, y: positionY},
            size: {width: this.rectWidth, height: 20},
            'ref-y': this.headerHeight,
            'ref-x': 0,
            ref: ref,
            placeholder: "",
            attrs: {
                label: {
                    text: 'sample text',
                    style: {
                        fontFamily: 'Arial, helvetica, sans-serif',
                    }
                }
            }

        });
    let currentAttributes = this.attr();
    currentAttributes.body2 = variableComponent;
    this.embed(variableComponent);
    return variableComponent;
}

  userInput(evt: dia.Event) {
        const header = 'headerText';
        const variablesRect = 'variablesRect';
        const functionsRect = 'functionsRect';
        const selectedRect = evt.target.attributes[0].value;

      let variableComponent;
      let positionY;

        switch (selectedRect) {
            case header:
                console.log('Header section double-clicked');
                break;
            case variablesRect:
                this.updateView();
                positionY = this.position().y + this.headerHeight + this.variablesCounter;
                variableComponent = this.createVariableComponent('variablesRect', positionY);
                this.variablesCounter += 20; // Adjust as needed for spacing
                this.rectVariablesHeight += 20;
                this.rectHeight += 20;
                this.functionComponents.forEach(component => {
                    let p = component.position();
                    component.position(p.x, p.y +20);
                })
                return variableComponent;
            case functionsRect:
                this.updateView();
                positionY = this.position().y + this.rectHeight - this.rectFunctionsHeight + this.funcCounter + 20;
                variableComponent = this.createVariableComponent('functionsRect', positionY);
                this.functionComponents.push(variableComponent);
                this.funcCounter += 20; // Adjust as needed for spacing
                this.adjustSize(this.rectFunctionsHeight);
                return variableComponent;
            default:
                console.log('Clicked outside the sections');
                break;
        }
        return null;
    }

    adjustSize(subRec:number) {
        this.rectHeight += 20;
        this.rectFunctionsHeight += 20;
        this.attr('size/height', this.rectHeight);



    }
}