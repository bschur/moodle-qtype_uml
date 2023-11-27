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
                    tagName: 'text',
                    selector: 'label'
                }
            ],
            // ... other configurations
        });
    }

    defaults() {
        let rectWidth = 70;
        let rectHeight = 50;

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
                label: {
                    text: "class",
                    fill: 'black',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, helvetica, sans-serif'
                }
            }
        }, joint.shapes.standard.Rectangle.prototype.defaults);
    }
}

export default UMLClass;
