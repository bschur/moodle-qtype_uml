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

import { dia, shapes, util } from 'jointjs';

const Form = dia.Element.define('example.Form', {
    attrs: {
        foreignObject: {
            width: 'calc(w)',
            height: 'calc(h)'
        }
    }
}, {
    markup: util.template(/* xml */`
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
                <button style="border-radius:5px;width:178px;height:36px;">
                    <span>Submit</span>
                </button>
            </div>
        </foreignObject>
    `)
});


shapes.example.FormView = dia.ElementView.extend({
    events: {
        'input input': 'onInput'
    },
    onInput: function(evt) {
        console.log('Input Value:', evt.target.value);
        this.model.attr('name/props/value', evt.target.value);
    }
});

