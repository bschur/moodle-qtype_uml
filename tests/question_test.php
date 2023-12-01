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

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->dirroot . '/question/engine/tests/helpers.php');
require_once($CFG->dirroot . '/question/type/uml/tests/helper.php');

/**
 * Unit tests for the uml question definition class.
 *
 * @package    qtype_uml
 * @copyright  2023 Luca Bösch <luca.boesch@bfh.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class question_test extends \advanced_testcase {

    /**
     * Test get_question_summary
     *
     * @covers ::get_question_summary()
     */
    public function test_get_question_summary(): void {
        \question_bank::load_question_definition_classes('uml');
        $uml = new \qtype_uml_question();
        $uml->questiontext = 'UML';
        $this->assertEquals('UML', $uml->get_question_summary());
    }
}
