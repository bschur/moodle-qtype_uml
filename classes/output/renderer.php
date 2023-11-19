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
     * area that contains the quetsion text, and the controls for students to
     * input their answers. Some question types also embed bits of feedback, for
     * example ticks and crosses, in this area.
     *
     * @param question_attempt $qa the question attempt to display.
     * @param question_display_options $options controls what should and should not be displayed.
     * @return string HTML fragment.
     * @throws coding_exception
     */
    public function formulation_and_controls(question_attempt $qa, question_display_options $options): string {
        $result = parent::formulation_and_controls($qa, $options);

        // Get the last response.
        $step = $qa->get_last_step_with_qt_var('answer');

        // Start new attempt if question has never been answered.
        if (!$step->has_qt_var('answer') && empty($options->readonly)) {
            // Question has never been answered, fill it with response template.
            $step = new question_attempt_step(['answer' => '']);
        }

        $answer = $step->get_qt_var('answer') ?? '';

        // Generate the input field.
        $answerattributes = [
                'type' => 'hidden',
                'id' => uniqid('diagramInput'),
                'name' => $qa->get_qt_field_name('answer'),
                'value' => $answer,
                'disabled' => $options->readonly ? 'true' : 'false',
        ];
        $answerinput = html_writer::empty_tag('input', $answerattributes);

        return $result . EditorHelper::load_editor_html_for_id($answerattributes['id'], !$options->readonly, $answer) .
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
     */
    protected function correct_response(question_attempt $qa): string {
        syslog(LOG_INFO, 'correct_response called');
        return parent::correct_response($qa);
    }
}
