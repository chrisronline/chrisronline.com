<?php
require '_credentials.php';

function request($url) {
  global $username, $password;
  $c = curl_init();
  curl_setopt_array($c, array(
    CURLOPT_URL => 'https://api.github.com/' . $url,
    CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
    CURLOPT_USERPWD => "$username:$password",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_USERAGENT => 'chrisronline.com'
  ));
  $response = curl_exec($c);
  curl_close($c);
  return $response;
}

$method = $_GET['method'];

$response = array();
switch ($method) {
  case 'repos':
    $repos = request('user/repos');
    $reposAsArray = json_decode($repos);
    foreach ($reposAsArray as &$repo) {
      $repo->commits = json_decode(request('repos/' . $username . '/' . $repo->name . '/commits'));
    }
    $response = $reposAsArray;
    break;
  default:
    $response = array('error' => 'Method not supported', 'method' => $method);
}

header('Content-Type: application/json');
echo json_encode($response);
