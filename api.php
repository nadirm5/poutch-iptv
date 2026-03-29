<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$server = "http://binqrzgi.sidiman.com";
$user = "YWR48WA";
$pass = "EQU8TG3";

$api = "$server/player_api.php?username=$user&password=$pass&action=get_live_streams";
$response = file_get_contents($api);

if(!$response){
    echo json_encode(["error" => "Impossible de contacter le serveur"]);
    exit;
}

$data = json_decode($response, true);
$result = [];

foreach($data as $ch){
    $result[] = [
        "name" => $ch['name'],
        "stream_id" => $ch['stream_id']
    ];
}

echo json_encode($result);
?>
