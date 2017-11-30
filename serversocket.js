// Require HTTP module (to start server) and Socket.IO
var http = require('http');
var io = require('socket.io');
var port = 8080;

// Start the server at port 8080
var serversock = http.createServer(function(req, res) {
    // Send HTML headers and message
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Hello Socket Lover!</h1>');
});

serversock.listen(port);

// Create a Socket.IO instance, passing it our server
var socket = io.listen(serversock);

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