
// parse json data from response
let parsedData = JSON.parse(data);

// google maps init
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parsedData.state_geo[0], lng: parsedData.state_geo[1] },
        zoom: 6
    });

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

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    })

}



