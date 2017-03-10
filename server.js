var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var uuid = require('node-uuid');
var WebSocket = require('ws');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  })
  .listen(3000, '0.0.0.0', function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log('Running at http://0.0.0.0:3000');
  });

// server.js

const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
let userCount = 0;
// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  
  // At this point in time wss.clients is an array that includes
  // the ws objects of all clients, including the one who just connected.
  userCount += 1;
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        count: userCount,
        type: "numUsers"
      }));
    }
  });

  ws.on('message', function incoming(message) {
    let msgObj = JSON.parse(message);
    msgObj.id = uuid.v4();
    // Broadcast to everyone else.
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msgObj));
      }
    });
    console.log(`User ${msgObj.username} said ${msgObj.content}`);
  });
  console.log('Client connected');

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  

  ws.on('close', () => {
    userCount -= 1;
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          count: userCount,
          type: "numUsers"
        }));
      }
    });
    console.log('Client disconnected');
    

  });
});