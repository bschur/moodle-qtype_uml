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
public class EditorHelper {
    /**
     * Loads the editor html with the given display options
     *
     * @param question_display_options|null $options
     * @return false|string|void
     */
    public static function load_editor_html(question_display_options $options = null) {
        // Load the editor and generate html.
        $filepath = dirname(__FILE__) . '/../../editor/index.html';
        $file = fopen($filepath, "r");
        if (!$file) {
            die();
        }
        $editorcontent = fread($file, filesize($filepath));
        fclose($file);

        if (isset($options)) {
            if ($options->readonly) {
                // TODO handle readonly.
                $editorcontent .= ' [readonly]';
            }
        }

        return $editorcontent;
    }
}
