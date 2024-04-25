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
 * UML question type upgrade code.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Upgrade code for the uml question type.
 *
 * @param int $oldversion the version we are upgrading from.
 */
function xmldb_qtype_uml_upgrade($oldversion) {
    global $DB;

    $dbman = $DB->get_manager();

    // Automatically generated Moodle v3.9.0 release upgrade line.
    // Put any upgrade step following this.

    if ($oldversion < 2024042504) {
        $table = new xmldb_table('question_uml');

        // Create fields.

        // Grader info fields.
        $fieldgraderinfo = new xmldb_field('graderinfo', XMLDB_TYPE_TEXT);
        $fieldgraderinfofromat = new xmldb_field('graderinfoformat', XMLDB_TYPE_INTEGER, '2', null,
                null, null, 0, null);

        // Prompt configuration fields.
        $fieldpromptconfiguration = new xmldb_field('promptconfiguration', XMLDB_TYPE_TEXT);
        $fieldpromptconfigurationformat = new xmldb_field('promptconfigurationformat', XMLDB_TYPE_INTEGER, '2', null,
                null, null, 0, null);

        $fields = [
                $fieldgraderinfo,
                $fieldgraderinfofromat,
                $fieldpromptconfiguration,
                $fieldpromptconfigurationformat,
        ];

        foreach ($fields as $field) {
            // Conditionally launch add field.
            if (!$dbman->field_exists($table, $field)) {
                $dbman->add_field($table, $field);
            }
        }

        // UML savepoint reached.
        upgrade_plugin_savepoint(true, 2024042504, 'qtype', 'uml');
    }

    return true;
}
