/* eslint-disable */
// This file is part of Moodle - https://moodle.org
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.
import {shapes} from 'jointjs';

export class UmlClass extends shapes.standard.Rectangle {
    override attributes: Partial<shapes.standard.RectangleAttributes> = {};

    /* TODO check code
    private readonly variables: string[] = [];


    private variablesCounter = 0;

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
    }

    override defaults() {
      // TODO fix
      return super.defaults()
    }


    updateView() {
      // TODO fix
    }

    counterVariablesUp() {
      this.variablesCounter += 20;
    }

    getcounterVariables() {
      return this.variablesCounter;
    }

    removeVariable(index: number) {
      // Remove a variable entry at a given index
      this.variables.splice(index, 1);
      // Update the view after removal
      this.updateView();
    }
     */
}
