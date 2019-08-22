

// let year = 2017;
// let state = 'CO';


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





