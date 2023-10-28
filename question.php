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
 * Question definition class for uml.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Class that represents a uml question.
 */
class qtype_uml_question extends question_graded_automatically_with_countback {

    public function get_expected_data() {
        // TODO: Implement get_expected_data() method.
    }

    public function get_correct_response() {
        // TODO: Implement get_correct_response() method.
    }

    public function is_complete_response(array $response) {
        // TODO: Implement is_complete_response() method.
    }

    public function is_same_response(array $prevresponse, array $newresponse) {
        // TODO: Implement is_same_response() method.
    }

    public function summarise_response(array $response) {
        // TODO: Implement summarise_response() method.
    }

    public function get_validation_error(array $response) {
        // TODO: Implement get_validation_error() method.
    }

    public function grade_response(array $response) {
        // TODO: Implement grade_response() method.
    }

    public function compute_final_grade($responses, $totaltries) {
        // TODO: Implement compute_final_grade() method.
    }
}
