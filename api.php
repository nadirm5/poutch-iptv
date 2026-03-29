<?php
header('Content-Type: application/json');

// Paramètres Xtream
$server = "http://binqrzgi.sidiman.com";
$user = "YWR48WA";
$pass = "EQU8TG3";

// Appel API Xtream pour récupérer les chaînes live
$api = "$server/player_api.php?username=$user&password=$pass&action=get_live_streams";

$response = file_get_contents($api);
if(!$response){
    echo json_encode([]);
    exit;
}

$data = json_decode($response, true);
$result = [];

foreach($data as $ch){
    $result[] = [
        "name" => $ch['name'],
        "url" => "$server/live/$user/$pass/".$ch['stream_id'].".m3u8" // HLS
    ];
}

echo json_encode($result);
