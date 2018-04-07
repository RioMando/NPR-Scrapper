
// Function that takes in 'news' (JSON) and creates a format to be rendered
function displayResults(news) {
	// First empty the info
	$("tBody").empty();

	//Then for each entry of that json
	news.forEach(function(scrapedNew) {   //Note: here news referes to the argument of displayResults(news)
		// Appedn each of the news' properties to the page
	$("tBody").append("<h3>" + scrapedNew.title + "</h3>" +  //Note: here scrapedNew refers to the argument in forEach(function(scrapedNew))
										"<h4>" + scrapedNew.teaser + "</h4>"); 
	});
}

// 1: On Load
// ==========

// First thing: ask the back end for json with all news
$.getJSON("/all", function(data) {
  // Call our function to generate the info body
  displayResults(data);
});

$("#get-all").on("click", function() {
   console.log("you click me");
  // Do an api call to the back end for json with all animals sorted by weight
  $.getJSON("/all", function(data) {
    // Call our function to generate a table body
    displayResults(data);
  });
});
