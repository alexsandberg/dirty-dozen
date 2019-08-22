

let year = 2017;
let state = 'CO';


function getData() {
	let results = [];
	let dirtyDoz = [];
	
	$.getJSON( "data/csvjson.json", function( json ) {
    	json.forEach(obj => {
			if(obj.YEAR === year && obj.STATE === state) {
				results.push(obj);
			}
		})

    	results.sort(function(a,b) {
			return b.CO2E_EMISSION - a.CO2E_EMISSION;
		});

		dirtyDoz = results.slice(0,12);

		console.log('DIRTY DOZEN: ' + JSON.stringify(dirtyDoz) );
	});
}





