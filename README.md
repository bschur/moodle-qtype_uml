# UML question type for Moodle

![](https://github.com/bschur/moodle-qtype_uml/actions/workflows/moodle-plugin-ci.yml/badge.svg)
[![GitHub
Release](https://img.shields.io/github/release/bschur/moodle-qtype_uml.svg)](https://github.com/bschur/moodle-qtype_uml/releases)
[![PHP Support](https://img.shields.io/badge/php-7.4--8.3-blue)](https://github.com/bschur/moodle-qtype_uml/actions)
[![Moodle Support](https://img.shields.io/badge/Moodle-4.1--4.4-orange)](https://github.com/bschur/moodle-qtype_uml/actions)
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

## Optionally Set Up AI Correction ##

By default, this plugin supports only static analysis of a given answer and its correct solution. However, it also has support for Large Language Models (LLMs), allowing for more
advanced correction capabilities.

To enable this feature, follow the steps outlined below.

### Setting Up Llama 3 Locally ###

We will set up LLM support using [Ollama](https://ollama.com/). Begin by following the Ollama setup guide on the Moodle server. Once installed, download the Llama 3 model. When
everything is running, go to a UML question and edit it to check if the setup is correct. You should see a section labeled "prompt configuration." If it appears, your setup is
successful.

### Using Other Models ###

If you'd rather not use Llama 3, there are other models you can choose from. Ollama provides a variety of [models](https://ollama.com/library) that you can download. Once you've
selected and downloaded your preferred model, modify the `post-prompt.php` file to reference the new model.

```php
$config->model = 'llama3';

// change to

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
