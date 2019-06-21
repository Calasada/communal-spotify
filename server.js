var SpotifyWebApi = require('spotify-web-api-node');
const express = require('express')
const app = express()

var credentials = {
    clientId: '59a34986442440bf8b14bdb6c954f17a',
    clientSecret: '970a4174e3514e9ab94bc19e65cc1a2b',
    redirectUri: 'http://localhost:3000/callback'
  };

var theManWhoSoldTheWorld = {
    "context_uri": "spotify:album:4h9rWFWhgCSSrvIEQ0YhYG",
    "offset": {
      "position": 7
    },
    "position_ms": 0
  }

spotifyApi = new SpotifyWebApi(credentials);

var scopes = ['user-modify-playback-state'],
    state;

var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);

app.get('/callback', function (req, res) {
    console.log('authenticated!');  
    var code = req.query.code;

    spotifyApi.authorizationCodeGrant(code).then(
        function(data) {
          console.log('The token expires in ' + data.body['expires_in']);
          console.log('The access token is ' + data.body['access_token']);
          console.log('The refresh token is ' + data.body['refresh_token']);
      
          // Set the access token on the API object to use it in later calls
          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.setRefreshToken(data.body['refresh_token']);

          spotifyApi.play(theManWhoSoldTheWorld).then(
              function(data) { // Output items
                console.log('Now Playing theManWhoSoldTheWorld');
            }, function(err) {
                console.log('Something went wrong!', err);
            });

        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );
    
  })

app.listen(3000);