<?php
// Waitlist logger for "What is wrong with me"
// Appends each submitted email to waitlist.csv with a Paris-time timestamp
// and the language of the platform the user signed up from (en / fr / ...).
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

// Platform language at sign-up (sent by the page: "en" or "fr"). Sanitised.
$lang = strtolower(trim($_POST['lang'] ?? ''));
if (!preg_match('/^[a-z]{2}(-[a-z]{2})?$/', $lang)) {
    $lang = '?';
}

date_default_timezone_set('Europe/Paris');
$timestamp = date('Y-m-d H:i:s');

$file = __DIR__ . '/waitlist.csv';
$esc  = function ($v) { return '"' . str_replace('"', '""', $v) . '"'; };
$row  = $esc($timestamp) . ',' . $esc($email) . ',' . $esc($lang) . "\n";

$fp = fopen($file, 'c'); // create if missing, never truncate
if ($fp === false || !flock($fp, LOCK_EX)) {
    if ($fp) fclose($fp);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'io']);
    exit;
}
fseek($fp, 0, SEEK_END);
if (ftell($fp) === 0) {
    fwrite($fp, "timestamp,email,lang\n"); // header on first write
}
fwrite($fp, $row);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok' => true]);
