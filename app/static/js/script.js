
// get state geo center data 
let stateGeo = resultsDataDiv.getAttribute("data-state-geo");
let stateLatLng = stateGeo.replace(/[(),]/g, "").split(" ");

let facilityDataset = Array.from(document.getElementsByClassName("facilityDataDiv"));
let facilityGeos = facilityDataset.map((facility) => facility.dataset.geo.split(","));
facilityGeos.forEach(arr => arr.forEach(i => i.trim()));


// google maps init
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parseFloat(stateLatLng[0]), lng: parseFloat(stateLatLng[1]) },
        zoom: 6
    });

    for (let i = 0; i < facilityGeos.length; i++) {
        let marker = new google.maps.Marker({
            position: { lat: parseFloat(facilityGeos[i][0]), lng: parseFloat(facilityGeos[i][1]) },
            map: map,
            title: 'Hello World!'
        });
    }

}



