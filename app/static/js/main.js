
// object for storing entry
const entry = {
    state: "state",
    stateName: "state name",
    year: "year",
    subResults: [],
    sorted: [],
    dirtyDoz: []
}

// store data
const data = getData();

// get the data
function getData() {
    let results = $.getJSON("data/csvjson.json", (json) => {
        let arr = json.map(a => ({ ...a }));
        return arr
    })
    return results
}

// button event listener
$('#location-btn').on('click', () => {
    runData(
        getInput,
        subResults,
        sortResults,
        getTop12,
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

// get results for specified state and year
function subResults(entry) {
    let subResults = [];
    data.responseJSON.forEach(obj => {
        if (obj.YEAR === entry.year && obj.STATE === entry.state) {
            subResults.push(obj);
        }
    })
    return Object.assign({}, entry, { subResults: subResults })
}

// sort the results
function sortResults(entry) {
    let sorted = [];
    sorted = entry.subResults.sort((a, b) => {
        return b.CO2E_EMISSION - a.CO2E_EMISSION;
    });
    return Object.assign({}, entry, { sorted: sorted })
}

// get the top 12 from sorted results
function getTop12(entry) {
    let dirtyDoz = [];
    dirtyDoz = entry.sorted.slice(0, 12);
    return Object.assign({}, entry, { dirtyDoz: dirtyDoz })
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
