function processBusTimes(line, xrt) {
    var nextStopTimes = xrt.nearbyStops[0].nextStopTimes[0];
    var timeElm = document.querySelectorAll("tr[data-route]");
    for (var idx = 0; idx < timeElm.length; idx++) {
        var elm = timeElm[idx];
        if (elm.dataset.route == line) {
            //console.log(line);
            console.log(elm.dataset.route);
            var busTime = elm.getElementsByTagName('time');
            console.log(busTime);
            if (nextStopTimes && nextStopTimes.scheduledDepartTimeUtc != null) {
                var schedTime = new Date(nextStopTimes.scheduledDepartTimeUtc);
                var localTime = new Date();
                //localTime = localTime.getFullYear() + '-' + (localTime.getMonth() + 1) + '-' + localTime.getDate() + "T" + localTime.getUTCHours() + ":" + localTime.getUTCMinutes() + ":" + localTime.getUTCSeconds() + "Z";
                //2021-11-30T16:02:00Z
                //console.log(localTime);
                //var nextSBusTime = schedTime.getMinutes() - localTime.getUTCMinutes();
                var nextSBusTime = (schedTime.getUTCHours() * 60 + schedTime.getUTCMinutes()) - (localTime.getUTCHours() * 60 + localTime.getUTCMinutes()) - 1;
                console.log(nextSBusTime);
                //console.log(schedTime.getMinutes() - localTime.getUTCMinutes());
                //tst.innerHTML += '<h5> Next Bus Time(s): ' + nextStopTimes[st].scheduledDepartTimeUtc + '</h5>';
                if (nextSBusTime > 0) {
                    busTime[0].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">' + nextSBusTime + '<span class="time-unit-field" > min</span ></time>';
                    busTime[1].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">' + nextSBusTime + '<span class="time-unit-field" > min</span ></time>';
                } else {
                    busTime[0].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">Due</time>';
                    busTime[1].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">Due</time>';
                }
            } else if (nextStopTimes && nextStopTimes.estimatedDepartTimeUtc != null){
                var estimTime = new Date(nextStopTimes.estimatedDepartTimeUtc);
                var localTime = new Date();
                //console.log(localTime);
                var nextSBusTime = (estimTime.getUTCHours() * 60 + estimTime.getUTCMinutes()) - (localTime.getUTCHours() * 60 + localTime.getUTCMinutes()) - 1;
                console.log(nextSBusTime);
                //console.log(estimTime.getMinutes() - localTime.getUTCMinutes());
                if (nextSBusTime > 0) {
                    busTime[0].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">' + nextSBusTime + '<span class="time-unit-field" > min</span ></time>';
                    busTime[1].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">' + nextSBusTime + '<span class="time-unit-field" > min</span ></time>';
                } else {
                    busTime[0].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">Due</time>';
                    busTime[1].outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">Due</time>';
                }
                //tst.innerHTML += '<h5> Next Bus Time(s): ' + nextStopTimes[st].estimatedDepartTimeUtc + '</h5>';
            } else {
                if (busTime[0] == null)
                    busTime.outerHTML = '<time datetime="PT 99M"></time>';
                else
                    busTime[0].outerHTML = '<time datetime="PT 99M"></time>';
                // (busTime[0].outerHTML = '<time datetime="PT 99M"></time>') || (busTime.outerHTML = '<time datetime="PT 99M"></time>');
            }
        }
    }
}

var bus1B  = '{"route":{"routeKey":"c7f75dbe-37ef-4bd3-b588-743ecd06c56b","nearbyStops":[{"stopCode":"BUS538","directionKey":"861f24b5-c6cb-46c6-81ce-ed03ff99bcde"}]}}';
var bus5   = '{"route":{"routeKey":"51a72715-e032-4d0f-a761-3c28f3637a76","nearbyStops":[{"stopCode":"BUS538","directionKey":"a3327a8e-7a87-4eac-9624-ca0bad51a2c7"}]}}';
var bus13  = '{"route":{"routeKey":"feadf0b3-e90b-4c01-b1dc-e4e39f6a617e","nearbyStops":[{"stopCode":"BUS538","directionKey":"a4872299-dd62-41a3-85c7-ff8a7865ff12"}]}}';
var bus15  = '{"route":{"routeKey":"a0c82da4-e313-41c4-9e2b-4eaf353cac6f","nearbyStops":[{"stopCode":"BUS538","directionKey":"50e490b9-1b6a-404b-bf90-256d0a688e84"}]}}';
var bus17  = '{"route":{"routeKey":"db9a2736-861c-43dd-b0f7-e8f9511f2c4e","nearbyStops":[{"stopCode":"BUS538","directionKey":"a1cbb00a-9d58-4206-a7b8-d2175100e3e2"}]}}';
var bus21A = '{"route":{"routeKey":"8889e486-0b03-41f2-bba6-4153e5d7fc4e","nearbyStops":[{"stopCode":"BUS538","directionKey":"989e4ef2-b772-4ff9-ad5f-c523ecd743fc"}]}}';

var busLines = {'1B': bus1B, '5': bus5, '13': bus13, '15': bus15, '17': bus17, '21A': bus21A};

function getNewTime(line, keys) {
    (async () => {
        const rawResponse = await fetch('refreshRouteData.php', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // body: "busLine="+'{"route":{"routeKey":"c7f75dbe-37ef-4bd3-b588-743ecd06c56b","nearbyStops":[{"stopCode":"BUS538","directionKey":"861f24b5-c6cb-46c6-81ce-ed03ff99bcde"}]}}'
            body: "busLine="+keys
        });
        const content = await rawResponse.json();
        console.log(JSON.parse(content));
        processBusTimes(line, JSON.parse(content));
    })();
}

var busTimer;
function updateBusTimes(){
    getNewTime('1B', bus1B);
    getNewTime('5', bus5);
    getNewTime('13', bus13);
    getNewTime('15', bus15);
    getNewTime('17', bus17);
    getNewTime('21A', bus21A);
}
updateBusTimes();



$(document).ready(function(){
    var time = new Date(), secondsRemaining = (60 - time.getUTCSeconds()) * 1000;
    setTimeout(function () {
        clearTimeout();
        updateBusTimes();
        busTimer = setInterval("updateBusTimes()", 58*1000);
    }, secondsRemaining);
});

//hkndisplay.ecn.purdue.edu
