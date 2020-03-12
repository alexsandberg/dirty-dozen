
// remove any invalid backslashes from json
let dataStr = data.replace(/\\/g, "");

// parse json data from response
let parsedData = JSON.parse(dataStr);

let zoom;
if (parsedData.state_name == 'United States') {
    zoom = 4
} else {
    zoom = 6
}

// google maps init
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parsedData.state_geo[0], lng: parsedData.state_geo[1] },
        zoom: zoom
    });

    let markers = []

    parsedData.entries.forEach(entry => {

        let contentString = `<a href="https://enviro.epa.gov/enviro/ghgreport.html?pFacId=${entry.FACILITY_ID}&pSp=1&pReportingYear=${parsedData.year}"
        target="_blank">${entry.FACILITY_NAME}</a>` +
            `<p><br /><span class="bold">${entry.CO2E_EMISSION}</span> metric tons CO2e (carbon
                dioxide equivalent) emitted</p>`

        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        let marker = new google.maps.Marker({
            position: { lat: entry.LATITUDE, lng: entry.LONGITUDE },
            map: map,
            title: 'Hello World!'
        });

        markers.push([marker, infowindow])
    })

    // add marker event listeners for opening infowindows
    markers.forEach((markerInfo) => {
        let marker = markerInfo[0]
        let infowindow = markerInfo[1]
        marker.addListener('click', function () {
            // open the infowindow for marker
            infowindow.open(map, marker);

            // close any other infowindows
            markers.forEach((markerInfo2) => {
                let marker2 = markerInfo2[0]
                let infowindow2 = markerInfo2[1]

                if (marker != marker2) {
                    infowindow2.close(map, marker2)
                }
            })
        });
    })

}


// set default menu values to previous search
let stateName = parsedData['state_name'];
let stateCode = parsedData['state'];

let state;
if (stateCode == 'all') {
    state = stateCode
} else {
    state = stateCode + "_" + stateName;
}

let year = parsedData['year'];
let gas = parsedData['gas'];

document.getElementById("state").value = state;
document.getElementById("year").value = year;
document.getElementById("gas").value = gas;

