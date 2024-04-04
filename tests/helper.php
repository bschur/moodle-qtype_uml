<?php
// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Test helper code for the uml question type.
 *
 * @package    qtype_uml
 * @copyright  2023 Luca Bösch <luca.boesch@bfh.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_uml_test_helper extends question_test_helper {

    /**
     * Get predefined questions
     *
     * @return array
     */
    public function get_test_questions() {
        return ['basic'];
    }

    /**
     * Does the basical initialisation of a new uml question that all the test
     * questions will need.
     * @return qtype_uml_question the new question.
     */
    protected static function make_a_uml_question() {
        question_bank::load_question_definition_classes('uml');

        $q = new qtype_uml_question();
        test_question_maker::initialise_a_question($q);
        $q->qtype = question_bank::get_qtype('uml');
        $q->name = 'UML Question';
        $q->questiontext = 'Draw an UML diagram';
        $q->generalfeedback = 'You should do this and that';
        return $q;
    }

    /**
     * Does the basic initialisation of a new uml question that all the test
     * questions will need.
     *
     * @return qtype_uml_question
     */
    public static function make_uml_question_basic() {
        $q = self::make_a_uml_question();
        return $q;
    }

    /**
     * Get the form data that corresponds to an uml question.
     *
     * @return stdClass simulated question form data.
     */
    public function get_uml_question_form_data_basic() {
        $form = new stdClass();
        $form->name = 'UML Question';
        $form->questiontext = ['text' => 'Draw an UML diagram', 'format' => FORMAT_HTML];
        $form->defaultmark = 1;
        $form->generalfeedback = [
            'text' => 'You should do this and that',
            'format' => FORMAT_HTML,
        ];

        $form->qtype = 'uml';
        return $form;
    }

    /**
     * Get the raw data that corresponds to an uml question.
     *
     * @return stdClass simulated question form data.
     */
    public function get_uml_question_data_basic() {
        $questiondata = new stdClass();
        test_question_maker::initialise_question_data($questiondata);
        $questiondata->qtype = 'uml';
        $questiondata->name = 'UML Question';
        $questiondata->questiontext = 'Draw an UML diagram';
        $questiondata->generalfeedback = 'You should do this and that';

        $questiondata->options = new stdClass();
        test_question_maker::set_standard_combined_feedback_fields($questiondata->options);
        $questiondata->options->showgrading = true;
        return $questiondata;
    }
}
