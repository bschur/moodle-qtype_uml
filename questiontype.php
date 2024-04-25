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
 * Question type class for uml is defined here.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

global $CFG;
require_once($CFG->libdir . '/questionlib.php');
require_once(__DIR__ . '/question.php');

/**
 * Class that represents a uml question type.
 *
 * The class loads, saves and deletes questions of the type uml
 * to and from the database and provides methods to help with editing questions
 * of this type. It can also provide the implementation for import and export
 * in various formats.
 */
class qtype_uml extends question_type {
    /**
     * Saves the question options to the database.
     *
     * @param object $question
     * @return bool
     * @throws dml_exception
     */
    public function save_question_options($question): bool {
        global $DB;
        $context = $question->context;

        // Fetch old answer ids so that we can reuse them.
        $oldanswers = $DB->get_records('question_answers',
                ['question' => $question->id], 'id ASC');

        // Save the correct answer - update an existing answer if possible.
        $correctanswerobject = array_shift($oldanswers);
        if (!$correctanswerobject) {
            $correctanswerobject = new stdClass();
            $correctanswerobject->question = $question->id;
            $correctanswerobject->answer = '';
            $correctanswerobject->feedback = '';
            $correctanswerobject->id = $DB->insert_record('question_answers', $correctanswerobject);
        }

        $correctanswerobject->answer = $question->correctanswer;
        $DB->update_record('question_answers', $correctanswerobject);
        $correctanswerid = $correctanswerobject->id;

        // Delete any leftover old answer records.
        $fs = get_file_storage();
        foreach ($oldanswers as $oldanswer) {
            $fs->delete_area_files($context->id, 'question', 'answerfeedback', $oldanswer->id);
            $DB->delete_records('question_answers', ['id' => $oldanswer->id]);
        }

        // Store grader information.
        $graderinfo = $this->import_or_save_files($question->graderinfo,
                $context, 'qtype_uml', 'graderinfo', $question->id);
        $graderinfoformat = $question->graderinfo['format'];

        // Store prompt configuration.
        $promptconfiguration = isset($question->promptconfiguration) ? $this->import_or_save_files($question->promptconfiguration,
                $context, 'qtype_uml', 'promptconfiguration', $question->id) : null;
        $promptconfigurationformat = isset($question->promptconfiguration) ? $question->promptconfiguration['format'] : null;

        $options = $DB->get_record('question_uml', ['question' => $question->id]);
        // Save question options in question_uml table.
        if (!$options) {
            $options = new stdClass();
            $options->question = $question->id;
            $options->correctanswer = $correctanswerid;
            $options->graderinfo = $graderinfo;
            $options->graderinfoformat = $graderinfoformat;
            $options->promptconfiguration = $promptconfiguration;
            $options->promptconfigurationformat = $promptconfigurationformat;
            $DB->insert_record('question_uml', $options);
        } else {
            $options->question = $question->id;
            $options->correctanswer = $correctanswerid;
            $options->graderinfo = $graderinfo;
            $options->graderinfoformat = $graderinfoformat;
            $options->promptconfiguration = $promptconfiguration;
            $options->promptconfigurationformat = $promptconfigurationformat;
            $DB->update_record('question_uml', $options);
        }

        $this->save_hints($question);

        return true;
    }

    /**
     * Get the question options from the database.
     *
     * @param object $question
     * @return bool
     * @throws dml_exception
     */
    public function get_question_options($question): bool {
        global $DB, $OUTPUT;
        parent::get_question_options($question);

        // Get additional information from database
        // and attach it to the question object.
        if (!$question->options = $DB->get_record('question_uml',
                ['question' => $question->id])) {
            echo $OUTPUT->notification('Error: Missing question options!');
            return false;
        }
        // Load the answers.
        if (!$question->options->answers = $DB->get_records('question_answers',
                ['question' => $question->id], 'id ASC')) {
            echo $OUTPUT->notification('Error: Missing question answers for uml question ' .
                    $question->id . '!');
            return false;
        }

        return true;
    }

    /**
     * Deletes the question from the database.
     *
     * @param int $questionid
     * @param int $contextid
     * @return void
     * @throws dml_exception
     */
    public function delete_question($questionid, $contextid): void {
        global $DB;
        $DB->delete_records('question_uml', ['question' => $questionid]);

        parent::delete_question($questionid, $contextid);
    }

    /**
     * A function that returns whether this question type sometimes requires manual grading.
     *
     * @return bool true if this question type sometimes requires manual grading.
     */
    public function is_manual_graded(): bool {
        return true;
    }

    /**
     * Initialises a question instance.
     *
     * @param question_definition $question
     * @param object $questiondata
     * @return void
     */
    protected function initialise_question_instance(question_definition $question, $questiondata): void {
        parent::initialise_question_instance($question, $questiondata);

        $answers = $questiondata->options->answers;
        $correctanswerid = $questiondata->options->correctanswer;

        $question->correctanswer = $answers[$correctanswerid]->answer;
    }
}
