import { dia, shapes, util } from 'jointjs'
import { CustomJointJSElementAttributes } from './custom-jointjs-element.model'
import { CustomTextBlock } from './custom-text-block.model'
import Paper = dia.Paper

export class UmlClass extends shapes.standard.Rectangle {
  private variablesCounter = 0
  private funcCounter = 0
  private rectWidth = 150 // Width of the class
  private rectHeight = 100 // Height of the class
  private headerHeight = 20 // Height of the header section
  private rectVariablesHeight = (this.rectHeight - this.headerHeight) / 2 // Height of each section
  private rectFunctionsHeight = (this.rectHeight - this.headerHeight) / 2 // Height of each section
  private functionComponents: shapes.standard.TextBlock[] = []

  override markup = [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'rect',
      selector: 'headerText',
    },
    {
      tagName: 'rect',
      selector: 'variablesRect',
    },
    {
      tagName: 'rect',
      selector: 'functionsRect',
    },
  ]

  override defaults() {
    //todo check how to initialize
    this.rectWidth = 150 // Width of the class
    this.rectHeight = 100 // Height of the class
    this.headerHeight = 20 // Height of the header section
    this.rectVariablesHeight = (this.rectHeight - this.headerHeight) / 2 // Height of each section
    this.rectFunctionsHeight = (this.rectHeight - this.headerHeight) / 2 // Height of each section

    const elementAttributes: CustomJointJSElementAttributes<shapes.standard.RectangleAttributes> = {
      type: 'custom.uml.Classifier',
      size: {
        width: this.rectWidth,
        height: this.rectHeight,
      },
      attrs: {
        body: {
          rx: 0,
          ry: 0,
          strokeWidth: 2,
          stroke: 'black',
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
          'text-anchor': 'middle',
        },
        variablesRect: {
          width: this.rectWidth,
          height: this.rectVariablesHeight,
          fill: '#3498db',
          stroke: 'black',
          'ref-y': this.headerHeight,
          'ref-x': 0,
          ref: 'body',
        },
        functionsRect: {
          width: this.rectWidth,
          height: this.rectFunctionsHeight,
          fill: '#9b59b6',
          stroke: 'black',
          'ref-dy': -this.rectFunctionsHeight,
          'ref-x': 0,
          ref: 'body',
        },
      },
    }

    util.defaultsDeep(elementAttributes, super.defaults)
    return elementAttributes
  }

  // Update the view with the rendered variables and functions
  updateView() {
    const attributes = this.attributes

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    attributes.attrs.variablesRect.height =
      parseInt(attributes.attrs?.['variablesRect']?.['height']?.toString() || '0') + 20
    //attributes.attrs.functionsRect.height = parseInt(attributes.attrs?.["functionsRect"]?.height?.toString() || '0');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.attr(attributes.attrs)
    this.resize(this.attributes.size?.width || 0, (this.attributes.size?.height || 0) + 20)
  }

  userInput(evt: dia.Event, paper: Paper) {
    const header = 'headerText'
    const variablesRect = 'variablesRect'
    const functionsRect = 'functionsRect'
    const selectedRect = evt.target.attributes[0].value
    const ctb = new CustomTextBlock()
    let currentAttributes

    let variableComponent
    let positionY

    switch (selectedRect) {
      case header:
        console.log('Header section double-clicked')
        break
      case variablesRect:
        this.updateView()
        positionY = this.position().y + this.headerHeight + this.variablesCounter
        variableComponent = ctb.createVariableComponent(
          'variablesRect',
          this.position().x,
          positionY,
          paper,
          this.rectWidth,
          this.headerHeight
        )
        this.variablesCounter += 20 // Adjust as needed for spacing
        this.rectVariablesHeight += 20
        this.rectHeight += 20
        this.functionComponents.forEach(component => {
          const p = component.position()
          component.position(p.x, p.y + 20)
        })
        currentAttributes = this.attr()
        currentAttributes.body2 = variableComponent
        this.embed(variableComponent)
        return variableComponent
      case functionsRect:
        this.updateView()
        positionY = this.position().y + this.rectHeight - this.rectFunctionsHeight + this.funcCounter + 20
        variableComponent = ctb.createVariableComponent(
          'functionsRect',
          this.position().x,
          positionY,
          paper,
          this.rectWidth,
          this.headerHeight
        )
        this.functionComponents.push(variableComponent)
        this.funcCounter += 20 // Adjust as needed for spacing
        this.adjustSize(this.rectFunctionsHeight)
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  adjustSize(subRec: number) {
    this.rectHeight += 20
    this.rectFunctionsHeight += 20
    this.attr('size/height', this.rectHeight)
  }
}
