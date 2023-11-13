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
     * @return false|string|void
     */
    private static function get_file_content(string $filepath) {
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
     * @return string
     */
    private static function load_change_handler_content() {
        // Set up the input field, which holds the diagram content.
        $diagraminputid = uniqid(self::$diagramhiddeninputid);

        // TODO generate this in the according moodle function (not in this class).
        $diagraminputhtml = '<input type="hidden" id="' . $diagraminputid . '" name="diagram">';

        $changehandlerscript = '<script>' . self::get_file_content('editor/diagram-change-handler.js') . '</script>';
        // Replace the placeholder {{id}} for referencing the input with the according input id.
        $changehandlerscript = str_replace("{{id}}", $diagraminputid, $changehandlerscript);

        return $diagraminputhtml . $changehandlerscript;
    }

    /**
     * Loads the editor html with the given display options.
     *
     * @param string|null $diagram
     * @param question_display_options|null $options
     * @return false|string|void
     */
    public static function load_editor_html(string $diagram = null, question_display_options $options = null) {
        // Default edit mode when no options set. Otherwise, check whether not in readonly mode.
        $iseditmode = !isset($options) || !$options->readonly;

        // Load the different scripts needed for the editor.
        $webcomponentscript = '<script>' . self::get_file_content('editor/uml-editor.js') . '</script>';

        // Wrap the script inside a html script tag and use the web component directly.
        $editorcontent =
                $webcomponentscript . '<uml-editor diagram=\'' . $diagram . '\' allowEdit=\'' . $iseditmode . '\'/>';

        if ($iseditmode) {
            // Load the change handler.
            $editorcontent .= self::load_change_handler_content();
        }

        return $editorcontent;
    }
}
