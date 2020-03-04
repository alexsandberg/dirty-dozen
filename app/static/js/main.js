
// object for storing entry
const entry = {
    state: "state",
    stateName: "state name",
    year: "year"
}


// submit button event listener
$('#location-btn').on('click', () => {
    runData(
        getInput,
        fetchResults,
        createHead,
        appendText
    )(entry)
});

// pipe function
const pipe = (f, g) => (...args) => g(f(...args))

// process the input data
const runData = (...fns) => fns.reduce(pipe);

// get user input
function getInput(entry) {
    const state = $('#state option:selected').val();
    const stateName = $('#state option:selected').text();
    const year = parseInt($('#year option:selected').val(), 10);
    return Object.assign({}, entry, { state: state, stateName: stateName, year: year })
}

function fetchResults(data) {

    // fetch data from server
    fetch(`${window.location.origin}/form`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            if (myJson['success'] == true) {
                console.log('success')
            }
        });
}

// create results header
function createHead(entry) {
    // let stateName = $('#state option:selected').text();

    // clear results if present
    $('#results-container').empty();

    // add header
    $('#results-container').append(`<h2 id="results-title">${entry.stateName}'s ${parseInt($('#year option:selected').val(), 10)} Dirty Dozen</h2>`);
    $('#results-container').append(`<div id="results-list"></div>`)
    $('#results-list').append(`<ol id="results"></ol>`);
    return entry
}

// append page with text
function appendText(entry) {
    let count = 1;

    // add new results elements 
    entry.dirtyDoz.forEach(function (obj) {
        let liID = `facility-${count}`;
        let li = `<li id="${liID}">${count}. Facility: <span class="bold">${obj.FACILITY_NAME}</span></li>`;
        let co2 = `<p>CO2e emitted: ${obj.CO2E_EMISSION.toLocaleString()} metric tons</p>`
        let more = `<a href="https://enviro.epa.gov/enviro/ghgreport.html?pFacId=${obj.FACILITY_ID}&pSp=1&pReportingYear=${parseInt($('#year option:selected').val(), 10)}" target="_blank">more information</a>`
        $("#results").append(li);
        $(`#facility-${count}`).append(co2, more);
        count++;
    })
}
