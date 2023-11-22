<?php
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

/**
 * The uml question editor helper class is defined here.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Helper functions for the editor loading
 */
class EditorHelper {
    /**
     * Loads the change handler functionality as HTML content.
     *
     * @param string $bindelementid the id of the element which holds the diagram.
     * @return string The script of the change handler
     */
    private static function load_change_handler_content(string $bindelementid): string {
        global $PAGE;
        $PAGE->requires->js(new moodle_url('/question/type/uml/editor/diagram-change-handler.js'), true);

        return '<script>registerChangeHandler(\'' . $bindelementid . '\')</script>';
    }

    /**
     * Loads the editor html with the given display options.
     *
     * @param string $bindelementid The id of the input field which holds the diagram.
     * @param bool $iseditmode Whether the editor should be editable or not.
     * @param string|null $diagram The diagram to load.
     * @return string The editor html.
     */
    public static function load_editor_html_for_id(string $bindelementid, bool $iseditmode = false,
            string $diagram = null): string {
        global $PAGE;
        $PAGE->requires->js(new moodle_url('/question/type/uml/editor/uml-editor.js'), true);

        // Wrap the script inside a html script tag and use the web component directly.
        $editorcontent = '<uml-editor inputId=\'' . $bindelementid . '\' diagram=\'' . $diagram . '\' allowEdit=\'' . $iseditmode .
                '\'></uml-editor>';

        if ($iseditmode) {
            // Load the change handler to the according binding element.
            $editorcontent .= self::load_change_handler_content($bindelementid);
        }

        return $editorcontent;
    }
}