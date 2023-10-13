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
require_once($CFG->dirroot . '/question/type/uml/questiontype.php');
require_once($CFG->dirroot . '/question/type/edit_question_form.php');
require_once($CFG->dirroot . '/question/type/uml/edit_uml_form.php');

class questiontype_test extends advanced_testcase {

    /** @var object qtype */
    protected $qtype;

    protected function setUp(): void {
        $this->qtype = new qtype_uml();
    }

    protected function tearDown(): void {
        $this->qtype = null;
    }

    /**
     * Test get_name
     *
     * @covers ::get_name()
     */
    public function test_name() {
        $this->assertEquals($this->qtype->name(), 'uml');
    }
}
