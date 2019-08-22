
function getInput() {
  const state = $('#state option:selected').val();
  const year = parseInt($('#year option:selected').val(), 10);
  console.log('year' + year);
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

    let dirtyNames = [];

    dirtyDoz.forEach(function(obj) {
      dirtyNames.push(obj.FACILITY_NAME)
    })

    console.log( dirtyNames );
  });
}


// function appendText(item) {
//   let h2 = `<h2>Text.</h2>`;               // Create element with HTML  
//   let txt2 = $("<p></p>").text("Text.");   // Create with jQuery
//   let txt3 = document.createElement("p");  // Create with DOM
//   txt3.innerHTML = "Text.";
//   $("body").append(txt1, txt2, txt3);      // Append the new elements 
// }

