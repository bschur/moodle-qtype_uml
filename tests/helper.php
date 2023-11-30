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

/**
 * Test helper class for the uml question type.
 *
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
        $q->contextid = context_system::instance()->id;
        $q->penalty = 0.2; // The default.
        test_question_maker::set_standard_combined_feedback_fields($q);
        $q->graderinfo = '';
        $q->graderinfoformat = FORMAT_HTML;
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
}
