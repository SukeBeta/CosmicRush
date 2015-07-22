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
var Dot = require("./entities/Dot");

// Game variables
var players = null;
var dots = null;
var dotCounter = 0;
var MAX_DOTS = 200;

// Broadcast updates every 100 ms
var updateInterval = 100;

// Map size
var MAP_WIDTH = 1920;
var MAP_HEIGHT = 1920;

// Set up Node http server
app.use(express.static("../client"));
server.listen(process.env.PORT || 8000);


// Run the server
init();

// Initialization
function init() {
    players = [];
    dots = [];

    setEventHandlers();
    // Namespaces
    generateNewDot();
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

    // Listen for remove dot message
    socket.on("remove dot", onRemoveDot);
}

function onNewPlayer(data) {
    var newPlayer = new Player(this.id, data.x, data.y, data.character, data.mass, data.point);

    // Assign an ID to the new player
    this.emit("assign an ID", {id: this.id});

    // Broadcast new player to connected socket clients
    this.broadcast.emit("new player", {id: this.id, x: data.x, y: data.y, character: data.character, mass: data.mass, point: data.point});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.getID(), x: existingPlayer.getX(), y: existingPlayer.getY(), character: existingPlayer.getCharacter(), mass: existingPlayer.getMass(), point: existingPlayer.getPoint()});
    }

    // Add new player to the players array
    players.push(newPlayer);

    // Dots
    // Send existing dots to the new player
    var i, existingDot;
    for (i = 0; i < dots.length; i++) {
        existingDot = dots[i];
        this.emit("new dot", {id: existingDot.getID(), x: existingDot.getX(), y: existingDot.getY()});
    }
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

    //TODO: (Delete after check) ADD by Geyang 13 Jul
    // Update player mass and point
    movePlayer.setMass(data.mass);
    movePlayer.setPoint(data.point);

    //TODO:计算吃，游戏逻辑加在这里
    //calculateGameLogic();

    // Broadcast updated position to connected socket clients
    // console.log("Player moves to: ", movePlayer.getX() + " " , movePlayer.getY());
    //TODO: (Delete after check) ADD by Geyang 13 Jul
    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), mass: movePlayer.getMass(), point: movePlayer.getPoint()});
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

/**
 * TODO:Generate a new dot on map
 */
function generateNewDot() {
    setInterval(function () {
        // Keep generating until full
        if (dots.length < MAX_DOTS) {

            var x = Math.floor(Math.random() * MAP_WIDTH);
            var y = Math.floor(Math.random() * MAP_HEIGHT);

            var newDot = new Dot(dotCounter++, x, y);

            dots.push(newDot);

            //console.log("New Dot created: " + newDot.getID());

            io.emit("new dot", {id: newDot.id, x: newDot.x, y: newDot.y});
        }
    }, 1000);
}

/**
 * TODO: Remove a dot from map
 * Usually called by the game logic
 */
function onRemoveDot(data) {
    // find dot in dots
    var index = _.findIndex(dots, {
        id : data.id
    });

    var removeDot = dots[index];

    // Dot not found
    if (!removeDot) {
        console.log("Dot not found: "+data.id);
        return;
    }

    // Remove player from players array
    dots.splice(dots.indexOf(removeDot), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove dot", {id: data.id});
}

/**
 * TODO: by mengchen @ 21 July not finished
 */
function calculateGameLogic() {
    var i, j;
    for(i = 0;i < players.length; i++) {
        for(j = 0;j < dots.length; j++) {
            var playerx = player[i].getX();
            var playery = player[i].getY();
            var playermass = player[i].getMass();
            var dotx = dot[j].getX();
            var doty = dot[j].getY();
            var distance = Math.sqrt((playerx - dotx) * (playerx - dotx) + (playery - doty) * (playery - doty));
            var radius = Math.sqrt(playermass);
            if(distance <= radius) {
                this.broadcast.emit("remove dot", {id: dot[j].getID()});
            }
        }
    }
}