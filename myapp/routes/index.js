
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

var host = 'api.github.com';
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

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      //console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}

performRequest('/users/HappyBite/repos', 'GET', {
    access_token: '32d4271fe0546ea3dbf535812aa7dfdce2c98f82',
  }, function(data) {
    sessionId = data[0].full_name;
    console.log('Logged in:', sessionId);
});
