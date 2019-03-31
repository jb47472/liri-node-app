require("dotenv").config()

var fs = require("fs");
var keys = require("./keys.js");
var moment = require("moment");
var axios = require("axios");
var liriFind = process.argv[2];
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
const chalk = require('chalk');


//switches for various commands
switch (liriFind) {
  case "concert-this":
    concertThis();
    break;

  case "spotify-this-song":
    spotifyThisSong();
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;
  //Instructions for first time user
  default: console.log(chalk.bold.bgBlue("\n" + "type any command after 'node liri.js': " + "\n" +
    "concert-this" + "\n" +
    "spotify-this-song 'any song title' " + "\n" +
    "movie-this 'any movie title' " + "\n" +
    "do-what-it-says " + "\n" +
    "Use Quotes for Multiword Titles!"));

};


// First Function, Finding the Concerts using BandsInTown
function concertThis() {
  var artists = process.argv[3];
  axios.get("https://rest.bandsintown.com/artists/" + artists + "/events?app_id=codingbootcamp")
    .then(function (response, err) {
      var bandResults = 
      "Venue:" + response.data[0].venue.name + "\n" +
      "Country:" + response.data[0].venue.country + "\n" +
      "City:" + response.data[0].venue.city + "\n" +
      "Date:" + response.data[0].datetime + "\n"
      // var datetime = response.data[0].datetime
      // datetime = moment().format('MM/DD/YYYY');
      console.log(chalk.bold.inverse.bgBlue(bandResults));

      if (err) {
        console.log("ERROR, Please Try Again!");
        return;
      }
      
    });

}

// Second Function, finding the song using Spotify

function spotifyThisSong(songName) {
  var songName = process.argv[3]
  if (!songName) {
    songName === "I Want it That Way";
  };
  songRequest = songName;
  spotify.search({
    type: "track",
    query: songRequest
  },
    function (err, data) {
      if (!err) {
        var trackInfo = data.tracks.items;
        for (var i = 0; i < 5; i++) {
          if (trackInfo[i] != undefined) {
            var spotifyResults =
              "Artist: " + trackInfo[i].artists[0].name + "\n" +
              "Song: " + trackInfo[i].name + "\n" +
              "Preview URL: " + trackInfo[i].preview_url + "\n" +
              "Album: " + trackInfo[i].album.name + "\n"

            console.log(chalk.bold.inverse.bgWhite(spotifyResults));
            console.log(' ');
          };
        };
      } else {
        console.log("error: " + err);
        return;
      };
    });
};

// Third Function, finding movies with OMDB
function movieThis() {
  var movieTitle = process.argv[3];
  var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy";
  axios.get(queryUrl)
    .then(function (response) {
      // console.log(response.data.Title);

      var queryResults =
        "Title:" + response.data.Title + "\n" +
        "Year:" + response.data.Year + "\n" +
        "IMBD Rating:" + response.data.Ratings[0].Value + "\n" +
        "Rotten Tomatoes" + response.data.Ratings[1].Value + "\n" +
        "Country of Production:" + response.data.Country + "\n" +
        "Language of Movie:" + response.data.Language + "\n" +
        "Plot:" + response.data.Plot + "\n" +
        "Key Actors:" + response.data.Actors + "\n" 

        console.log(chalk.bold.inverse.bgMagenta(queryResults));




    });

}

// Fourth Function, Do What it Says
function doWhatItSays() {
  fs.writeFile("random.txt", "spotify-this-song, 'I Want it That Way'", function (err) {
    var song = "spotify-this-song 'I Want it That Way'"
    if (err) {
      return console.log(err);

    }
    else console.log(song);

  });
};





