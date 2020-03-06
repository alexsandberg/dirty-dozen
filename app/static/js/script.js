
// get state geo center data 
let stateGeo = resultsDataDiv.getAttribute("data-state-geo");
let stateLatLng = stateGeo.replace(/[(),]/g, "").split(" ");


// google maps init
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: parseInt(stateLatLng[0]), lng: parseInt(stateLatLng[1]) },
        zoom: 6
    });
}