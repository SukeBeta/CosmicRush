/**
 * Created by Yunen on 26/05/15.
 */

// Using with Node http server
var express = require("express");
var app = express();
var server = require("http").Server(app);

// Socket.IO
var io = require("socket.io").listen(server);

// Underscore
var _ = require('underscore');

// Game objects
var Player = require("./entities/Player");

// Game variables
var players = null;

// Set up Node http server
app.use(express.static("../client"));
server.listen(process.env.PORT || 8000);

// Run the server
init();

// Initialization
function init() {
    players = [];
    setEventHandlers();
}

// Event handlers
function setEventHandlers() {
    // Socket.IO
    io.on("connection", onSocketConnection);
}

// New socket connection
function onSocketConnection(socket) {
    console.log("New player has connected: "+ socket.id);

    // Listen for client disconnected
    socket.on("disconnect", onClientDisconnect);

    // Listen for new player message
    socket.on("new player", onNewPlayer);

    // Listen for move player message
    socket.on("move player", onMovePlayer);
}

function onNewPlayer(data) {
    var newPlayer = new Player(this.id, data.x, data.y);

    // Assign an ID to the new player
    this.emit("assign an ID", {id: this.id});

    // Broadcast new player to connected socket clients
    this.broadcast.emit("new player", {id: this.id, x: data.x, y: data.y});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.getID(), x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

    // Add new player to the players array
    players.push(newPlayer);
}

function onMovePlayer(data) {
    // Find player in array
    var index = _.findIndex(players, {
        id : this.id
    });

    var movePlayer = players[index];

    // Player not found
    if (!movePlayer) {
        console.log("Player not found: "+ this.id);
        return;
    }

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Broadcast updated position to connected socket clients
    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
}

function onClientDisconnect() {
    console.log("Player has disconnected: "+ this.id);

    // Find player in array
    var index = _.findIndex(players, {
        id : this.id
    });

    var removePlayer = players[index];

    // Player not found
    if (!removePlayer) {
        console.log("Player not found: "+this.id);
        return;
    }

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove player", {id: this.id});
}