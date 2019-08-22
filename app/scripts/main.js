
function getInput() {
  const state = $('#state option:selected').val();
  const year = parseInt($('#year option:selected').val(), 10);
  console.log('year' + year);
  getData(state, year);
}


// function appendText() {
//   let h2 = `<h2>Text.</h2>`;               // Create element with HTML  
//   let txt2 = $("<p></p>").text("Text.");   // Create with jQuery
//   let txt3 = document.createElement("p");  // Create with DOM
//   txt3.innerHTML = "Text.";
//   $("body").append(txt1, txt2, txt3);      // Append the new elements 
// }

