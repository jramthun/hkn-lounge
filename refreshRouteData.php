<?php

$url = "https://bus.gocitybus.com/Home/RefreshRouteData/";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "Content-Type: application/json",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

// $data = '{"route":{"routeKey":"8889e486-0b03-41f2-bba6-4153e5d7fc4e","nearbyStops":[{"stopCode":"BUS538","directionKey":"989e4ef2-b772-4ff9-ad5f-c523ecd743fc"}]}}';

$data = $_POST["busLine"];

curl_setopt($curl, CURLOPT_POSTFIELDS, $data);

//for debug only!
curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($curl);
curl_close($curl);
$json_resp = json_encode($resp);
echo $json_resp;

?>


