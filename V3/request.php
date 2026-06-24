<?php
// Access-request logger for "What is wrong with me" (V3 — chronic pain)
// Appends each request to requests.csv with a Paris-time timestamp.
// Fields: timestamp, name, email, pain_duration, human_support, lang, source.
// requests.csv is protected from the web by the parent .htaccess (<FilesMatch "\.csv$">);
// retrieve it via FTP only.
header('Content-Type: application/json; charset=utf-8');

// Accept POST only
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

// Honeypot: real users never fill the hidden "website" field
if (trim($_POST['website'] ?? '') !== '') {
    echo json_encode(['ok' => true]); // silently ignore bots
    exit;
}

$email = trim($_POST['email'] ?? '');
if ($email === '' || strlen($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}

// Free-text name: trim, strip line breaks, cap length.
$clean = function ($v, $max = 120) {
    $v = trim((string) $v);
    $v = preg_replace('/[\r\n\t]+/', ' ', $v);
    return function_exists('mb_substr') ? mb_substr($v, 0, $max) : substr($v, 0, $max);
};
$name = $clean($_POST['name'] ?? '', 120);

// Pain duration: constrained to a known set.
$pain = strtolower(trim($_POST['pain_duration'] ?? ''));
$allowed = ['lt1', '1-3', '3-5', '5plus', 'prefer-not'];
if (!in_array($pain, $allowed, true)) {
    $pain = '';
}

// Human-support interest: checkbox sends "yes" only when ticked.
$human = (strtolower(trim($_POST['human_support'] ?? '')) === 'yes') ? 'yes' : 'no';

// Which form it came from (form-hero / form-request). Sanitised.
$source = strtolower(trim($_POST['source'] ?? ''));
if (!preg_match('/^[a-z0-9_-]{0,32}$/', $source)) {
    $source = '?';
}

// Platform language at sign-up (sent by the page: "en" or "fr"). Sanitised.
$lang = strtolower(trim($_POST['lang'] ?? ''));
if (!preg_match('/^[a-z]{2}(-[a-z]{2})?$/', $lang)) {
    $lang = '?';
}

date_default_timezone_set('Europe/Paris');
$timestamp = date('Y-m-d H:i:s');

$file = __DIR__ . '/requests.csv';
$esc  = function ($v) { return '"' . str_replace('"', '""', $v) . '"'; };
$row  = $esc($timestamp) . ',' . $esc($name) . ',' . $esc($email) . ',' .
        $esc($pain) . ',' . $esc($human) . ',' . $esc($lang) . ',' . $esc($source) . "\n";

$fp = fopen($file, 'c'); // create if missing, never truncate
if ($fp === false || !flock($fp, LOCK_EX)) {
    if ($fp) fclose($fp);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'io']);
    exit;
}
fseek($fp, 0, SEEK_END);
if (ftell($fp) === 0) {
    fwrite($fp, "timestamp,name,email,pain_duration,human_support,lang,source\n");
}
fwrite($fp, $row);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok' => true]);
