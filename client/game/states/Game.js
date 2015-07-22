/**
 * Created by Yunen on 26/05/15.
 */

//MAP size
var MAP_WIDTH = 1920;
var MAP_HEIGHT = 1920;

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
        // A Reference to objects on the map
        ground = this;

        // Game Environment
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.add.tileSprite(0, 0, MAP_WIDTH, MAP_HEIGHT, 'background');
        this.game.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Player
        this.character = _.random(0, 8);
        this.player = new Player(null, this.rnd.integerInRange(0, 400), this.rnd.integerInRange(0, 400), self.character);
        this.player.scale.setTo(this.scaleRatio, this.scaleRatio);
        this.game.camera.follow(self.player);

        // Scoretext TODO: how to fix score text position on screen
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.scoretext =  this.game.add.text(80, 40, "", style);
        this.scoretext.anchor.setTo(0.5, 0.5);
        this.scoretext.setText(0);


        // Groups
        this.remotePlayers = [];
        this.dots = this.game.add.group();
        this.dots.enableBody = true;
        this.dots.physicsBodyType = Phaser.Physics.ARCADE;

        // Socket.io
        // Start listening for events
        this.setEventHandlers();
    },

    update: function () {
        self.player.handleMovement(this.dots);
    },

    render: function() {
        // this.game.debug.body(this.player);
    },

    setEventHandlers: function() {
        // Socket connection successful
        socket.on("connect", this.onSocketConnected());

        // Socket disconnection
        socket.on("disconnect", this.onSocketDisconnect());

        // New ID message received
        socket.on("assign an ID", this.onIDReceived);

        // New player message received
        socket.on("new player", this.onNewPlayer);

        // Player move message received
        socket.on("move player", this.onMovePlayer);

        // Player removed message received
        socket.on("remove player", this.onRemovePlayer);

        // TODO:(Not tested) New Dot created message received
        socket.on("new dot", this.onNewDot);

        // TODO:(Not tested) Dot removed message received
        socket.on("remove dot", this.onRemoveDot);
    },

    onSocketConnected: function() {
        console.log("Connected to socket server");

        // Send local player data to the game server
        socket.emit("new player", {x: self.player.x, y: self.player.y, character: self.character, mass: self.mass, point: self.point});
    },

    // Socket disconnected
    onSocketDisconnect: function() {
        console.log("Disconnected from socket server");
    },

    // ID received
    onIDReceived: function(data) {
        console.log("ID received: ", data.id);

        // Assign an ID to the player
        self.player.id = data.id;
    },

    // A new player has joined
    onNewPlayer: function(data) {
        console.log("New player connected: "+ data.id);

        var newPlayer = new RemotePlayer(data.id, data.x, data.y, data.character, data.mass, data.point);
        newPlayer.scale.setTo(self.scaleRatio, self.scaleRatio);

        self.remotePlayers.push(newPlayer);
    },

    // One player is moving
    onMovePlayer: function(data) {
        // Find player in array
        var index = _.findIndex(self.remotePlayers, {
            id : data.id
        });

        var movePlayer = self.remotePlayers[index];

        // Player not found
        if (!movePlayer) {
            console.log("Player not found: " + data.id);
            return;
        }

        // Update player position
        movePlayer.x = data.x;
        movePlayer.y = data.y;

        // Update player mass
        movePlayer.updateMass(data.mass);
    },

    onRemovePlayer: function(data) {
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
    },

    onNewDot: function(data) {
        console.log("New dot generated: " + data.id);

        // Add A Dot To Group
        var circle = new Dot();
        var dot = self.game.add.sprite(data.x, data.y, circle);
        dot.scale.setTo(self.scaleRatio, self.scaleRatio);

        // store id to dot
        dot.id = data.id;

        // add dot to dots group
        self.dots.add(dot);
    },

    onRemoveDot: function(data) {
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
    },

    tweet: function(data) {
        console.log(data);
    }
};