
// remove any invalid backslashes from json
let dataStr = data.replace(/\\/g, "");

// parse json data from response
let parsedData = JSON.parse(dataStr);

// console.log(parsedData)

// group entries by facility id
let facilities = {}
parsedData.entries.forEach(entry => {
    if (facilities.hasOwnProperty(entry.FACILITY_ID)) {
        facilities[entry.FACILITY_ID].push(entry)
    } else {
        facilities[entry.FACILITY_ID] = [entry]
    }
})

// zoom out more to view full US
let zoom;
if (parsedData.state_name == 'United States') {
    zoom = 4
} else {
    zoom = 6
}

let year = parsedData['year'];

let markers = []

// google maps init
var map;
function initMap() {

    // initialize bounds
    let bounds = new google.maps.LatLngBounds();

    // create new map
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parsedData.state_geo[0], lng: parsedData.state_geo[1] },
        zoom: zoom
    });

    // iterate through each entry per facility and add marker with infowindow
    Object.keys(facilities).forEach(arr => {

        let facilityID = arr
        let facilityName = facilities[arr][0].FACILITY_NAME

        let contentString = `<p><span class="bold">${facilityName}</span></p>`

        // add CO2e data to infowindow for each year per given facility
        facilities[arr].forEach(entry => {
            contentString += `<p><span class="bold">${entry.CO2E_EMISSION}</span> metric tons CO2e emitted in ${entry.YEAR} <a href="https://enviro.epa.gov/enviro/ghgreport.html?pFacId=${facilityID}&pSp=1&pReportingYear=${entry.YEAR}"
                target="_blank">(more info)</a><br /></p>`
        })

        // create new infowindow for each facility
        let infowindow = new google.maps.InfoWindow({
            content: contentString,
            id: facilityID
        });

        // create new marker for each facility
        let marker = new google.maps.Marker({
            position: { lat: facilities[arr][0].LATITUDE, lng: facilities[arr][0].LONGITUDE },
            map: map
        });

        // extend map bounds to encomass marker
        let loc = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        bounds.extend(loc);

        markers.push([marker, infowindow])
    })

    // auto zoom and pan to fit map to markers
    map.fitBounds(bounds);
    map.panToBounds(bounds);

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

// click handler for each result li
const resultsClickHandler = (id) => {
    let currentMarker;
    // open infowindow for marker matching id
    markers.forEach((entry) => {
        let marker = entry[0];
        let infowindow = entry[1];

        if (infowindow.id == parseInt(id)) {
            currentMarker = marker;
            infowindow.open(map, marker);
        }
    })

    // close any other infowindows
    markers.forEach((markerInfo2) => {
        let marker2 = markerInfo2[0]
        let infowindow2 = markerInfo2[1]

        if (currentMarker != marker2) {
            infowindow2.close(map, marker2)
        }
    })
}


const parentCompanyInfo = (facilityID, year) => {

    // fetch parent company information
    fetch(`/parent-company/${facilityID}/${year}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let parentResults = $(`#parent-${facilityID}-${year}`);
            parentResults.empty();

            let results = document.createElement("div");
            results.classList.add("card");
            results.classList.add("card-body");
            parentResults.append(results);

            data.forEach((entry) => {
                let str = `<p><span class="bold">Company:</span> ${entry.PARENT_COMPANY_NAME}<br />
                ${entry.PARENT_CO_CITY}, ${entry.PARENT_CO_STATE}<br />
                ${entry.PARENT_CO_PERCENT_OWN}% ownership
                </p>`

                parentResults.children(":first").append(str);
            });

        });
}