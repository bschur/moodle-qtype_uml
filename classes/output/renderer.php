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
 * The uml question renderer class is defined here.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/../helpers/editor_helper.php');

/**
 * Generates the output for uml questions.
 *
 * You should override functions as necessary from the parent class located at
 * /question/type/rendererbase.php.
 */
class qtype_uml_renderer extends qtype_renderer {

    /**
     * Generates the display of the formulation part of the question. This is the
     * area that contains the question text, and the controls for students to
     * input their answers. Some question types also embed bits of feedback, for
     * example ticks and crosses, in this area.
     *
     * @param question_attempt $qa the question attempt to display.
     * @param question_display_options $options controls what should and should not be displayed.
     * @return string HTML fragment.
     */
    public function formulation_and_controls(question_attempt $qa, question_display_options $options): string {
        $question = $qa->get_question();
        $response = $qa->get_last_qt_var('answer', '');

        $result = html_writer::tag('div', $question->format_questiontext($qa), ['class' => 'qtext']);

        // Generate the input field.
        $answerattributes = [
                'type' => 'hidden',
                'id' => uniqid('diagramInput'),
                'name' => $qa->get_qt_field_name('answer'),
                'value' => $response,
        ];
        if ($options->readonly) {
            $answerattributes['disabled'] = 'disabled';
        }

        $answerinput = html_writer::empty_tag('input', $answerattributes);

        return $result . EditorHelper::load_editor_html_for_id($answerattributes['id'], !$options->readonly, $response) .
                $answerinput;
    }

    /**
     * Generate the specific feedback. This is feedback that varies according to
     * the response the student gave. This method is only called if the display options
     * allow this to be shown.
     *
     * @param question_attempt $qa the question attempt to display.
     * @return string HTML fragment.
     */
    protected function specific_feedback(question_attempt $qa): string {
        syslog(LOG_INFO, 'question_attempt called');
        return parent::specific_feedback($qa);
    }

    /**
     * Generates an automatic description of the correct response to this question.
     * Not all question types can do this. If it is not possible, this method
     * should just return an empty string.
     *
     * @param question_attempt $qa the question attempt to display.
     * @return string HTML fragment.
     * @throws coding_exception
     */
    protected function correct_response(question_attempt $qa): string {
        $question = $qa->get_question();
        if (!$question instanceof qtype_uml_question) {
            throw new coding_exception('Question is not a uml question');
        }

        return $question->correctanswer;
    }
}
