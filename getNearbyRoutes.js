async function parseRoutes(resp) {
    var busLines = {};
    var BSRR = resp.busStopRouteResults;
    // console.log(BSRR)
    var lenResp = BSRR.length;
    // console.log(BSRR.length);
    for (var s = 0; s < BSRR.length; s++){
        var routeNumber = BSRR[s].routeNumber;
        var routeKey = BSRR[s].routeKey;
        var stopCode = BSRR[s].nearbyStops[0].stopCode;
        var directionKey = BSRR[s].nearbyStops[0].directionKey;
        // console.log('{"route":{"routeKey":'+routeKey+',"nearbyStops":[{"stopCode":'+stopCode+',"directionKey":'+directionKey+'}]}}');
        var routeTimeCall = '{"route":{"routeKey":"'+routeKey+'","nearbyStops":[{"stopCode":"' + stopCode + '","directionKey":"' + directionKey + '"}]}}';
        busLines[routeNumber] = routeTimeCall;
        // console.log(busLines[routeNumber]);
    }
    // console.log(busLines);
    return busLines;
}

// function getNearbyRoutes() {
//     (async () => {
//         const rawResponse = await fetch('getNearbyRoutes.php', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: { "latitude": null, "longitude": null, "stopCode": "BUS538", "minRadius": null, "maxRadius": null, "favouriteRoutes": [] }
//         });
//         const content = await rawResponse.json();
//         console.log(JSON.parse(content));
//         const busLines = await parseRoutes(JSON.parse(content));
//         console.log(busLines);
//         return busLines;
//     })();
// }


async function getNearbyRoutes(){
    let rawResponse = await fetch('getNearbyRoutes.php', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "data="+'{"latitude": null, "longitude": null, "stopCode": "BUS538", "minRadius": null, "maxRadius": null, "favouriteRoutes": []}'
    });
    let content = await rawResponse.json();
    console.log(JSON.parse(content));
    let busLines = await parseRoutes(JSON.parse(content));
    // console.log(busLines);
    return busLines;
}

// getNearbyRoutes().then((resp) => {console.log(resp)});