# UML question type for Moodle

![](https://github.com/bschur/moodle-qtype_uml/actions/workflows/moodle-plugin-ci.yml/badge.svg)
[![GitHub
Release](https://img.shields.io/github/release/bschur/moodle-qtype_uml.svg)](https://github.com/bschur/moodle-qtype_uml/releases)
[![PHP Support](https://img.shields.io/badge/php-7.4--8.2-blue)](https://github.com/bschur/moodle-qtype_uml/actions)
[![Moodle Support](https://img.shields.io/badge/Moodle-4.1--4.3-orange)](https://github.com/bschur/moodle-qtype_uml/actions)
[![License GPL-3.0](https://img.shields.io/github/license/bschur/moodle-qtype_uml?color=lightgrey)](https://github.com/bschur/moodle-qtype_uml/blob/main/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/bschur/moodle-qtype_uml)](https://github.com/bschur/moodle-qtype_uml/graphs/contributors)

## Installing via uploaded ZIP file ##

1. Log in to your Moodle site as an admin and go to _Site administration >
   Plugins > Install plugins_.
2. Upload the ZIP file with the plugin code. You should only be prompted to add
   extra details if your plugin type is not automatically detected.
3. Check the plugin validation report and finish the installation.

## Installing manually ##

The plugin can be also installed by putting the contents of this directory to

    {your/moodle/dirroot}/question/type/uml

Afterwards, log in to your Moodle site as an admin and go to _Site administration >
Notifications_ to complete the installation.

Alternatively, you can run

    $ php admin/cli/upgrade.php

to complete the installation from the command line.

## License ##

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
