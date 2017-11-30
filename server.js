// This app serves some static content from a static path and serves a REST API that's
// defined on the api.yaml swagger 2.0 file
// Usage:
// node server -h

// Require HTTP module (to start server) and Socket.IO
var http = require('http');
var io = require('socket.io');
var port = 8080;

// Start the server at port 8080
var server = http.createServer(function(req, res) {
    // Send HTML headers and message
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Hello Socket Lover!</h1>');
});

server.listen(port);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(server);

// Add a connect listener
socket.on('connection', function(client) {
    var room = "";
    console.log('Connection to client established');

    // Success!  Now listen to messages to be received
    client.on('message', function(event) {
        room = event;
        console.log('Received message from client!', event);
    });

    client.on('disconnect', function() {
        clearInterval(interval);
        console.log('Server has disconnected');
    });
});

console.log('Server running at http://127.0.0.1:' + port + '/');

var Server = require('swagger-boilerplate').Server;


var server =
    new Server({
        apiFile: './api.yml',
        modulePath: __dirname + '/server/',
        appName: 'OpentokRTC-V2 Main'
    });

server.start();