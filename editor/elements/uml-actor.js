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
import {dia, util} from 'jointjs';

const legsY = 0.7;
const bodyY = 0.3;
const headY = 0.15;

const COLORS = [
    '#3f84e5',
    '#49306B',
    '#fe7f2d',
    '#ad343e',
    '#899e8b',
    '#ede9e9',
    '#b2a29f',
    '#392F2D'
];

export class UmlActor extends dia.Element {
    defaults() {
        return {
            ...super.defaults,
            type: 'Actor',
            size: {
                width: 40,
                height: 80
            },
            attrs: {
                background: {
                    width: 'calc(w)',
                    height: 'calc(h)',
                    fill: 'transparent'
                },
                body: {
                    d: `M 0 calc(0.4 * h) h calc(w) M 0 calc(h) calc(0.5 * w) calc(${legsY} * h) calc(w) calc(h) M calc(0.5 * w) calc(${legsY} * h) V calc(${bodyY} * h)`,
                    fill: 'none',
                    stroke: COLORS[7],
                    strokeWidth: 2
                },
                head: {
                    cx: 'calc(0.5 * w)',
                    cy: `calc(${headY} * h)`,
                    r: `calc(${headY} * h)`,
                    stroke: COLORS[7],
                    strokeWidth: 2,
                    fill: '#ffffff'
                },
                label: {
                    y: 'calc(h + 10)',
                    x: 'calc(0.5 * w)',
                    textAnchor: 'middle',
                    textVerticalAnchor: 'top',
                    fontSize: 14,
                    fontFamily: 'sans-serif',
                    fill: COLORS[7],
                    textWrap: {
                        width: 'calc(3 * w)',
                        height: null
                    }
                }
            }
        };
    }

    preinitialize(...args) {
        super.preinitialize(...args);
        this.markup = util.svg`
            <rect @selector="background" />
            <path @selector="body" />
            <circle @selector="head" />
            <text @selector="label" />
        `;
    }
}