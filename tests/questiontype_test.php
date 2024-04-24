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
require_once($CFG->dirroot . '/question/engine/tests/helpers.php');
require_once($CFG->dirroot . '/question/format/xml/format.php');

/**
 * Unit tests for the uml question type class.
 *
 * @package    qtype_uml
 * @copyright  2023 Luca Bösch <luca.boesch@bfh.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
final class questiontype_test extends \advanced_testcase {

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
     * Test column name getter/setter
     *
     * @covers ::name()
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

    /**
     * Method to assert that two xml strings are the same
     *
     * @param string $expectedxml the expected xml
     * @param string $xml the xml to compare
     * @return void
     */
    public function assert_same_xml($expectedxml, $xml) {
        $this->assertEquals(str_replace("\r\n", "\n", $expectedxml),
            str_replace("\r\n", "\n", $xml));
    }

    /**
     * Test initialise question instance
     *
     * @covers \qtype_uml::make_question
     * @return void
     */
    public function test_initialise_question_instance(): void {
        $qdata = \test_question_maker::get_question_data('uml', 'basic');
        $expectedq = \test_question_maker::make_question('uml', 'basic');
        $qdata->stamp = $expectedq->stamp;
        $qdata->version = $expectedq->version;
        $qdata->timecreated = $expectedq->timecreated;
        $qdata->timemodified = $expectedq->timemodified;

        $question = $this->qtype->make_question($qdata);

        $this->assertEquals($expectedq, $question);
    }

    /**
     * Test xml import
     *
     * @covers \qtype_uml::import_from_xml
     * @return void
     * @throws \coding_exception
     */
    public function test_xml_import(): void {
        $xml = '  <question type="uml">
    <name>
      <text>UML question</text>
    </name>
    <questiontext format="html">
      <text>Draw an UML diagram</text>
    </questiontext>
    <generalfeedback>
      <text>You should do this and that</text>
    </generalfeedback>
    <defaultgrade>6</defaultgrade>
    <penalty>0.3333333</penalty>
    <hidden>0</hidden>
    <showstandardinstruction>0</showstandardinstruction>
  </question>';
        $xmldata = xmlize($xml);

        $importer = new \qformat_xml();
        $q = $importer->try_importing_using_qtypes(
            $xmldata['question'], null, null, 'uml');

        $expectedq = new \stdClass();
        $expectedq->qtype = 'uml';
        $expectedq->name = 'UML question';
        $expectedq->questiontext = 'Draw an UML diagram';
        $expectedq->questiontextformat = FORMAT_HTML;
        $expectedq->generalfeedback = 'General feedback.';
        $expectedq->generalfeedbackformat = FORMAT_HTML;
        $expectedq->defaultmark = 6;
        $expectedq->length = 1;
        $expectedq->penalty = 0.3333333;

        $this->assertEquals(new question_check_specified_fields_expectation($expectedq), $q);
    }

    /**
     * Test xml export
     *
     * @covers \qtype_uml::export_to_xml
     * @return void
     */
    public function test_xml_export(): void {
        $qdata = \test_question_maker::get_question_data('uml', 'basic');
        $qdata->defaultmark = 6;

        $exporter = new \qformat_xml();
        $xml = $exporter->writequestion($qdata);

        $expectedxml = '<!-- question: 0  -->
  <question type="uml">
    <name>
      <text>UML question</text>
    </name>
    <questiontext format="html">
      <text>Draw an UML diagram</text>
    </questiontext>
    <generalfeedback format="html">
      <text>You should do this and that</text>
    </generalfeedback>
    <defaultgrade>6</defaultgrade>
    <penalty>0.3333333</penalty>
    <hidden>0</hidden>
    <idnumber></idnumber>
    <showstandardinstruction>0</showstandardinstruction>
    <hint format="html">
      <text>Hint 1.</text>
      <shownumcorrect/>
    </hint>
    <hint format="html">
      <text>Hint 2.</text>
      <shownumcorrect/>
      <clearwrong/>
      <options>1</options>
    </hint>
  </question>
';

        $this->assert_same_xml($expectedxml, $xml);
    }
}
