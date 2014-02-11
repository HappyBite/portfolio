
/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index',
    {
        title: 'Express hehe',
        sessionId: sessionId
    });
};

//-------------------------------------------------------------------------
// Rest manager
//-------------------------------------------------------------------------
var querystring = require('querystring');
var https = require('https');
var http = require('http');

var host = 'api.hemsidaonline.se';
var sessionId = null;

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
    headers = {
      'User-Agent': 'HappyBite'
    };
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length,
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      //console.log(responseString);
      //var strin = JSON.stringify(responseString);
      var responseObject = JSON.parse(responseString);
      //var responseObject = responseString;
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

performRequest('/oauth/token', 'GET', {
    code: '',
    client_id: '',
    client_secret: '',
    grant_type: '',
  }, function(data) {
    sessionId = data.expires_in;
    console.log(sessionId);
});
















