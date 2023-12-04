import { dia, shapes, util } from 'jointjs'

export class UmlClass extends shapes.standard.Rectangle {
    private variablesCounter = 0;
    private funcCounter = 0;
    private rectWidth:number; // Width of the class
    private rectHeight; // Height of the class
    private headerHeight; // Height of the header section
    private sectionHeight;  // Height of each section




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
        this.sectionHeight= (this.rectHeight - this.headerHeight) / 2;  // Height of each section
    }

    override defaults() {
        //todo check how to initialize
        this.rectWidth = 150; // Width of the class
        this.rectHeight = 100; // Height of the class
        this.headerHeight = 20; // Height of the header section
        this.sectionHeight= (this.rectHeight - this.headerHeight) / 2;  // Height of each section
        return util.defaultsDeep({
            type: 'UmlClassModel.Class',
            size: {
                width: this.rectWidth,
                height: this.rectHeight
            },
            attrs: {
                body: {
                    fill: '#2ECC71',
                    rx: 5,
                    ry: 5,
                    strokeWidth: 2,
                    stroke: 'black',
                },
                headerText: {
                    width: this.rectWidth,
                    height: 40,
                    text: 'Class',
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
                    height: this.sectionHeight,
                    fill: '#3498db',
                    stroke: 'black',
                    'ref-y': this.headerHeight,
                    'ref-x': 0,
                    ref: 'body',

                },
                functionsRect: {
                    width: this.rectWidth,
                    height: this.sectionHeight,
                    fill: '#9b59b6',
                    stroke: 'black',
                    'ref-dy': -this.sectionHeight,
                    'ref-x': 0,
                    ref: 'body',

                }
            }
        }, shapes.standard.Rectangle.prototype.defaults);
    }

    // Update the view with the rendered variables and functions
    updateView() {
        const attributes = this.attributes;

        // @ts-ignore
        attributes.attrs.variablesRect.height = parseInt(attributes.attrs?.["variablesRect"]?.height?.toString() || '0') + 20;
        //attributes.attrs.functionsRect.height = parseInt(attributes.attrs?.["functionsRect"]?.height?.toString() || '0');

        // @ts-ignore
        this.attr(attributes.attrs);
        this.resize(this.attributes.size?.width || 0, (this.attributes.size?.height || 0) + 20);
    }



createVariableComponent(ref:string, positionY:number) {
    return new shapes.standard.TextBlock({
        position: {x: this.position().x, y: positionY},
        size: {width: this.rectWidth, height: 20},
        text: 'Sample Text',
        fill: 'black',
        fontSize: 10,
        fontFamily: 'Arial, helvetica, sans-serif',
        'ref-y': this.headerHeight,
        'ref-x': 0,
        ref: ref,
        'text-anchor': 'middle',
        'pointer-events': 'none'
    });
}


  userInput(evt: dia.Event) {
        const header = 'headerText';
        const variablesRect = 'variablesRect';
        const functionsRect = 'functionsRect';
        const selectedRect = evt.target.attributes[0].value;

      let variableComponent;
      let positionY;
      let  currentAttributes;

        switch (selectedRect) {
            case header:
                console.log('Header section double-clicked');
                break;
            case variablesRect:
                this.updateView();
                positionY = this.position().y + this.headerHeight + this.variablesCounter;
                variableComponent = this.createVariableComponent('variablesRect', positionY);
                currentAttributes = this.attr();
                currentAttributes.body2 = variableComponent;
                this.embed(variableComponent);
                this.variablesCounter += 20; // Adjust as needed for spacing
                return variableComponent;

            case functionsRect:
                this.updateView();
                positionY = this.position().y + this.headerHeight + this.rectHeight + this.funcCounter -40;
                variableComponent = this.createVariableComponent('variablesRect', positionY);
                currentAttributes = this.attr();
                currentAttributes.body2 = variableComponent;
                this.embed(variableComponent);
                this.funcCounter += 20; // Adjust as needed for spacing
                return variableComponent;
            default:
                console.log('Clicked outside the sections');
                break;
        }
        return null;
    }
}
