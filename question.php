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

/**
 * Class that represents a uml question.
 */
class qtype_uml_question extends question_with_responses {
    /**
     * @var string The correct answer fot the UML question.
     */
    public string $correctanswer;

    // Definition of properties used in legacy code or tests, for compatibility with PHP 8.2.
    /** @var string Feedback for any correct response. */
    public $correctfeedback;
    /** @var int format of $correctfeedback. */
    public $correctfeedbackformat;
    /** @var string Feedback for any partially correct response. */
    public $partiallycorrectfeedback;
    /** @var int format of $partiallycorrectfeedback. */
    public $partiallycorrectfeedbackformat;
    /** @var string Feedback for any incorrect response. */
    public $incorrectfeedback;
    /** @var int format of $incorrectfeedback. */
    public $incorrectfeedbackformat;
    /** @var string Information for the graders. */
    public $graderinfo;
    /** @var int format of $graderinfo. */
    public $graderinfoformat;
    /** @var string configuration of the prompt. */
    public $promptconfiguration;
    /** @var int format of $promptconfiguration. */
    public $promptconfigurationformat;

    /**
     * Defines the behaviour of the question.
     *
     * @param question_attempt $qa
     * @param object $preferredbehaviour
     * @return qbehaviour_missing|question_behaviour
     */
    public function make_behaviour(question_attempt $qa, $preferredbehaviour) {
        return question_engine::make_behaviour('manualgraded', $qa, $preferredbehaviour);
    }

    /**
     * Returns the expected data for the question.
     *
     * @return array
     */
    public function get_expected_data(): array {
        return ['answer' => PARAM_RAW];
    }

    /**
     * Returns the correct answer for the question.
     *
     * @return string[]
     */
    public function get_correct_response(): array {
        return ['answer' => $this->correctanswer];
    }

    /**
     * Checks whether the response given is complete.
     *
     * @param array $response
     * @return bool
     */
    public function is_complete_response(array $response): bool {
        return array_key_exists('answer', $response);
    }

    /**
     * Check if the response is the same as the previous response.
     *
     * @param array $prevresponse
     * @param array $newresponse
     * @return bool
     */
    public function is_same_response(array $prevresponse, array $newresponse): bool {
        return false; // We handle the correction in the frontend itself.
    }

    /**
     * Summarise the response.
     *
     * @param array $response
     * @return string
     */
    public function summarise_response(array $response): string {
        if (array_key_exists('answer', $response) &&
                isset($response['answer'])) {
            return $response['answer'];
        }

        return '';
    }
}
