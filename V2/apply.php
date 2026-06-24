<?php
// Cohort 0 application logger for "What is wrong with me" (V2)
// Appends each application to cohort0.csv with a Paris-time timestamp.
// Fields: timestamp, name, email, treatment, goal, lang, source.
// cohort0.csv is protected from the web by the parent .htaccess (<FilesMatch "\.csv$">);
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

// Free-text fields: trim and cap length defensively.
$clean = function ($v, $max = 200) {
    $v = trim((string) $v);
    $v = preg_replace('/[\r\n\t]+/', ' ', $v); // keep CSV rows on one line
    if (function_exists('mb_substr')) {
        return mb_substr($v, 0, $max);
    }
    return substr($v, 0, $max);
};

$name = $clean($_POST['name'] ?? '', 120);
$goal = $clean($_POST['goal'] ?? '', 280);

// Treatment: constrained to a known set of values.
$treatment = strtolower(trim($_POST['treatment'] ?? ''));
$allowed   = ['mounjaro', 'other-glp1', 'none', 'prefer-not'];
if (!in_array($treatment, $allowed, true)) {
    $treatment = '';
}

// Which form it came from (form-hero / form-apply). Sanitised.
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

$file = __DIR__ . '/cohort0.csv';
$esc  = function ($v) { return '"' . str_replace('"', '""', $v) . '"'; };
$row  = $esc($timestamp) . ',' . $esc($name) . ',' . $esc($email) . ',' .
        $esc($treatment) . ',' . $esc($goal) . ',' . $esc($lang) . ',' . $esc($source) . "\n";

$fp = fopen($file, 'c'); // create if missing, never truncate
if ($fp === false || !flock($fp, LOCK_EX)) {
    if ($fp) fclose($fp);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'io']);
    exit;
}
fseek($fp, 0, SEEK_END);
if (ftell($fp) === 0) {
    fwrite($fp, "timestamp,name,email,treatment,goal,lang,source\n"); // header on first write
}
fwrite($fp, $row);
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode(['ok' => true]);
