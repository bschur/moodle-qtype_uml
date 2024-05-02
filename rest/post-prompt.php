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
 * The rest endpoint for posting prompts.
 *
 * @package     qtype_uml
 * @copyright   copy
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define('MOODLE_INTERNAL', true);

defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/../vendor/autoload.php');

use LLPhant\OllamaConfig;
use LLPhant\Chat\OllamaChat;
use GuzzleHttp\Exception\ClientException;

// Check if request is POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}

// Check if ollama instance is running.
$fp = @fsockopen('localhost', '11434');
if (!is_resource($fp)) {
    http_response_code(500);
    echo 'Ollama instance not running (has to run on localhost:11434)';
    exit();
}

// Check if prompt is given.
$prompt = file_get_contents('php://input');
if (!isset($prompt)) {
    http_response_code(400);
    echo 'Prompt was not given';
    exit();
}

$config = new OllamaConfig();
$config->model = 'llama3';
$chat = new OllamaChat($config);

try {
    $response = $chat->generateText($prompt);
    header('Content-Type: application/json');
    echo json_encode($response);
} catch (ClientException $e) {
    http_response_code(404);
    echo 'Error invoking model. Most likely the model does not exists.';
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error invoking model. Most likely your current setup isn\'t correct.';
    exit();
}
