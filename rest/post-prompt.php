<?php

require_once __DIR__ . '/../vendor/autoload.php';

use LLPhant\OllamaConfig;
use LLPhant\Chat\OllamaChat;
use GuzzleHttp\Exception\ClientException;

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit();
}

// check if ollama instance is running
$fp = @fsockopen('localhost', '11434');
if(!is_resource($fp)) {
    http_response_code(500);
    echo 'Ollama instance not running (has to run on localhost:11434)';
    exit();
}

// TODO check for privileges

$prompt = htmlspecialchars($_POST['prompt']);
if(!isset($prompt)){
    http_response_code(400);
    echo 'Prompt was not given';
    exit();
}

$config = new OllamaConfig();
$config->model = 'llama';
$chat = new OllamaChat($config);

try {
    $response = $chat->generateText($prompt);
    echo $response;
} catch (ClientException $e) {
    http_response_code(404);
    echo 'Error invoking model. Most likely the model does not exists.';
    exit();
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error invoking model. Most likely your current setup isn\'t correct.';
    exit();
}
