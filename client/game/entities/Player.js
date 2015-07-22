/**
 * Created by Yunen on 26/05/15.
 */
var DEFAULT_PLAYER_SPEED = 180;
var MASS_SPEED_CONSTANT = 300;

var Player = function(id, x, y, character){
    this.id = id;
    this.speed = DEFAULT_PLAYER_SPEED;
    this.image = "";

    // mass: player quits when mass < 5
    this.mass = 10;

    /**
     * speed_factor concept:
     * speed_factor * sqrt(mass) = constant
     * radius^2 ~ mass
     */
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    this.radius = Math.sqrt(this.mass) / 3;
    this.scale = this.radius;

    // point: accumulated score
    this.point = 0;

    switch (character) {
        case 0:
            this.image = "p01";
            break;
        case 1:
            this.image = "p02";
            break;
        case 2:
            this.image = "p03";
            break;
        case 3:
            this.image = "p04";
            break;
        case 4:
            this.image = "p05";
            break;
        case 5:
            this.image = "p06";
            break;
        case 6:
            this.image = "p07";
            break;
        case 7:
            this.image = "p08";
            break;
        case 8:
            this.image = "p09";
            break;
    }

    Phaser.Sprite.call(this, game, x, y, this.image);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds=true;
    game.add.existing(this);
    // TODO: fix score text to screen?
    // this.addChild(ground.scoretext);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.handleInput = function() {
    this.handleMovement();
};

/**
 * Update player's mass and recalculate its speed_factor
 * @param mass
 */
Player.prototype.updateMass = function(mass) {
    this.mass = mass;
    this.speed_factor = MASS_SPEED_CONSTANT/Math.sqrt(this.mass);
    // TODO: scale sprite
    this.radius = Math.sqrt(this.mass) / 3;
    this.scale.x = this.radius;
    this.scale.y = this.radius;
};

/**
 * Add some points to player's point
 * @param point
 */
Player.prototype.addPoint = function(point) {
    this.point += point;
    ground.scoretext.setText("Point: "+ this.point);
};

Player.prototype.handleMovement = function() {
    var self = this;

    // Collisions
    game.physics.arcade.overlap(this, ground.dots, eatingDot, null, this);

    for (var i = 0; i < ground.remotePlayers.length; i++) {
        remotePlayer = ground.remotePlayers[i];
        game.physics.arcade.collide(this, remotePlayer, colliding, null, this);
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.body.velocity.y = 0;
        this.body.velocity.x = - DEFAULT_PLAYER_SPEED * this.speed_factor;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.velocity.y = 0;
        this.body.velocity.x = DEFAULT_PLAYER_SPEED * this.speed_factor;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.body.velocity.x = 0;
        this.body.velocity.y = - DEFAULT_PLAYER_SPEED * this.speed_factor;
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.body.velocity.x = 0;
        this.body.velocity.y = DEFAULT_PLAYER_SPEED * this.speed_factor;
    }

    // Gyro control
    // setting gyroscope update frequency
    gyro.frequency = 20;
    // start gyroscope detection
    gyro.startTracking(function(o) {
        // updating player velocity
        // Modify speed_factor for better control
        self.body.velocity.x = self.body.velocity.x / 10 + Math.sqrt(Math.abs(o.gamma)) * self.speed_factor * (o.gamma/Math.abs(o.gamma)) * 7;
        self.body.velocity.y = self.body.velocity.y / 10 + Math.sqrt(Math.abs(o.beta)) * self.speed_factor * (o.beta/Math.abs(o.beta)) * 7;
    });

    // Send move player message
    socket.emit("move player", {id: this.id, x: this.position.x, y: this.position.y, mass: this.mass, point: this.point});

    // collisionHandler
    // collide with a dot
    function eatingDot(player, dot) {
        //kill dot
        dot.kill();

        // Update player information
        player.updateMass(player.mass + 1);
        player.addPoint(1);

        // Send remove dot message
        socket.emit("remove dot", {id: dot.id});

        // dot will be destroyed when server broadcast back
    }

    // collide with a remotePlayer
    function colliding(player, remotePlayer) {
        //:ToDo
    }
};