const { dia, util } = joint;

class UMLClass extends joint.shapes.standard.Rectangle {

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
        this.variables = [];
        this.functions = [];

    }

    defaults() {
        let rectWidth = 150; // Width of the class
        let rectHeight = 100; // Height of the class
        let headerHeight = 20; // Height of the header section
        let sectionHeight = (rectHeight - headerHeight) / 2; // Height of each section

        return util.defaultsDeep({
            type: 'UMLClass.Class',
            size: {
                width: rectWidth,
                height: rectHeight
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
                    text: 'Class',
                    fill: 'black',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, helvetica, sans-serif',
                    'ref-y': 0.5,
                    'ref-x': 0.5,
                    ref: 'body',
                    'text-anchor': 'middle'
                },
                variablesRect: {
                    width: rectWidth,
                    height: sectionHeight,
                    fill: '#3498db',
                    stroke: 'black',
                    'ref-y': headerHeight,
                    'ref-x': 0,
                    ref: 'body',

                },
                functionsRect: {
                    width: rectWidth,
                    height: sectionHeight,
                    fill: '#9b59b6',
                    stroke: 'black',
                    'ref-y': headerHeight + sectionHeight,
                    'ref-x': 0,
                    ref: 'body',
                }
            }
        }, joint.shapes.standard.Rectangle.prototype.defaults);


    }



    // Update the view with the rendered variables and functions
    updateView() {
        // Update the view to render variables and functions
        this.renderVariablesAndFunctions();
        // Additional logic if required for updating functions
    }

    addVariable(name) {
        // Add a variable entry
        this.variables.push(name);
        // Update the view with the new entry
        this.updateView();
    }

    removeVariable(index) {
        // Remove a variable entry at a given index
        this.variables.splice(index, 1);
        // Update the view after removal
        this.updateView();
    }



}

export default UMLClass;
