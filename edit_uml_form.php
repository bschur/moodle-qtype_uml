<?php
// This file is part of Moodle - https://moodle.org/
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
 * The editing form for uml question type is defined here.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once($CFG->dirroot . '/question/type/edit_question_form.php');

/**
 * uml question editing form defition.
 *
 * You should override functions as necessary from the parent class located at
 * /question/type/edit_question_form.php.
 */
class qtype_uml_edit_form extends question_edit_form {

    /**
     * Returns the question type name.
     *
     * @return string The question type name.
     */
    public function qtype() {
        return 'uml';
    }

    /**
     * Loads and sets up the editor
     *
     * @param $mform
     * @return void
     */
    protected function definition_inner($mform) {
        // Generate the label html.
        $labelhtml = '
        <div class="col-md-3 col-form-label d-flex pb-0 pr-md-0">
            <label id="id_idnumber_label" class="d-inline word-break " for="id_idnumber">
                ' . get_string("correctanswer", "qtype_uml") . '
            </label>
        </div>';

        // Load the editor and generate html.
        $filepath = dirname(__FILE__) . '/editor/index.html';
        $file = fopen($filepath, "r") || die("Unable to load editor");
        $editorcontent = fread($file, filesize($filepath));
        fclose($file);

        $editorhtml = '
        <div class="col-md-9 form-inline align-items-start felement" data-fieldtype="text">
            ' . $editorcontent . '
        </div>';

        $mform->addElement('html', '<div class="form-group row fitem">' . $labelhtml . $editorhtml . '</div>');
    }

    /**
     * Reads the question data and processes it
     *
     * @param $question
     * @return void
     */
    public function data_preprocessing($question) {
        $question = parent::data_preprocessing($question);

        // TODO read from LS and put editor output into correctanswer field.

        return $question;
    }
}
