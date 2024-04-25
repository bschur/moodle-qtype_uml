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

## Optionally setup AI correction ##

Out of the box this plugin only supports static analysis over an given answer and the correct solution.
There is support for LLMs (Large Language Models) to provide a more sophisticated correction.

To enable this feature, you can either use the predefined Llama2 correction or setup your own service yourself.

### Setup Llama2 locally ###

We setup the LLM feature with [Ollama](https://ollama.com/). Follow the guide to setup Ollama on the Moodle server.
Finally download the Llama2 model. When the service is running you can configure the prompt text for a given UML question.

### Use other model instead ###

You don't want to use Llama2? No problem, you can use other models as well.
Just download one of the many [models](https://ollama.com/library) provided by Ollama.
Then use the model identifier in the `post-prompt.php` file.

```php
$config->model = 'llama2';

// becomes

$config->model = 'your-model';
```

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

## Angular Project UML Editor ##

The UML editor is an Angular project located in `./uml-editor`. See the [README](./uml-editor/README.md) for more information.