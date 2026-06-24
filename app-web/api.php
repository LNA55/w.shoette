<?php
/* What works for me — API de sauvegarde minimale (données de test).
   Chaque compte est stocké dans data/store_<id>.json sur le serveur.
   Pas de durcissement sécurité (cf. cahier des charges : données de test). */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$DATA = __DIR__ . '/data';
if (!is_dir($DATA)) { @mkdir($DATA, 0775, true); }

function jexit($a){ echo json_encode($a, JSON_UNESCAPED_UNICODE); exit; }
function readJson($f, $def){ if(!is_file($f)) return $def; $d = json_decode(file_get_contents($f), true); return is_array($d) ? $d : $def; }
function writeJson($f, $d){ return file_put_contents($f, json_encode($d, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT), LOCK_EX) !== false; }
function storeFile($DATA, $id){ return $DATA . '/store_' . preg_replace('/[^a-zA-Z0-9_]/','',$id) . '.json'; }

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) $body = [];
$action = isset($body['action']) ? $body['action'] : '';

$usersFile = $DATA . '/users.json';
$users = readJson($usersFile, []);

if ($action === 'signup') {
  $email = strtolower(trim($body['email'] ?? ''));
  $pass  = (string)($body['password'] ?? '');
  if ($email === '' || $pass === '') jexit(['ok'=>false,'error'=>'missing']);
  if (isset($users[$email])) jexit(['ok'=>false,'error'=>'exists']);
  $id = 'acc_' . bin2hex(random_bytes(6));
  $users[$email] = ['id'=>$id, 'hash'=>password_hash($pass, PASSWORD_DEFAULT), 'createdAt'=>time()];
  writeJson($usersFile, $users);
  $store = ['profile'=>['lang'=>$body['lang']??'fr','theme'=>$body['theme']??'turquoise'], 'entries'=>[]];
  writeJson(storeFile($DATA,$id), $store);
  jexit(['ok'=>true,'token'=>$id,'email'=>$email,'store'=>$store]);
}

if ($action === 'login') {
  $email = strtolower(trim($body['email'] ?? ''));
  $pass  = (string)($body['password'] ?? '');
  if (!isset($users[$email])) jexit(['ok'=>false,'error'=>'nouser']);
  if (!password_verify($pass, $users[$email]['hash'])) jexit(['ok'=>false,'error'=>'badpass']);
  $id = $users[$email]['id'];
  $store = readJson(storeFile($DATA,$id), ['profile'=>[],'entries'=>[]]);
  jexit(['ok'=>true,'token'=>$id,'email'=>$email,'store'=>$store]);
}

/* Actions authentifiées : token = id de compte (données de test, pas de session durcie). */
$token = (string)($body['token'] ?? '');
$valid = false;
foreach ($users as $u) { if ($u['id'] === $token) { $valid = true; break; } }
if (!$valid) jexit(['ok'=>false,'error'=>'auth']);

if ($action === 'load') {
  jexit(['ok'=>true,'store'=>readJson(storeFile($DATA,$token), ['profile'=>[],'entries'=>[]])]);
}

if ($action === 'save') {
  $store = $body['store'] ?? null;
  if (!is_array($store)) jexit(['ok'=>false,'error'=>'nostore']);
  writeJson(storeFile($DATA,$token), $store);
  jexit(['ok'=>true]);
}

jexit(['ok'=>false,'error'=>'unknown']);
