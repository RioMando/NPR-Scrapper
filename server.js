// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "nprdb";
var collections = ["scrapedNews"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedNews collection in the db
  db.scrapedNews.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of NPR
  request("https://www.npr.org/sections/news/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    // $(".title").each(function(i, element) {
    // $(".item-info").each(function(i, element) {
    $(".item-info").each(function (i, element) {
      // Save the text and href of each link enclosed in the current element
      // var title = $(element).children("a").text();
      var title = $(element).children(".title").children("a").text();
      var link = $(element).children(".title").children("a").attr("href");
      var teaser = $(element).children(".teaser").children("a").text();
      var teaserLink = $(element).children(".teaser").children("a").attr("href");
      // var xtract = $(element).children("teaser a").text();
      // var extract = $(element).children("a").text()

      // If this found element had both a title and a link
      if (title && link && teaser && teaserLink) {
        // Insert the data in the scrapedNews db
        db.scrapedNews.insert({
          title: title,
          link: link,
          teaser: teaser,
          teaserLink: teaserLink
          // xtract: xtract
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
