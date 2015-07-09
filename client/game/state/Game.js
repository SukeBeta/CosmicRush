/**
 * Created by Yunen on 26/05/15.
 */
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
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
};

BasicGame.Game.prototype = {

    create: function () {
        this.game.stage.backgroundColor = '#71c5cf';

        // set world bound
        this.game.world.setBounds(0,0,1600,1600);

        // create player
        BasicGame.player = new Player(null, this.rnd.integerInRange(0, 400), this.rnd.integerInRange(0, 400));
        BasicGame.remotePlayers = [];

        // camera follows the player
        this.game.camera.follow(BasicGame.player);

        // Start listening for events
        this.setEventHandlers();
    },

    update: function () {
        BasicGame.player.handleMovement();

        for (var i = 0; i < BasicGame.remotePlayers.length; i++) {
            var remotePlayer = BasicGame.remotePlayers[i];
            remotePlayer.update()
        }
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
    },

    onSocketConnected: function() {
        console.log("Connected to socket server");

        // Send local player data to the game server
        socket.emit("new player", {x: BasicGame.player.x, y: BasicGame.player.y});
    },

    // Socket disconnected
    onSocketDisconnect: function() {
        console.log("Disconnected from socket server");
    },

    // ID received
    onIDReceived: function(data) {
        console.log("ID received: ", data.id);

        // Assign an ID to the player
        BasicGame.player.id = data.id;
    },

    // A new player has joined
    onNewPlayer: function(data) {
        console.log("New player connected: "+ data.id);

        BasicGame.remotePlayers.push(new RemotePlayer(data.id, data.x, data.y));
    },

    // One player is moving
    onMovePlayer: function(data) {
        // Find player in array
        var index = _.findIndex(BasicGame.remotePlayers, {
            id : data.id
        });

        var movePlayer = BasicGame.remotePlayers[index];

        // Player not found
        if (!movePlayer) {
            console.log("Player not found: " + data.id);
            return;
        }

        // Update player position
        movePlayer.x = data.x;
        movePlayer.y = data.y;
    },

    onRemovePlayer: function(data) {
        // Find player in array
        var index = _.findIndex(BasicGame.remotePlayers, {
            id : data.id
        });

        var removePlayer = BasicGame.remotePlayers[index];

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: "+ data.id);
            return;
        }

        removePlayer.kill();

        // Remove player from array
        BasicGame.remotePlayers.splice(BasicGame.remotePlayers.indexOf(removePlayer), 1);
    }
};