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

namespace qtype_uml;

use question_bank;
use question_engine;
use question_state;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/engine/tests/helpers.php');

/**
 * Unit tests for the uml question type.
 *
 * @package    qtype_uml
 * @copyright  2023 Luca Bösch <luca.boesch@bfh.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class walkthrough_test extends \qbehaviour_walkthrough_test_base {

    /**
     * Test feedback with deferredfeedback question behaviour
     *
     * @covers ::get_general_feedback()
     */
    public function test_deferred_feedback(): void {

        // Create an uml question.
        $q = \test_question_maker::make_question('uml');
        $this->start_attempt_at_question($q, 'deferredfeedback', 1);

        $prefix = $this->quba->get_field_prefix($this->slot);

        // Check the initial state.
        $this->check_current_state(question_state::$todo);
        $this->check_current_mark(null);
        $this->render();
        $this->check_step_count(1);

        // Save a response.
        $this->quba->process_all_actions(null, [
            'slots'                    => $this->slot,
        ]);

        // Verify.
        $this->check_current_state(question_state::$complete);
        $this->check_current_mark(null);
        $this->check_step_count(2);
        $this->render();
        $this->check_step_count(2);

        // Finish the attempt.
        $this->quba->finish_all_questions();

        // Verify.
        $this->check_current_state(question_state::$needsgrading);
        $this->check_current_mark(null);
        $this->render();
        $this->assertMatchesRegularExpression('/' . preg_quote(s($response), '/') . '/', $this->currentoutput);
        $this->check_current_output(
                $this->get_contains_question_text_expectation($q),
                $this->get_contains_general_feedback_expectation($q));
    }

}
