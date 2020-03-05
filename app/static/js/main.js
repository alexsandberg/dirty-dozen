
// object for storing entry
const entry = {
    state: "state",
    stateName: "state name",
    year: "year"
}


// submit button event listener
$('#location-btn').on('click', () => {

    let input = getInput(entry);

    fetchResults(input)
        .then(json => appendText(createHead(json)))

});


// get user input
function getInput(entry) {
    const state = $('#state option:selected').val();
    const stateName = $('#state option:selected').text();
    const year = parseInt($('#year option:selected').val(), 10);
    return Object.assign({}, entry, { state: state, stateName: stateName, year: year })
}

const fetchResults = async (data) => {

    // fetch data from server
    let response = await fetch(`${window.location.origin}/form`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    let json = await response.json()
    return json;
}

// create results header
function createHead(entry) {

    // clear results if present
    $('#results-container').empty();

    // add header
    $('#results-container').append(`<h2 id="results-title">${entry.data.state_name}'s ${entry.data.year} Dirty Dozen</h2>`);
    $('#results-container').append(`<div id="results-list"></div>`)
    $('#results-list').append(`<ol id="results"></ol>`);
    return entry
}

// append page with text
function appendText(entry) {
    let count = 1;

    // add new results elements 
    entry.data.entries.forEach(function (obj) {
        let liID = `facility-${count}`;
        let li = `<li id="${liID}">${count}. Facility: <span class="bold">${obj.FACILITY_NAME}</span></li>`;
        let co2 = `<p><br/><span class="bold">${obj.CO2E_EMISSION.toLocaleString()}</span> metric tons CO2e (carbon dioxide equivalent) emitted</p>`;
        let sectorType = `<p>Sector Type: ${obj.SECTOR_NAME}<br/>Sector Description: ${obj.SUBSECTOR_DESC}</p>`;
        let gas = `<p>Gas: ${obj.GAS_NAME} (${obj.GAS_CODE})</p>`;
        let more = `<a href="https://enviro.epa.gov/enviro/ghgreport.html?pFacId=${obj.FACILITY_ID}&pSp=1&pReportingYear=${parseInt($('#year option:selected').val(), 10)}" target="_blank">more information</a>`
        $("#results").append(li);
        $(`#facility-${count}`).append(co2, sectorType, gas, more);
        count++;
    })
}
