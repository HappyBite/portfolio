// Load the node-router library by creationix
var server = require('node-router').getServer();

// Configure our HTTP server to respond with Hello World the root request
server.get("/", function (request, response) {
  response.simpleText(200, variable);
});

// Listen on port 8080 on localhost
server.listen(process.env.PORT, "localhost");

var variable = node hello.js;