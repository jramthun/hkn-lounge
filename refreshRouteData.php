<?php

$url = "https://bus.gocitybus.com/Home/RefreshRouteData";

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$headers = array(
   "Content-Type: application/json",
);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

// $data = '{"route":{"routeKey":"3a120982-dafa-489d-8a3e-2e0ff9e7ab16","nearbyStops":[{"stopCode":"BUS538","directionKey":"9e97afbf-d16e-4753-9d0e-ab44eef28fda"}]}}';
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


