<?php

$url = "https://bus.gocitybus.com/Home/GetNearbyRoutes/";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "Content-Type: application/json",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

// $data = '{"latitude":null,"longitude":null,"stopCode":"BUS538","minRadius":null,"maxRadius":null,"favouriteRoutes":[]}';
$data = $_POST["data"];

curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($curl);
curl_close($curl);
$json_resp = json_encode($resp);
echo $json_resp;
?>


