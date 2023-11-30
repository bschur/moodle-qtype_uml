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

use qtype_uml;

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/type/uml/questiontype.php');


/**
 * Unit tests for the uml question type class.
 *
 * @package    qtype_uml
 * @copyright  2023 Luca Bösch <luca.boesch@bfh.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class questiontype_test extends \advanced_testcase {

    /** @var uml instance of the question type class to test. */
    protected $qtype;

    protected function setUp(): void {
        $this->qtype = new qtype_uml();
    }

    protected function tearDown(): void {
        $this->qtype = null;
    }

    /**
     * Get some test question data.
     * @return object the data to construct a question like
     * {@see \test_question_maker::make_question($questiondata)}.
     */
    protected function get_test_question_data() {
        $q = new \stdClass();
        $q->id = 1;

        return $q;
    }

    /**
     * Test get_name
     *
     * @covers ::get_name()
     */
    public function test_name(): void {
        $this->assertEquals($this->qtype->name(), 'uml');
    }

    /**
     * Test can_analyse_responses
     *
     * @covers ::can_analyse_responses()
     */
    public function test_can_analyse_responses(): void {
        $this->assertFalse($this->qtype->can_analyse_responses());
    }

    /**
     * Test get_random_guess_score
     *
     * @covers ::get_random_guess_score()
     */
    public function test_get_random_guess_score(): void {
        $q = $this->get_test_question_data();
        $this->assertEquals(0, $this->qtype->get_random_guess_score($q));
    }

    /**
     * Test get_possible_responses_subpoints
     *
     * @covers ::get_possible_responses()
     */
    public function test_get_possible_responses(): void {
        $q = $this->get_test_question_data();
        $this->assertEquals([], $this->qtype->get_possible_responses($q));

    }
}
