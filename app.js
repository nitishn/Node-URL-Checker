var express   = require('express');
var request   = require('request');
var fs        = require('fs');
var q         = require('q');
var app       = express();

// Define a config file for URLs/etc
var config = require('./config');

app.get( '/', function( req, res ) {


  checkUrls(config.urlsToTest)
  .then( function(response) {
    console.log('toast');
    res.send('Done');
  }, function(error) {
    console.log(error);
    res.send(error);
  });
});

app.listen( 3000, function () {
  console.log( 'Listening on port 3000!' );
});


// Internal functions //

// Wrap function to utilize Q's amazing q.all function
function checkUrls( urls ) {

  var results = [];

  if( urls ) {
    // Once request returns, record the results.
    urls.forEach( function(item) { results.push(checkUrl(item)) });
    return q.all(results);
  } else {
    return false;
  }
}

// Request each URL individually
function checkUrl( url ) {
  var deferred = q.defer();

  // Fire the request and record the response
  request( config.basePath + url, function(err, response, body) {
    if( !err && response.statusCode == 200 ) {
      deferred.resolve(response.statusCode);

    } else {
      deferred.reject(err);
    }
  });
  return deferred.promise;
}

// Fetch errors from php error log
function checkErrors() {

}
