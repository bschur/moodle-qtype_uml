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
     * @var string The id which is set to the hidden input field which holds the diagram.
     */
    private static string $diagramhiddeninputid = 'diagram-input';

    /**
     * Loads a files content relative to project root directory and returns its content.
     *
     * @param string $filepath
     * @return string
     */
    private static function get_file_content(string $filepath): string {
        $absolutefilepath = dirname(__FILE__) . '/../../' . $filepath;
        $file = fopen($absolutefilepath, "r");
        if (!$file) {
            die();
        }
        $filecontent = fread($file, filesize($absolutefilepath));
        fclose($file);
        return $filecontent;
    }

    /**
     * Loads the change handler functionality as HTML content.
     *
     * @param string $diagraminputid the id of the input field which holds the diagram.
     * @param html_quickform_element $bindingelement the element to keep track of the diagram content.
     * @return string
     */
    private static function load_change_handler_content(string $diagraminputid, html_quickform_element $bindingelement): string {
        // Represent the id on the input field with the generated one.
        $bindingelement->setAttributes(['id' => $diagraminputid]);

        $changehandlerscript = '<script>' . self::get_file_content('editor/diagram-change-handler.js') . '</script>';

        // Replace the placeholder {{id}} for referencing the input with the according input id.
        return str_replace("{{id}}", $diagraminputid, $changehandlerscript);
    }

    /**
     * Loads the editor html with the given display options.
     *
     * @param string|null $diagram
     * @param bool $iseditmode
     * @param html_quickform_element|null $bindingelement
     * @return string
     */
    public static function load_editor_html(string $diagram = null, bool $iseditmode = false,
            html_quickform_element $bindingelement = null): string {
        // Set up an unique id for the diagram.
        $diagramid = uniqid(self::$diagramhiddeninputid);

        // Load the different scripts needed for the editor.
        $webcomponentscript = '<script>' . self::get_file_content('editor/uml-editor.js') . '</script>';

        // Wrap the script inside a html script tag and use the web component directly.
        $editorcontent =
                $webcomponentscript . '<uml-editor inputId=\'' . $diagramid . '\' diagram=\'' . $diagram . '\' allowEdit=\'' .
                $iseditmode . '\'/>';

        if ($iseditmode) {
            if (isset($bindingelement)) {
                // Load the change handler to the according binding element.
                $editorcontent .= self::load_change_handler_content($diagramid, $bindingelement);
            }
        }

        return $editorcontent;
    }
}
