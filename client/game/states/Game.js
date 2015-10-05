/**
 * Created by Yunen on 26/05/15.
 */

//MAP size
var MAP_WIDTH = 3000;
var MAP_HEIGHT = 3000;

BasicGame.Game = function (game) {
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator),
    this.scaleRatio = window.scaleRatio;
    self = this;
};

BasicGame.Game.prototype = {

    create: function () {
        //
        BasicGame.playing = true;

        // A Reference to objects on the map
        ground = this;

        // Game Environment
        this.game.stage.backgroundColor = '#160b20';
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.stage.backgroundColor = '#ffffff';

        this.game.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Player
        this.R = _.random(0, 255);
        this.G = _.random(0, 255);
        this.B = _.random(0, 255);
        this.character = _.random(0, 18);

        this.player = new Player(null, this.rnd.integerInRange(200, 500), this.rnd.integerInRange(100, 800), this.character, this.R, this.G, this.B);

        this.player.scale.setTo(this.player.radius, this.player.radius);
        this.player.anchor.setTo(0.5, 0.5);
        this.game.camera.follow(this.player);

        // Score Text
        var style = {font: '40px "Press Start 2P"', fill: "white"};
        this.scoretext =  this.game.add.text(10, 10, "", style);
        this.scoretext.setText("Score  : " + 0);
        this.scoretext.fixedToCamera = 1;

        // Mass Text
        this.masstext = this.game.add.text(10, 60, "", style);
        this.masstext.setText("Mass   : " + 20);
        this.masstext.fixedToCamera = 1;

        // Player Number text
        this.playertext = this.game.add.text(10, 110, "", style);
        this.playertext.setText("Player : " + 1);
        this.playertext.fixedToCamera = 1;

        // Groups
        this.remotePlayers = [];
        //
        this.dots = this.game.add.group();
        this.dots.enableBody = true;
        this.dots.physicsBodyType = Phaser.Physics.ARCADE;

        // Socket.io
        // Start listening for events
        this.setEventHandlers();

        // TODO: Spacebar for debugging only
        //key2 = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //key2.onDown.add(function() {
        //    self.restart();
        //}, this);
    },

    update: function () {
        /**
         this.remotePlayers.forEach(function(remotePlayer) {
            remotePlayer.breathe();
        }, this);
         **/

        this.player.handleMovement(this.dots);
        // TODO: Enable breathe when stable
        // this.player.breathe();
    },

    updateStarfield: function() {
        self.stars.forEach(function(star) {
            if (star.body.x > MAP_WIDTH) {
                star.body.x = -32;
            }
        },self.stars);
    },

    setEventHandlers: function() {
        // Socket connection successful
        socket.on("connect", this.onSocketConnected());

        // Socket disconnection
        socket.on("disconnect", this.onSocketDisconnect);

        // Game Over
        socket.on("game over", this.onGameOver);

        // New ID message received
        socket.on("assign an ID", this.onIDReceived);

        // New player message received
        socket.on("new player", this.onNewPlayer);

        // Player move message received
        socket.on("move player", this.onMovePlayer);

        // Player removed message received
        socket.on("remove player", this.onRemovePlayer);

        // Update player message received
        socket.on("update player", this.onUpdatePlayer);

        // New Dot created message received
        socket.on("new dot", this.onNewDot);

        // Dot removed message received
        socket.on("remove dot", this.onRemoveDot);
    },

    onSocketConnected: function() {
        console.log("Connected to socket server");

        // Send local player data to the game server
        socket.emit("new player", {x: self.player.x, y: self.player.y, character: self.character, R: self.R, G: self.G, B: self.B, mass: self.mass, point: self.point});
    },

    // Socket disconnected
    onSocketDisconnect: function() {
        console.log("Disconnected from socket server");
        // Server breaks the connection and need to refresh to join
        // TODO: implement refresh page
        socket.disconnect();
        BasicGame.playing = false;
        self.state.start('Menu');
    },

    onGameOver: function() {
        console.log("Game is over by the server, restart");
        if (ground.player.getPoint() > highscore) {
            highscore = ground.player.getPoint();
        }
        self.restart();
    },

    //
    restart: function() {
        BasicGame.playing = false;
        console.log("restart");
        socket.emit("restart", {});
        self.state.start('Menu');
    },

    // ID received
    onIDReceived: function(data) {
        console.log("ID received: ", data.id);

        // Assign an ID to the player
        self.player.id = data.id;
    },

    // A new player has joined
    onNewPlayer: function(data) {
        if (BasicGame.playing) {
            console.log("New player connected: "+ data.id);

            var newPlayer = new RemotePlayer(data.id, data.x, data.y, data.character, data.R, data.G, data.B, data.mass, data.point);
            newPlayer.scale.setTo(newPlayer.radius, newPlayer.radius);
            newPlayer.anchor.setTo(0.5, 0.5);
            self.remotePlayers.push(newPlayer);
            ground.playertext.setText("Player : " + (self.remotePlayers.length+1));
        }
    },

    // One player is moving
    onMovePlayer: function(data) {
        if (BasicGame.playing) {
            // Find player in array
            var index = _.findIndex(self.remotePlayers, {
                id : data.id
            });

            var movePlayer = self.remotePlayers[index];

            // Player not found
            if (!movePlayer) {
                // console.log("Player not found: " + data.id);
                return;
            }

            // Update player position
            movePlayer.x = data.x;
            movePlayer.y = data.y;

            // Update player mass
            movePlayer.updateMass(data.mass);
        }
    },

    onRemovePlayer: function(data) {
        if (BasicGame.playing) {
            // Find player in array
            var index = _.findIndex(self.remotePlayers, {
                id : data.id
            });

            var removePlayer = self.remotePlayers[index];

            // Player not found
            if (!removePlayer) {
                console.log("Player not found: "+ data.id);
                return;
            }

            removePlayer.kill();

            // Remove player from array
            self.remotePlayers.splice(self.remotePlayers.indexOf(removePlayer), 1);
            ground.playertext.setText("Player : " + (self.remotePlayers.length+1) );

            console.log("Player not found: "+ data.id + " removed");
        }
    },

    onUpdatePlayer: function(data) {
        if (BasicGame.playing) {
            self.player.updateMass(data.mass);
            self.player.setPoint(data.point);

            // Delay 200ms then unfreeze
            setTimeout(function(){
                socket.emit("unfreeze player", {id: self.player.id});
            }, 200);
        }
    },

    onNewDot: function(data) {
        if (BasicGame.playing) {
            //console.log("New dot generated: " + data.id);

            // Add A Dot To Group
            var circle = new Dot();
            var dot = self.game.add.sprite(data.x, data.y, circle);
            dot.scale.setTo(self.scaleRatio, self.scaleRatio);
            dot.anchor.setTo(0.5, 0.5);

            // TODO: (not tested) Hide dots if not near the player
            //if (Math.abs(data.x-self.player.x) > 500 || Math.abs(data.y-self.player.y) > 500) {
            //    dot.kill();
            //}

            // store id to dot
            dot.id = data.id;

            // add dot to dots group
            self.dots.add(dot);
        }
    },

    onRemoveDot: function(data) {
        if (BasicGame.playing) {
            // Find dot in dots
            var i = 0;
            var dotRemoved = self.dots.getChildAt(i);
            while (dotRemoved.id != data.id && i<self.dots.length) {
                i++;
                dotRemoved = self.dots.getChildAt(i);
            }

            // Dot not found
            if (!dotRemoved) {
                console.log("Dot not found: "+ data.id);
            } else {
                // remove dot
                self.dots.remove(dotRemoved);
                dotRemoved.destroy();
            }
        }
    }
};