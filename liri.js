var keys = require("./keys.js");
var request = require("request");

var twitter = require("twitter");
var twit = new twitter(keys);

var spotify = require("node-spotify-api");
var spot = new spotify({
  id: "3ce5b028d6eb4040ac7b0fc009e5bcef",
  secret: "9bf19aa13ee441a3a0a9daf5a6570d2c"
});

var fs = require("fs");

var act = process.argv[2];
var value = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
  value += (" " + process.argv[i]);
}

function tweets() {
  twit.get('statuses/user_timeline', { count: 20 }, function(error, tweets, response) {
    if(error) { console.log(error) }
    for (var i = 0; i < tweets.length; i++) {
      console.log(tweets[i].created_at);
      console.log(tweets[i].text);
      console.log("-------");
    }
  })
}

function spotifyThis(value) {
  if (value === undefined) {
    value = "the sign ace of base";
  }

  spot.search({ type: "track", query: value, limit: 20 }, function(error, data) {
    if (error) { console.log(error) }
    for (var i = 0; i < data.tracks.items.length; i++) {
      console.log("Artist: " + data.tracks.items[i].artists[0].name);
      console.log("Song Name: " + data.tracks.items[i].name);
      console.log("Preview URL: " + data.tracks.items[i].preview_url);
      console.log("Album: " + data.tracks.items[i].album.name);
      console.log("-------");
    }
  });
}

function movie(value) {
  if (value === undefined) {
    value = "mr nobody";
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&apikey=40e9cece";

  request(queryUrl, function(error, response, body) {
    if (error) {console.log(error)}
    var body = JSON.parse(body);
    console.log("Title: " + body.Title);
    console.log("Release Year: " + body.Year);
    console.log("IMDB Rating: " + body.imdbRating);
    if (body.Ratings[1]) {
      console.log("Rotten Tomatoes Rating: " + body.Ratings[1].Value);
    } else {
      console.log("Rotten Tomatoes Rating: none");
    }
    console.log("Country of Production: " + body.Country);
    console.log("Language: " + body.Language);
    console.log("Plot: " + body.Plot);
    console.log("Actors: " + body.Actors);
  })
}



switch (act) {
  case "do-what-it-says":
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) { console.log(error) }
      var arr = data.split(",")
      act = arr[0];
      value = arr[1];
      if (act === "my-tweets") {
        tweets();
      } else if (act === "spotify-this-song") {
        spotifyThis(value);
      } else if (act === "movie-this") {
        movie(value);
      }
    })
    break;
  case "my-tweets":
    tweets();
    break;
  case "spotify-this-song":
    spotifyThis(value);
    break;
  case "movie-this":
    movie(value);
    break;
}