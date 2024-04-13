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

defined('MOODLE_INTERNAL') || die();

global $PAGE, $CFG;
$PAGE->requires->js_call_amd('qtype_uml/loader', 'init', [$CFG->wwwroot . '/question/type/uml/dist']);

/**
 * Helper functions for the editor loading
 */
class EditorHelper {

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
        return '<fullscreen-view style="min-height: 300px; height: 1px;"><uml-editor
                    input-id=\'' . $bindelementid . '\'
                    allow-edit=\'' . ($iseditmode ? 'true' : 'false') . '\'
                    diagram=\'' . $diagram . '\'/>
                </fullscreen-view>';
    }

    /**
     * Loads the editor correctness html with the given display options.
     *
     * @param string $bindelementid The id of the input field which holds the correction.
     * @param string $diagram The diagram to compare.
     * @param string $correctanswer The diagram correct answer.
     * @param int $maxpoints The maximum points to get for this question.
     * @return string The editor correctness html.
     */
    public static function load_editor_correctness_html_for_id(
        string $bindelementid,
        string $diagram,
        string $correctanswer,
        int $maxpoints
    ) {
        $promptendpoint = '';

        // Check if ollama instance is running.
        $fp = @fsockopen('localhost', '11434');
        if (is_resource($fp)) {
            // If yes, provide the according endpoint to the web component.
            $promptendpoint = $CFG->wwwroot . '/question/type/uml/rest/post-prompt.php';
        }

        return '<fullscreen-view style="min-height: 300px; height: 1px;"><uml-editor-correctness
                    input-id=\'' . $bindelementid . '\'
                    max-points=\'' . $maxpoints . '\'
                    prompt-endpoint=\'' . $promptendpoint . '\'
                    diagram=\'' . $diagram . '\'
                    correct-answer=\'' . $correctanswer . '\'/>
                </fullscreen-view>';
    }
}
