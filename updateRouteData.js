async function fastSwap(line, nextStopTimes){
    var timeElm = document.querySelector('[data-for="'+line+'"]');
    var busTime = timeElm.getElementsByTagName('time');
    if (nextStopTimes) {
        if (nextStopTimes.scheduledDepartTimeUtc != null) {
            var schedTime = new Date(nextStopTimes.scheduledDepartTimeUtc);
            var localTime = new Date();
            var nextSBusTime = (schedTime.getUTCHours() * 60 + schedTime.getUTCMinutes()) - (localTime.getUTCHours() * 60 + localTime.getUTCMinutes()) - 1;
            // console.log(nextSBusTime);
            if (nextSBusTime > 0) {
                $(busTime).animate({ 'opacity': 0 }, 400, function () {
                    // $(busTime).outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">' + nextSBusTime + '<span class="time-unit-field" > min</span ></time>';
                    $(this).html(nextSBusTime + '<span class="time-unit-field" > min</span >');
                }).animate({ 'opacity': 1 }, 400);
            } else {
                $(busTime).animate({ 'opacity': 0 }, 400, function () {
                    // $(busTime).outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">Due</time>';
                    $(this).html("Due");
                }).animate({ 'opacity': 1 }, 400);
            }
        } else if (nextStopTimes.estimatedDepartTimeUtc != null) {
            var estimTime = new Date(nextStopTimes.estimatedDepartTimeUtc);
            var localTime = new Date();
            var nextSBusTime = (estimTime.getUTCHours() * 60 + estimTime.getUTCMinutes()) - (localTime.getUTCHours() * 60 + localTime.getUTCMinutes()) - 1;
            // console.log(nextSBusTime);
            if (nextSBusTime > 0) {
                $(busTime).animate({ 'opacity': 0 }, 400, function () { 
                    // $(busTime).outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">' + nextSBusTime + '<span class="time-unit-field" > min</span ></time>';
                    $(this).html(nextSBusTime + '<span class="time-unit-field" > min</span >');
                }).animate({ 'opacity': 1 }, 400);
                
            } else {
                $(busTime).animate({ 'opacity': 0 }, 400, function () { 
                    // $(busTime).outerHTML = '<time datetime="PT ' + nextSBusTime + 'M">Due</time>'; 
                    $(this).html("Due");
                }).animate({ 'opacity': 1 }, 400);
            }
        } else {
            $(busTime[0]).animate({ 'opacity': 0 }, 400, function () { $(busTime).text('');}).animate({ 'opacity': 1 }, 400);
        }
    } else {
        $(busTime[0]).animate({ 'opacity': 0 }, 400, function () { $(busTime).text('');}).animate({ 'opacity': 1 }, 400);
    }
}

async function setInterrupt(line, interruptions){
    var intElem = document.querySelector('[data-interrupt="' + line + '"]');
    if (interruptions){
        intElem.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
    } else {
        intElem.innerHTML = '';
    }
}

async function interruptTable(lines, interrupts){
    // console.log(interrupts);
    var intLoc = document.getElementsByClassName('interrupt-container')[0];
    // console.log(intLoc);
    var intList = {};
    for (let i = 0; i < lines.length; i++){
        if (interrupts[lines[i]] != null){
            // console.log(interrupts[lines[i]]);
            // console.log(interrupts[lines[i]].externalServiceInterruptionKey);
            // console.log(interrupts[lines[i]].serviceInterruptionName);
            // console.log(interrupts[lines[i]].serviceInterruptionTimeRange);
            intList[interrupts[lines[i]].externalServiceInterruptionKey] = [interrupts[lines[i]].serviceInterruptionName, interrupts[lines[i]].serviceInterruptionTimeRange];
            // console.log(intList);
        }
    }

    intTable = "";

    for (i in intList){
        document.getElementsByClassName('service-interruption-container')[0].style.display = 'block';
        intTable += '<div class="service-interruption-item"><span class="service-interruption-name"><strong>'+intList[i][0]+'</strong><br><span class="time-range">'+intList[i][1]+'</span></span></div>';
    }

    if (intList == null){
        document.getElementsByClassName('service-interruption-container')[0].style.display = 'none';
        intTable = '';
    }

    if (intLoc.innerHTML != intTable){
        intLoc.innerHTML = intTable;
    }
}

var busLines;
var busTimes = {};
var serviceInterrupts = {};

async function getFastTime(lines, keys) {
    const promises = [];
    for (let p = 0; p < keys.length; p++){
        // console.log(keys[p]);
        promises.push(
            fetch('refreshRouteData.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: "busLine=" + keys[p]
            })
        );
    }
    Promise.all(promises).then(responses => {
        return Promise.all(responses.map(response => {
            return response.json();
        }));
    }).then(data => {
        console.log(data);
        for (let p = 0; p < keys.length; p++){
            // console.log(JSON.parse(data[p]));
            jsonContent = JSON.parse(data[p]);
            let line = lines[p];
            busTimes[line] = jsonContent.nearbyStops[0].nextStopTimes[0];
            serviceInterrupts[line] = jsonContent.nearbyStops[0].serviceInterruptions[0];
            // console.log(busTimes[line]);
            fastSwap(line, busTimes[line]);
            setInterrupt(line, serviceInterrupts[line]);
        }
        interruptTable(lines, serviceInterrupts);
    }).catch(error => {
        console.log(error);
    })
}

var busTimer;
function updateBusTimes() {
    var lines = Object.keys(busLines);
    var lineKeys = Object.values(busLines);
    getFastTime(lines, lineKeys);
}

getNearbyRoutes().then((resp) => {
    console.log(resp);
    busLines = resp;
    updateBusTimes();
    $(document).ready(function () {
        var time = new Date(), secondsRemaining = (60 - time.getUTCSeconds()) * 1000;
        setTimeout(function () {
            clearTimeout();
            updateBusTimes();
            busTimer = setInterval("updateBusTimes()", 58 * 1000);
        }, secondsRemaining);
    });
})

//hkndisplay.ecn.purdue.edu