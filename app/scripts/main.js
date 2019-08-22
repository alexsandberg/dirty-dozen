
function getInput() {
  const state = $('#state option:selected').val();
  const year = parseInt($('#year option:selected').val(), 10);
  getData(state, year);
}

function getData(state, year) {
  let results = [];
  let subResults = [];
  let dirtyDoz = [];
  
  $.getJSON( "data/csvjson.json", function( json ) {
    results = json.map(a => ({...a}));

      results.forEach(obj => {
      if(obj.YEAR === year && obj.STATE === state) {
        subResults.push(obj);
      }
    })

      subResults.sort(function(a,b) {
      return b.CO2E_EMISSION - a.CO2E_EMISSION;
    });

    dirtyDoz = subResults.slice(0,12);

    // clear results if present
    $('#results-container').empty();

    // add new results head
    createHead();

    let count = 1;

    // add new results elements 
    dirtyDoz.forEach(function(obj) {
      appendText(obj, count);
      count++;
    })
  });
}

// https://enviro.epa.gov/enviro/ghgreport.html?pFacId=1000742&pSp=1&pReportingYear=2017

function createHead() {
  let stateName = $('#state option:selected').text();
  $('#results-container').append(`<h2 id="results-title">${stateName}'s ${parseInt($('#year option:selected').val(), 10)} Dirty Dozen</h2>`);
  $('#results-container').append(`<ol id="results"></ol>`);
}

function appendText(obj, count) {
  let li = `<li id="facility-${count}">${obj.FACILITY_NAME}</li>`;               // Create element with HTML  
  let co2 = `<p>CO2e emitted: ${obj.CO2E_EMISSION} metric tons</p>`
  let more = `<a href="https://enviro.epa.gov/enviro/ghgreport.html?pFacId=${obj.FACILITY_ID}&pSp=1&pReportingYear=${parseInt($('#year option:selected').val(), 10)}" target="_blank">more information</a>`
  $("#results").append(li);
  $(`#facility-${count}`).append(co2, more);
}

