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
var MAX_DOTS = 300;

// Broadcast updates every 100 ms
var updateInterval = 100;

// Map size
var MAP_WIDTH = 3000;
var MAP_HEIGHT = 3000;

// Set up Node http server
app.use(express.static("../client"));
server.listen(process.env.PORT || 8000);


// Run the server
init();

// Initialization
function init() {
    players = [];
    dots = [];

    console.log("COSMIC RUSH server starts!");

    setEventHandlers();
    // Namespaces
    generateNewDot();
    // TODO: Server's Big Monster
    bigMonster();
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

    // Listen for restart message
    socket.on("restart", onRestart);

    // Listen for new player message
    socket.on("new player", onNewPlayer);

    // Listen for move player message
    socket.on("move player", onMovePlayer);

    // Listen for remove dot message
    socket.on("remove dot", onRemoveDot);

    // unfreeze player
    socket.on("unfreeze player", onUnfreezePlayer);
}

function onNewPlayer(data) {
    var newPlayer = new Player(this.id, data.x, data.y, data.character, data.R, data.G, data.B, data.mass, data.point);

    // Assign an ID to the new player
    this.emit("assign an ID", {id: this.id});

    // Broadcast new player to connected socket clients
    this.broadcast.emit("new player", {id: this.id, x: data.x, y: data.y, character: data.character, R: data.R, G: data.G, B: data.B, mass: data.mass, point: data.point});

    // Send existing players to the new player
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.getID(), x: existingPlayer.getX(), y: existingPlayer.getY(), character: existingPlayer.getCharacter(), R:existingPlayer.getR(), G:existingPlayer.getG(), B:existingPlayer.getB(),mass: existingPlayer.getMass(), point: existingPlayer.getPoint()});
    }

    // Add new player to the players array
    players.push(newPlayer);

    // Dots
    // Send existing dots to the new player
    var existingDot;
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
        console.log("Player not found for moving: "+ this.id);
        return;
    }

    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    // Update player mass and point
    movePlayer.setMass(data.mass);
    movePlayer.setPoint(data.point);

    // Calculating eating between players
    calculateGameLogic(movePlayer);

    // Broadcast updated position to connected socket clients
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
        // Remove the player even it is not found
        this.broadcast.emit("remove player", {id: this.id});
        return;
    }

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove player", {id: this.id});
}

function onRestart() {
    console.log("Player has restarted: "+ this.id);

    // Find player in array
    var index = _.findIndex(players, {
        id : this.id
    });

    var removePlayer = players[index];

    // Player not found
    if (!removePlayer) {
        console.log("Player not found: "+this.id);
        // Remove the player even it is not found
        this.broadcast.emit("remove player", {id: this.id});
        return;
    }

    // Remove player from players array
    players.splice(players.indexOf(removePlayer), 1);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove player", {id: this.id});
}

/**
 * Generate a new dot on map
 */
function generateNewDot() {
    setInterval(function () {
        // Keep generating until full
        if (dots.length < MAX_DOTS) {
            var i, x, y, newDot;

            if (dots.length < MAX_DOTS / 20) {
                for (i = 0; i < 8; i++) {
                    x = Math.floor(Math.random() * MAP_WIDTH);
                    y = Math.floor(Math.random() * MAP_HEIGHT);

                    newDot = new Dot(dotCounter++, x, y);

                    dots.push(newDot);

                    io.emit("new dot", {id: newDot.id, x: newDot.x, y: newDot.y});
                }
            } else if (dots.length < MAX_DOTS / 3) {
                for (i = 0; i < 3; i++) {
                    x = Math.floor(Math.random() * MAP_WIDTH);
                    y = Math.floor(Math.random() * MAP_HEIGHT);

                    newDot = new Dot(dotCounter++, x, y);

                    dots.push(newDot);

                    io.emit("new dot", {id: newDot.id, x: newDot.x, y: newDot.y});
                }
            } else{

                x = Math.floor(Math.random() * MAP_WIDTH);
                y = Math.floor(Math.random() * MAP_HEIGHT);

                newDot = new Dot(dotCounter++, x, y);

                dots.push(newDot);

                io.emit("new dot", {id: newDot.id, x: newDot.x, y: newDot.y});
            }
        }
    }, 1000);
}

/**
 * Remove a dot from map
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
        // Yunen
        // console.log("Dot not found: "+data.id);
        return;
    }

    // Remove player from players array
    dots.splice(dots.indexOf(removeDot), 1);

    console.log("Dot removed: "+data.id);

    // Broadcast removed player to connected socket clients
    this.broadcast.emit("remove dot", {id: data.id});
}

/**
 *
 * @param data
 */
function onUnfreezePlayer(data) {
    // Find player in array
    var index = _.findIndex(players, {
        id : data.id
    });

    var frozenPlayer = players[index];
    if (!frozenPlayer) {
        console.log("Player does not exist for unfrozen: " + data.id);
    } else {
        frozenPlayer.eatable = true;
        console.log("Player has been unfrozen: " + data.id);
    }
}

/**
 * Calculating player eating/be eaten process
 * Update @17 AUG : eating only depends on mass
 * @param player
 */
function calculateGameLogic(player) {
    for(var i = 0; i < players.length; i++) {
        if (players[i].getID() != player.getID()) {
            var distanceX = player.getX() - players[i].getX();
            var distanceY = player.getY() - players[i].getY();
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            // TODO: formula to be determined
            var safeDistance = (Math.sqrt(player.getMass())+Math.sqrt(players[i].getMass())) * 7;

            if (distance < safeDistance) {
                var eater = null,
                    eaten = null;
                // player eats players[i]
                if ( player.getMass() > (players[i].getMass() + 1) && players[i].eatable) {
                    eater = player;
                    eaten = players[i];
                    eaten.eatable = false;
                    console.log("Player ID: " + eater.getID() + " eats Player ID: " + eaten.getID() + " for " + Math.floor(eaten.getMass()/2) + " points");

                    eater.setMass( eater.getMass() + eaten.getMass()/2 );
                    eater.setPoint( eater.getPoint() + Math.floor(eaten.getMass()/2));
                    eaten.setMass( eaten.getMass()/2 );

                    // send message back to player to update mass and score
                    if (eater.getID() != 'MONSTER') {
                        io.to(eater.getID()).emit("update player", {mass: eater.getMass(), point: eater.getPoint()});
                    } else {
                        console.log("Monster now has " + eater.getPoint() + " points!")
                    }
                    io.to(eaten.getID()).emit("update player", {mass: eaten.getMass(), point: eaten.getPoint()});

                    // Remove eaten if its mass < 5
                    if (eaten.getMass() < 10) {
                        io.to(eaten.getID()).emit("game over", {});
                    }

                    var playerToBeChecked01 = players[i];

                    // Remove the unresponsive player (players[i]) after 2 seconds
                    // Disable auto break at the moment as not stable
                    //setTimeout(function(){
                    //    if (playerToBeChecked01.eatable == false) {
                    //        breakClient(playerToBeChecked01.getID());
                    //    }
                    //}, 2000);
                }

                // players[i] eats player
                if ( players[i].getMass() > (player.getMass() + 1) && player.eatable) {
                    eater = players[i];
                    eaten = player;
                    eaten.eatable = false;
                    console.log("Player ID: " + eater.getID() + " eats Player ID: " + eaten.getID() + " for " + Math.floor(eaten.getMass()/2) + " points");

                    eater.setMass( eater.getMass() + eaten.getMass()/2 );
                    eater.setPoint( eater.getPoint() + Math.floor(eaten.getMass()/2));
                    eaten.setMass( eaten.getMass()/2 );

                    // send message back to player to update mass and score
                    if (eater.getID() != 'MONSTER') {
                        io.to(eater.getID()).emit("update player", {mass: eater.getMass(), point: eater.getPoint()});
                    } else {
                        console.log("Monster now has " + eater.getPoint() + " points!")
                    }
                    io.to(eaten.getID()).emit("update player", {mass: eaten.getMass(), point: eaten.getPoint()});

                    // Remove eaten if its mass < 5
                    if (eaten.getMass() < 10) {
                        io.to(eaten.getID()).emit("game over", {});
                    }

                    var playerToBeChecked02 = player;

                    // Remove the unresponsive player (player) after 2 seconds
                    // Disable auto break at the moment as not stable
                    //setTimeout(function(){
                    //    if (playerToBeChecked02.eatable == false) {
                    //        breakClient(playerToBeChecked02.getID());
                    //    }
                    //}, 2000);
                }
            }

        }
    }
}

/**
 * Server breaks a client with a specific id
 * @param id
 */
function breakClient(id) {
    console.log("Break the connection for player: "+ id);

    // Find player in array
    var index = _.findIndex(players, {
        id : id
    });

    var removePlayer = players[index];

    // Player not found
    if (!removePlayer) {
        console.log("Player not found for breaking: "+id);
    } else {
        // Remove player from players array
        players.splice(players.indexOf(removePlayer), 1);
    }

    // Break the connection for player with id
    io.to(id).emit("disconnect", {});

    // Broadcast removed player to connected socket clients
    io.emit("remove player", {id: id});
}

/**
 * Server generates and updates a monster to chase players
 */
function bigMonster() {
    // 0. Monster's data
    var monster = {};
    monster.id = 'MONSTER';
    monster.x = MAP_WIDTH / 2;
    monster.y = MAP_HEIGHT / 2;
    monster.character = 1;
    monster.R = 237;
    monster.G = 14;
    monster.B = 51;
    monster.mass = 150;
    monster.point = 0;

    monster.speed = 60;
    var plusOrMinus;


    // 1. create monster
    {
        var newMonster = new Player(monster.id, monster.x, monster.y, monster.character, monster.R, monster.G, monster.B, monster.mass, monster.point);

        // Broadcast new Monster to connected socket clients
        io.emit("new player", {id: monster.id, x: monster.x, y: monster.y, character: monster.character, R: monster.R, G: monster.G, B: monster.B, mass: monster.mass, point: monster.point});

        // Add new player to the players array
        players.push(newMonster);

        // Generate initial speed for monster;
        monster.speedX = Math.random() * monster.speed * 2 - monster.speed;
        plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        monster.speedY = calculateSpeedY(monster.speed, monster.speedX) * plusOrMinus;
        console.log("Monster speed X is " + monster.speedX);
        console.log("Monster speed Y is " + monster.speedY);
    }

    // 2. update monster
    setInterval(function(){
        // Find player in array
        var index = _.findIndex(players, {
            id : monster.id
        });

        var moveMonster = players[index];

        // Update position
        monster.x += monster.speedX;
        monster.y += monster.speedY;

        // Update player position
        moveMonster.setX(monster.x);
        moveMonster.setY(monster.y);

        // Calculating eating between players
        calculateGameLogic(moveMonster);

        // Broadcast updated position to connected socket clients
        io.emit("move player", {id: moveMonster.id, x: moveMonster.getX(), y: moveMonster.getY(), mass: moveMonster.getMass(), point: moveMonster.getPoint()});
    }, 50);

    // 3. Detect outbound and reset
    setInterval(function() {
        if (monster.x > MAP_WIDTH + 70 || monster.y > MAP_HEIGHT + 70 || monster.x < -70 || monster.y < -70) {
            console.log("Monster Outbounds! Reset");

            // reset speed
            monster.speedX = Math.random() * monster.speed * 2 - monster.speed;
            plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            monster.speedY = calculateSpeedY(monster.speed, monster.speedX) * plusOrMinus;

            // reset starting point;
            if (monster.speedX < 0) {
                monster.x = MAP_WIDTH + 20;
            } else {
                monster.x = -20;
            }
            monster.y = Math.random() * (MAP_HEIGHT + 40) - 20;
        }
    }, 100);

}

/**
 * Utility function to calculate speed in y direction for big monster
 * @param speed
 * @param speedX
 * @returns speedY
 */
function calculateSpeedY(speed, speedX) {
    return Math.sqrt(speed * speed - speedX * speedX);
}