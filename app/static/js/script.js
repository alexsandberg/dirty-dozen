
// remove any invalid backslashes from json
let dataStr = data.replace(/\\/g, "");

// parse json data from response
let parsedData = JSON.parse(dataStr);

// group entries by facility id
let facilities = {}
parsedData.entries.forEach(entry => {
    if (facilities.hasOwnProperty(entry.FACILITY_ID)) {
        facilities[entry.FACILITY_ID].push(entry)
    } else {
        facilities[entry.FACILITY_ID] = [entry]
    }
})
console.log(facilities)

// zoom out more to view full US
let zoom;
if (parsedData.state_name == 'United States') {
    zoom = 4
} else {
    zoom = 6
}

let year = parsedData['year'];

// google maps init
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parsedData.state_geo[0], lng: parsedData.state_geo[1] },
        zoom: zoom
    });

    let markers = []

    // iterate through each entry per facility and add marker with infowindow
    Object.keys(facilities).forEach(arr => {

        let facilityID = arr
        let facilityName = facilities[arr][0].FACILITY_NAME

        let contentString = `<p><span class="bold">${facilityName}</span></p>`

        // add CO2e data to infowindow for each year per given facility
        facilities[arr].forEach(entry => {
            console.log('ENTRY: ', entry)
            contentString += `<p><span class="bold">${entry.CO2E_EMISSION}</span> metric tons CO2e emitted in ${entry.YEAR} <a href="https://enviro.epa.gov/enviro/ghgreport.html?pFacId=${facilityID}&pSp=1&pReportingYear=${entry.YEAR}"
                target="_blank">(more info)</a><br /></p>`
        })

        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        let marker = new google.maps.Marker({
            position: { lat: facilities[arr][0].LATITUDE, lng: facilities[arr][0].LONGITUDE },
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

let gas = parsedData['gas'];

document.getElementById("state").value = state;
document.getElementById("year").value = year;
document.getElementById("gas").value = gas;

